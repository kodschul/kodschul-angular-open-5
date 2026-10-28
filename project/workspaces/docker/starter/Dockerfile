# syntax=docker/dockerfile:1
# Starter Lab 13.3 – nach docker/playground/ kopieren und dort vervollständigen.
# Build aus dem Ordner workspaces/:
#   docker build -f docker/playground/Dockerfile -t eventhub-web .

# ---------- Stufe 1: Build mit Node ----------
FROM node:24-alpine AS build
ARG APP_DIR=eventhub-perf-fixed
WORKDIR /app

# TODO 1: package.json und package-lock.json aus ${APP_DIR}/ kopieren, danach Abhängigkeiten mit npm ci installieren
#         (vor dem Quellcode, damit die Schicht im Cache bleibt)

# TODO 2: restlichen Quellcode aus ${APP_DIR}/ kopieren und den Produktions-Build ausführen (npm run build)

# ---------- Stufe 2: Auslieferung mit nginx ----------
# TODO 3: Basis-Image nginx:alpine als Stufe "runtime"

# TODO 4: docker/playground/nginx/default.conf nach /etc/nginx/conf.d/default.conf kopieren

# Laufzeitkonfiguration (vorgegeben): Vorlage + Startskript, das config.json schreibt
COPY docker/runtime/config.template.json /etc/eventhub/config.template.json
COPY --chmod=755 docker/runtime/40-eventhub-config.sh /docker-entrypoint.d/40-eventhub-config.sh

# TODO 5: Build-Ergebnis /app/dist/eventhub-perf/browser aus der Stufe "build" nach /usr/share/nginx/html kopieren

ENV API_URL=http://localhost:3000
EXPOSE 8080
