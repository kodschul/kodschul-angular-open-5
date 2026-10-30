# Lab 5.2: Higher-Order-Operatoren: Live-Suche ohne Race Conditions

**Leitfragen:**

<details>
<summary>Jemand tippt „ang“, dann „angular“; die erste Antwort kommt später an. Was steht in der Liste?</summary>

Wenn jede Antwort die Liste überschreibt: die Treffer für „ang“, obwohl im Feld „angular“ steht. Die langsamere, ältere Antwort gewinnt. Dieses Fehlerbild heißt Race Condition.

</details>

<details>
<summary>Muss bei jedem Tastendruck eine Anfrage raus?</summary>

Nein. Sinnvoll ist eine Anfrage, wenn die Eingabe kurz ruht und sich wirklich geändert hat. Dafür gibt es `debounceTime` (aus Lab 5.1) und `distinctUntilChanged` (lässt einen Wert nur durch, wenn er sich vom vorherigen unterscheidet).

</details>

<details>
<summary>Was soll bei Doppelklick auf „Anmelden“ passieren?</summary>

Genau eine Anmeldung. Solange die erste Anfrage läuft, wird der zweite Klick ignoriert. Für dieses Verhalten gibt es einen eigenen Operator: `exhaustMap` ignoriert neue Werte, solange die laufende Anfrage noch nicht fertig ist (siehe Tabelle unten).

</details>

- Eine Suche ist ein Strom von Suchbegriffen, aus dem pro Begriff ein neuer Strom (die HTTP-Anfrage) entsteht.
- Wie diese inneren Ströme zusammengeführt werden, entscheidet über richtige oder falsche Ergebnisse.
- `switchMap` bricht die alte Anfrage ab, sobald ein neuer Begriff kommt: Die Liste zeigt immer den letzten Begriff.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| Äußeres Observable | Der auslösende Strom, hier die Suchbegriffe |
| Inneres Observable | Der Strom, der pro äußerem Wert entsteht, hier eine HTTP-Anfrage |
| Higher-Order-Operator | Operator, der pro Wert ein inneres Observable startet und die Ergebnisse in einen Strom zusammenführt (`switchMap`, `mergeMap`, `concatMap`, `exhaustMap`) |
| Race Condition | Ergebnis hängt davon ab, welche von mehreren parallelen Antworten zuletzt ankommt |
| `combineLatest` | Kombiniert mehrere Ströme; sendet bei jeder Änderung ein Array mit dem jeweils letzten Wert jedes Stroms |

## Erst ohne: Suche mit `mergeMap`

`mergeMap` startet für jeden Begriff eine Anfrage und gibt jede Antwort weiter, sobald sie da ist, egal in welcher Reihenfolge.

```text
Begriffe:   -a-------b-------|     a="ang", b="angular"
Anfrage a:  startet bei a, Antwort A nach 1200 ms (Frame 13)
Anfrage b:  startet bei b, Antwort B nach 200 ms (Frame 11)
mergeMap:   -----------B-A---|     A kommt zuletzt → Liste zeigt "ang"
switchMap:  -----------B-----|     Anfrage a wird bei b abgebrochen
```

Die Mock-API macht das Fehlerbild reproduzierbar: Der Query-Parameter `_randomDelay=1` verzögert jede Antwort zufällig um 0–1500 ms. Die Beispielroute `/examples/m05-rxjs/l02-operators/ohne` zeigt das Fehlerbild: `mergeMap` mit Entprellung 0 ms (`debounceTime(0)`), also praktisch eine Anfrage pro Tastendruck.

```text
GET http://localhost:3000/sessions?q=ang&_randomDelay=1
```

## Die vier Higher-Order-Operatoren

```text
Äußere Werte: -a--b--c-|     jeder Wert startet ein inneres Observable mit Dauer "---X|"
```

| Operator | Verhalten bei neuem äußeren Wert | Diagramm-Idee | Typischer Einsatz |
| --- | --- | --- | --- |
| `switchMap` | bricht das laufende innere Observable ab, startet das neue | nur das letzte Ergebnis zählt | Suche, Laden nach Auswahl, Routenparameter |
| `mergeMap` | startet parallel, alle laufen weiter | Ergebnisse in Ankunftsreihenfolge | unabhängige Aktionen, z. B. mehrere Uploads |
| `concatMap` | wartet, bis das laufende fertig ist, dann das nächste | Warteschlange, Reihenfolge bleibt | Speichern in fester Reihenfolge |
| `exhaustMap` | ignoriert neue Werte, solange eines läuft | erster gewinnt | Login-Button, Doppelklick-Schutz |

Dieselbe Eingabe durch alle vier Operatoren. Jeder äußere Wert startet ein inneres Observable `----x|`: Ergebnis nach 4 Frames, Ende nach 5. Kleinbuchstaben in der Ausgabe = Ergebnis zum gleichnamigen äußeren Wert.

```text
Äußere Werte: -a--b--c-|
switchMap:    -----------c|        b bricht a ab, c bricht b ab: nur c kommt an
mergeMap:     -----a--b--c|        alle drei laufen parallel, jedes Ergebnis kommt an
concatMap:    -----a----b----c|    b wartet auf das Ende von a, c auf das Ende von b
exhaustMap:   -----a-----c|        b kommt, während a läuft: ignoriert; c startet nach dem Ende von a
```

- Das Ende `|` der Ausgabe kommt erst, wenn der äußere Strom **und** alle laufenden inneren Observables beendet sind.
- `concatMap` liefert alles, aber am spätesten; `switchMap` liefert am wenigsten, aber nie veraltet.

## Eingaben bremsen: `debounceTime` und `distinctUntilChanged`

