# Lab 2.3 – Lösung: Bestandsprojekt migrieren

Alle Ausgaben stammen aus einem Lauf mit Angular CLI 22.2 auf `workspaces/legacy-ngmodule` (Stand: 28.10.2026).

## Aufgabe 1: Prüfliste

| Seite | Muss sichtbar sein |
| --- | --- |
| `/sessions` | zwölf Karten mit Titel (Link), Datum, Dauer (`45 min`, `3 h`), Level-Badge |
| `/sessions/3` | „RxJS-Operatoren, die wirklich zählen“, Datum, Raum, Dauer, Badge, Abstract, Speaker |
| `/about` | Text und Badge „Experte“ |
| Header | Links „Sessions“ und „Über“, aktiver Link unterstrichen |

## Aufgabe 2: Ausgangszustand zählen

| Art | Anzahl | Dateien |
| --- | --- | --- |
| `@NgModule` | 5 | `app.module.ts`, `app-routing.module.ts`, `shared/shared.module.ts`, `sessions/sessions.module.ts`, `sessions/sessions-routing.module.ts` |
| `standalone: false` | 6 | 5 Komponenten (`AppComponent`, `AboutComponent`, `LevelBadgeComponent`, `SessionListComponent`, `SessionDetailComponent`) und `DurationPipe` |

## Aufgabe 3: Schritt 1 ausführen

```bash
npx ng generate @angular/core:standalone
# ? Choose the type of migration: Convert all components, directives and pipes to standalone
# ? Which path in your project should be migrated? ./
```

Ausgabe:

```text
    🎉 Automated migration step has finished! 🎉
    IMPORTANT! Please verify manually that your application builds and behaves as expected.
    See https://angular.dev/reference/migrations/standalone for more information.
UPDATE src/app/shared/level-badge.component.ts (480 bytes)
UPDATE src/app/shared/duration.pipe.ts (331 bytes)
UPDATE src/app/sessions/session-list.component.ts (1445 bytes)
UPDATE src/app/sessions/session-detail.component.ts (1627 bytes)
UPDATE src/app/about.component.ts (468 bytes)
UPDATE src/app/shared/shared.module.ts (471 bytes)
UPDATE src/app/sessions/sessions.module.ts (530 bytes)
UPDATE src/app/app.module.ts (872 bytes)
```

## Aufgabe 4: Diff nach Schritt 1

`npm run build` endet mit `Application bundle generation complete.`

`session-list.component.ts`:

```diff
+import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
+import { RouterLink } from '@angular/router';
+import { LevelBadgeComponent } from '../shared/level-badge.component';
+import { DurationPipe } from '../shared/duration.pipe';

 @Component({
   selector: 'app-session-list',
-  standalone: false,
   template: `…`,
+  imports: [NgIf, NgFor, RouterLink, LevelBadgeComponent, AsyncPipe, DatePipe, DurationPipe],
 })
```

Das Schematic liest jedes Template und importiert genau, was es verwendet: Direktiven (`NgIf`, `NgFor`), Pipes, `RouterLink` und eigene Bausteine.

Module nach Schritt 1:

```diff
 // shared.module.ts
-  declarations: [LevelBadgeComponent, DurationPipe],
-  imports: [CommonModule],
+  imports: [CommonModule, LevelBadgeComponent, DurationPipe],

 // sessions.module.ts
-  declarations: [SessionListComponent, SessionDetailComponent],
-  imports: [SharedModule, SessionsRoutingModule],
+  imports: [SharedModule, SessionsRoutingModule, SessionListComponent, SessionDetailComponent],

 // app.module.ts
-  declarations: [AppComponent, AboutComponent],
-  imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule],
+  declarations: [AppComponent],
+  imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule, AboutComponent],
```

`AppComponent` bleibt deklariert und behält `standalone: false`, weil `AppModule` sie bootstrapt. Das ändert erst Schritt 3.

```bash
git add . && git commit -m "Schritt 1: convert-to-standalone"
```

## Aufgabe 5: Schritt 2 (`prune-ng-modules`)

```bash
npx ng generate @angular/core:standalone --mode=prune-ng-modules --path=./
```

```text
DELETE src/app/shared/shared.module.ts
UPDATE src/app/sessions/sessions.module.ts (459 bytes)
UPDATE src/app/app.module.ts (786 bytes)
```

