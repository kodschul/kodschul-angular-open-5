# Lab 6.2: Signals und Observables im Zusammenspiel

**Leitfragen:**

<details>
<summary>Ist „aktuell eingeloggte Person“ ein Ereignis oder ein Zustand?</summary>

Ein Zustand: Zu jedem Zeitpunkt gibt es genau einen aktuellen Wert, den jede Stelle sofort lesen will. Das Ein- und Ausloggen selbst sind Ereignisse, die diesen Zustand ändern.

</details>

<details>
<summary>Welche Probleme aus Lab 5.3 verschwinden, wenn niemand mehr <code>subscribe</code> schreibt?</summary>

Vergessene Abos und damit Lecks: `toSignal` (stellt den letzten Wert eines Observables als Signal bereit), `httpResource` (lädt per HTTP direkt in Signals) und die `async`-Pipe beenden ihre Abos selbst, wenn die Komponente zerstört wird. `toSignal` und `httpResource` stellt dieses Lab vor; die `async`-Pipe ist aus Lab 1.1 bekannt.

</details>

<details>
<summary>Wofür bleibt RxJS trotzdem unverzichtbar?</summary>

Für Zeit und Ereignisfolgen: Entprellen, Abbrechen alter Anfragen, Wiederholen, Kombinieren mehrerer Quellen (Lab 5.2). Signals kennen keine Zeit, nur den aktuellen Wert.

</details>

- Signal = aktueller Wert, Observable = Folge von Ereignissen über die Zeit.
- `toSignal` und `toObservable` verbinden beide Welten; RxJS-Logik bleibt, das Template liest Signals.
- `resource`, `rxResource` und `httpResource` laden Daten, die von Signals abhängen, und liefern Wert, Ladezustand und Fehler als Signals.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| `toSignal(obs$)` | abonniert ein Observable und stellt den letzten Wert als Signal bereit; beendet das Abo beim Zerstören |
| `toObservable(sig)` | macht aus einem Signal ein Observable, das bei jeder Änderung sendet |
| Resource | Objekt aus Signals für asynchrone Daten: `value()`, `status()`, `isLoading()`, `error()`, `hasValue()`, `reload()` |
| `httpResource` | Resource für eine GET-Anfrage über `HttpClient`; die URL ist eine Funktion, die Signals lesen darf |
| Router-Input | Routen- oder Query-Parameter, den der Router dank `withComponentInputBinding()` in einen gleichnamigen Input schreibt |

## Signal oder Observable

| | Signal | Observable |
| --- | --- | --- |
| Inhalt | genau ein aktueller Wert | Folge von Werten über die Zeit |
| Lesen | synchron, jederzeit: `count()` | nur per Abo, Werte kommen später |
| Startwert | immer vorhanden | evtl. keiner (bis zum ersten `next`) |
| Abbruch, Zeit | nicht vorgesehen | `switchMap`, `debounceTime`, `takeUntil…` |
| Operatoren | `computed` | hunderte (`map`, `retry`, `combineLatest`, …) |
| Aufräumen | automatisch | Abo beenden (Lab 5.3) |
| Typisch | UI-Zustand, Formularwerte, Auswahl, Warenkorb | Eingabeströme, HTTP-Abläufe, WebSocket, Router-Ereignisse |

> **Merksatz:** Zustand → Signal, Ereignisse und Zeit → Observable.

## `toSignal` und `toObservable`

```ts
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

protected readonly track = signal('Frontend');

// Signal → Observable → RxJS-Operatoren aus Lab 5.2 → Signal
protected readonly trackSessions = toSignal(
  toObservable(this.track).pipe(
    debounceTime(200),
    switchMap((track) => this.api.getSessions({ track })),
  ),
  { initialValue: [] },
);
```

```html
<select [value]="track()" (change)="track.set($any($event.target).value)">…</select>
@for (session of trackSessions(); track session.id) { … }
```

Dasselbe Prinzip funktioniert mit jeder Funktion, die Observables annimmt und zurückgibt, auch mit `createSessionSearch` aus Lab 5.2.

- `toSignal` braucht den Injection Context (Feld oder Konstruktor) und abonniert sofort.
- Ohne `initialValue` ist der Typ `T | undefined`; mit `initialValue: null` ist er `T | null`.
- `toObservable` sendet den aktuellen Wert beim ersten Durchlauf (asynchron, intern über einen `effect`, nicht synchron beim Abonnieren) und danach jede Änderung; mehrere Änderungen im selben Durchlauf kommen als ein Wert an.

## Daten laden mit Resources

```text
speakerId (signal) ──► url() ──► httpResource ──► value() / isLoading() / error() ──► Template
       ändert sich      neu        alte Anfrage abbrechen, neue starten
```

