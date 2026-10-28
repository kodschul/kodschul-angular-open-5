# Kurs-Projekt: EventHub (Angular 22)

Angular-App mit allen Beispielen des Kurses, den Startern der Übungen, einem Playground als Arbeitsbereich, der EventHub-Mock-API und eigenen Workspaces für Themen mit eigener Projektstruktur. Handouts und Aufgaben liegen eine Ebene höher: [`../README.md`](../README.md).

## Start

Voraussetzung: Node.js 22.22.3+ oder 24.15+. Installation, Fallbacks und häufige Probleme: [`../00-setup-and-installation.md`](../00-setup-and-installation.md).

```bash
npm install
npm run api   # Terminal 1
npm start     # Terminal 2
```

## Stack

| Bereich | Paket (Version laut `package.json`) |
| --- | --- |
| Framework | `@angular/core` `^22.2.0`, `@angular/router` `^22.2.0`, `@angular/forms` `^22.2.0` |
| Build und Dev-Server | `@angular/build` `^22.2.5`, `@angular/cli` `^22.2.5` |
| Sprache | `typescript` `~6.0.2` |
| Reaktivität | `rxjs` `~7.8.0` |
| State | `@ngrx/store` `^22.0.1`, `@ngrx/effects` `^22.0.1`, `@ngrx/signals` `^22.0.1`, `@angular-architects/ngrx-toolkit` `^21.0.1` |
| Sicherheit | `angular-auth-oidc-client` `^22.0.2` |
| Web Components | `@angular/elements` `^22.2.3` |
| Unit-Tests | `vitest` `^5.0.0`, `@vitest/coverage-v8` `^5.0.5`, `jsdom` `^30.0.0` |
| E2E-Tests | `cypress` `^16.2.1` |

Die App läuft zoneless (ohne zone.js); neue Komponenten nutzen `OnPush` als Standard. `app.config.ts` stellt Router (mit `withComponentInputBinding()`) und `HttpClient` bereit.

## Skripte

| Befehl | Wirkung |
| --- | --- |
| `npm run api` | Mock-API auf `http://localhost:3000` (`api/server.mjs`, Daten in `api/db.json`, nur im Speicher) |
| `npm start` | Dev-Server auf `http://localhost:4200/` |
| `npm run build` | Produktions-Build nach `dist/project/` mit Budgets |
| `npm test` / `npm run test:run` | Vitest im Watch-Modus / einmal |
| `npx ng test --watch=false --coverage` | Tests mit Coverage-Bericht in `coverage/` |
| `npx ngc -p tsconfig.app.json --noEmit` | Typprüfung aller Dateien inklusive Templates und Starter |
| `npx cypress install`, `npm run cy:open`, `npm run e2e` | Cypress laden, öffnen, headless ausführen (Lab 10.5) |

## Adressen

| URL | Anzeige |
| --- | --- |
| `/` | Startseite mit allen Beispielen nach Tagen und Modulen (`src/app/launcher/`) |
| `/playground` | eigene Arbeit aus `src/app/playground/playground.ts` |
| `/examples/<modul>/<lab>` | fertiges Beispiel eines Labs; manche Labs haben Varianten als Unterpfad (z. B. `/examples/m05-rxjs/l02-operators/ohne`) |

## Ordnerstruktur

```text
project/
├── api/                      EventHub-Mock-API (Node.js, ohne Abhängigkeiten)
├── public/                   statische Dateien (config.json für Lab 2.2, dashboard-widgets.json und playground-dashboard.json für Lab 8.3)
├── cypress/                  E2E-Tests, Support-Befehle, Fixtures (Lab 10.5)
├── src/app/
│   ├── examples/<mNN-…>/<lNN-…>/  fertiges Beispiel je Lab, Routen je Modul in routes.ts
│   ├── starters/                  Starter je Übung (mNN-lNN-<name>.ts, ggf. gleichnamiger Ordner)
│   ├── playground/                Arbeitsbereich der Übungen
│   ├── shared/                    Modelle (models.ts) und SessionApi (api.ts)
│   └── launcher/                  Startseite und Lab-Katalog
└── workspaces/               eigene Projekte, siehe unten
```

## Lab → Beispiel → Starter

