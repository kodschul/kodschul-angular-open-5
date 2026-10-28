# Lab 7.5 – Übung: Events-Plugin und Entscheidung im Team

**Dauer:** ca. 22 Minuten (a: 15 Minuten einzeln, b: 7 Minuten Notiz zu zweit und Vergleich im Plenum)
**Ändert die EventHub-Projektbasis?** Ja — Sessions- und Warenkorb-Store reagieren auf das Event „Session abgesagt“.

## Vorbereitung

- Terminal 1: `npm run api` (Mock-API auf Port 3000)
- Terminal 2: `npm start` (App auf Port 4200)
- Arbeitsdatei: Ordner `src/app/playground/m07-l05-events/` und `src/app/playground/playground.ts`
- Starter: `src/app/starters/m07-l05-events.ts` und Ordner `src/app/starters/m07-l05-events/`
- URL: http://localhost:4200/playground
- Die Playground-Route in `src/app/app.routes.ts` hat keine Provider (Stand nach Lab 7.4).

Der Starter enthält einen fertigen `SessionsStore` (wie Lab 7.4, mit `cancelledIds` im Zustand) und einen fertigen `CartStore` für Workshop-Tickets. Der Button „Absagen (Admin)“ schreibt bisher nur in die Konsole.

## Aufgaben

### a) Event „Session abgesagt“

1. Kopiere `src/app/starters/m07-l05-events.ts` nach `src/app/playground/playground.ts` und den Ordner `src/app/starters/m07-l05-events/` nach `src/app/playground/m07-l05-events/`.
2. Lege in `m07-l05-events/session.events.ts` die Event-Gruppe `sessionAdminEvents` an: Quelle `Session Admin`, Event `cancelled` mit Payload `{ sessionId: number; title: string }`.
3. Lege in `playground.ts` ein Feld `dispatch = injectDispatch(sessionAdminEvents)` an und löse in `cancel(session)` das Event `cancelled` mit ID und Titel aus.
4. Ergänze im `SessionsStore` ein `withReducer` mit `on(sessionAdminEvents.cancelled, ...)`: ID zu `cancelledIds` hinzufügen und aus `favoriteIds` entfernen. Sage eine Session ab, die vorher als Favorit markiert war.
5. Ergänze im `CartStore` ein `withReducer` für dasselbe Event: Positionen dieser Session entfernen und `notice` mit dem Titel setzen; ist der Warenkorb nicht betroffen, `{}` zurückgeben. Lege zwei verschiedene Workshops in den Warenkorb, einen davon zweimal, und sage diesen ab. Sage danach einen Talk ab.
6. Ergänze im `SessionsStore` ein `withEventHandlers` mit `inject(Events)`, das bei `cancelled` den Titel per `console.info` ausgibt.

### b) Entscheidungsnotiz

7. Lege `src/app/playground/entscheidung.md` an und schreibe (allein oder zu zweit) eine Entscheidungsnotiz für EventHub in fünf Sätzen:
   1. Kontext (Team, Größe der App, bestehender Code),
   2. Entscheidung (Service mit Signals, Signal Store, Signal Store mit Events oder NgRx Store, ggf. je Bereich),
   3. Begründung mit zwei Kriterien aus der Entscheidungstabelle,
   4. was bewusst nicht gemacht wird,
   5. wann die Entscheidung neu geprüft wird.
   Annahme für EventHub: sechs Entwickelnde in zwei Teams (Teilnehmenden-App, Admin-Bereich), kein bestehender NgRx-Code, Admin-Änderungen sollen nachvollziehbar sein.
8. Vergleiche die Notiz im Plenum mit mindestens zwei anderen (allein: mit den Beispielnotizen in der Lösung) und notiere darunter, welche Kriterien dort den Ausschlag gegeben haben.

## Checkpoint

Nach Aufgabe 4:

- „Absagen (Admin)“ zeigt an der Session das Badge „abgesagt“ und sperrt ihre Buttons.
- War die Session ein Favorit, steht sie danach auf „☆ Merken“ (aus `favoriteIds` entfernt).

## Abschlusskriterien

- Nach dem Absagen eines Workshops im Warenkorb verschwinden seine Positionen, die Summe sinkt, der Hinweis nennt den Titel.
- Das Absagen eines Talks ändert den Warenkorb nicht; der Hinweis bleibt unverändert.
- `cart.store.ts` und `sessions.store.ts` importieren nur `session.events.ts`, nicht den jeweils anderen Store.
- Die Konsole zeigt `[SessionsStore] abgesagt: <Titel>`.
- `entscheidung.md` enthält fünf Sätze nach dem Schema.

## Erweiterung

- Ergänze in beiden Stores `withDevtools('sessions')` bzw. `withDevtools('cart')` aus `@angular-architects/ngrx-toolkit` als erstes Feature. Öffne den Tab **Redux**, Instanz „NgRx SignalStore“, und prüfe die Zweige `sessions` und `cart` nach einer Absage.
- Ergänze ein zweites Event `restored` („Absage zurückgenommen“), das im `SessionsStore` die ID aus `cancelledIds` entfernt, und einen Button dafür an abgesagten Sessions.

## Fallback

- Funktioniert `withDevtools` mit der installierten Version nicht (Peer-Abhängigkeit für Angular 21, siehe Theorie): Erweiterung 1 auslassen und den Zustand mit `{{ cart.items().length }}` bzw. der Konsole prüfen. Die Pflichtaufgaben brauchen das Plugin nicht.
- Ohne laufende Mock-API erscheint keine Session-Liste; Aufgabe 7–8 bleiben machbar.
- Fertiger Stand zum Vergleich: http://localhost:4200/examples/m07-ngrx/l05-events
