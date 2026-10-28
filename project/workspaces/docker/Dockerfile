# syntax=docker/dockerfile:1
# EventHub als statische Angular-App in nginx (Lab 13.3).
# Build-Kontext ist der Ordner workspaces/:
#   cd workspaces
#   docker build -f docker/Dockerfile -t eventhub-web .
# Andere App bauen (z. B. die langsame Variante): --build-arg APP_DIR=eventhub-perf

# ---------- Stufe 1: Build mit Node ----------
FROM node:24-alpine AS build
ARG APP_DIR=eventhub-perf-fixed
WORKDIR /app

# Erst nur die Paketdateien: Diese Schicht bleibt im Cache, solange sich die Abhängigkeiten nicht ändern
COPY ${APP_DIR}/package.json ${APP_DIR}/package-lock.json ./
RUN npm ci

# Dann der Quellcode und der Produktions-Build (inklusive Budgets aus angular.json)
COPY ${APP_DIR}/ ./
RUN npm run build

# ---------- Stufe 2: Auslieferung mit nginx ----------
FROM nginx:alpine AS runtime

# Server-Konfiguration: SPA-Fallback und Caching-Header
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Laufzeitkonfiguration: Vorlage + Skript, das beim Containerstart config.json schreibt
COPY docker/runtime/config.template.json /etc/eventhub/config.template.json
COPY --chmod=755 docker/runtime/40-eventhub-config.sh /docker-entrypoint.d/40-eventhub-config.sh

# Nur das Build-Ergebnis wandert ins Image – kein Node.js, kein Quellcode, keine node_modules
COPY --from=build /app/dist/eventhub-perf/browser /usr/share/nginx/html

# Standardwert, im Container per -e API_URL=… überschreibbar
ENV API_URL=http://localhost:3000
EXPOSE 8080
