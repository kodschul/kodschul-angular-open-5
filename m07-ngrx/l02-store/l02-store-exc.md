# Lab 7.2 – Übung: NgRx Store: Actions, Reducer, Selectors

**Dauer:** ca. 25 Minuten (Checkpoint nach Aufgabe 5, danach 5 Minuten Debrief)
**Ändert die EventHub-Projektbasis?** Ja — `src/app/app.routes.ts` bekommt Provider für die Playground-Route; Lab 7.3 baut darauf auf.

## Vorbereitung

- Terminal 1: `npm run api` (Mock-API auf Port 3000)
- Terminal 2: `npm start` (App auf Port 4200)
- Arbeitsdatei: `src/app/playground/playground.ts` und Ordner `src/app/playground/m07-l02-store/`
- Starter: `src/app/starters/m07-l02-store.ts` und Ordner `src/app/starters/m07-l02-store/`
- URL: http://localhost:4200/playground
- Redux DevTools sind im Browser installiert (siehe `00-setup-and-installation.md`).

## Aufgaben

1. Kopiere `src/app/starters/m07-l02-store.ts` nach `src/app/playground/playground.ts` und den Ordner `src/app/starters/m07-l02-store/` nach `src/app/playground/m07-l02-store/`.
2. Lege in `src/app/playground/m07-l02-store/sessions.actions.ts` zwei Action-Gruppen an:
   - `sessionsPageActions` mit Quelle `Sessions Page` und den Ereignissen `Opened` (ohne Daten) und `Favorite Toggled` (`{ sessionId: number }`),
   - `sessionsApiActions` mit Quelle `Sessions API` und den Ereignissen `Sessions Loaded Success` (`{ sessions: Session[] }`) und `Sessions Loaded Failure` (`{ error: string }`).
3. Kommentiere in `sessions.feature.ts` das vorbereitete Gerüst ein (Imports nach oben). Der Fall für `opened` ist vorgegeben. Ergänze die drei übrigen `on`-Fälle: `sessionsLoadedSuccess` übernimmt die Sessions, `sessionsLoadedFailure` setzt `error`, `favoriteToggled` fügt die ID hinzu oder entfernt sie. Das Gerüst exportiert `sessionsFeature` mit dem Namen `sessions`.
4. Ergänze in `src/app/app.routes.ts` an der Route `playground` diese Provider und die passenden Imports:

   ```ts
   providers: [
     provideStore(),
     provideState(sessionsFeature),
     provideStoreDevtools({ name: 'EventHub Playground', maxAge: 25 }),
   ],
   ```

   `sessionsFeature` kommt aus `./playground/m07-l02-store/sessions.feature`.
5. Hole in `playground.ts` den `Store` per `inject()`. Ersetze die fünf Platzhalter-Signals durch `store.selectSignal(...)` mit den automatisch erzeugten Selectors (für `favoriteSessions` vorerst `selectSessions`). Löse in `toggleFavorite` die Action `favoriteToggled` aus.
6. Löse im Konstruktor `opened()` aus. Lade danach die Sessions mit `SessionApi.getSessions()` und melde Erfolg und Fehler als `sessionsLoadedSuccess` bzw. `sessionsLoadedFailure`. Setze in `sessions.feature.ts` den Startwert `sessions` auf `[]`.
7. Ergänze in `createFeature` den Selector `selectFavoriteSessions` über `extraSelectors` und `createSelector`. Verwende ihn in `playground.ts` für `favoriteSessions`.
8. Öffne in den DevTools den Tab **Redux**, wähle die Instanz `EventHub Playground`, setze drei Favoriten und entferne einen. Springe mit **Jump** zur Action nach dem zweiten Favoriten und beobachte die Seite.

## Checkpoint

Nach Aufgabe 5 (statische Daten):

- `/playground` zeigt die zwei Demo-Sessions aus `DEMO_SESSIONS`.
- Ein Klick auf „☆ Merken“ wechselt auf „★ Favorit“; der Tab Redux zeigt `[Sessions Page] Favorite Toggled` mit `sessionId`.

## Abschlusskriterien

- Die Liste zeigt alle Sessions der Mock-API; der Tab Redux zeigt `[Sessions Page] Opened`, danach `[Sessions API] Sessions Loaded Success`.
- „Favoriten: N“ und die grünen Badges zeigen genau die markierten Sessions.
- Nach **Jump** zeigt die Seite den früheren Favoritenstand; nach Klick auf den letzten Eintrag wieder den aktuellen.
- Keine Komponente verändert den Zustand außer über `dispatch`.

## Erweiterung

- Beende die Mock-API (Strg+C in Terminal 1) und lade `/playground` neu. Der Tab Redux zeigt `Sessions Loaded Failure`, die Seite die Fehlermeldung. Starte die API danach wieder.
- Ergänze einen Selector `selectWorkshops`, der nur Sessions mit `type === 'workshop'` liefert, und zeige deren Anzahl an.

## Fallback

- Ohne Redux DevTools: Ergänze in `playground.ts` vorübergehend `effect(() => console.log(this.favoriteIds()))` und prüfe die Änderungen in der Konsole. Zeitreise entfällt.
- Ohne laufende Mock-API: Bleibe bei den `DEMO_SESSIONS` aus Aufgabe 5; Aufgabe 6 entfällt.
- Fertiger Stand zum Vergleich: http://localhost:4200/examples/m07-ngrx/l02-store
