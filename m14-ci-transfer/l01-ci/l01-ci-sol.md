# Lab 14.1 – Lösung: CI-Pipeline für Angular

Fertiger Workflow: `project/workspaces/ci/.github/workflows/ci.yml`. Info-Seite in der Kurs-App: `/examples/m14-ci-transfer/l01-ci`.

## Aufgabe 1: Starter an den richtigen Ort

```bash
mkdir -p .github/workflows
cp project/workspaces/ci/starter/ci.yml .github/workflows/ci.yml
```

GitHub wertet nur Dateien in `.github/workflows/` der Repo-Wurzel aus. Der Ordner `project/workspaces/ci/.github/` ist verschachtelt und wird ignoriert; er dient nur als Ablage.

## Aufgabe 2: Unit-Tests (TODO 1)

```yaml
      - name: Unit-Tests (Vitest)
        run: npx ng test --watch=false
```

Der Schritt läuft im Arbeitsordner `project` (aus `defaults.run.working-directory`). `--watch=false` beendet Vitest nach einem Durchlauf mit Exit-Code 0 oder 1.

## Aufgabe 3: Docker-Build (TODO 2)

```yaml
      - name: Docker-Image bauen
        working-directory: project/workspaces
        run: docker build -f docker/Dockerfile -t eventhub-web:${{ github.sha }} .
```

`working-directory` am Schritt überschreibt den Job-Standard (`project/workspaces/eventhub-perf-fixed`), weil der Build-Kontext aus Lab 13.3 der Ordner `workspaces/` ist. Auf `ubuntu-latest` ist Docker vorinstalliert.

## Vollständiger Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  test:
    name: Lint und Unit-Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: project
    env:
      CYPRESS_INSTALL_BINARY: 0
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: project/package-lock.json
      - run: npm ci
      - name: Lint
        if: hashFiles('project/eslint.config.js') != ''
        run: npx ng lint
      - name: Unit-Tests (Vitest)
        run: npx ng test --watch=false

  e2e:
    name: E2E-Tests (Cypress)
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
      - uses: cypress-io/github-action@v7
        with:
          working-directory: project
          start: npm run api, npm start
          wait-on: 'http://localhost:3000/sessions, http://localhost:4200'
          wait-on-timeout: 180
      - name: Screenshots und Videos bei Fehlern sichern
        if: failure()
        uses: actions/upload-artifact@v7
        with:
          name: cypress-artefakte
          path: |
            project/cypress/screenshots
            project/cypress/videos
          if-no-files-found: ignore

  build:
    name: Build und Docker-Image
    needs: test
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: project/workspaces/eventhub-perf-fixed
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: project/workspaces/eventhub-perf-fixed/package-lock.json
      - run: npm ci
      - name: Build mit Budgets
        run: npm run build
      - name: Docker-Image bauen
        working-directory: project/workspaces
        run: docker build -f docker/Dockerfile -t eventhub-web:${{ github.sha }} .
      - name: Image-Größe ausgeben
        run: docker image ls eventhub-web
