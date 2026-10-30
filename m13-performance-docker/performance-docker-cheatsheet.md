# Performance-und-Docker-Cheatsheet

Schnellreferenz für Modul 13 (Messen, Optimieren, Container). Ordner: `project/workspaces/eventhub-perf/`, `eventhub-perf-fixed/`, `docker/`.

## Messen

| Befehl / Ort | Wirkung |
| --- | --- |
| `npm run build:stats` | Produktions-Build plus `dist/eventhub-perf/browser-stats.json` (`ng build --stats-json`) |
| `npm run serve:dist` | Build mit `serve -s` ausliefern (SPA-Fallback), Port 8081 bzw. 8082 |
| DevTools → Lighthouse → Navigation, Mobile, Performance | Score, FCP, LCP, TBT, CLS und Hinweise |
| DevTools → Performance → Aufnahme | Long Tasks, „Bottom-Up“ nach Self Time |
| Angular DevTools → Profiler | Change-Detection-Durchläufe pro Komponente (nur `ng serve`) |
| https://esbuild.github.io/analyze/ | `browser-stats.json` als Treemap |
| `ng build --source-map` + `npx source-map-explorer "dist/…/browser/*.js"` | Alternative Bundle-Analyse (`prüfen`) |

## Grenzwerte Core Web Vitals

| Kennzahl | gut | schlecht |
| --- | --- | --- |
| LCP | ≤ 2,5 s | > 4 s |
| INP (Labor: TBT) | ≤ 200 ms | > 500 ms |
| CLS | ≤ 0,1 | > 0,25 |

## Optimieren

| Syntax | Wirkung |
| --- | --- |
| `<img ngSrc="img/banner.webp" width="1200" height="400" priority>` | `NgOptimizedImage`: Platz reserviert, `fetchpriority="high"` für das LCP-Bild |
| `imports: [NgOptimizedImage]` | Direktive aus `@angular/common` |
| `<img ngSrc="…" fill>` | Bild füllt den Container, wenn die Größe unbekannt ist |
| `@defer (on viewport; prefetch on idle) { … }` | Komponente und ihre Bibliotheken in eigenen Chunk, Laden bei Sichtbarkeit |
| `@placeholder { <div style="height: 320px"> }` | feste Höhe gegen Layout-Sprünge |
| `loadComponent: () => import('./…').then((m) => m.X)` | Seite als Lazy-Chunk |
| `@for (item of items(); track item.id)` | DOM-Elemente nach ID wiederverwenden |
| `computed(() => list().map(…))` | teure Berechnung einmal pro Datenstand statt pro Durchlauf |
| `Chart.register(BarController, BarElement, …)` | nur benötigte Chart.js-Teile bündeln |

## Budgets (`angular.json` → `configurations.production.budgets`)

| Eintrag | Wirkung |
| --- | --- |
| `{ "type": "initial", "maximumWarning": "<kB>", "maximumError": "<kB>" }` | Start-Code begrenzen (neues Projekt: 500 kB / 1 MB) |
| `{ "type": "anyScript", "maximumWarning": "<kB>", … }` | jede einzelne JS-Datei begrenzen |
| `{ "type": "anyComponentStyle", "maximumWarning": "<kB>", … }` | Stylesheet pro Komponente begrenzen (neues Projekt: 4 kB / 8 kB) |
| `maximumError` überschritten | `ng build` endet mit Exit-Code 1 |

## Dev-Warnungen

| Code | Bedeutung |
| --- | --- |
| `NG0913` | Bilddatei viel größer als dargestellt |
| `NG0956` | `track` nach Identität baut die ganze Liste neu |
| `NG02954` | `ngSrc` ohne `width`/`height` bzw. `fill` |
| `NG02955` | LCP-Bild ohne `priority` |

## Docker

| Befehl | Wirkung |
| --- | --- |
| `docker build -f docker/Dockerfile -t eventhub-web .` | Image bauen (im Ordner `workspaces/`) |
| `docker build … --build-arg APP_DIR=eventhub-perf .` | andere App bauen |
| `docker run --rm -p 8080:8080 eventhub-web` | Container starten |
| `docker run … -e API_URL=https://api.example.test eventhub-web` | API-URL zur Laufzeit setzen |
| `docker image ls eventhub-web` / `docker history eventhub-web` | Größe gesamt / pro Schicht |
| `docker logs <id>`, `docker exec -it <id> sh` | Log ansehen, Shell im Container |
| `curl -i http://localhost:8080/sessions/3` | Deep-Link und Header prüfen |

## Dockerfile und nginx

| Zeile | Wirkung |
| --- | --- |
| `FROM node:24-alpine AS build` | Build-Stufe |
| `COPY package.json package-lock.json ./` + `RUN npm ci` | Abhängigkeiten als eigene, gecachte Schicht |
| `FROM nginx:alpine AS runtime` | Auslieferungsstufe ohne Node.js |
| `COPY --from=build /app/dist/<projekt>/browser /usr/share/nginx/html` | nur Build-Ergebnis übernehmen |
| `COPY --chmod=755 … /docker-entrypoint.d/40-….sh` | Startskript, läuft vor nginx |
| `Dockerfile.dockerignore` neben dem Dockerfile | Ignore-Datei für genau dieses Dockerfile |
| `FROM nginxinc/nginx-unprivileged:alpine` + `USER 101` | ohne root, Port 8080 |
| `try_files $uri $uri/ /index.html;` | SPA-Fallback für Deep-Links |
| `add_header Cache-Control "public, max-age=31536000, immutable";` | gehashte Bundles langfristig cachen |
| `add_header Cache-Control "no-cache";` / `"no-store";` | `index.html` / `config.json` |
| `envsubst '${API_URL}' < vorlage > config.json` | Platzhalter beim Start ersetzen |