```ts
term$.pipe(
  map((value) => value.trim()),
  debounceTime(300), // erst nach 300 ms Tipp-Pause weitergeben (Lab 5.1)
  distinctUntilChanged(), // "angular" → "angular " → trim → gleich → keine neue Anfrage
);
```

```text
Frame = 100 ms; a="a", n="an", g="ang" (zweimal, dazwischen kurz "ang " getippt und gelöscht)
Eingabe nach trim:     a-n-g----g---|
debounceTime(300):     -------g----g|
distinctUntilChanged:  -------g-----|    zweites "ang" fällt weg, keine zweite Anfrage
```

## Fehler abfangen: `catchError` und `retry`

- `retry(n)`: Abonniert das fehlgeschlagene Observable bis zu `n`-mal neu, bei HTTP also eine neue Anfrage.
- `catchError(fn)`: Ersetzt den Fehler durch ein anderes Observable, z. B. `of({ sessions: [], error: '…' })`.
- **Position entscheidet:** Ein Fehler beendet den Strom, in dem er auftritt. Steht `catchError` außen hinter `switchMap`, ist danach die ganze Suche tot. Steht es innen an der Anfrage, endet nur diese eine Anfrage.

```ts
switchMap((q) =>
  search(q).pipe(
    retry(1),
    catchError(() => of({ sessions: [], error: 'Suche fehlgeschlagen' })), // innen: Suche lebt weiter
  ),
);
```

Fehler testen: `_fail=500` an die URL hängen, dann antwortet die Mock-API immer mit Status 500.

## Suche und Filter kombinieren: `combineLatest`

```text
Begriff:  -a-------b----     a="ang" b="angular"
Level:    x----y--------     x="" y="Experte"
combineLatest: -A---B---C---  A=[ang,""] B=[ang,Experte] C=[angular,Experte]
```

- `combineLatest` sendet erst, wenn **jeder** Eingangsstrom mindestens einen Wert hatte.
- `valueChanges` ist ein Observable am `FormControl` (Lab 4.1), das bei jeder Änderung des Felds den neuen Wert sendet. Den Anfangswert sendet es nicht, der erste Wert kommt erst mit der ersten Eingabe. `startWith(wert)` stellt einen Anfangswert voran, damit die Suche sofort mit leerem Begriff startet.

## Die vollständige Suche als reine Funktion

Die Pipeline steht in einer eigenen Datei ohne Angular-Abhängigkeit. So lässt sie sich mit beliebigen Strömen füttern und später ohne Browser testen (Lab 10.3). Das Muster am Beispiel einer Sprecher-Suche nach Name und Thema:

```ts
// speaker-search.ts: Muster, nicht Teil des Projekts
export type SpeakerFindFn = (name: string, topic: string) => Observable<Speaker[]>;

export function createSpeakerSearch(
  name$: Observable<string>,
  topic$: Observable<string>,
  find: SpeakerFindFn,
): Observable<SpeakerSearchResult> {
  const name = name$.pipe(map((v) => v.trim()), debounceTime(400), distinctUntilChanged());
  const topic = topic$.pipe(distinctUntilChanged());

  return combineLatest([name, topic]).pipe(
    switchMap(([n, t]) =>
      find(n, t).pipe(
        retry(2),
        map((speakers) => ({ name: n, topic: t, speakers, error: null })),
        catchError(() => of({ name: n, topic: t, speakers: [], error: 'Sprecher nicht ladbar' })),
      ),
    ),
  );
}
```

Die Komponente liefert die Eingangsströme und zeigt das Ergebnis per `async`-Pipe:

```ts
protected readonly speakers$ = createSpeakerSearch(
  this.nameControl.valueChanges.pipe(startWith('')),
  this.topicControl.valueChanges.pipe(startWith('')),
  (name, topic) => this.find(name, topic), // HttpClient.get mit Query-Parametern
);
```

```html
@if (speakers$ | async; as result) {
  <p>Sprecher für »{{ result.name }}«</p>
  @for (speaker of result.speakers; track speaker.id) { … }
}
```

Das Ergebnis trägt den Begriff, für den es gilt (`result.name`). So zeigt die Oberfläche sofort, wenn eine Antwort nicht zur Eingabe passt. Die Übung baut dieselbe Struktur für Sessions mit Level-Filter (`createSessionSearch`); die Referenzfassung liegt in `src/app/examples/m05-rxjs/l02-operators/session-search.ts`.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| Liste zeigt Treffer eines älteren Begriffs | `mergeMap` statt `switchMap` | `switchMap` verwenden |
| Nach einem Fehler reagiert die Suche nicht mehr | `catchError` außen hinter `switchMap` | `catchError` in das innere Observable verschieben |
| Beim Laden passiert nichts, erst nach Tippen | `valueChanges` ohne Anfangswert, `combineLatest` wartet | `startWith('')` |
| Anfrage pro Tastendruck | `debounceTime` fehlt oder steht hinter `switchMap` | `debounceTime` vor den Higher-Order-Operator |
| `Observable<Observable<…>>` im Typ | `map` statt `switchMap` für die Anfrage | Higher-Order-Operator verwenden |

## Fazit

- Pro Suchbegriff entsteht ein inneres Observable; der Higher-Order-Operator entscheidet, welche Antworten zählen.
- `switchMap` für „nur das Neueste“, `concatMap` für Reihenfolge, `exhaustMap` gegen Doppelklicks, `mergeMap` nur für unabhängige Aktionen.
- `debounceTime` und `distinctUntilChanged` sparen Anfragen; `catchError` gehört an die innere Anfrage.

Die Übung reproduziert die Race Condition mit `mergeMap`, korrigiert sie mit `switchMap` und fängt den API-Fehler ab.
