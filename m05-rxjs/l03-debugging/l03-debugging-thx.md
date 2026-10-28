# Lab 5.3: Streams debuggen und aufräumen

**Leitfragen:**

<details>
<summary>Was läuft weiter, wenn eine Komponente vom Bildschirm verschwindet?</summary>

Alles, was die Komponente selbst gestartet und nicht beendet hat: Timer, Intervalle, offene Abos auf langlebige Observables. Angular zerstört die Komponente, aber nicht die Abos, die sie angelegt hat.

</details>

<details>
<summary>Wie findet man heraus, wie viele Abos gerade aktiv sind?</summary>

RxJS zeigt das nicht von selbst an. Ein benanntes Log beim Abonnieren und beim Beenden macht es sichtbar: zählen beim `subscribe`, herunterzählen beim Ende.

</details>

<details>
<summary>Wer ist für das Beenden eines Streams zuständig?</summary>

Wer abonniert, beendet auch. Die `async`-Pipe übernimmt das für das Template; wer im Code `subscribe()` aufruft, muss das Ende selbst festlegen.

</details>

- Ein Abo lebt, bis die Quelle endet oder jemand `unsubscribe()` aufruft. Das Zerstören einer Komponente gehört nicht dazu.
- `interval`, `Subject`, `valueChanges` und Router-Ereignisse enden nie von selbst; `HttpClient`-Anfragen enden nach der Antwort.
- Drei Wege zum sauberen Ende: `async`-Pipe, `takeUntilDestroyed()`, `DestroyRef`.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| Speicherleck (Memory Leak) | Speicher und Arbeit, die nicht mehr gebraucht, aber auch nicht freigegeben werden; hier: Abos zerstörter Komponenten |
| `interval(ms)` | Cold Observable, das alle `ms` Millisekunden eine fortlaufende Zahl sendet und nie endet |
| `DestroyRef` | Angular-Objekt, das zu einer Komponente (oder einem Service) gehört und meldet, wann sie zerstört wird |
| `takeUntilDestroyed()` | Operator aus `@angular/core/rxjs-interop`, der den Strom beendet, wenn der zugehörige `DestroyRef` meldet |
| Injection Context | Phase, in der Angular eine Komponente oder einen Service gerade erzeugt und `inject()` deshalb erlaubt ist: Konstruktor und Feld-Initialisierung; in `ngOnInit` und Event-Handlern nicht mehr |

## Das Leck

```ts
export class LeakyTicker implements OnInit {
  ngOnInit(): void {
    interval(1000).subscribe((n) => console.log('Entwurf gespeichert', n));
  }
}
```

```text
Route /ticker-leck öffnen:   subscribe → 0 1 2 3 …
Route wechseln:              Komponente zerstört, interval läuft weiter: 4 5 6 …
Route erneut öffnen:         zweites Abo dazu: 7 0 8 1 9 2 …
```

Folgen in echten Apps: doppelte HTTP-Anfragen, Code, der auf zerstörte Komponenten zugreift, wachsender Speicher bei langen Sitzungen.

## Abos sichtbar machen: benanntes Logging mit `tap`

`tap` kennt neben `next`, `error` und `complete` drei weitere Rückrufe: `subscribe` (Abo beginnt), `unsubscribe` (Abo wird von außen beendet) und `finalize` (Ende aus beliebigem Grund).

```ts
// src/app/examples/m05-rxjs/l03-debugging/debug.ts (gekürzt)
const aktiveAbos = new Map<string, number>();

export function debug<T>(name: string): MonoTypeOperatorFunction<T> {
  const zaehlen = (delta: number) => {
    const anzahl = (aktiveAbos.get(name) ?? 0) + delta;
    aktiveAbos.set(name, anzahl);
    return anzahl;
  };
  return tap({
    subscribe: () => console.log(`[${name}] subscribe – aktiv: ${zaehlen(+1)}`),
    next: (wert) => console.log(`[${name}] next:`, wert),
    finalize: () => console.log(`[${name}] beendet – aktiv: ${zaehlen(-1)}`),
  });
}

interval(1000).pipe(debug('ticker')).subscribe();
```

