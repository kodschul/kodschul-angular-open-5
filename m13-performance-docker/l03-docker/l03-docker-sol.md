# Lab 13.3 – Lösung: Containerisierung mit Docker

Fertige Dateien: `project/workspaces/docker/` (`Dockerfile`, `Dockerfile.dockerignore`, `Dockerfile.unprivileged`, `nginx/default.conf`, `runtime/`). Info-Seite in der Kurs-App: `/examples/m13-performance-docker/l03-docker`.

Die Ausgaben unten sind gekürzt und zeigen das erwartete Muster; Zeiten, Hashes und Größen hängen von Rechner und Basis-Image-Version ab.

## Aufgabe 1: Arbeitsordner

```bash
cd project/workspaces
cp -R docker/starter docker/playground
```

## Aufgabe 2 und 3: Dockerfile

`docker/playground/Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
ARG APP_DIR=eventhub-perf-fixed
WORKDIR /app

# TODO 1
COPY ${APP_DIR}/package.json ${APP_DIR}/package-lock.json ./
RUN npm ci

# TODO 2
COPY ${APP_DIR}/ ./
RUN npm run build

# TODO 3
FROM nginx:alpine AS runtime

# TODO 4
COPY docker/playground/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY docker/runtime/config.template.json /etc/eventhub/config.template.json
COPY --chmod=755 docker/runtime/40-eventhub-config.sh /docker-entrypoint.d/40-eventhub-config.sh

# TODO 5
COPY --from=build /app/dist/eventhub-perf/browser /usr/share/nginx/html

ENV API_URL=http://localhost:3000
EXPOSE 8080
```

- `npm run build` statt `npx ng build`: Das Skript `prebuild` erzeugt vorher das Hero-Bild, das per Ignore-Datei nicht im Kontext liegt.
- Der Ordner heißt `dist/eventhub-perf/`, weil das Angular-Projekt in `angular.json` so heißt (auch in `eventhub-perf-fixed`).

## Aufgabe 4: Ignore-Datei

`docker/playground/Dockerfile.dockerignore`:

```gitignore
*
!eventhub-perf-fixed/
!docker/
**/node_modules
**/dist
**/.angular
**/public/img/hero.png
```

Erst alles ausschließen, dann gezielt erlauben: Neue Ordner in `workspaces/` (z. B. ein Nx-Workspace mit eigenen `node_modules`) landen so nie versehentlich im Kontext. Spätere Zeilen gewinnen, deshalb stehen die Ausschlüsse für `node_modules` & Co. nach den Freigaben.

## Aufgabe 5: nginx-Konfiguration

`docker/playground/nginx/default.conf`:

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # TODO A
    location ~* "-[0-9a-z]{8}\.(js|css)$" {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location ~* \.(png|jpg|jpeg|webp|avif|svg|ico|woff2?)$ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=86400";
    }

    # TODO B
    location = /config.json {
        add_header Cache-Control "no-store";
    }

    # TODO C
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    location / {
        # TODO D
        try_files $uri $uri/ /index.html;
    }
}
```

- Der reguläre Ausdruck trifft die Dateinamen des Angular-Builds (`main-QDO6YXOM.js`, `chunk-HAFNJ5OF.js`, `styles-Z3QJSWY5.css`): Bindestrich, acht Zeichen Hash, Endung.
- Der Fallback auf `/index.html` springt intern in den Block `location = /index.html`; auch Deep-Links bekommen damit `no-cache`.
- Die Bild-Regel ist eine Ergänzung zum Starter: Ohne sie gälte für `img/hero.png` der Block `location /`.

## Aufgabe 6: Build

```bash
docker build -f docker/playground/Dockerfile -t eventhub-web .
```

```text
 => [internal] load build context
 => => transferring context: …kB
 => [build 3/6] COPY eventhub-perf-fixed/package.json eventhub-perf-fixed/package-lock.json ./
 => [build 4/6] RUN npm ci
 => [build 6/6] RUN npm run build
 => [runtime 5/5] COPY --from=build /app/dist/eventhub-perf/browser /usr/share/nginx/html
 => naming to docker.io/library/eventhub-web
