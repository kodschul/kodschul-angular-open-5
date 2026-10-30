# Lab 6.3 – Übung: Session-Karte und Favoriten-Zähler mit Signals

**Dauer:** ca. 13 Minuten
**Ändert die EventHub-Projektbasis?** Ja — `SessionCard` mit Signal-APIs und der `FavoritesService` sind Ausgangspunkt für den Favoriten-State in m07.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api`
- Terminal 2 im Ordner `project/`: `npm start`
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m06-l03-communication.ts`
- Browser: http://localhost:4200/playground

Der Starter enthält vier Teile in einer Datei: `FavoritesService` (mit normalem Array), `FavoritesHeader`, `SessionCard` (klassisch mit `@Input`/`@Output` wie in Lab 1.2) und die Seite `Playground`, die Karten und Header zusammensetzt. Das Template der Seite bleibt in der ganzen Übung unverändert.

## Aufgaben

1. Kopiere den Starter nach `src/app/playground/playground.ts`, öffne `/playground` und markiere drei Karten als Favorit. Notiere, was der Zähler im Header anzeigt.
2. Stelle `SessionCard` auf Signal-APIs um: `session` per `input.required<Session>()`, `compact` per `input(false, { transform: booleanAttribute })`, `selected` per `output<Session>()`. Passe das Karten-Template an (`session()`, `compact()`) und ersetze die Restplätze durch ein `computed` namens `seatsLeft`.
3. Ersetze `@Input() favorite` und `@Output() favoriteChange` durch `favorite = model(false)`; `toggleFavorite()` nutzt `favorite.update(...)`. Prüfe, dass Klick auf „☆ Merken“ weiterhin funktioniert und die Seite unverändert bleibt.
4. Stelle `FavoritesService` auf Signals um: privates `signal<number[]>([])`, `count` als `computed`, `isFavorite` und `setFavorite` lesen bzw. schreiben das Signal. Passe den Header auf `favorites.count()` an.
5. Markiere erneut drei Karten, entferne eine und prüfe den Zähler. Klicke danach bei einer Karte auf „Details“ und prüfe die Zeile „Zuletzt gewählt“.

## Checkpoint

- Nach Aufgabe 1: Die Karten zeigen „★ Favorit“, der Header bleibt bei „★ 0 Favoriten“.
- Nach Aufgabe 3: Karten funktionieren wie vorher; im Karten-Code steht kein Decorator `@Input`/`@Output` mehr.
- Nach Aufgabe 5: Der Header zeigt sofort „★ 3 Favoriten“, danach „★ 2 Favoriten“; „Zuletzt gewählt“ zeigt den Titel der Karte.

## Abschlusskriterien

- Der Header zählt Favoriten, ohne dass ein Output bis zu ihm durchgereicht wird.
- `SessionCard` nutzt `input.required`, `input` mit `transform`, `model` und `output`.
- Der Service hält die Favoriten als Signal; außerhalb des Service schreibt niemand direkt in das Signal.

## Erweiterung

- Ergänze in der Seite ein Feld `#filterBox` (Titel filtern) mit `viewChild.required` und einen Button „Filter fokussieren“; zeige mit `viewChildren(SessionCard)` die Zahl der angezeigten Karten.
- Setze über der Liste eine hervorgehobene Karte mit Zwei-Wege-Bindung ein: `featuredFavorite = signal(false)` und `<app-session-card [session]="sessions()[0]" [(favorite)]="featuredFavorite" />` (nur rendern, wenn Sessions geladen sind). Prüfe, dass `featuredFavorite()` beim Klick wechselt.