- Der Name im Log zeigt, welche Kette spricht; die Zahl zeigt, wie viele Abos dieser Kette gleichzeitig leben.
- Im Konsolenfilter der DevTools den Namen eingeben, um nur diese Kette zu sehen.

## Drei Wege zum sauberen Ende

| Weg | Wann | Code |
| --- | --- | --- |
| `async`-Pipe | Wert wird im Template angezeigt | `{{ tick$ \| async }}` |
| `takeUntilDestroyed()` | `subscribe()` im Konstruktor oder in einem Feld | `.pipe(takeUntilDestroyed()).subscribe()` |
| `takeUntilDestroyed(destroyRef)` | `subscribe()` außerhalb des Injection Context, z. B. in `ngOnInit` | `destroyRef = inject(DestroyRef)` vorher als Feld |

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class FixedTicker implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // 1. async-Pipe im Template: kein subscribe im Code
  protected readonly tick$ = interval(1000);

  constructor() {
    // 2. Im Injection Context findet takeUntilDestroyed den DestroyRef selbst
    interval(1000).pipe(takeUntilDestroyed()).subscribe(/* … */);
  }

  ngOnInit(): void {
    // 3. In ngOnInit gibt es keinen Injection Context: DestroyRef übergeben
    interval(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(/* … */);

    // DestroyRef kann auch eigenen Aufräumcode registrieren
    this.destroyRef.onDestroy(() => console.log('zerstört'));
  }
}
```

- `takeUntilDestroyed()` gehört ans **Ende** der Kette, direkt vor `subscribe()`; Operatoren dahinter (z. B. ein späteres `switchMap`) würden sonst weiterlaufen.
- Ohne Argument außerhalb des Injection Context wirft Angular den Fehler `NG0203` („can only be used within an injection context“).
- Klassisch: `Subscription` speichern und in `ngOnDestroy` `unsubscribe()` aufrufen. Funktioniert, wird aber bei mehreren Abos unübersichtlich.

## Marble-Diagramm im Fehlerbericht

Ein Diagramm beschreibt ein Stream-Problem genauer als Prosa:

```text
Route:        [ticker]-------[info]-------[ticker]----
Erwartet:     -0-1-2-|       (nichts)     -0-1-2-…
Beobachtet:   -0-1-2-3-4-5-6-7-8-9-…      + zweiter Strom -0-1-2-…
Ursache:      kein Ende beim Zerstören (fehlendes takeUntilDestroyed)
```

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| Log läuft nach Routenwechsel weiter | `subscribe()` ohne Ende | `takeUntilDestroyed` oder `async`-Pipe |
| Werte kommen doppelt nach erneutem Öffnen | altes Abo lebt, neues kommt dazu | wie oben; mit `debug` die Zahl „aktiv“ prüfen |
| `NG0203` beim Aufruf von `takeUntilDestroyed()` | Aufruf in `ngOnInit` oder Methode ohne Injection Context | `DestroyRef` als Feld injizieren und übergeben |
| Leck trotz `takeUntilDestroyed` | Operator steht vor einem `switchMap`, dessen innerer Strom weiterläuft | `takeUntilDestroyed` als letzten Operator setzen |

## Fazit

- Das Zerstören einer Komponente beendet keine Abos; wer `subscribe()` schreibt, legt das Ende fest.
- `tap` mit `subscribe` und `finalize` plus Zähler zeigt im Log, wie viele Abos leben.
- `async`-Pipe im Template, `takeUntilDestroyed()` im Konstruktor, `takeUntilDestroyed(destroyRef)` in `ngOnInit`.

Die Übung findet ein Intervall-Leck im Playground, weist es im Log nach und behebt es.
