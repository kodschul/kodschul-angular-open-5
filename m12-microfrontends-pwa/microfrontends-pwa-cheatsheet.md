# Micro-Frontends-und-PWA-Cheatsheet

Schnellreferenz für Modul 12 (Architektur-Entscheidung, Native Federation, PWA). Versionen: Angular 22.2, `@angular-architects/native-federation` 22.2, `@angular/pwa` 22.2 (Stand: 28.10.2026).

## Ansatz wählen

| Situation | Ansatz |
| --- | --- |
| 1–2 Teams, gemeinsamer Release | Monorepo (Nx, Lab 11.1) |
| mehrere Angular-Teams, getrennte Deployments | Native Federation |
| bestehender Webpack-Build mit Module Federation | Webpack Module Federation |
| Widget in fremden Seiten oder anderes Framework | Web Component (Angular Elements, Lab 11.3) |
| Altanwendung, harte Isolation | iframe |

## Native Federation: Einrichtung

| Befehl | Wirkung |
| --- | --- |
| `npx ng add @angular-architects/native-federation --project <p> --port 4201 --type remote` | Projekt als Remote |
| `npx ng add @angular-architects/native-federation --project <p> --port 4200 --type dynamic-host` | Projekt als Host mit Manifest |
| `… --type host` | Host mit fest eingetragenen Remotes |
| `npx ng serve` | Dev-Server mit Federation (Remote baut bei Änderungen neu) |
| `npx ng build` | Build inkl. `remoteEntry.json` und geteilter Pakete |
| `npx ng serve --port 4300` | anderer Port, z. B. wenn 4200 belegt ist |

## Native Federation: Dateien und Code

| Datei / Syntax | Wirkung |
| --- | --- |
| `federation.config.mjs` → `name` | Name des Remotes (Schlüssel im Manifest) |
| `exposes: { './routes': './src/app/admin.routes.ts' }` | Modul für Hosts freigeben |
| `shared: fromPackageJson({ singleton: true, strictVersion: true, requiredVersion: 'auto' })` | Abhängigkeiten teilen (ältere Projekte: `shareAll(...)`) |
| `public/federation.manifest.json` | `{ "federation-admin": "http://localhost:4201/remoteEntry.json" }` |
| `initFederation('federation.manifest.json', …).then((nf) => …)` | Federation vor Angular starten (`src/main.ts`) |
| `bootstrapApplication(App, appConfig(nf))` | `loadRemoteModule` an die Routen weitergeben |
| `loadChildren: () => loadRemoteModule('federation-admin', './routes').then((m) => m.ADMIN_ROUTES)` | Remote-Routen laden |
| `loadComponent: () => loadRemoteModule('federation-admin', './Dashboard').then((m) => m.AdminDashboard)` | Remote-Komponente laden |
| `.catch(() => [{ path: '**', component: RemoteUnavailable }])` | Ersatzroute, wenn der Remote fehlt |
| `admin-remote.d.ts` mit `export declare const ADMIN_ROUTES: Routes;` | Typ des Remote-Moduls im Host |
| `provideHttpClient()` im Host | Remotes nutzen den `HttpClient` (und Interceptors) des Hosts |
| `npx http-server dist/<remote>/browser -p 4201 --cors` | gebauten Remote statisch ausliefern |

## PWA: Einrichtung und Test

| Befehl | Wirkung |
| --- | --- |
| `npx ng add @angular/pwa` | Manifest, Icons, `ngsw-config.json`, `provideServiceWorker` |
| `npx ng build` | Produktions-Build mit `ngsw-worker.js` und `ngsw.json` |
| `npx http-server dist/<app>/browser -p 8080 -c-1` | Build lokal ausliefern (im Workspace: `npm run serve:dist`) |
| DevTools › Application › Service Workers | Status, „Update on reload“, „Unregister“ |
| DevTools › Application › Cache Storage | gespeicherte Dateien und API-Antworten |
| DevTools › Application › Manifest | Name, Icons, Installierbarkeit |
| DevTools › Network › „Offline“ | Offline-Test |

## PWA: `ngsw-config.json`

| Feld | Wirkung |
| --- | --- |
| `assetGroups[].installMode: "prefetch"` | Dateien sofort speichern (App-Kern) |
| `assetGroups[].installMode: "lazy"` | erst beim ersten Abruf speichern |
| `dataGroups[].urls` | API-URLs, fremde Origins mit voller URL inkl. Port |
| `cacheConfig.strategy: "freshness"` | Netz zuerst, Cache nach `timeout` |
| `cacheConfig.strategy: "performance"` | Cache zuerst, bis `maxAge` abläuft |
| `maxSize`, `maxAge` (`"1d"`, `"12h"`), `timeout` (`"3s"`) | Grenzen der Daten-Gruppe |

## PWA: Updates mit `SwUpdate`

| Syntax | Wirkung |
| --- | --- |
| `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() })` | Service Worker nur im Produktions-Build |
| `inject(SwUpdate).isEnabled` | `false` in `ng serve` |
| `swUpdate.versionUpdates.pipe(filter((e) => e.type === 'VERSION_READY'))` | neue Version ist geladen |
| `swUpdate.checkForUpdate()` | aktiv nach Updates suchen |
| `document.location.reload()` | neue Version aktivieren |
