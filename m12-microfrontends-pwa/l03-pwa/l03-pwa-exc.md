# Lab 12.3 – Übung: Progressive Web App

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Nein — die Übung arbeitet in `output/project/workspaces/eventhub-pwa/`; das Ergebnis zum Vergleich liegt in `eventhub-pwa-final/`.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api` (Mock-API auf Port 3000).
- Terminal 2 im Ordner `output/project/workspaces/eventhub-pwa/`: `npm install`.
- Ausgangszustand: `src/app/app.ts` lädt das Programm per `httpResource` von `http://localhost:3000/sessions`.
- Browser: Chrome oder Edge mit geöffneten DevTools; Adresse nach Aufgabe 4: http://localhost:8080.

## Aufgaben

1. Starte die App mit `npx ng serve` (Port 4240) und prüfe, dass das Programm erscheint. Öffne DevTools › Application › Service Workers und notiere den Eintrag. Beende den Dev-Server.
2. Führe `npx ng add @angular/pwa` aus und ordne jede Zeile der Ausgabe (CREATE/UPDATE) einer Aufgabe zu: Manifest, Service Worker, Icons, Registrierung.
3. Passe in `public/manifest.webmanifest` `name` („EventHub Programm“), `short_name` („EventHub“), `lang` und `theme_color` an.
4. Baue mit `npx ng build`, starte `npm run serve:dist` und öffne http://localhost:8080. Prüfe unter Application › Service Workers den Status und unter Cache Storage die Einträge.
5. Stoppe die Mock-API (Strg+C in Terminal 1) und lade die Seite neu. Notiere, was erscheint und was fehlt. Starte die Mock-API wieder.
6. Ergänze in `ngsw-config.json` eine Daten-Gruppe `programm-api` für `http://localhost:3000/sessions` und `http://localhost:3000/speakers` mit der Strategie `freshness`, höchstens 20 Einträgen, einem Tag Höchstalter und 3 Sekunden Timeout.
7. Baue neu (`npm run serve:dist` darf weiterlaufen), lade die Seite zweimal neu, stoppe die Mock-API und lade erneut. Wiederhole den Test mit Network › „Offline“.
8. Lege `src/app/update-banner.ts` an: Die Komponente zeigt einen Hinweis mit Button „Jetzt neu laden“, sobald `SwUpdate.versionUpdates` ein Ereignis `VERSION_READY` meldet. Binde sie oben in `app.ts` ein.
9. Baue, lade die Seite neu, ändere danach die Überschrift in `app.ts`, baue erneut und lade die Seite einmal neu. Warte etwa 10 Sekunden auf den Hinweis und klicke „Jetzt neu laden“.

## Checkpoint

- Nach Aufgabe 1: Mit `ng serve` steht unter Service Workers kein Eintrag für die Seite.
- Nach Aufgabe 4: Status „activated and is running“, Cache Storage enthält Einträge mit `ngsw` im Namen.
- Nach Aufgabe 5: Die App erscheint, das Programm nicht („Programm nicht erreichbar …“).
- Nach Aufgabe 7: Das Programm erscheint ohne Mock-API und im Offline-Modus; Cache Storage enthält einen Eintrag mit `programm-api`.

## Abschlusskriterien

- Die App lädt das Programm offline aus der Daten-Gruppe.
- Application › Manifest zeigt Name, Kurzname, Farbe und Icons ohne Fehler; Chrome bietet die Installation an.
- Nach einem neuen Build erscheint der Update-Hinweis; der Klick lädt die neue Überschrift.

## Erweiterung

- Prüfe alle 30 Minuten aktiv auf Updates (`interval(30 * 60 * 1000)` und `swUpdate.checkForUpdate()`).
- Ändere die Strategie auf `performance` und vergleiche: Welche Änderung an `api/db.json` sieht die App wann?

## Fallback

- `ng add @angular/pwa` braucht Internet. Ohne Netz: die geänderten Dateien aus `eventhub-pwa-final/` übernehmen (`ngsw-config.json`, `public/manifest.webmanifest`, `public/icons/`, `src/app/app.config.ts`, `src/index.html`, Eintrag `serviceWorker` in `angular.json`) oder direkt in `eventhub-pwa-final/` testen.
- Ohne Chrome oder Edge: Firefox zeigt Service Worker unter `about:debugging#/runtime/this-firefox`; Installation als App ist dort nicht vorgesehen.
