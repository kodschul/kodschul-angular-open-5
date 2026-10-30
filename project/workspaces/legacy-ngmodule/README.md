# EventHub Legacy (NgModule)

Kleine EventHub-App im Stil Angular 15 (NgModule, `*ngIf`/`*ngFor`, Konstruktor-Injection, `HttpClientModule`), technisch auf Angular 22. Ausgangspunkt für Lab 2.3 „Bestandsprojekt migrieren“.

| Datei | Rolle |
| --- | --- |
| `src/main.ts` | Start über `bootstrapModule(AppModule)` |
| `src/app/app.module.ts` | Wurzelmodul |
| `src/app/app-routing.module.ts` | Routen, `sessions` lazy über `loadChildren` |
| `src/app/shared/shared.module.ts` | `LevelBadgeComponent`, `DurationPipe` |
| `src/app/sessions/sessions.module.ts` | Feature-Modul mit Liste und Detail |

## Start

```bash
# Terminal 1, im Ordner project: Mock-API
npm run api

# Terminal 2, in diesem Ordner
npm install
npm start -- --port 4300   # http://localhost:4300, die Kurs-App belegt 4200
npm run build
```

Die Migration läuft in diesem Ordner (Lab 2.3). Im geklonten Kurs-Repo zeigt `git diff -- .` jeden Schritt; `git restore --staged --worktree -- . && git clean -fd -- src` stellt den Ausgangszustand wieder her. Ohne Git (ZIP) vorher `git init && git add . && git commit -m "Ausgangszustand"` ausführen.