| API | Lädt mit | Paket | Einsatz |
| --- | --- | --- | --- |
| `resource({ params, loader })` | `Promise` (z. B. `fetch`) | `@angular/core` | beliebige asynchrone Quelle |
| `rxResource({ params, stream })` | `Observable` | `@angular/core/rxjs-interop` | vorhandene Service-Methoden mit Observables |
| `httpResource(() => url)` | `HttpClient` (Interceptors greifen) | `@angular/common/http` | einfache GET-Anfragen |

Alle drei sind seit Angular 22 stabil (`@publicApi 22.0` in den Typdefinitionen, geprüft mit Angular 22.2.3, Stand 28.10.2026).

```ts
readonly speakerId = signal<number | null>(null);

// httpResource: URL als Funktion; undefined = keine Anfrage
readonly speaker = httpResource<Speaker>(() =>
  this.speakerId() === null ? undefined : `${API_URL}/speakers/${this.speakerId()}`,
);

// rxResource: Observable-Quelle, params bestimmen, wann neu geladen wird
readonly speaker2 = rxResource({
  params: () => this.speakerId() ?? undefined, // undefined = keine Anfrage
  stream: ({ params: id }) => this.http.get<Speaker>(`${API_URL}/speakers/${id}`),
});

// resource: Promise-basiert, abortSignal bricht alte Anfragen ab
readonly speaker3 = resource({
  params: () => this.speakerId() ?? undefined,
  loader: ({ params: id, abortSignal }) =>
    fetch(`${API_URL}/speakers/${id}`, { signal: abortSignal }).then((r) => r.json() as Promise<Speaker>),
});
```

| Signal der Resource | Bedeutung |
| --- | --- |
| `status()` | `'idle'`, `'loading'`, `'reloading'`, `'resolved'`, `'error'`, `'local'` |
| `isLoading()` | `true` bei `loading` und `reloading` |
| `value()` | Ergebnis; `undefined` während `loading`. Im Status `error` wirft `value()` einen Fehler („Resource is currently in an error state“), deshalb vorher `error()` oder `hasValue()` prüfen |
| `hasValue()` | `true`, wenn ein Wert vorliegt; Prüfung vor dem Zugriff auf `value()` im Template |
| `error()` | Fehlerobjekt bei Status `error` |
| `statusCode()` | HTTP-Status (nur `httpResource`) |
| `reload()` | dieselbe Anfrage erneut ausführen |

Resources sind für **Lesen** gedacht. Speichern (POST, PATCH) läuft weiter über `HttpClient`; ein Abbruch durch neue Parameter könnte sonst eine Änderung halb abbrechen.

## Router-Input mit klassischem `@Input`

Die Kurs-App nutzt `provideRouter(routes, withComponentInputBinding())` (Lab 1.2). Der Router schreibt dann Pfad- und Query-Parameter in gleichnamige Inputs der Routen-Komponente: `/playground?id=3` setzt `@Input() id` auf `'3'`.

```ts
// Seite: bekommt die ID vom Router und reicht sie weiter
@Input() id?: string;

// Detail-Komponente: Setter schreibt den Input in ein Signal, damit httpResource reagiert
protected readonly sessionId = signal<number | undefined>(undefined);
@Input({ required: true })
set id(value: string | number) {
  this.sessionId.set(Number(value));
}
```

Der Setter ist die Brücke zwischen klassischem Input und Signal; Lab 6.3 ersetzt ihn durch `input()`.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `NG0203` bei `toSignal` | Aufruf in `ngOnInit` oder Methode | als Feld oder im Konstruktor anlegen |
| `Cannot read properties of undefined` im Template | `value()` gelesen, während `loading` | erst `hasValue()` oder `isLoading()` prüfen |
| `Resource is currently in an error state` in der Konsole, Template bricht ab | `value()` im Status `error` gelesen, z. B. bei 404 | Reihenfolge im Template: zuerst `error()`, dann `hasValue()`, erst danach `value()` |
| Detail lädt bei Klick auf andere Session nicht neu | URL-Funktion liest kein Signal (ID als normales Feld) | ID in ein Signal schreiben und in der URL-Funktion lesen |
| Ergebnis von `toSignal` ist `undefined` | Observable hat noch nicht gesendet, kein `initialValue` | `initialValue` setzen oder `undefined` im Template behandeln |
| Router-Input kommt nicht an | Name des Inputs ≠ Name des Parameters | Input genauso nennen wie `:id` bzw. `?id=` |

## Fazit

- Zustand als Signal, Abläufe über die Zeit als Observable; `toSignal`/`toObservable` verbinden beides ohne `subscribe`.
- `httpResource` lädt abhängig von Signals und liefert Lade- und Fehlerzustand gleich mit.
- RxJS bleibt für Entprellen, Abbrechen und Kombinieren; das Template liest nur noch Signals.

Die Übung lädt ein Session-Detail per `httpResource` und bringt die Live-Suche aus Lab 5.2 per `toSignal` ins Template.
