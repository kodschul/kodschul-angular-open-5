# CI-und-Transfer-Cheatsheet

Schnellreferenz für Modul 14 (Pipeline, Modernisierung). Vorlagen: `output/project/workspaces/ci/`, `anhang-modernisierungsplan-vorlage.md`.

## GitHub-Actions-Workflow

| Syntax | Wirkung |
| --- | --- |
| Datei `.github/workflows/ci.yml` in der Repo-Wurzel | GitHub erkennt den Workflow |
| `on: { push: { branches: [main] }, pull_request: }` | Auslöser |
| `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }` | alten Lauf beim neuen Push abbrechen |
| `permissions: { contents: read }` | Token nur mit Leserechten |
| `jobs.<id>.runs-on: ubuntu-latest` | Runner-Typ |
| `needs: test` | Job startet erst nach grünem Job `test` |
| `defaults.run.working-directory: project` | Arbeitsordner für alle `run`-Schritte |
| `working-directory:` am Schritt | Arbeitsordner nur für diesen Schritt |
| `if: failure()` | Schritt nur nach einem Fehler |
| `if: hashFiles('project/eslint.config.js') != ''` | Schritt nur, wenn die Datei existiert |
| `env: { CYPRESS_INSTALL_BINARY: 0 }` | Cypress-Binary beim `npm ci` überspringen |
| `${{ github.sha }}` | Commit-Hash, z. B. als Image-Tag |

## Actions (Stand 28.10.2026, `prüfen`)

| Action | Zweck |
| --- | --- |
| `actions/checkout@v7` | Code auschecken (`fetch-depth: 0` für volle Historie) |
| `actions/setup-node@v7` mit `node-version: 24`, `cache: npm`, `cache-dependency-path: project/package-lock.json` | Node.js und npm-Cache |
| `cypress-io/github-action@v7` mit `working-directory`, `start`, `wait-on` | Abhängigkeiten, Binary-Cache, App starten, `cypress run` |
| `actions/upload-artifact@v7` | Screenshots und Videos sichern |
| `nrwl/nx-set-shas@v5` | Basis-Commit für `nx affected` |

## Pipeline-Befehle

| Befehl | Stufe |
| --- | --- |
| `npm ci` | Install exakt nach Lock-Datei |
| `npx ng lint` | Lint (erst nach `ng add angular-eslint`) |
| `npx ng test --watch=false` | Unit-Tests einmalig, Exit-Code 0/1 |
| `npx ng test --watch=false --include "src/app/…/*.spec.ts"` | nur ausgewählte Tests |
| `npm run build` | Produktions-Build, bricht bei `maximumError` ab |
| `docker build -f docker/Dockerfile -t eventhub-web:<tag> .` | Image (im Ordner `workspaces/`) |
| `npx nx affected -t lint test build` | nur betroffene Projekte im Nx-Workspace |

## Lokal prüfen

| Befehl | Wirkung |
| --- | --- |
| `act -l -W .github/workflows/ci.yml` | Jobs auflisten |
| `act push -W .github/workflows/ci.yml -j test` | Job `test` lokal in Docker ausführen |
| `echo $?` | Exit-Code des letzten Befehls |

## Migrations-Schematics (Angular 22)

| Befehl | Wirkung |
| --- | --- |
| `ng update @angular/core@<n> @angular/cli@<n>` | eine Hauptversion weiter, inkl. automatischer Migrationen |
| `ng generate @angular/core:standalone` | NgModules → Standalone (drei Durchläufe) |
| `ng generate @angular/core:control-flow` | `*ngIf`/`*ngFor` → `@if`/`@for` |
| `ng generate @angular/core:inject` | Konstruktor-Injection → `inject()` |
| `ng generate @angular/core:signal-input-migration` | `@Input` → `input()` |
| `ng generate @angular/core:output-migration` | `@Output` → `output()` |
| `ng generate @angular/core:route-lazy-loading` | eager Routen → `loadComponent` |
| `ng generate @schematics/angular:refactor-jasmine-vitest` | Jasmine-Syntax → Vitest (experimentell) |

## Modernisierungsplan

| Spalte | Inhalt |
| --- | --- |
| Maßnahme | ein auslieferbarer Schritt |
| Warum an dieser Stelle? | Abhängigkeit oder Risiko-Begründung |
| Aufwand | S ≤ 2 PT, M ≤ 10 PT, L > 10 PT |
| Risiko | niedrig / mittel / hoch, mit Grund |
| Messkriterium | prüfbar: Befehl, Zahl, Ja/Nein |
| Kurs-Lab | Lab mit dem Werkzeug |

Reihenfolge: Sicherheitsnetz (CI, Tests, Baseline) → Version → automatische Migrationen → Auslieferung → Feature für Feature.
