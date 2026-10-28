# Lab 10.4 – Übung: Stores testen

**Dauer:** ca. 17 Minuten
**Ändert die EventHub-Projektbasis?** Ja — neue Testdatei im Playground; Store-Code bleibt unverändert.

## Vorbereitung

- Kein Server nötig. Für die Beispielseite optional `npm run api` und `npm start`.
- Starter: Ordner `src/app/starters/m10-l04-store-tests/` mit
  - `sessions.feature.ts` (Actions, Reducer, Selectors aus Lab 7.2),
  - `sessions.effects.ts` (funktionaler Effect `loadSessions` aus Lab 7.3),
  - `sessions.store.ts` (Signal Store `SessionsStore` aus Lab 7.4),
  - `favorites-badge.ts` (kleine Komponente, die `selectFavoriteCount` anzeigt; nur für die Erweiterung),
  - `store-tests.spec.ts` (drei `describe`-Blöcke mit `it.todo`, Testdaten und Scheduler vorbereitet).
- Arbeitsordner: `src/app/playground/m10-l04-store-tests/`
- Testlauf im Watch-Modus:

  ```bash
  npx ng test --include=src/app/playground/m10-l04-store-tests
  ```

- Beispielseite zum Vergleich: http://localhost:4200/examples/m10-testing/l04-store-tests

## Aufgaben

1. Kopiere den Ordner `src/app/starters/m10-l04-store-tests/` nach `src/app/playground/m10-l04-store-tests/` und starte den Testlauf.
2. **Reducer „Favorit umschalten“:** Ersetze das erste `it.todo`. Rufe den Reducer zweimal mit `toggleFavorite({ id: 7 })` auf und prüfe `favoriteIds` nach jedem Schritt. Prüfe zusätzlich, dass `initialState` unverändert bleibt.
3. **Effect „Laden fehlgeschlagen“:** Ergänze im `beforeEach` die Provider `provideMockActions(() => actions$)` und `{ provide: SessionApi, useValue: api }`. Ersetze das `it.todo`: `load` kommt bei Frame 1, `getSessions` endet nach 2 Frames mit `new HttpErrorResponse({ status: 500 })`. Erwartet wird `loadFailure({ error: 'Laden fehlgeschlagen (500)' })` bei Frame 3.
4. **Signal Store „Favoriten-Zähler“:** Stelle `SessionsStore` und eine gemockte `SessionApi` (`getSessions: vi.fn(() => of(sessions))`) per `TestBed` bereit. Schalte die Favoriten 1, 7 und noch einmal 1 um und prüfe `favoriteCount()` und `favoriteIds()`.
5. Ändere in der Playground-Kopie von `sessions.effects.ts` die Fehlermeldung (z. B. `Fehler (…)`), notiere die Meldung des roten Tests und stelle den Text wieder her.

## Checkpoint

- Nach Aufgabe 2: ein grüner Test ohne `TestBed`.
- Nach Aufgabe 4: drei grüne Tests über beide Store-Varianten.

## Abschlusskriterien

- `npx ng test --watch=false --include=src/app/playground/m10-l04-store-tests` meldet drei grüne Tests.
- Der Effect-Test nutzt `provideMockActions` und ein Marble-Diagramm, keine echte HTTP-Anfrage.
- Der Signal-Store-Test nutzt eine gemockte `SessionApi`.

## Erweiterung

- Effect-Erfolgsfall: `getSessions` liefert `cold('--r|', { r: sessions })`, erwartet `loadSuccess` bei Frame 3.
- Signal Store: `load()` mit gemockter API füllt `entities()`; Fehlerfall mit `mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })))` setzt `error()`.
- Komponente `FavoritesBadge` (`favorites-badge.ts`): in einer neuen Datei `favorites-badge.spec.ts` mit `provideMockStore` und `overrideSelector(sessionsFeature.selectFavoriteCount, 3)` prüfen, dass `★ 3` angezeigt wird.

## Fallback

Läuft der Effect-Test leer, zuerst prüfen, ob `actions$` vor `TestBed.runInInjectionContext(() => loadSessions())` gesetzt ist. Die fertigen Tests liegen unter `src/app/examples/m10-testing/l04-store-tests/`.
