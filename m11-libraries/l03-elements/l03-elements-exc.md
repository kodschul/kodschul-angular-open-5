# Lab 11.3 – Übung: Angular Elements

**Dauer:** ca. 13 Minuten
**Ändert die EventHub-Projektbasis?** Nein — die Übung arbeitet im eigenen Workspace `project/workspaces/eventhub-elements/`.

## Vorbereitung

- Terminal im Ordner `project/workspaces/eventhub-elements/`: `npm install`.
- Dateien: `src/app/signup-widget.ts` (Komponente), `src/main.ts` (Registrierung), `public/demo.html` (statische Seite ohne Angular).
- Browser: http://localhost:4230/demo.html (nach Aufgabe 2).

## Aufgaben

1. Baue das Projekt mit `npm run build` und liste `dist/eventhub-elements/browser/` auf. Notiere Größe und Anzahl der JavaScript-Dateien aus der Build-Ausgabe.
2. Starte einen statischen Webserver mit `npm run serve:dist` und öffne `/demo.html`. Fülle das Formular mit 2 Tickets aus und klicke „Anmelden“. Prüfe den Bereich „Ereignisse“.
3. Wähle in den DevTools (Tab „Elements“) das Element `<eventhub-signup>` und setze in der Konsole `$0.setAttribute('session-title', 'RxJS-Workshop')`, danach `$0.maxTickets = 1`. Beobachte Überschrift und Tickets-Feld nach jedem Befehl.
4. Ergänze in `src/app/signup-widget.ts` einen Button „Abbrechen“ (`type="button"`), der das Formular zurücksetzt und ein neues Output `cancelled` ohne Daten auslöst.
5. Ergänze in `public/demo.html` einen Listener für `cancelled`, der im Bereich „Ereignisse“ „Anmeldung abgebrochen.“ anzeigt.
6. Baue neu (`npm run build`), lade `/demo.html` neu (Webserver läuft weiter) und teste beide Buttons.
7. Öffne den Tab „Network“, lade neu und vergleiche die übertragene Größe von `main.js` mit der Build-Ausgabe aus Aufgabe 1.

## Checkpoint

- Nach Aufgabe 2: „Ereignisse“ zeigt ein JSON mit `sessionTitle`, `name`, `email` und `tickets: 2`.
- Nach Aufgabe 3: Die Überschrift lautet „Anmeldung: RxJS-Workshop“; mit `maxTickets = 1` sperrt ein Wert von 2 den Button.
- Nach Aufgabe 6: „Abbrechen“ leert das Formular und zeigt „Anmeldung abgebrochen.“.

## Abschlusskriterien

- `demo.html` enthält kein Angular außer `main.js` und reagiert auf beide Events.
- Die Komponente meldet Ergebnisse nur über `output()`, nicht über globale Variablen oder `window`.

## Erweiterung

- Binde das Widget zweimal mit unterschiedlichen `session-title` in `demo.html` ein und prüfe, dass jedes nur seine eigenen Events auslöst.
- Registriere in `src/main.ts` ein zweites Element `<eventhub-session-count>`, das per `httpResource` die Anzahl der Sessions der Mock-API (`npm run api` im Kursprojekt) anzeigt. Prüfe, ob `main.js` dadurch spürbar wächst.

## Fallback

- Ohne Internet für `npm install`: Workspace mit vorinstallierten `node_modules` aus dem Kurs-ZIP nutzen.
- Ist Port 4230 belegt: `npx http-server dist/eventhub-elements/browser -p 4231 -c-1`.
