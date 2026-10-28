# Lab 11.2 – Übung: Angular Library bauen und veröffentlichen

**Dauer:** ca. 17 Minuten
**Ändert die EventHub-Projektbasis?** Nein — die Übung arbeitet in `output/project/workspaces/eventhub-ui-lib/` (Library) und `output/project/workspaces/eventhub-ui-consumer/` (zweite App).

## Vorbereitung

- Terminal 1 im Ordner `output/project/workspaces/eventhub-ui-lib/`: `npm install`.
- Terminal 2 im Ordner `output/project/workspaces/eventhub-ui-consumer/`: `npm install`.
- Library: `projects/eventhub-ui/` mit `SessionBadge` (aus Lab 3.3) und `TicketCounter` (aus Lab 4.3).
- Zweite App: `eventhub-ui-consumer/src/app/app.ts` mit zwei `TODO Lab 11.2`-Kommentaren; Dev-Server auf http://localhost:4220.

## Aufgaben

1. Öffne in der Library `projects/eventhub-ui/src/public-api.ts`, `projects/eventhub-ui/package.json` und `projects/eventhub-ui/ng-package.json`. Notiere, welche Dateien exportiert werden, welche Pakete als Peer eingetragen sind und wohin gebaut wird.
2. Baue die Library mit `npx ng build eventhub-ui` und liste die Dateien in `dist/eventhub-ui/` auf. Vergleiche `dist/eventhub-ui/package.json` mit der Quelle aus Aufgabe 1.
3. Wechsle nach `dist/eventhub-ui/` und erzeuge mit `npm pack` den Tarball. Notiere Dateiname und Paketgröße aus der Ausgabe.
4. Installiere den Tarball in der zweiten App: `npm install ../eventhub-ui-lib/dist/eventhub-ui/eventhub-ui-0.1.0.tgz` (im Ordner `eventhub-ui-consumer/`). Prüfe den neuen Eintrag in deren `package.json`.
5. Ersetze in `eventhub-ui-consumer/src/app/app.ts` den Platzhalter-Badge durch `<eh-session-badge>` mit Level „Fortgeschritten“ und das Zahlenfeld durch `<eh-ticket-counter>` am vorhandenen `FormControl` mit höchstens 4 Tickets. Importiere beide Komponenten aus `eventhub-ui`.
6. Starte die App mit `npx ng serve`, klicke im Zähler auf „+“ und „−“ und prüfe die Zeile „Gewählt: … Ticket(s)“. Halte die Maus über das Badge.
7. Importiere testweise `levelClass` aus `eventhub-ui` in `app.ts` und lies die Fehlermeldung im Terminal. Entferne den Import wieder.
8. Ergänze in der Library an `SessionBadge` eine optionale Eingabe `compact` (Standard `false`), die das Badge kleiner darstellt. Entscheide, welche Versionsnummer die Änderung bekommt, trage sie in `projects/eventhub-ui/package.json` ein, baue, packe und installiere das neue Paket in der zweiten App.

## Checkpoint

- Nach Aufgabe 3: Im Ordner `dist/eventhub-ui/` liegt `eventhub-ui-0.1.0.tgz`.
- Nach Aufgabe 6: Badge und Zähler erscheinen; „+“ ist bei 4 Tickets gesperrt, die Zeile „Gewählt“ folgt dem Zähler.
- Nach Aufgabe 7: Der Compiler meldet, dass `eventhub-ui` kein Mitglied `levelClass` exportiert.

## Abschlusskriterien

- Die zweite App nutzt `SessionBadge` und `TicketCounter` ausschließlich aus dem installierten Paket.
- `package.json` der zweiten App referenziert die neue Version aus Aufgabe 8; die App baut mit `npx ng build` ohne Fehler, auch ohne `compact` zu verwenden.

## Erweiterung

- Lege einen Secondary Entry Point `eventhub-ui/testing` mit einer Funktion `fakeSession()` an, baue und prüfe, dass `dist/eventhub-ui/` einen zweiten Ordner bzw. ein zweites FESM-Modul enthält.
- Lege außerhalb von `output/project/` einen eigenen, leeren Library-Workspace an (`npx @angular/cli@22 new my-ui --no-create-application`, danach `npx ng generate library my-ui`) und vergleiche die erzeugten Dateien mit `eventhub-ui-lib`.

## Fallback

- Ohne Internet für `npm install`: Workspaces mit vorinstallierten `node_modules` aus dem Kurs-ZIP nutzen.
- Schlägt Aufgabe 4 fehl, Pfad zum Tarball prüfen: beide Workspaces müssen nebeneinander unter `workspaces/` liegen.