Starter mit Ordner: Die Datei kommt nach `src/app/playground/playground.ts`, der gleichnamige Ordner als Ganzes nach `src/app/playground/`.

| Lab | Beispiel (`src/app/examples/…`) | Starter (`src/app/starters/…`) |
| --- | --- | --- |
| 1.1 Kurs-Workspace und Angular 22 | [`m01-angular-recap/l01-workspace/`](src/app/examples/m01-angular-recap/l01-workspace/) | `m01-l01-workspace.ts` |
| 1.2 Recap: Komponenten, Bindings, Services, Routing | [`m01-angular-recap/l02-recap/`](src/app/examples/m01-angular-recap/l02-recap/) | `m01-l02-fix-the-eventhub`, `m01-l02-fix-the-eventhub.broken.ts` |
| 2.1 Standalone statt NgModule | [`m02-standalone/l01-standalone/`](src/app/examples/m02-standalone/l01-standalone/) | `m02-l01-standalone`, `m02-l01-standalone.ts` |
| 2.2 Bootstrapping mit app.config.ts und app.routes.ts | [`m02-standalone/l02-bootstrapping/`](src/app/examples/m02-standalone/l02-bootstrapping/) | `m02-l02-bootstrapping`, `m02-l02-bootstrapping.ts` |
| 2.3 Bestandsprojekt migrieren | [`m02-standalone/l03-migration/`](src/app/examples/m02-standalone/l03-migration/) | – (Workspace, siehe `-exc.md`) |
| 3.1 Control Flow Syntax | [`m03-component-deep-dive/l01-control-flow/`](src/app/examples/m03-component-deep-dive/l01-control-flow/) | `m03-l01-control-flow.ts` |
| 3.2 Deferred Loading | [`m03-component-deep-dive/l02-defer/`](src/app/examples/m03-component-deep-dive/l02-defer/) | `m03-l02-defer`, `m03-l02-defer.ts` |
| 3.3 Standalone Directives und Host Directives | [`m03-component-deep-dive/l03-directives/`](src/app/examples/m03-component-deep-dive/l03-directives/) | `m03-l03-directives.ts` |
| 4.1 Typed Reactive Forms | [`m04-reactive-forms/l01-typed-forms/`](src/app/examples/m04-reactive-forms/l01-typed-forms/) | `m04-l01-typed-forms.ts` |
| 4.2 Eigene Validatoren: synchron, asynchron, feldübergreifend | [`m04-reactive-forms/l02-validators/`](src/app/examples/m04-reactive-forms/l02-validators/) | `m04-l02-validators.ts` |
| 4.3 Eigenes Formular-Control mit ControlValueAccessor | [`m04-reactive-forms/l03-custom-control/`](src/app/examples/m04-reactive-forms/l03-custom-control/) | `m04-l03-custom-control.ts` |
| 5.1 Observables und Marble-Diagramme | [`m05-rxjs/l01-marbles/`](src/app/examples/m05-rxjs/l01-marbles/) | `m05-l01-marbles.ts` |
| 5.2 Higher-Order-Operatoren: Live-Suche ohne Race Conditions | [`m05-rxjs/l02-operators/`](src/app/examples/m05-rxjs/l02-operators/) | `m05-l02-operators.ts` |
| 5.3 Streams debuggen und aufräumen | [`m05-rxjs/l03-debugging/`](src/app/examples/m05-rxjs/l03-debugging/) | `m05-l03-debugging.ts` |
| 6.1 Signals API | [`m06-signals/l01-signals/`](src/app/examples/m06-signals/l01-signals/) | `m06-l01-signals.ts` |
| 6.2 Signals und Observables im Zusammenspiel | [`m06-signals/l02-interop/`](src/app/examples/m06-signals/l02-interop/) | `m06-l02-interop.ts` |
| 6.3 Komponenten-Kommunikation mit Signals | [`m06-signals/l03-communication/`](src/app/examples/m06-signals/l03-communication/) | `m06-l03-communication.ts` |
| 6.4 Signal Forms im Vergleich zu Reactive Forms | [`m06-signals/l04-signal-forms/`](src/app/examples/m06-signals/l04-signal-forms/) | `m06-l04-signal-forms.ts` |
| 7.1 Welcher State gehört wohin? | [`m07-ngrx/l01-state-decision/`](src/app/examples/m07-ngrx/l01-state-decision/) | `m07-l01-state-decision.md` |
| 7.2 NgRx Store: Actions, Reducer, Selectors | [`m07-ngrx/l02-store/`](src/app/examples/m07-ngrx/l02-store/) | `m07-l02-store`, `m07-l02-store.ts` |
| 7.3 Effects für Seiteneffekte | [`m07-ngrx/l03-effects/`](src/app/examples/m07-ngrx/l03-effects/) | `m07-l03-effects`, `m07-l03-effects.ts` |
| 7.4 NgRx Signal Store | [`m07-ngrx/l04-signal-store/`](src/app/examples/m07-ngrx/l04-signal-store/) | `m07-l04-signal-store`, `m07-l04-signal-store.ts` |
| 7.5 Events-Plugin und Entscheidung im Team | [`m07-ngrx/l05-events/`](src/app/examples/m07-ngrx/l05-events/) | `m07-l05-events`, `m07-l05-events.ts` |
| 8.1 Lazy Loading mit loadComponent und loadChildren | [`m08-advanced-routing/l01-lazy-loading/`](src/app/examples/m08-advanced-routing/l01-lazy-loading/) | `m08-l01-lazy-loading` |
| 8.2 Preloading-Strategien | [`m08-advanced-routing/l02-preloading/`](src/app/examples/m08-advanced-routing/l02-preloading/) | – (Workspace, siehe `-exc.md`) |
| 8.3 Dynamische Komponenten | [`m08-advanced-routing/l03-dynamic-components/`](src/app/examples/m08-advanced-routing/l03-dynamic-components/) | `m08-l03-dynamic-components.ts` |
| 9.1 Token-basierte Authentifizierung verstehen | [`m09-security/l01-tokens/`](src/app/examples/m09-security/l01-tokens/) | `m09-l01-tokens.ts` |
| 9.2 JWT im Angular-Client: Interceptor und Guards | [`m09-security/l02-jwt/`](src/app/examples/m09-security/l02-jwt/) | `m09-l02-jwt` |
| 9.3 OAuth 2.0 und OpenID Connect | [`m09-security/l03-oidc/`](src/app/examples/m09-security/l03-oidc/) | `m09-l03-oidc` |
| 10.1 Teststrategie und Vitest | [`m10-testing/l01-strategy/`](src/app/examples/m10-testing/l01-strategy/) | `m10-l01-strategy` |
| 10.2 Komponenten- und Service-Tests | [`m10-testing/l02-component-tests/`](src/app/examples/m10-testing/l02-component-tests/) | `m10-l02-component-tests` |
| 10.3 Marble-Testing für RxJS-Streams | [`m10-testing/l03-marble-testing/`](src/app/examples/m10-testing/l03-marble-testing/) | `m10-l03-marble-testing` |
| 10.4 Stores testen | [`m10-testing/l04-store-tests/`](src/app/examples/m10-testing/l04-store-tests/) | `m10-l04-store-tests` |
| 10.5 End-to-End-Tests mit Cypress | [`m10-testing/l05-cypress/`](src/app/examples/m10-testing/l05-cypress/) | `cypress/starters/m10-l05-flow.cy.ts` (außerhalb von `src/`) |
| 11.1 Nx Workspace | [`m11-libraries/l01-nx/`](src/app/examples/m11-libraries/l01-nx/) | – (Workspace, siehe `-exc.md`) |
| 11.2 Angular Library bauen und veröffentlichen | [`m11-libraries/l02-library/`](src/app/examples/m11-libraries/l02-library/) | – (Workspace, siehe `-exc.md`) |
| 11.3 Angular Elements | [`m11-libraries/l03-elements/`](src/app/examples/m11-libraries/l03-elements/) | – (Workspace, siehe `-exc.md`) |
| 12.1 Micro-Frontend-Architektur | [`m12-microfrontends-pwa/l01-mfe-architecture/`](src/app/examples/m12-microfrontends-pwa/l01-mfe-architecture/) | – (Workspace, siehe `-exc.md`) |
| 12.2 Micro-Frontend mit Native Federation | [`m12-microfrontends-pwa/l02-native-federation/`](src/app/examples/m12-microfrontends-pwa/l02-native-federation/) | – (Workspace, siehe `-exc.md`) |
| 12.3 Progressive Web App | [`m12-microfrontends-pwa/l03-pwa/`](src/app/examples/m12-microfrontends-pwa/l03-pwa/) | – (Workspace, siehe `-exc.md`) |
| 13.1 Performance messen mit Lighthouse und DevTools | Infoseite in `m13-performance-docker/routes.ts` | – (Workspace, siehe `-exc.md`) |
| 13.2 Optimieren und nachmessen | Infoseite in `m13-performance-docker/routes.ts` | – (Workspace, siehe `-exc.md`) |
| 13.3 Containerisierung mit Docker | Infoseite in `m13-performance-docker/routes.ts` | – (Workspace, siehe `-exc.md`) |
| 14.1 CI-Pipeline für Angular | Infoseite in `m14-ci-transfer/routes.ts` | – (Workspace, siehe `-exc.md`) |
| 14.2 Architektur-Review: Bestands-App modernisieren | Infoseite in `m14-ci-transfer/routes.ts` | – (Workspace, siehe `-exc.md`) |