```

| Entscheidung | Grund |
| --- | --- |
| `e2e` und `build` hängen nur von `test` ab | laufen parallel; ein roter Unit-Test spart beide teuren Jobs |
| `CYPRESS_INSTALL_BINARY: 0` nur im Job `test` | spart den Binary-Download, wo kein Browser-Test läuft |
| Build-Job baut `eventhub-perf-fixed` | dort sind die Budgets aus Lab 13.2 gesetzt und das Dockerfile aus Lab 13.3 passt; in einem echten Projekt testen und bauen alle Jobs dieselbe App |
| `permissions: contents: read` | Workflow braucht nur Lesezugriff; minimiert Rechte des automatischen Tokens |
| Lint mit `if: hashFiles(…)` | Angular 22 hat kein Lint-Target; der Schritt wird ohne ESLint-Konfiguration übersprungen statt rot |

Dieser Workflow wurde für den Kurs statisch geprüft (YAML-Syntax, Action-Versionen vom 28.10.2026, Befehle lokal); ein Lauf auf GitHub gehört zur Übung.

## Aufgabe 4: Struktur prüfen

Variante A: Im Tab „Actions“ erscheint der Workflow „CI“ mit den Jobs „Lint und Unit-Tests“, „E2E-Tests (Cypress)“ und „Build und Docker-Image“.

Variante B:

```bash
act -l -W .github/workflows/ci.yml
```

Die Liste nennt die Job-IDs `test`, `e2e` und `build` mit Workflow- und Dateinamen.

## Aufgabe 5 und 6: Roter Lauf

`project/src/app/playground/ci-rot.spec.ts`:

```ts
// Absichtlich roter Test für Lab 14.1 – nach dem roten Lauf wieder löschen.
describe('CI-Probe', () => {
  it('schlägt absichtlich fehl', () => {
    expect(1 + 1).toBe(3);
  });
});
```

`describe`, `it` und `expect` sind ohne Import verfügbar (`vitest/globals` in `tsconfig.spec.json`, Modul 10).

Log des Schritts „Unit-Tests (Vitest)“ (lokal geprüft mit `npx ng test --watch=false --include src/app/playground/ci-rot.spec.ts`, gekürzt):

```text
 ❯ |project| src/app/playground/ci-rot.spec.ts (1 test | 1 failed) 15ms
   ❯ CI-Probe (1)
     × schlägt absichtlich fehl 13ms
 FAIL  |project| src/app/playground/ci-rot.spec.ts > CI-Probe > schlägt absichtlich fehl
AssertionError: expected 2 to be 3 // Object.is equality
 Test Files  1 failed (1)
      Tests  1 failed (1)
```

Auf GitHub folgt darunter die Zeile `Error: Process completed with exit code 1.`

- Rot: Job `test`, Schritt „Unit-Tests (Vitest)“.
- Übersprungen: `e2e` und `build` (Status „skipped“), weil beide `needs: test` haben.
- Im Pull Request steht der Check „CI / Lint und Unit-Tests“ als fehlgeschlagen.

## Aufgabe 7: Grüner Lauf

Nach dem Löschen der Datei laufen alle drei Jobs grün. Typische Reihenfolge der Laufzeiten: `test` am kürzesten, `build` mittel (`npm run build` plus `docker build`), `e2e` am längsten (Binary, App-Start, Browser). Die konkreten Minuten hängen von Runner-Auslastung und Cache ab.

## Aufgabe 8: Cache

Im zweiten Lauf meldet `actions/setup-node` im Job `test` eine Zeile `Cache restored from key: …`. Der Schlüssel enthält den Hash von `project/package-lock.json`; ändert sich die Lock-Datei, gibt es einen neuen Cache.

## Erweiterung

**Budget überschritten:** Der Job `build` wird im Schritt „Build mit Budgets“ rot:

```text
✘ [ERROR] bundle initial exceeded maximum budget. Budget 200.00 kB was not met by 88.12 kB with a total of 288.12 kB.
Error: Process completed with exit code 1.
```

Der Docker-Schritt läuft danach nicht mehr. Warnungen (`maximumWarning`) erscheinen nur im Log, der Job bleibt grün.

**Required Checks:** Settings → Branches (bzw. Rules → Rulesets) → Regel für `main` → „Require status checks to pass“ → `Lint und Unit-Tests`, `E2E-Tests (Cypress)`, `Build und Docker-Image` auswählen (Bezeichnungen der GitHub-Oberfläche Stand 28.10.2026, `prüfen`).

**GitLab CI:**

```yaml
# .gitlab-ci.yml
stages: [test]

unit-tests:
  stage: test
  image: node:24
  variables:
    CYPRESS_INSTALL_BINARY: "0"
  cache:
    key:
      files: [project/package-lock.json]
    paths: [.npm/]
  script:
    - cd project
    - npm ci --cache ../.npm --prefer-offline
    - npx ng test --watch=false
```
