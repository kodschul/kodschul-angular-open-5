# Lab 14.1 – Übung: CI-Pipeline für Angular

**Dauer:** ca. 15 Minuten (Einzel oder Paar)
**Ändert die EventHub-Projektbasis?** Ja — neue Datei `.github/workflows/ci.yml` in der Wurzel des eigenen Repos (Fork oder Kopie des Kurs-Repos).

## Vorbereitung

- Repo-Wurzel = Ordner, der `project/` enthält (das Kurs-Repo). Alle Befehle laufen dort.
- Variante A (empfohlen): eigener Fork oder eigenes Repo auf GitHub mit dem Kurs-Repo, Actions aktiviert.
- Variante B (lokal): Docker läuft und `act` ist installiert (`act --version`); siehe https://github.com/nektos/act.
- Starter: `project/workspaces/ci/starter/ci.yml` mit den Lücken TODO 1 (Unit-Tests) und TODO 2 (Docker-Build).
- Voraussetzungen aus früheren Labs: `project/workspaces/eventhub-perf-fixed/` (Lab 13.2) und `project/workspaces/docker/Dockerfile` (Lab 13.3).

## Aufgaben

1. Kopiere den Starter an den Ort, an dem GitHub Workflows sucht: `mkdir -p .github/workflows && cp project/workspaces/ci/starter/ci.yml .github/workflows/ci.yml`.
2. Ergänze im Job `test` an der Stelle von TODO 1 einen Schritt „Unit-Tests (Vitest)“, der die Tests einmalig ohne Watch-Modus ausführt.
3. Ergänze im Job `build` an der Stelle von TODO 2 einen Schritt „Docker-Image bauen“ mit Arbeitsordner `project/workspaces`, Dockerfile `docker/Dockerfile` und Tag `eventhub-web:${{ github.sha }}`.
4. Prüfe die Struktur: Variante A – Datei committen und pushen, im Tab „Actions“ erscheinen die Jobs `test`, `e2e` und `build`. Variante B – `act -l -W .github/workflows/ci.yml` listet die drei Jobs.
5. Lege einen absichtlich roten Test an: `project/src/app/playground/ci-rot.spec.ts` mit einem `describe`/`it`, das `expect(1 + 1).toBe(3)` prüft. Committe und pushe auf einen neuen Branch und öffne einen Pull Request (Variante B: `act push -W .github/workflows/ci.yml -j test`).
6. Notiere, welcher Job rot wird, welche Jobs übersprungen werden und welche Zeile im Log den Fehler zeigt.
7. Lösche `ci-rot.spec.ts`, committe und pushe erneut. Notiere die Laufzeit jedes Jobs im grünen Lauf.
8. Notiere, ob der zweite Lauf im Schritt `actions/setup-node` einen Cache-Treffer meldet („Cache restored“).

## Checkpoint

- Nach Aufgabe 4: Der Workflow ist syntaktisch gültig, drei Jobs sind sichtbar.
- Nach Aufgabe 6: `test` ist rot, `e2e` und `build` laufen nicht (wegen `needs: test`).
- Nach Aufgabe 7: alle drei Jobs grün.

## Abschlusskriterien

- `.github/workflows/ci.yml` enthält alle Stufen: Install mit Cache, Lint (bedingt), Unit-Tests, E2E, Build mit Budgets, Docker-Image.
- Ein roter und ein grüner Lauf sind dokumentiert (Screenshot oder kopierte Log-Zeilen).

## Erweiterung

- Senke in `project/workspaces/eventhub-perf-fixed/angular.json` das `initial`-Budget auf `"maximumError": "200kB"`, pushe und prüfe, dass der Job `build` im Schritt „Build mit Budgets“ rot wird. Stelle den Wert danach zurück.
- Richte im Repository unter Settings → Branches eine Regel für `main` ein, die die Jobs `test`, `e2e` und `build` als Required Checks verlangt.
- Schreibe den Job `test` als GitLab-CI-Job (`.gitlab-ci.yml`) mit `image: node:24`, `cache` und `script`.

## Fallback

Ohne GitHub-Zugang und ohne `act`: Führe die Befehle der Pipeline lokal in derselben Reihenfolge aus und dokumentiere die Exit-Codes (`echo $?` nach jedem Befehl):

```bash
cd project
npm ci
npx ng test --watch=false            # mit ci-rot.spec.ts: Exit-Code 1, ohne: 0
cd workspaces/eventhub-perf-fixed
npm ci && npm run build
cd .. && docker build -f docker/Dockerfile -t eventhub-web:lokal .   # nur mit Docker
```

Grenze: Cache, parallele Jobs und Required Checks lassen sich so nicht prüfen.