## Workspaces

Eigene Projekte unter `workspaces/`, jeweils mit eigenem `package.json` (außer `eventhub-lab`, das die Pakete der Kurs-App nutzt) und eigener Startanleitung im `-exc.md` bzw. README. `node_modules` und Build-Ausgaben sind per `.gitignore` ausgeschlossen; vor der ersten Nutzung im jeweiligen Ordner `npm install` (bzw. `npm ci`) ausführen.

| Workspace | Lab | Inhalt | Port |
| --- | --- | --- | --- |
| [`legacy-ngmodule/`](workspaces/legacy-ngmodule/README.md) | 2.3 | EventHub im Stil Angular 15 (NgModules, zone.js, `*ngIf`) zum Migrieren | 4300 |
| `eventhub-lab/` | 8.1, 8.2, 9.2, 9.3 | Mini-App mit eigener `app.config.ts` für Lazy Loading, Preloading, Login und OIDC; nutzt `node_modules` der Kurs-App | 4201 |
| `keycloak/` | 9.3 | `docker-compose.yml` und Realm `eventhub` (Client `eventhub-spa`, PKCE) | 8080 |
| [`nx-eventhub/`](workspaces/nx-eventhub/README.md) | 11.1 | Nx-Workspace mit App `eventhub` (Startzustand) | 4210 |
| [`eventhub-ui-lib/`](workspaces/eventhub-ui-lib/README.md) | 11.2 | Angular Library `eventhub-ui` | – |
| [`eventhub-ui-consumer/`](workspaces/eventhub-ui-consumer/README.md) | 11.2 | App, die das gepackte Paket installiert (Startzustand) | 4220 |
| [`eventhub-elements/`](workspaces/eventhub-elements/README.md) | 11.3 | Angular Element `<eventhub-signup>` mit statischer Demo-Seite | 4230 |
| [`federation-host/`](workspaces/federation-host/README.md), [`federation-admin/`](workspaces/federation-admin/README.md) | 12.2 | Native Federation: Host und Remote | 4200, 4201 |
| [`eventhub-pwa/`](workspaces/eventhub-pwa/README.md), [`eventhub-pwa-final/`](workspaces/eventhub-pwa-final/README.md) | 12.3 | PWA: Startzustand und fertiger Zustand | 4240, 8080 |
| `eventhub-perf/`, `eventhub-perf-fixed/` | 13.1, 13.2 | langsame Variante mit drei Befunden und optimierte Variante | 4300/4301 (`ng serve`), 8081/8082 (Produktions-Build) |
| [`docker/`](workspaces/docker/README.md) | 13.3 | Dockerfile-Varianten, nginx-Konfiguration, Laufzeit-Konfiguration | 8080 |
| `ci/` | 14.1 | GitHub-Actions-Workflow (vollständig) und Starter | – |

Vor dem Start eines Workspaces auf Port 4200 oder 4201 die Kurs-App bzw. `eventhub-lab` beenden.
