# Docker-Dateien (Lab 13.3)

| Datei | Zweck | Build-Befehl |
| --- | --- | --- |
| `Dockerfile` + `Dockerfile.dockerignore` | EventHub-App aus `eventhub-perf-fixed/` (Lab 13.3, CI in Lab 14.1) | im Ordner `workspaces/`: `docker build -f docker/Dockerfile -t eventhub-web .` |
| `Dockerfile.unprivileged` + `.dockerignore` | dieselbe App ohne root (`nginxinc/nginx-unprivileged`) | im Ordner `workspaces/`: `docker build -f docker/Dockerfile.unprivileged -t eventhub-web:nonroot .` |
| `Dockerfile.project` + `.dockerignore` | das Kurs-Projekt selbst (Transferprojekt m14) | im Ordner `project/`: `docker build -f workspaces/docker/Dockerfile.project -t eventhub-kurs .` |
| `nginx/default.conf` | SPA-Fallback, Cache-Header, gzip | – |
| `runtime/` | Vorlage und Startskript für `config.json` aus `API_URL` | – |
| `starter/` | Starter für die Übung; Arbeitskopie nach `docker/playground/` | im Ordner `workspaces/`: `docker build -f docker/playground/Dockerfile -t eventhub-web .` |

Start: `docker run --rm -p 8080:8080 -e API_URL=http://localhost:3000 eventhub-web`, danach http://localhost:8080 und http://localhost:8080/sessions/3.
