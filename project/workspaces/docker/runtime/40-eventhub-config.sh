#!/bin/sh
# Läuft beim Containerstart (nginx-Image führt alle Skripte in /docker-entrypoint.d/ aus).
# Schreibt config.json aus der Vorlage; nur ${API_URL} wird ersetzt.
set -eu
: "${API_URL:=http://localhost:3000}"
export API_URL
envsubst '${API_URL}' < /etc/eventhub/config.template.json > /usr/share/nginx/html/config.json
echo "EventHub: config.json geschrieben (apiUrl=${API_URL})"