```

Der Kontext bleibt klein (Quellcode, Lock-Dateien, Docker-Dateien), weil `node_modules` und `dist` ausgeschlossen sind. Ohne Ignore-Datei würden die lokalen `node_modules` (mehrere hundert MB) übertragen.

## Aufgabe 7: Layer-Cache

Nach einer Änderung in `home.ts` kommen `FROM`, `COPY package*.json` und `RUN npm ci` aus dem Cache (`CACHED`); neu laufen nur `COPY ${APP_DIR}/`, `npm run build` und das Kopieren ins nginx-Image. Ändert sich `package-lock.json`, läuft auch `npm ci` neu.

## Aufgabe 8: Container starten

```bash
docker run --rm -p 8080:8080 --name eventhub eventhub-web
```

```text
/docker-entrypoint.sh: Launching /docker-entrypoint.d/40-eventhub-config.sh
EventHub: config.json geschrieben (apiUrl=http://localhost:3000)
/docker-entrypoint.sh: Configuration complete; ready for start up
```

## Aufgabe 9: Deep-Link und Header

```bash
curl -i http://localhost:8080/sessions/3
```

```text
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache

<!doctype html>
<html lang="de">
…
```

| Datei | Erwarteter Header |
| --- | --- |
| `/` und `/sessions/3` | `Cache-Control: no-cache` |
| `/config.json` | `Cache-Control: no-store` |
| `/main-….js` | `Cache-Control: public, max-age=31536000, immutable` |
| `/img/hero.png` | `Cache-Control: public, max-age=86400` |

Ohne SPA-Fallback (`try_files $uri =404`) liefert derselbe Aufruf `404 Not Found`. Dasselbe Verhalten zeigt ein statischer Server ohne Fallback-Option, z. B. `npx http-server dist/eventhub-perf/browser` (geprüft am 28.10.2026: `/` → 200, `/sessions/3` → 404).

## Aufgabe 10: API-URL zur Laufzeit

```bash
docker run --rm -p 8080:8080 -e API_URL=http://localhost:3999 eventhub-web
curl http://localhost:8080/config.json
```

```json
{ "apiUrl": "http://localhost:3999" }
```

Die Startseite zeigt „Programm konnte nicht geladen werden“, weil der Browser die API unter Port 3999 sucht. Mit `-e API_URL=http://localhost:3000` (oder ohne `-e`, Standardwert aus `ENV`) funktioniert sie wieder. Dasselbe Image läuft so in Test und Produktion mit je eigener URL.

## Aufgabe 11: Image-Größe

```bash
docker image ls eventhub-web
docker history eventhub-web
```

- Die Größe wird fast vollständig vom Basis-Image `nginx:alpine` bestimmt (Docker Hub: ca. 26 MB komprimiert, Stand 28.10.2026; `docker image ls` zeigt die entpackte Größe, die höher liegt).
- Die App selbst trägt weniger als 1 MB bei (Bundles ca. 500 kB roh, Hero-Bild ca. 50 KB).
- `docker history` zeigt `node:24-alpine` und `npm ci` nicht: Die Build-Stufe ist nicht Teil des Ergebnisses.

## Erweiterung

**Ohne root** (`docker/Dockerfile.unprivileged`, Auszug):

```dockerfile
FROM nginxinc/nginx-unprivileged:alpine AS runtime
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/runtime/config.template.json /etc/eventhub/config.template.json
COPY --chmod=755 docker/runtime/40-eventhub-config.sh /docker-entrypoint.d/40-eventhub-config.sh
# Benutzer 101 muss config.json beim Start überschreiben dürfen
COPY --chown=101:101 --from=build /app/dist/eventhub-perf/browser /usr/share/nginx/html
USER 101
```

`docker run --rm eventhub-web:nonroot id` gibt `uid=101(nginx)` aus. Ein Prozess ohne root-Rechte kann bei einer Lücke im Webserver weniger Schaden anrichten; Ports unter 1024 sind dann nicht nutzbar, deshalb Port 8080.

**Langsame Variante als Image:** `--build-arg APP_DIR=eventhub-perf` funktioniert, weil die Ignore-Datei in `workspaces/docker/` beide App-Ordner zulässt. Das Image ist kaum größer (Bild wird im Build mit 4,7 MB erzeugt); die Unterschiede aus Lab 13.2 liegen in der Ladezeit, nicht in der Image-Größe.

**Volume statt Variable:** Mit `:ro` eingehängter `config.json` scheitert das Startskript beim Schreiben (`Read-only file system` im Log von `docker run`). In einer Kopie des Dockerfiles ohne die beiden `runtime`-Zeilen startet der Container und liefert die eingehängte Datei aus.
