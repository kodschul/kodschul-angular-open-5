# nx-eventhub (Lab 11.1)

Nx-Workspace (Nx 24, Angular 22) mit der App `eventhub` (Session-Liste) und der Library `models`. Ausgangszustand für Lab 11.1: Die Session-Karte liegt noch in der App und wandert in der Übung in eine `ui`-Library.

Erzeugt mit:

```bash
npx create-nx-workspace@latest nx-eventhub --preset=angular-monorepo --appName=eventhub \
  --bundler=esbuild --style=css --ssr=false --e2eTestRunner=none --linter=eslint \
  --formatter=prettier --nxCloud=skip --aiAgents=none --workspaces=false --skipGit --interactive=false
npx nx g @nx/js:library libs/shared/models --bundler=none --unitTestRunner=none --tags=type:util,scope:shared
```

Danach: Willkommensseite entfernt, Session-Liste und -Karte ergänzt, Modulgrenzen in `eslint.config.mjs`, Test-Pakete für Libraries (Vitest mit AnalogJS) vorinstalliert, Dev-Server-Port 4210.

## Start

```bash
# Mock-API im Kursprojekt (project/)
npm run api

# in diesem Ordner
npm install
npx nx serve eventhub              # http://localhost:4210
npx nx run-many -t build test lint
npx nx graph
```

| Projekt | Ordner | Tags |
| --- | --- | --- |
| `eventhub` | `apps/eventhub` | `type:app`, `scope:eventhub` |
| `models` | `libs/shared/models` | `type:util`, `scope:shared` |

Lösung: `output/m11-libraries/l01-nx/l01-nx-sol.md`.
