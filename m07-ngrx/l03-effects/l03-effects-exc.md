# Lab 7.3 – Übung: Effects für Seiteneffekte

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Ja — die Playground-Route in `src/app/app.routes.ts` bekommt Effects; Lab 7.4 baut dasselbe Feature als Signal Store.

## Vorbereitung

- Terminal 1: `npm run api` (Mock-API auf Port 3000)
- Terminal 2: `npm start` (App auf Port 4200)
- Arbeitsdatei: `src/app/playground/m07-l03-effects/sessions.effects.ts` (Komponente, Actions und Reducer sind vorgegeben)
- Starter: `src/app/starters/m07-l03-effects.ts` und Ordner `src/app/starters/m07-l03-effects/`
- URL: http://localhost:4200/playground
- Redux DevTools offen, Tab **Redux**

## Aufgaben

1. Kopiere `src/app/starters/m07-l03-effects.ts` nach `src/app/playground/playground.ts` und den Ordner `src/app/starters/m07-l03-effects/` nach `src/app/playground/m07-l03-effects/`. Lies `sessions.actions.ts` und `sessions.feature.ts`; neu sind `Reload Clicked`, `Save Favorites Clicked` und die beiden `Favorites Saved`-Actions. Bis Aufgabe 3 hängt an der Route `playground` noch der Stand aus Lab 7.2: Mit fertigem Lab 7.2 zeigt `/playground` dauerhaft „Lade Sessions …“ ohne Liste (die Komponente meldet `opened`, aber noch lädt kein Effect; ein leeres Badge „Favoriten gespeichert“ ist normal). Ohne Provider aus Lab 7.2 meldet die Konsole `NG0201: No provider found for Store`. Beides behebt Aufgabe 3.
2. Schreibe in `sessions.effects.ts` den funktionalen Effect `loadSessions`: Er reagiert auf `opened` und `reloadClicked`, lädt per `SessionApi.getSessions()` mit `switchMap` und liefert `sessionsLoadedSuccess` oder, per `catchError` im inneren Observable, `sessionsLoadedFailure` mit dem Text `Laden fehlgeschlagen (HTTP <Status>)`, also z. B. `Laden fehlgeschlagen (HTTP 500)`.
3. Ändere in `src/app/app.routes.ts` die Provider der Route `playground`:

   ```ts
   providers: [
     provideStore(),
     provideState(sessionsFeature),
     provideEffectsRuntimeAtRoute(),
     provideEffects(sessionsEffects),
     provideStoreDevtools({ name: 'EventHub Playground', maxAge: 25 }),
   ],
   ```

   Imports: `sessionsFeature` aus `./playground/m07-l03-effects/sessions.feature`, `import * as sessionsEffects from './playground/m07-l03-effects/sessions.effects'`, `provideEffects` aus `@ngrx/effects`, `provideEffectsRuntimeAtRoute` aus `./examples/m07-ngrx/shared/effects-at-route`. `provideEffectsRuntimeAtRoute()` braucht nur die Kurs-App, weil hier jede Route einen eigenen Store hat (siehe Theorie).
4. Lade `/playground` neu. Setze danach den Haken „API-Fehler simulieren“ und klicke „Neu laden“. Klicke nach dem Entfernen des Hakens auf „Erneut versuchen“.
5. Schreibe den Effect `saveFavorites`: Er reagiert auf `saveFavoritesClicked`, ruft `FavoritesStorage.save(favoriteIds)` mit `exhaustMap` auf und liefert `favoritesSavedSuccess` oder `favoritesSavedFailure`. Markiere zwei Favoriten und doppelklicke schnell auf „Favoriten speichern“.
6. Schreibe den Effect `logErrors` mit `dispatch: false`, der bei `sessionsLoadedFailure` und `favoritesSavedFailure` den Fehlertext mit dem Präfix `[Sessions]` per `console.error` ausgibt. Prüfe ihn mit dem Fehlerschalter aus Aufgabe 4.
7. Prüfe im Tab **Redux** die Reihenfolge der Actions für Laden, Fehler und Speichern.

## Checkpoint

Nach Aufgabe 4:

- Beim Öffnen zeigt der Tab Redux `[Sessions Page] Opened`, danach `[Sessions API] Sessions Loaded Success`; die Liste erscheint.
- Mit Fehlerschalter zeigt die Seite „Laden fehlgeschlagen (HTTP 500)“ und den Button „Erneut versuchen“.
- Nach dem Ausschalten lädt „Erneut versuchen“ die Liste wieder. Der Effect lebt nach dem Fehler weiter.

## Abschlusskriterien

- `playground.ts` enthält keinen HTTP-Aufruf; Laden und Speichern laufen über Effects.
- Ein Doppelklick auf „Favoriten speichern“ erzeugt zwei `Save Favorites Clicked`, aber nur ein `Favorites Saved Success`; die Konsole zeigt `[FavoritesStorage] speichere` genau einmal.
- Der Fehlerfall erscheint in der Seite, im Tab Redux und, nach Aufgabe 6, in der Konsole als `[Sessions] Laden fehlgeschlagen (HTTP 500)`.
- Der Schalter „API-Fehler simulieren“ ist am Ende aus.

## Erweiterung

- Tausche in `saveFavorites` `exhaustMap` gegen `concatMap` und wiederhole den Doppelklick. Notiere als Kommentar, wie viele Speichervorgänge laufen und wann welcher Operator passt.
- Schreibe einen Effect `loadFavorites`, der bei `opened` die gespeicherten Favoriten mit `FavoritesStorage.load()` liest. Ergänze dafür eine Action `Favorites Loaded Success` in `sessionsApiActions` und einen `on`-Fall im Reducer.
- Starte mit `http://localhost:3000/_control` per `curl` eine Verzögerung (`{"delay":2000}`), klicke dreimal schnell auf „Neu laden“ und prüfe im Tab **Netzwerk**, wie viele Anfragen abgebrochen werden. Setze danach `{"delay":0}`.

## Fallback

- Ohne Redux DevTools: Prüfe die Actions mit einem zusätzlichen Effect `{ functional: true, dispatch: false }`, der `actions$.pipe(tap((action) => console.log(action.type)))` ausgibt.
- Wenn der Schalter „API-Fehler simulieren“ nicht reagiert: `curl -X POST http://localhost:3000/_control -H "Content-Type: application/json" -d '{"fail":500}'` und danach `-d '{"fail":0}'`.
- Fertiger Stand zum Vergleich: http://localhost:4200/examples/m07-ngrx/l03-effects