```diff
 // app.module.ts
-import { SharedModule } from './shared/shared.module';
-  imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule, AboutComponent],
+  imports: [BrowserModule, HttpClientModule, AppRoutingModule, AboutComponent],

 // sessions.module.ts
-import { SharedModule } from '../shared/shared.module';
-  imports: [SharedModule, SessionsRoutingModule, SessionListComponent, SessionDetailComponent],
+  imports: [SessionsRoutingModule, SessionListComponent, SessionDetailComponent],
```

- Verschwunden: `SharedModule`. Es hat nur noch importiert und exportiert.
- Geblieben: `SessionsModule` (importiert `SessionsRoutingModule` mit `RouterModule.forChild`, wird per `loadChildren` geladen), `AppModule`, beide Routing-Module.

Build grün, Commit „Schritt 2“.

## Aufgabe 6: Schritt 3 (`standalone-bootstrap`)

```bash
npx ng generate @angular/core:standalone --mode=standalone-bootstrap --path=./
```

```text
DELETE src/app/app.module.ts
UPDATE src/main.ts (736 bytes)
UPDATE src/app/app.component.ts (650 bytes)
```

`main.ts` danach:

```ts
import { platformBrowser, BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

// Klassischer Start über ein NgModule (Angular ≤ 16)

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule, AppRoutingModule),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
}).catch((err) => console.error(err));
```

`app.component.ts` verliert `standalone: false` und bekommt `imports: [RouterLink, RouterLinkActive, RouterOutlet]`.

Build grün, Commit „Schritt 3“.

## Aufgabe 7: App prüfen

Alle Punkte der Prüfliste aus Aufgabe 1 stimmen. Die Build-Ausgabe zeigt weiterhin einen Lazy Chunk `sessions-module`, weil `loadChildren` noch die Modulklasse lädt.

## Aufgabe 8: Migrationsnotiz

```markdown
# Migrationsnotiz legacy-ngmodule

1. main.ts: importProvidersFrom(BrowserModule, HttpClientModule, AppRoutingModule)
   -> provideRouter(routes) + provideHttpClient() in src/app/app.config.ts; BrowserModule entfällt.
2. app-routing.module.ts, sessions.module.ts, sessions-routing.module.ts: Module nur noch für Routen
   -> app.routes.ts und sessions/sessions.routes.ts, loadChildren lädt das Routen-Array.
3. main.ts: ungenutzter Import platformBrowser und veralteter Kommentar; HttpClientModule ist veraltet
   -> aufräumen. Danach getrennt: Control Flow (Lab 3.1), inject() statt Konstruktor-Injection.
```

Weitere gültige Punkte: `SessionService` hat die API-URL fest im Code (Lab 2.2), `SessionDetailComponent` liest die ID nur über `snapshot` (Lab 1.2), zone.js bleibt vorerst (Umstieg auf zoneless erst nach Signals, Modul 6).

## Erweiterung

**1. Nacharbeiten** (vollständig, Build geprüft):

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AboutComponent } from './about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  { path: 'sessions', loadChildren: () => import('./sessions/sessions.routes') },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'sessions' },
];
```

```ts
// src/app/sessions/sessions.routes.ts
import { Routes } from '@angular/router';
import { SessionDetailComponent } from './session-detail.component';
import { SessionListComponent } from './session-list.component';

export default [
  { path: '', component: SessionListComponent },
  { path: ':id', component: SessionDetailComponent },
] satisfies Routes;
```

```ts
// src/app/app.config.ts
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

Gelöscht: `app-routing.module.ts`, `sessions/sessions.module.ts`, `sessions/sessions-routing.module.ts`. Der Lazy Chunk heißt jetzt `sessions-routes`:

```text
Lazy chunk files      | Names           |  Raw size | Estimated transfer size
chunk-U7A5UCTP.js     | sessions-routes |   3.35 kB |                 1.23 kB
```

`src/app/` enthält danach kein `@NgModule` mehr.

**2. Control Flow:** `npx ng generate @angular/core:control-flow` ersetzt `*ngIf … ; else loading` durch `@if (…) { … } @else { … }` und `*ngFor` durch `@for (…; track …)`. Die Einträge `NgIf` und `NgFor` in `imports` werden danach überflüssig. Details in Lab 3.1.

Referenz-Übersicht in der Kurs-App: `src/app/examples/m02-standalone/l03-migration/example.ts`, URL `/examples/m02-standalone/l03-migration`.
