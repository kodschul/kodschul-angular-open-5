# Lab 2.3 – Übung: Bestandsprojekt migrieren

**Dauer:** ca. 23 Minuten (Einzel oder Paar, Checkpoint nach Schritt 1)
**Ändert die EventHub-Projektbasis?** Nein — die Migration läuft im eigenen Workspace `output/project/workspaces/legacy-ngmodule/`.

## Vorbereitung

- Terminal 1 (Ordner `project/`): `npm run api`.
- Terminal 2: in den Workspace wechseln und prüfen, ob der Build läuft:

  ```bash
  cd workspaces/legacy-ngmodule
  npm run build
  ```

  Die Abhängigkeiten des Workspaces werden im Setup installiert (`00-setup-and-installation.md`). Falls noch nicht im Setup geschehen: vorher `npm install` im Workspace ausführen (ca. 240 MB Download, je nach Netz einige Minuten; am besten in der Pause davor starten).

- Arbeitsordner: `workspaces/legacy-ngmodule/` (kein Playground, kein Starter)
- URL beim Ausprobieren: http://localhost:4300 (`npm start -- --port 4300`)
- Ausgangszustand sichern: Im geklonten Kurs-Repo ist der Workspace versioniert, `git status -- .` muss leer sein; die Commits der Übung gehören auf einen eigenen Branch (`git switch -c migration-uebung`). Bei der ZIP-Version vorher `git init && git add . && git commit -m "Ausgangszustand"` im Workspace ausführen.

## Aufgaben

1. Starte die App (`npm start -- --port 4300`), öffne `/sessions`, eine Detailseite und `/about`. Notiere, was sichtbar sein muss; das ist die Prüfliste für jeden Schritt. Stoppe den Server danach.
2. Zähle in `src/app/` die Dateien mit `@NgModule` und die Komponenten mit `standalone: false`.
3. Führe Schritt 1 aus: `npx ng generate @angular/core:standalone` ohne Optionen, wähle „Convert all components, directives and pipes to standalone“ und Pfad `./`.
4. Prüfe `npm run build` und `git diff -- .`. Notiere, welche `imports` das Schematic in `session-list.component.ts` eingetragen hat und welche Komponente noch `declarations` hat. Committe den Stand (`git add . && git commit -m "Schritt 1"`).
5. Führe Schritt 2 aus (`--mode=prune-ng-modules --path=./`), baue, lies den Diff, committe. Notiere, welches Modul verschwunden ist und welches bleibt.
6. Führe Schritt 3 aus (`--mode=standalone-bootstrap --path=./`), baue, lies den Diff von `main.ts`, committe.
7. Starte die App und prüfe die Liste aus Aufgabe 1.
8. Schreibe eine Migrationsnotiz `MIGRATION.md` im Workspace mit drei Punkten, die nach dem Schematic noch von Hand zu erledigen sind (Datei, Problem, Ziel).

## Checkpoint

- Nach Schritt 1: Build grün; `standalone: false` steht nur noch in `app.component.ts`, `AppComponent` steht weiter in `declarations` von `AppModule`.
- Nach Schritt 2: `shared.module.ts` ist gelöscht, Build grün.
- Nach Schritt 3: `app.module.ts` ist gelöscht, `main.ts` ruft `bootstrapApplication` auf, Build grün.
- Die App zeigt Liste, Detail und About wie vorher.

## Abschlusskriterien

- Drei Commits (oder drei notierte Diffs), jeder mit grünem Build.
- Lauffähige Standalone-App ohne `AppModule` und ohne `SharedModule`.
- `MIGRATION.md` mit drei konkreten Nacharbeiten.

## Erweiterung

1. Erledige die Nacharbeiten: `src/app/app.config.ts` mit `provideRouter(routes)` und `provideHttpClient()`, `src/app/app.routes.ts` statt `app-routing.module.ts`, `src/app/sessions/sessions.routes.ts` statt `sessions.module.ts` + `sessions-routing.module.ts`. Baue und prüfe die Build-Ausgabe: Wie heißt der Lazy Chunk jetzt?
2. Führe danach `npx ng generate @angular/core:control-flow` aus und sieh den Diff an (Vertiefung in Lab 3.1).

## Fallback

- Schritt schlägt fehl oder Diff ist verwirrend: `git restore --staged --worktree -- . && git clean -fd -- src` stellt den letzten Commit wieder her.
- Kein `npm install` möglich: Diffs aller drei Schritte stehen vollständig in der Lösung; die Aufgaben 4–8 lassen sich daran nachvollziehen.
- Zeitmangel: nur Schritte 1–2 ausführen, Schritt 3 in der Lösung nachlesen.
