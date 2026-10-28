# Lab 10.3 – Übung: Marble-Testing für RxJS-Streams

**Dauer:** ca. 20 Minuten (einzeln oder zu zweit)
**Ändert die EventHub-Projektbasis?** Ja — neue Testdatei im Playground; `session-search.ts` bleibt bis auf Aufgabe 6 unverändert.

## Vorbereitung

- Kein Server nötig. Für die Beispielseite optional `npm run api` und `npm start`.
- Starter: Ordner `src/app/starters/m10-l03-marble-testing/` mit
  - `session-search.ts` (Suchkette aus Lab 5.2 als Funktion `sessionSearch(terms$, search)`),
  - `session-search.spec.ts` (Scheduler und Testdaten `angularTalk`, `rxjsTalk` vorbereitet, vier `it.todo`).
- Arbeitsordner: `src/app/playground/m10-l03-marble-testing/`
- Testlauf im Watch-Modus:

  ```bash
  npx ng test --include=src/app/playground/m10-l03-marble-testing
  ```

- Beispielseite zum Vergleich: http://localhost:4200/examples/m10-testing/l03-marble-testing

## Aufgaben

1. Kopiere den Ordner `src/app/starters/m10-l03-marble-testing/` nach `src/app/playground/m10-l03-marble-testing/` und starte den Testlauf.
2. **Entprellung:** Eingaben `'an'` (0 ms), `'ang'` (101 ms) und `'angular'` (502 ms), danach Abschluss, als `cold`-Diagramm. Die Suche antwortet sofort (`cold('(r|)', …)`). Zeichne zuerst das erwartete Ausgabe-Diagramm auf Papier, dann schreibe den Test mit `expectObservable`.
3. **Gleicher Begriff:** Eingaben `'rxjs'` und `'rxjs '` (mit Leerzeichen, 401 ms später) als `hot`-Diagramm. Erwartet: genau eine Ausgabe bei 300 ms. Prüfe zusätzlich mit `vi.fn` und `scheduler.flush()`, dass die Suche genau einmal aufgerufen wurde.
4. **Abbruch durch switchMap:** `'ang'` bei 0, `'angular'` bei 401 (hot). Die Suche nach `'ang'` antwortet nach 500 ms, die nach `'angular'` nach 100 ms. Erwartet: nur das Ergebnis für `'angular'`. Prüfe mit `expectSubscriptions`, wann die langsame Suche abonniert und abbestellt wird.
5. **Fehlerfall:** Die Suche nach `'ang'` endet nach 50 ms mit `#`, die nach `'rxjs'` (401 ms später eingegeben) liefert ein Ergebnis. Erwartet: zuerst ein Zustand mit `error: 'Suche fehlgeschlagen'`, danach das Ergebnis für `'rxjs'`.
6. Ersetze in der Playground-Kopie von `session-search.ts` `switchMap` durch `mergeMap`, notiere welche Tests rot werden und mit welcher Abweichung, und stelle `switchMap` wieder her.

## Checkpoint

- Nach Aufgabe 2: ein grüner Test; die Laufzeit pro Test liegt im Millisekundenbereich, obwohl 300 ms Debounce im Spiel sind.
- Nach Aufgabe 5: vier grüne Tests.

## Abschlusskriterien

- `npx ng test --watch=false --include=src/app/playground/m10-l03-marble-testing` meldet vier grüne Tests.
- Jeder Test baut alle Observables innerhalb von `scheduler.run(...)` auf.
- Aufgabe 6 hat gezeigt, welcher Test die Race Condition aus Lab 5.2 erkennt.

## Erweiterung

- Teste den Parameter `debounceMs`: mit `sessionSearch(terms, search, 100)` kommt die Ausgabe 200 Frames früher.
- Ergänze `filter((term) => term.length >= 2)` in der Playground-Kopie und schreibe zuerst den Test, der einen Ein-Buchstaben-Begriff ignoriert.

## Fallback

Wer mit den Frame-Rechnungen nicht weiterkommt: im Test vorübergehend `expectObservable(...).toBe('')` schreiben. Die Diff-Ausgabe listet unter `+ Received` die tatsächlichen Ereignisse mit `"frame"` und `"kind"` (`N` = Wert, `C` = Abschluss, `E` = Fehler); daraus lässt sich das richtige Diagramm ablesen.
