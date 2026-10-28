# Lab 5.2 – Lösung: Live-Suche ohne Race Conditions

Referenz: `src/app/examples/m05-rxjs/l02-operators/` (`session-search.ts`, `example.ts`), im Browser `/examples/m05-rxjs/l02-operators` (mit `switchMap`) und `/examples/m05-rxjs/l02-operators/ohne` (mit `mergeMap`, ohne `debounceTime`).

## Aufgabe 1: Starter kopieren

Der Platzhalter `of({ term: '', … })` liefert genau ein leeres Ergebnis, deshalb „Ergebnis für »«“ und „Keine Sessions gefunden.“

## Aufgabe 2: `combineLatest` und `mergeMap`

```ts
export function createSessionSearch(
  term$: Observable<string>,
  level$: Observable<string>,
  search: SessionSearchFn,
): Observable<SessionSearchResult> {
  return combineLatest([term$, level$]).pipe(
    mergeMap(([q, level]) =>
      search(q, level).pipe(map((sessions) => ({ term: q, level, sessions, error: null }))),
    ),
  );
}
```

Beim Laden erscheinen alle zwölf Sessions, weil beide Eingänge per `startWith('')` sofort einen Wert liefern.

## Aufgabe 3: Race Condition reproduzieren

Konsole bei zügigem Tippen (Ausschnitt, Reihenfolge der Antworten zufällig):

```text
→ Anfrage q="a" level=""
→ Anfrage q="an" level=""
→ Anfrage q="ang" level=""
…
→ Anfrage q="angular" level=""
← Antwort q="angular": 3 Treffer
← Antwort q="an": 6 Treffer
← Antwort q="ang": 3 Treffer
← Antwort q="a": 11 Treffer
```

Jede Antwort überschreibt die Anzeige. Kommt `q="a"` zuletzt an, steht im Feld `angular`, die Seite zeigt „Ergebnis für »a«“ mit elf Sessions und dauerhaft „passt nicht zur Eingabe“. Ursache: `mergeMap` lässt alle Anfragen parallel laufen und gibt jede Antwort in Ankunftsreihenfolge weiter.

## Aufgabe 4: `switchMap`

```ts
return combineLatest([term$, level$]).pipe(
  switchMap(([q, level]) =>
    search(q, level).pipe(map((sessions) => ({ term: q, level, sessions, error: null }))),
  ),
);
```

Der Network-Tab zeigt einen Teil der Anfragen für `a` bis `angula` als `(canceled)`: genau die, die beim nächsten Tastendruck noch liefen. `switchMap` bestellt das alte innere Observable ab, `HttpClient` bricht dabei die laufende Anfrage ab. Anfragen, deren Antwort schon da war, bleiben mit Status 200 stehen; ihre Antwort wurde kurz angezeigt und sofort ersetzt. Das letzte Ergebnis gehört immer zu `angular`.

## Aufgabe 5: Eingabe bremsen

```ts
const term = term$.pipe(
  map((value) => value.trim()),
  debounceTime(300),
  distinctUntilChanged(),
);
return combineLatest([term, level$]).pipe(
  switchMap(([q, level]) => /* wie in Aufgabe 4 */),
);
```

Beim Tippen von `angular` in einem Zug gibt es eine Anfrage (`q="angular"`) statt sieben. Ein angehängtes Leerzeichen löst dank `trim` und `distinctUntilChanged` keine neue Anfrage aus.

## Aufgabe 6: Fehler abfangen

```ts
switchMap(([q, level]) =>
  search(q, level).pipe(
    retry(1),
    map((sessions): SessionSearchResult => ({ term: q, level, sessions, error: null })),
    catchError(() => of<SessionSearchResult>({ term: q, level, sessions: [], error: 'Suche fehlgeschlagen' })),
  ),
),
```

- Mit aktivem Schalter: zwei Anfragen mit Status 500 pro Begriff (Original und eine Wiederholung durch `retry(1)`), danach „Suche fehlgeschlagen“.
- Schalter aus, Begriff ändern: Treffer erscheinen wieder. Der äußere Strom lebt, weil der Fehler nur das innere Observable beendet hat.

## Aufgabe 7: Level-Filter

„Experte“ löst über `combineLatest` sofort eine neue Anfrage mit dem letzten Suchbegriff aus; bei leerem Begriff zeigt die Liste die zwei Experte-Sessions (NgRx-Workshop, Micro-Frontends).

## Vollständige Lösung

```ts
export function createSessionSearch(
  term$: Observable<string>,
  level$: Observable<string>,
  search: SessionSearchFn,
): Observable<SessionSearchResult> {
  const term = term$.pipe(map((value) => value.trim()), debounceTime(300), distinctUntilChanged());
  const level = level$.pipe(distinctUntilChanged());

  return combineLatest([term, level]).pipe(
    switchMap(([q, lvl]) =>
      search(q, lvl).pipe(
        retry(1),
        map((sessions): SessionSearchResult => ({ term: q, level: lvl, sessions, error: null })),
        catchError(() => of<SessionSearchResult>({ term: q, level: lvl, sessions: [], error: 'Suche fehlgeschlagen' })),
      ),
    ),
  );
}
```

Die Fassung im Beispielordner hat zusätzlich einen vierten Parameter `options` (`debounceMs`, `flatten: 'switch' | 'merge'`, `retryCount`). Damit zeigt dieselbe Komponente unter `/ohne` das Fehlerbild (Routen-Daten `flatten: 'merge'` und `debounceMs: 0`, also wie nach Aufgabe 2), und Lab 10.3 testet beide Varianten.

## Erweiterung

- **`catchError` außen:** Nach dem ersten Fehler sendet `catchError` den Ersatzwert und beendet den Strom. Die `async`-Pipe erhält danach nichts mehr, neue Eingaben lösen keine Anfrage aus.
- **`concatMap`:** Alle Begriffe werden der Reihe nach abgefragt; die Liste zeigt nacheinander jedes Zwischenergebnis und erst am Schluss das richtige. Mit Zufallsverzögerung dauert das deutlich länger.
- **`exhaustMap`:** Begriffe, die während einer laufenden Anfrage kommen, gehen verloren; die Liste kann bei einem alten Begriff stehen bleiben. Passend für einen Anmelde-Button, falsch für eine Suche.
