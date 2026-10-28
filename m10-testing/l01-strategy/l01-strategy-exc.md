# Lab 10.1 – Übung: Teststrategie und Vitest

**Dauer:** ca. 17 Minuten
**Ändert die EventHub-Projektbasis?** Ja — neue Testdatei im Playground; der Code unter Test bleibt unverändert.

## Vorbereitung

- Terminal: Testlauf (siehe Aufgaben). Die Tests brauchen weder API noch Dev-Server.
- Nur für die Beispielseite zum Vergleich: zusätzlich `npm run api` und `npm start` in zwei weiteren Terminals.
- Starter: Ordner `src/app/starters/m10-l01-strategy/` mit
  - `workshop-stats.ts` (Code unter Test: `warnIfAlmostFull`, `logSoldOut`, Service `WorkshopStats`),
  - `workshop-stats.spec.jasmine.txt` (drei Jasmine-Tests aus einem Karma-Projekt).
- Arbeitsordner: `src/app/playground/m10-l01-strategy/`
- Beispielseite zum Vergleich: http://localhost:4200/examples/m10-testing/l01-strategy

## Aufgaben

1. Führe `npm run test:run` aus und notiere Anzahl der Testdateien, Anzahl der Tests und die Dauer aus der Zusammenfassung.
2. Kopiere den Ordner `src/app/starters/m10-l01-strategy/` nach `src/app/playground/m10-l01-strategy/`.
3. Benenne dort `workshop-stats.spec.jasmine.txt` in `workshop-stats.spec.ts` um.
4. Starte den Watch-Modus nur für diesen Ordner:

   ```bash
   npx ng test --include=src/app/playground/m10-l01-strategy
   ```

   Notiere die erste Fehlermeldung.
5. Schreibe den Test für `warnIfAlmostFull` auf Vitest um (`jasmine.createSpy`, `toBeTrue`, `toHaveBeenCalledOnceWith`). Speichere und beobachte, dass der Watch-Modus neu baut: Die Fehlerliste wird kürzer, bleibt aber rot, solange die anderen beiden Tests noch Jasmine-Aufrufe enthalten.
6. Schreibe den Test für `logSoldOut` um (`spyOn(console, 'warn')`). Sorge dafür, dass keine Warnung in der Testausgabe erscheint und der Spy nach dem Test wieder entfernt wird.
7. Schreibe den Test für `WorkshopStats` um (`spyOn(...).and.returnValue(...)`).
8. Ändere in `workshop-stats.ts` (Playground-Kopie) die Grenze in `warnIfAlmostFull` von `90` auf `96`, speichere, notiere welcher Test rot wird, und stelle den Wert wieder her.
9. Ergänze einen vierten Test: `warnIfAlmostFull` ruft `notify` bei geringer Auslastung **nicht** auf.
10. Führe die Tests mit Coverage aus (das Paket `@vitest/coverage-v8` ist im Kurs-Projekt installiert):

    ```bash
    npx ng test --watch=false --coverage --include=src/app/playground/m10-l01-strategy
    ```

    Notiere für `workshop-stats.ts` die Spalten `% Lines` und `% Branch` sowie `Uncovered Line #s`, und finde heraus, welcher Zweig in dieser Zeile nie ausgeführt wurde.

## Checkpoint

- Nach Aufgabe 4 meldet der Build `jasmine` bzw. `spyOn` als unbekannt.
- Nach Aufgabe 5 und 6 wird die Fehlerliste kürzer; der Build bleibt rot bis Aufgabe 7.
- Nach Aufgabe 7 (erster grüner Lauf) meldet die Zusammenfassung `1 passed` Testdatei und drei grüne Tests.
- Die Testausgabe enthält keine Zeile `Ausgebucht: …` aus `console.warn`.

## Abschlusskriterien

- `src/app/playground/m10-l01-strategy/workshop-stats.spec.ts` enthält kein `jasmine.` und kein freies `spyOn(` mehr.
- `npx ng test --watch=false --include=src/app/playground/m10-l01-strategy` ist grün (vier Tests).
- Aufgabe 8 hat einen roten Test gezeigt, danach ist die Suite wieder grün.

## Erweiterung

- Lasse den Refactoring-Schematic auf die Jasmine-Version los und vergleiche mit dem eigenen Ergebnis: Kopiere die `.txt`-Datei als `workshop-stats-auto.spec.ts` in den Playground-Ordner und führe `npx ng g @schematics/angular:refactor-jasmine-vitest --include=src/app/playground/m10-l01-strategy/workshop-stats-auto.spec.ts` aus. Der Schematic ist experimentell und legt im Projektordner einen Bericht `jasmine-vitest-<Zeitstempel>.md` an; Unterschiede zur eigenen Fassung notieren, den Bericht danach löschen.
- Ordne fünf Tests aus dem eigenen Projekt den Ebenen der Testpyramide zu.

## Fallback

Fehlt `@vitest/coverage-v8` in einem eigenen Projekt, entfällt Aufgabe 10; der Rest der Übung braucht keine zusätzlichen Pakete und keine laufende API.
