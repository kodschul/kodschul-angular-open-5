# Lab 7.4 – Übung: NgRx Signal Store

**Dauer:** ca. 25 Minuten (Checkpoint nach Aufgabe 2, danach 5 Minuten Debrief mit Codevergleich)
**Ändert die EventHub-Projektbasis?** Ja — das Sessions-Feature läuft als Signal Store; die Store-Provider der Playground-Route aus Lab 7.2–7.3 entfallen. Lab 7.5 baut darauf auf.

## Vorbereitung

- Terminal 1: `npm run api` (Mock-API auf Port 3000)
- Terminal 2: `npm start` (App auf Port 4200)
- Arbeitsdatei: `src/app/playground/m07-l04-signal-store/sessions.store.ts` und `src/app/playground/playground.ts`
- Starter: `src/app/starters/m07-l04-signal-store.ts` und Ordner `src/app/starters/m07-l04-signal-store/`
- URL: http://localhost:4200/playground
- Zum Vergleich: der Code aus Lab 7.3 unter `src/app/examples/m07-ngrx/l03-effects/`

Der Starter enthält den Store mit `withState` und Demo-Favoriten, die Imports für alle Aufgaben und in `playground.ts` die Template-Blöcke für Aufgabe 3 und 5 als HTML-Kommentar (wie die Oberfläche aus Lab 7.3). Zu schreiben ist der Store; im Template werden nur Kommentarzeichen entfernt und zwei Bindungen ergänzt.

## Aufgaben

1. Kopiere `src/app/starters/m07-l04-signal-store.ts` nach `src/app/playground/playground.ts` und den Ordner `src/app/starters/m07-l04-signal-store/` nach `src/app/playground/m07-l04-signal-store/`. Entferne in `src/app/app.routes.ts` an der Route `playground` den Eintrag `providers: [...]` und die NgRx-Imports aus Lab 7.2–7.3.
2. Ergänze in `sessions.store.ts` nach `withState` ein `withComputed` mit `favoriteCount` (Anzahl der `favoriteIds`). Zeige in `playground.ts` den Text `Favoriten: {{ store.favoriteCount() }}` an.
3. Ergänze `withEntities<Session>()` als erstes Feature und `withMethods` mit der Methode `load` als `rxMethod<void>`: Ladezustand setzen, mit `switchMap` `api.getSessions()` aufrufen, Ergebnis per `patchState(store, setAllEntities(sessions), { loading: false })` speichern, Fehler per `catchError` als `error` setzen (Text wie in Lab 7.3: `Laden fehlgeschlagen (HTTP <Status>)`) und `EMPTY` zurückgeben (Observable, das sofort ohne Wert endet; siehe Begriffe). Ergänze in `withComputed` `favoriteSessions`. Binde im Template `[sessions]="store.entities()"` und entferne die Kommentarzeichen um den vorbereiteten Block „Aufgabe 3“ (Button „Neu laden“, Lade- und Fehleranzeige, Favoriten-Badges).
4. Ergänze in `withMethods` die Methode `toggleFavorite(sessionId: number)` mit `patchState` und einer Update-Funktion. Binde `(favoriteToggled)` der Liste daran.
5. Ergänze die Methode `saveFavorites` als `rxMethod<void>` mit `exhaustMap` und `FavoritesStorage.save(store.favoriteIds())`; setze dabei `saving` und `savedCount`. Entferne die Kommentarzeichen um den vorbereiteten Block „Aufgabe 5“ (Button „Favoriten speichern“ mit Speicheranzeige).
6. Ergänze `withHooks` mit `onInit`, das `store.load()` aufruft. Setze im `initialState` `favoriteIds` auf `[]`.
7. Prüfe den Fehlerfall mit dem Schalter „API-Fehler simulieren“ und „Neu laden“, danach die Erholung mit ausgeschaltetem Schalter.
8. Lege `src/app/playground/vergleich.md` an und fülle die Tabelle für Lab 7.3 (Beispielcode unter `src/app/examples/m07-ngrx/l03-effects/`) und den eigenen Signal Store:

   | Aspekt | NgRx Store (Lab 7.3) | Signal Store (Lab 7.4) |
   | --- | --- | --- |
   | Dateien | | |
   | Zeilen ohne Imports, Kommentare, Leerzeilen | | |
   | Wo steht „Favorit umschalten“? | | |
   | Wo steht der HTTP-Aufruf? | | |
   | Was zeigen die Redux DevTools? | | |

## Checkpoint

Nach Aufgabe 2:

- `/playground` zeigt `Favoriten: 2` und `Favoriten-IDs: 1,3` (Demo-Werte aus `initialState`).
- `ng serve` meldet keine Fehler; die Store-Provider der Route sind entfernt.

## Abschlusskriterien

- Die Seite sieht aus und verhält sich wie `/examples/m07-ngrx/l03-effects`: Liste beim Öffnen, Favoriten umschalten, Speichern mit Doppelklick-Schutz, Fehlermeldung mit „Erneut versuchen“.
- Der gesamte Feature-Code steht in `sessions.store.ts`; `playground.ts` ruft nur Methoden und liest Signals.
- Ein Doppelklick auf „Favoriten speichern“ erzeugt in der Konsole genau einmal `[FavoritesStorage] speichere`.
- `vergleich.md` enthält die ausgefüllte Tabelle.

## Erweiterung

- Ergänze im Store `withState` um `query: ''` und eine Methode `search` als `rxMethod<string>` mit `debounceTime(300)` und `switchMap` auf `api.getSessions({ q })`. Binde ein Eingabefeld daran.
- Stelle den Store auf `signalStore({ providedIn: 'root' }, ...)` um, entferne `providers: [SessionsStore]` und prüfe, ob Favoriten nach einem Wechsel zur Startseite und zurück erhalten bleiben.

## Fallback

- Ohne laufende Mock-API zeigt die Seite die Fehlermeldung; Aufgabe 2 lässt sich trotzdem prüfen (Favoriten-Zähler mit Demo-IDs), Aufgabe 7 zeigt dann dauerhaft den Fehler.
- Fertiger Stand zum Vergleich: http://localhost:4200/examples/m07-ngrx/l04-signal-store
