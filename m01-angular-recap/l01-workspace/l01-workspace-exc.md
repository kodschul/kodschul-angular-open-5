# Lab 1.1 – Übung: Kurs-Workspace und Angular 22

**Dauer:** ca. 13 Minuten
**Ändert die EventHub-Projektbasis?** Ja — das Kurs-Projekt wird installiert und gestartet; alle weiteren Labs bauen darauf auf.

## Vorbereitung

- Node.js 22 oder 24 und Git sind installiert (siehe `00-setup-and-installation.md`).
- Kurs-Repo liegt als Klon oder entpacktes ZIP vor.
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m01-l01-workspace.ts`
- URL: http://localhost:4200/playground

## Aufgaben

1. Wechsle in den Ordner `project/` und führe `npm install` aus (entfällt beim ZIP mit `node_modules`).
2. Starte in Terminal 1 die Mock-API mit `npm run api` und öffne http://localhost:3000/sessions im Browser.
3. Starte in Terminal 2 die App mit `npm start` und öffne http://localhost:4200/.
4. Öffne `package.json`, `angular.json`, `src/main.ts` und `src/app/app.config.ts`. Notiere die Angular-Version, den Build-Builder und die drei Provider in `app.config.ts`. Prüfe, ob `zone.js` in `package.json` oder `angular.json` vorkommt.
5. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts` und öffne http://localhost:4200/playground.
6. Ergänze nach den TODO-Kommentaren `AsyncPipe` in Import und `imports`, danach das Template: `sessions$` per `async`-Pipe in `@if` auflösen, mit `@for` (mit `track session.id`) je Session eine `.card` mit Titel und Raum ausgeben, im `@else`-Zweig „Lade Sessions …“ zeigen.
7. Öffne die Entwicklertools, Tab „Angular“ (Angular DevTools), wähle die Komponente `Playground` und sieh die Eigenschaften an.
8. Stoppe die Mock-API (`Strg + C` in Terminal 1), lade `/playground` neu und beobachte Anzeige und Konsole. Starte die API danach wieder.

## Checkpoint

- http://localhost:3000/sessions zeigt JSON mit zwölf Sessions.
- `/playground` zeigt „Angular 22.x.x“ und zwölf Karten mit Titel und Raum.
- Der Angular-Tab zeigt `Playground` mit dem Feld `sessions$`.
- Ohne API bleibt „Lade Sessions …“ stehen, die Konsole meldet `ERR_CONNECTION_REFUSED`.

## Abschlusskriterien

- Mock-API und App laufen in zwei Terminals.
- Die Notiz aus Aufgabe 4 nennt Version, Builder, die drei Provider und das Ergebnis der zone.js-Suche.
- Die Session-Liste im Playground kommt über `async`-Pipe und `@for`.

## Erweiterung

- Gib zusätzlich die Anzahl der Sessions über der Liste aus (`sessions.length`).
- Öffne http://localhost:4200/examples/m01-angular-recap/l01-workspace und vergleiche mit der eigenen Lösung.

## Fallback

- Kein npm-Zugang: ZIP mit `node_modules` verwenden, `npm install` entfällt.
- Ohne Angular DevTools entfällt Aufgabe 7; das Ergebnis ist trotzdem im Browser sichtbar.
- Port belegt: `npm start -- --port 4300` bzw. `PORT=3100 npm run api` (dann zeigt die Liste keine Daten, weil `src/app/shared/api.ts` Port 3000 erwartet; Lab 2.2 zeigt die Konfigurationsdatei).
