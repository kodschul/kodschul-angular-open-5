# Lab 5.3 – Lösung: Speicherleck finden und beheben

Referenz: `src/app/examples/m05-rxjs/l03-debugging/` (`example.ts` mit Kind-Routen, `leaky-ticker.ts`, `fixed-ticker.ts`, `info-page.ts`, `debug.ts`), im Browser `/examples/m05-rxjs/l03-debugging`.

## Aufgabe 1: Starter starten

```text
Entwurf gespeichert 0
Entwurf gespeichert 1
…
Entwurf gespeichert 4
```

## Aufgabe 2: Route verlassen

Auf der Startseite laufen die Zeilen weiter (`5`, `6`, `7`, …). Angular hat die Playground-Komponente zerstört, das Abo auf `interval(1000)` lebt aber weiter, weil niemand `unsubscribe()` aufruft.

## Aufgabe 3: Route erneut öffnen

Ein zweites Abo kommt dazu, beide zählen parallel:

```text
Entwurf gespeichert 12
Entwurf gespeichert 0
Entwurf gespeichert 13
Entwurf gespeichert 1
```

## Aufgabe 4: Leck mit Zahlen nachweisen

```ts
interval(1000)
  .pipe(debug('entwurf'))
  .subscribe((n) => console.log('Entwurf gespeichert', n));
```

```text
[entwurf] subscribe – aktiv: 1
[entwurf] next: 0
…                                   ← Wechsel zur Startseite: keine „beendet“-Zeile
[entwurf] next: 7
[entwurf] subscribe – aktiv: 2      ← erneut geöffnet
[entwurf] next: 8
[entwurf] next: 0
```

## Aufgabe 5: Marble-Diagramm im Kommentar

```ts
/*
  Route:      [playground]------[home]------[playground]------
  Erwartet:   -0-1-2-3-4-|      (nichts)    -0-1-2-…
  Beobachtet: -0-1-2-3-4-5-6-7-8-9-10-11-12-13-…
                                            -0-1-…   (zweites Abo)
  Ursache: subscribe() in ngOnInit ohne Ende
*/
```

## Aufgabe 6: `takeUntilDestroyed` mit `DestroyRef`

```ts
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class Playground implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    interval(1000)
      .pipe(debug('entwurf'), takeUntilDestroyed(this.destroyRef))
      .subscribe((n) => console.log('Entwurf gespeichert', n));
  }
}
```

```text
[entwurf] subscribe – aktiv: 1
[entwurf] next: 0
[entwurf] next: 1
[entwurf] beendet – aktiv: 0      ← beim Wechsel zur Startseite
[entwurf] subscribe – aktiv: 1    ← erneut geöffnet, Zählung beginnt bei 0
[entwurf] next: 0
```

`takeUntilDestroyed` steht als letzter Operator vor `subscribe()`. In `ngOnInit` gibt es keinen Injection Context, deshalb wird `DestroyRef` als Feld injiziert und übergeben.

## Aufgabe 7: Anzeige per `async`-Pipe

```ts
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-playground',
  imports: [AsyncPipe],
  template: `
    <h1>Lab 5.3 Entwurf automatisch speichern</h1>
    <p>Sekunden auf dieser Seite: <strong>{{ tick$ | async }}</strong></p>
  `,
})
export class Playground implements OnInit {
  protected readonly tick$ = interval(1000).pipe(debug('anzeige'));
  // … Rest wie in Aufgabe 6
}
```

Beim Verlassen meldet das Log `[anzeige] beendet – aktiv: 0`: Die `async`-Pipe beendet ihr Abo, wenn die Komponente zerstört wird.

## Erweiterung

```ts
constructor() {
  interval(1000)
    .pipe(debug('entwurf'), takeUntilDestroyed())
    .subscribe((n) => console.log('Entwurf gespeichert', n));
}
```

Im Konstruktor findet `takeUntilDestroyed()` den `DestroyRef` selbst. In `ngOnInit` ohne Argument meldet die Konsole `NG0203: takeUntilDestroyed() can only be used within an injection context …`; das Abo startet nicht, das Template der Komponente wird trotzdem angezeigt.

Im Beispiel unter `/examples/m05-rxjs/l03-debugging` zeigt „Ticker mit Leck“ dasselbe Fehlerbild; „Ticker aufgeräumt“ beendet beim Wechsel alle drei Abos (`ticker-async`, `ticker-takeUntilDestroyed`, `ticker-destroyRef`) mit „aktiv: 0“.
