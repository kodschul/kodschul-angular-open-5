# Lab 13.3 – Übung: Containerisierung mit Docker

**Dauer:** ca. 20 Minuten (Einzel)
**Ändert die EventHub-Projektbasis?** Ja — neue Docker-Dateien in `workspaces/docker/playground/`; die CI-Pipeline in Lab 14.1 baut das Image aus `workspaces/docker/Dockerfile`.

## Vorbereitung

- Docker Desktop oder Podman läuft: `docker version` zeigt „Client“ und „Server“.
- Terminal 1 im Ordner `output/project/`: `npm run api` (Mock-API auf Port 3000).
- Terminal 2 im Ordner `output/project/workspaces/` (alle Befehle unten laufen dort).
- Gebaut wird die App aus `workspaces/eventhub-perf-fixed/` (Stand nach Lab 13.2).
- Starter: `workspaces/docker/starter/Dockerfile` und `workspaces/docker/starter/nginx/default.conf`.
- Vorgegeben: `workspaces/docker/runtime/config.template.json` und `40-eventhub-config.sh`.

## Aufgaben

1. Kopiere den Starter in einen eigenen Arbeitsordner: `cp -R docker/starter docker/playground`.
2. Vervollständige in `docker/playground/Dockerfile` die Build-Stufe: TODO 1 (Paketdateien kopieren, `npm ci`) und TODO 2 (Quellcode kopieren, `npm run build`).
3. Vervollständige die Auslieferungsstufe: TODO 3 (`FROM nginx:alpine AS runtime`), TODO 4 (`nginx`-Konfiguration kopieren) und TODO 5 (`COPY --from=build` des Ordners `dist/eventhub-perf/browser`).
4. Lege `docker/playground/Dockerfile.dockerignore` an, die nur `eventhub-perf-fixed/` und `docker/` in den Build-Kontext lässt und darin `node_modules`, `dist` und `.angular` ausschließt.
5. Vervollständige in `docker/playground/nginx/default.conf` die TODOs A bis D (Cache-Header und SPA-Fallback).
6. Baue das Image: `docker build -f docker/playground/Dockerfile -t eventhub-web .` Notiere die Dauer und die Größe des übertragenen Kontexts („transferring context“).
7. Ändere eine Zeile in `eventhub-perf-fixed/src/app/home/home.ts` (z. B. den Untertitel) und baue erneut. Notiere, welche Schritte aus dem Cache kommen (`CACHED`). Mache die Änderung danach rückgängig.
8. Starte den Container: `docker run --rm -p 8080:8080 --name eventhub eventhub-web`. Öffne http://localhost:8080; das Programm erscheint.
9. Rufe in einem neuen Tab direkt http://localhost:8080/sessions/3 auf und prüfe zusätzlich `curl -i http://localhost:8080/sessions/3`. Prüfe mit `curl -I` die Header von `index.html`, `config.json` und einer `main-….js`-Datei (Name aus dem Network-Tab).
10. Stoppe den Container (Strg+C) und starte ihn mit falscher API-URL: `docker run --rm -p 8080:8080 -e API_URL=http://localhost:3999 eventhub-web`. Prüfe `curl http://localhost:8080/config.json` und die Startseite. Starte danach wieder mit der richtigen URL.
11. Notiere die Image-Größe mit `docker image ls eventhub-web` und die größten Schichten mit `docker history eventhub-web`.

## Checkpoint

- Nach Aufgabe 6: Build endet ohne Fehler, „transferring context“ liegt im Bereich weniger MB.
- Nach Aufgabe 9: `/sessions/3` zeigt die Detailseite, `curl -i` liefert `HTTP/1.1 200 OK` mit HTML.
- Nach Aufgabe 10: `config.json` enthält `http://localhost:3999`, die Startseite zeigt „Programm konnte nicht geladen werden“ – ohne neuen Build.

## Abschlusskriterien

- Container läuft, Deep-Link funktioniert, Cache-Header sind wie geplant gesetzt.
- API-URL wechselt per `-e API_URL=…` ohne neuen Build.
- Image-Größe ist notiert.

## Erweiterung

- Baue die Variante ohne root: `docker build -f docker/Dockerfile.unprivileged -t eventhub-web:nonroot .` und prüfe mit `docker run --rm eventhub-web:nonroot id`, unter welchem Benutzer der Container läuft.
- Baue mit `--build-arg APP_DIR=eventhub-perf` die langsame Variante aus Lab 13.1 als Image und vergleiche die Größe.
- Ersetze die Variable durch ein Volume: `docker run --rm -p 8080:8080 -v "$(pwd)/config.test.json:/usr/share/nginx/html/config.json:ro" …` mit einer eigenen `config.test.json`. Prüfe im Log, warum das Startskript dann scheitert, und entferne es in einer Kopie des Dockerfiles.

## Fallback

Ohne Docker: Prüfe `docker/playground/Dockerfile` und `default.conf` statisch gegen die Checkliste und vergleiche mit `workspaces/docker/Dockerfile` und `workspaces/docker/nginx/default.conf`.

| Prüfpunkt | Erfüllt? |
| --- | --- |
| Zwei Stufen; die letzte basiert auf nginx, nicht auf Node.js | |
| `package.json` und `package-lock.json` werden vor dem übrigen Code kopiert, danach `npm ci` | |
| Nur `dist/eventhub-perf/browser` wird ins nginx-Image kopiert | |
| Ignore-Datei schließt `node_modules`, `dist`, `.angular` aus | |
| `try_files $uri $uri/ /index.html` im Block `location /` | |
| gehashte `.js`/`.css`: ein Jahr, `immutable`; `index.html`: `no-cache`; `config.json`: `no-store` | |
| `config.json` entsteht beim Start aus `API_URL`, nicht beim Build | |
| keine Geheimnisse (Tokens, Passwörter) in Dockerfile oder Konfiguration | |
