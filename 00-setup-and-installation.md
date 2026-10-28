# Setup und Installation

Diese Anleitung bringt das Kurs-Repo auf dem Laptop zum Laufen, in der Reihenfolge der Abschnitte. Nach jedem Installationsschritt steht eine Prüfung. Alle Befehle sind für eine Bash-Shell geschrieben (macOS/Linux: Terminal, Windows: Git Bash oder das Terminal in VS Code mit Git Bash).

Stand: 28.10.2026 (Angular 22.2, NgRx 22). Versionen vor Kursbeginn prüfen.

## Checkliste

| Werkzeug | Version | Prüfung | Benötigt ab |
| --- | --- | --- | --- |
| Node.js | 22.22.3+ oder 24.15+ (empfohlen 24 LTS) | `node -v` | Tag 1 |
| npm | wird mit Node.js installiert (10 oder neuer) | `npm -v` | Tag 1 |
| VS Code | aktuell, Erweiterung „Angular Language Service“ | Start des Programms | Tag 1 |
| Chrome oder Edge | aktuell | Entwicklertools mit `F12` | Tag 1 |
| Angular DevTools | Browser-Erweiterung | Tab „Angular“ in den Entwicklertools | Tag 1 |
| Redux DevTools | Browser-Erweiterung | Tab „Redux“ in den Entwicklertools | Tag 2 (Modul 7) |
| Git | aktuell | `git --version` | Tag 1 |
| Docker Desktop oder Podman | aktuell, optional | `docker version` | Tag 3 (Lab 9.3), Tag 4 (Lab 13.3) |
| Netzzugang | `registry.npmjs.org` | `npm ping` | Tag 1 |
| Freie Ports | 3000 (Mock-API), 4200 (App), 4201 (`eventhub-lab`, Lab 12.2); Tag 4 zusätzlich 4210–4240, 4300/4301, 8080–8082 (Übersicht in [`project/README.md`](project/README.md#workspaces)) | – | Tag 1 |

## Node.js installieren

| Weg | Vorgehen |
| --- | --- |
| Installer | LTS-Version von [nodejs.org](https://nodejs.org) herunterladen und mit den Standardoptionen installieren |
| Versionsverwaltung (macOS, Linux) | `nvm install 24` und `nvm use 24` (nvm) oder `fnm install 24` (fnm) |
| Versionsverwaltung (Windows) | nvm-windows oder fnm: `nvm install 24`, `nvm use 24` |

Danach ein neues Terminal öffnen und prüfen:

```bash
node -v
npm -v
```

Erwartet: `node -v` zeigt mindestens `v22.22.3` oder `v24.15.0` (Anforderung der Angular CLI 22.2: `^22.22.3 || ^24.15.0 || >=26`, Stand 28.10.2026). Die von Angular 22 unterstützten Node-Versionen stehen in der Versionstabelle auf [angular.dev/reference/versions](https://angular.dev/reference/versions).

## Angular CLI

Die CLI ist im Kurs-Projekt als Entwicklungsabhängigkeit enthalten. Innerhalb von `project/` genügt `npx ng …`. Eine globale Installation ist optional und nur für neue Projekte außerhalb des Kurs-Repos nötig:

```bash
npm install -g @angular/cli@22
ng version
```

## Browser-Erweiterungen

1. Angular DevTools aus dem Chrome Web Store bzw. Edge-Add-ons installieren (Suche: „Angular DevTools“).
2. Redux DevTools ebenso installieren (Suche: „Redux DevTools“).
3. Seite neu laden. Auf Angular-Seiten im Entwicklungsmodus erscheint der Tab „Angular“.

Ohne die Erweiterungen bleibt der Kurs machbar; Modul 7 zeigt die Store-Inhalte zusätzlich in der Oberfläche an.

## Kurs-Repo bekommen

| Variante | Vorgehen |
| --- | --- |
| Git-Klon | `git clone <URL-des-Kurs-Repos>`, danach `cd <repo-ordner>` |
| ZIP | Archiv in einen Ordner entpacken, der nicht von OneDrive, Dropbox o. Ä. synchronisiert wird |
| ZIP inklusive `node_modules` | wie ZIP; `npm install` entfällt (siehe „Fallbacks“) |

```text
<repo-ordner>/
├── m00-overview/                 Überblick, Themen, Glossar, Best Practices, FAQ
├── mNN-<modul>/                  Handouts je Lab (Theorie, Übung, Lösung) und Cheatsheet
├── 00-setup-and-installation.md
├── 00-prework.md                 optionale Auffrischung der Grundlagen
└── project/                      Angular-22-App des Kurses
    ├── api/                      EventHub-Mock-API (Node.js, ohne Abhängigkeiten)
    ├── src/app/examples/         fertiges Beispiel je Lab
    ├── src/app/starters/         Startdateien der Übungen
    ├── src/app/playground/       Arbeitsbereich für Übungen
    ├── src/app/shared/           gemeinsame Modelle und API-Service
    ├── cypress/                  E2E-Tests (Modul 10)
    └── workspaces/               eigene Projekte für Migration, Nx, Libraries, Micro-Frontends, PWA, Docker, CI
```

## Projekt installieren und starten

Alle npm-Befehle laufen im Ordner `project/`, weil dort `package.json` liegt. Gearbeitet wird mit zwei Terminals.

```bash
cd project
npm install
```

**Terminal 1 – Mock-API:**

```bash
npm run api
```

Erwartete Ausgabe:

```text
EventHub Mock-API läuft auf http://localhost:3000
```

**Terminal 2 – App:**

```bash
npm start
```

Erwartet wird die Meldung `Local: http://localhost:4200/`. Die Adresse im Browser öffnen. `Strg + C` beendet jeweils den Prozess.

Prüfung der API im Browser: [http://localhost:3000/sessions](http://localhost:3000/sessions) liefert eine JSON-Liste mit zwölf Sessions.

## Startseite, Beispiele und Playground

| Adresse | Anzeige |
| --- | --- |
| `http://localhost:4200/` | Startseite mit allen Beispielen nach Tagen und Modulen |
| `http://localhost:4200/examples/<modul>/<lab>` | fertiges Beispiel eines Labs |
| `http://localhost:4200/playground` | eigene Arbeit aus `src/app/playground/playground.ts` |

Arbeitsweise für Übungen:

1. Im `-exc.md` des Labs stehen Starter und Arbeitsdatei, z. B. `src/app/starters/m03-l01-control-flow.ts`.
2. Den Inhalt der Starter-Datei nach `src/app/playground/playground.ts` kopieren. Die Klasse heißt dort immer `Playground`. Gibt es zusätzlich einen gleichnamigen Starter-Ordner (z. B. `src/app/starters/m03-l02-defer/`), diesen Ordner als Ganzes nach `src/app/playground/` kopieren, sodass `src/app/playground/m03-l02-defer/` entsteht; so stimmen die relativen Importe.
3. `/playground` im Browser öffnen; jede gespeicherte Änderung erscheint sofort.
4. Nach der Übung mit dem `-sol.md` und dem fertigen Beispiel unter `src/app/examples/` vergleichen.

Bei einem Git-Klon stellt `git restore src/app/playground/` den Ausgangszustand wieder her.

## Mock-API: Endpunkte und Schalter

| Methode und Pfad | Wirkung |
| --- | --- |
| `GET /sessions?q=&level=&track=&type=` | Sessions filtern (Suche in Titel und Tags) |
| `GET /sessions/:id`, `PATCH /sessions/:id` | eine Session lesen; ändern nur als Admin |
| `GET /speakers`, `GET /speakers/:id` | Speaker |
| `GET /registrations?email=`, `POST /registrations` | Anmeldungen lesen und anlegen |
| `POST /auth/login` | Login, liefert `accessToken` (JWT) und `user`; optional `expiresIn` in Sekunden |
| `GET /auth/me` | Profil zum Token |
| `GET /favorites`, `PUT /favorites` | Favoriten der angemeldeten Person |
| `GET /admin/stats` | Kennzahlen, nur Rolle `admin` |

| Schalter | Wirkung |
| --- | --- |
| `?_delay=2000` | Antwort um 2 s verzögern |
| `?_randomDelay=1` | zufällige Verzögerung 0–1,5 s (Race Conditions sichtbar machen) |
| `?_fail=500` | Fehlerstatus erzwingen |
| `POST /_control` mit `{"delay":0,"randomDelay":false,"fail":0}` | Schalter global für alle Anfragen setzen |

Kurs-Konten: `admin@eventhub.test` / `admin123` (Rolle `admin`), `user@eventhub.test` / `user123` (Rolle `user`). Die Daten liegen nur im Speicher; ein Neustart der API setzt sie zurück.

## Prüfen mit Tests und Build

| Befehl | Wirkung |
| --- | --- |
| `npm test` | Vitest im Watch-Modus |
| `npm run test:run` | alle Unit-Tests einmal |
| `npm run build` | Produktions-Build nach `dist/project/` inklusive Budgets |
| `npx ngc -p tsconfig.app.json --noEmit` | schnelle Typprüfung aller Dateien inklusive Templates |
| `npm run cy:open` | Cypress öffnen (Modul 10; Programm vorab installiert, siehe „Vor Kursbeginn“) |

## Vor Kursbeginn: große Downloads vorab erledigen

Zwei Übungen brauchen große Downloads. Im Kursnetz kosten sie sonst Übungszeit; deshalb vor Tag 1 einmal ausführen:

| Wofür | Befehl (im Ordner `project/`) | Größe | Prüfung |
| --- | --- | --- | --- |
| Lab 2.3 (Migration) | `cd workspaces/legacy-ngmodule && npm install && npm run build && cd ../..` | ca. 240 MB | Build endet mit `Application bundle generation complete` |
| Lab 10.5 (Cypress) | `npx cypress install && npx cypress verify` | mehrere 100 MB, landet im Benutzer-Cache | `verify` meldet `Verified Cypress!` |

Die Workspaces für Tag 4 (`workspaces/…`) brauchen ebenfalls je ein `npm install`; die Übungen nennen den Befehl. Bei langsamem Netz lohnt es sich, auch diese vorab auszuführen (Liste in [`project/README.md`](project/README.md#workspaces)).

## Docker (optional)

Lab 9.3 (Keycloak) und Lab 13.3 (Container) nutzen Docker. Prüfung:

```bash
docker version
docker run --rm hello-world
```

Docker Desktop ist für Unternehmen ab einer bestimmten Größe lizenzpflichtig (Stand 28.10.2026, Bedingungen auf docker.com prüfen). Podman ist eine Alternative; `docker` lässt sich dort meist durch `podman` ersetzen.

## Proxy und Firmennetz

| Symptom | Lösung |
| --- | --- |
| `npm install` hängt oder meldet `ETIMEDOUT` | Proxy setzen: `npm config set proxy http://<proxy>:<port>` und `npm config set https-proxy http://<proxy>:<port>` |
| `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` | Firmenzertifikat einbinden: `npm config set cafile <pfad-zum-zertifikat.pem>` |
| Port 4200 belegt | `npm start -- --port 4300` |
| Port 3000 belegt | `PORT=3100 npm run api`; dann im Code die API-URL anpassen (Lab 2.2 zeigt die Konfigurationsdatei) |

## Fallbacks

| Problem | Ausweg |
| --- | --- |
| Kein npm-Zugang | ZIP mit `node_modules` vom Trainer verwenden |
| Mock-API startet nicht | Node-Version prüfen (`node -v`); die API braucht keine Pakete |
| Kein Docker | Labs 9.3 und 13.3 als Demo verfolgen, Konfigurationsdateien statisch prüfen |
| Cypress lässt sich nicht installieren | Lab 10.5 mit dem Trainer-Bildschirm verfolgen; die Spec-Dateien sind trotzdem lesbar |

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| Liste bleibt leer, Konsole zeigt `ERR_CONNECTION_REFUSED` | Mock-API läuft nicht | Terminal 1: `npm run api` |
| `ng: command not found` | CLI nicht global installiert | `npx ng …` oder `npm start` verwenden |
| Fehler im Playground nach dem Kopieren eines Starters | Klassenname geändert oder alter Inhalt nicht ersetzt | Datei komplett ersetzen; Klasse heißt `Playground` |
| Änderungen erscheinen nicht | falsche Datei bearbeitet (Beispiel statt Playground) | Arbeitsdatei ist `src/app/playground/playground.ts` |
