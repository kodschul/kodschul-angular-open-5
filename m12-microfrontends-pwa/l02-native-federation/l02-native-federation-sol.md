# Lab 12.2 – Lösung: Micro-Frontend mit Native Federation

Ausgangszustand im Repo: `output/project/workspaces/federation-admin/` und `output/project/workspaces/federation-host/` (Aufgaben 1–4 laufen ohne Codeänderung). Die Änderungen aus Aufgabe 5–8 stehen unten. Infoseite in der Kurs-App: `/examples/m12-microfrontends-pwa/l02-native-federation`.

## Aufgabe 1: Remote allein

```bash
cd output/project/workspaces/federation-admin
npx ng serve            # ➜ Local: http://localhost:4201/
```

http://localhost:4201 zeigt „federation-admin · Einzelstart auf Port 4201“, „Admin-Bereich Remote v1.0.0“ und „12 Sessions, 1 ausgebucht“.

`remoteEntry.json` (Auszug):

```json
{
  "name": "federation-admin",
  "shared": [
    { "packageName": "@angular/core", "version": "22.2.3", "requiredVersion": "^22.2.0", "singleton": true, "strictVersion": true }
  ],
  "exposes": [{ "key": "./routes", "outFileName": "routes-….js" }]
}
```

## Aufgabe 2: Host

```bash
cd output/project/workspaces/federation-host
npx ng serve            # ➜ Local: http://localhost:4200/
```

Im Tab „Network“ nach Klick auf „Admin (Remote)“: `remoteEntry.json` und `routes-….js` kommen von `localhost:4201`; `_angular_core….js` steht nur einmal in der Liste. Host und Remote teilen Angular, weil beide `@angular/core` als Singleton in `shared` führen und die Versionen zusammenpassen.

## Aufgabe 3: Dateien im Ablauf

| Datei | Schritt im Ablauf |
| --- | --- |
| `public/federation.manifest.json` | `initFederation` liest: Remote `federation-admin` liegt unter `http://localhost:4201/remoteEntry.json` |
| `src/main.ts` | `initFederation(...)` vor dem Start, danach `bootstrap(nf)` |
| `src/app/app.routes.ts` | Navigation nach `/admin` ruft `loadRemoteModule('federation-admin', './routes')` |

## Aufgabe 4: Neue Remote-Version ohne Host-Build

```ts
// federation-admin/src/app/admin-dashboard.ts
export const ADMIN_VERSION = '1.1.0';
```

Terminal 2 meldet den Neubau („Bundling exposed modules … Done!“), Terminal 3 bleibt ruhig. Nach dem Neuladen zeigt der Host „Remote v1.1.0“. In Produktion entspricht das einem neuen Deployment nur des Remotes; der Host lädt bei jedem Start die aktuelle `remoteEntry.json`.

## Aufgabe 5: Zweites Modul freigeben

`federation-admin/federation.config.mjs`:

```js
  exposes: {
    './routes': './src/app/admin.routes.ts',
    './Dashboard': './src/app/admin-dashboard.ts',     // neu: einzelne Komponente
  },
```

Nach dem Neustart des Remotes enthält `remoteEntry.json` zwei Einträge unter `exposes`.

## Aufgabe 6: Route `auslastung` im Host

`federation-host/src/app/admin-dashboard-remote.d.ts`:

```ts
// Vertrag des Remote-Moduls './Dashboard'
import { Type } from '@angular/core';

export declare const AdminDashboard: Type<unknown>;
```

`federation-host/src/app/app.routes.ts` (vollständig, inklusive Aufgabe 8):

```ts
import type { NativeFederationResult } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { Home } from './home';
import { RemoteUnavailable } from './remote-unavailable';

export const routes = ({ loadRemoteModule }: NativeFederationResult): Routes => [
  { path: '', component: Home, title: 'EventHub' },
  {
    path: 'admin',
    loadChildren: () =>
      loadRemoteModule<typeof import('./admin-remote')>('federation-admin', './routes')
        .then((m) => m.ADMIN_ROUTES)
        // Remote nicht erreichbar: Ersatzroute statt leerer Seite
        .catch(() => [{ path: '**', component: RemoteUnavailable }]),
  },
  {
    path: 'auslastung',
    title: 'EventHub – Auslastung',
    // einzelne Komponente statt Routen: loadComponent wie in Lab 8.1
    loadComponent: () =>
      loadRemoteModule<typeof import('./admin-dashboard-remote')>('federation-admin', './Dashboard').then(
        (m) => m.AdminDashboard,
      ),
  },
];
```

`federation-host/src/app/app.ts` (Navigation):

```html
<nav class="row">
  <strong>EventHub Host</strong>
  <a routerLink="/">Start</a>
  <a routerLink="/admin">Admin (Remote)</a>
  <a routerLink="/auslastung">Auslastung</a>
</nav>
```

`/auslastung` zeigt dasselbe Dashboard wie `/admin`. Der `HttpClient` kommt in beiden Fällen aus `app.config.ts` des Hosts.

## Aufgabe 7: Remote gestoppt

Der Host startet weiter (das Manifest wird gelesen, der fehlende Remote nur protokolliert). Beim Öffnen von `/admin` bleibt der Inhalt leer, die Konsole meldet:

```text
[NF][6]: Failed to load module federation-admin/./routes
ERROR NFError: Failed to load module federation-admin/./routes
```

## Aufgabe 8: Ersatzseite

`federation-host/src/app/remote-unavailable.ts`:

```ts
import { Component } from '@angular/core';

/** Ersatzseite, wenn der Remote nicht erreichbar ist. */
@Component({
  selector: 'app-remote-unavailable',
  template: `<p class="card">Der Admin-Bereich ist gerade nicht erreichbar.</p>`,
})
export class RemoteUnavailable {}
```

Das `.catch()` in der Route `admin` (siehe Aufgabe 6) liefert statt der Remote-Routen eine Ersatzroute. Mit gestopptem Remote zeigt `/admin` den Text; nach dem Neustart des Remotes und einem Neuladen der Seite wieder das Dashboard.

## Erweiterung

```bash
cd federation-admin
npx ng build
npx http-server dist/federation-admin/browser -p 4201 --cors
```

`--cors` ist nötig, weil der Host von Port 4200 Dateien von Port 4201 lädt. Der Host funktioniert unverändert.

Manifest pro Umgebung: `federation.manifest.json` liegt nach dem Build als normale Datei in `dist/federation-host/browser/`. Beim Deployment ersetzt die Pipeline oder der Container-Start diese Datei, z. B. mit `"federation-admin": "https://admin.test.example/remoteEntry.json"`; der Host-Build bleibt derselbe (gleiches Prinzip wie `config.json` aus Lab 2.2).
