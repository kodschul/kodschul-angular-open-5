# Mastering Angular: Kurs-Repo

Handouts und lauffähiger Code zum Aufbaukurs „Mastering Angular: Advanced Skills for Professional Development“ (4 Tage, auf 5 Tage dehnbar). Alle Beispiele spielen in der fiktiven Konferenz-Plattform **EventHub**; jedes Thema beginnt bei der klassischen Lösung aus Bestandsprojekten und führt dann den heutigen Weg ein.

Stand: Angular 22.2, TypeScript 6, RxJS 7.8, NgRx 22, Vitest 5, Cypress 16 (28.10.2026).

## Setup in 3 Befehlen

Voraussetzung: Node.js 22.22.3+ oder 24.15+. Details, Fallbacks und häufige Probleme: [`00-setup-and-installation.md`](00-setup-and-installation.md).

```bash
cd project
npm install
npm run api   # Terminal 1: Mock-API auf Port 3000
npm start     # Terminal 2: App auf http://localhost:4200/
```

## Arbeiten mit dem Repo

| Was | Wo |
| --- | --- |
| Playground (Arbeitsbereich der Übungen) | [`project/src/app/playground/playground.ts`](project/src/app/playground/playground.ts), Anzeige unter `/playground` |
| Starter der Übungen | [`project/src/app/starters/`](project/src/app/starters/); das `-exc.md` nennt Datei und ggf. gleichnamigen Ordner |
| Fertige Beispiele (Lösungen) | [`project/src/app/examples/`](project/src/app/examples/), Anzeige unter `/examples/<modul>/<lab>` |
| Mock-API | [`project/api/`](project/api/server.mjs), Endpunkte und Schalter in [`00-setup-and-installation.md`](00-setup-and-installation.md#mock-api-endpunkte-und-schalter) |
| Eigene Projekte (Migration, Nx, Libraries, Micro-Frontends, PWA, Performance, Docker, CI) | [`project/workspaces/`](project/README.md#workspaces) |
| Optionale Auffrischung der Grundlagen | [`00-prework.md`](00-prework.md) |
| Überblick, Themen, Glossar, Best Practices, FAQ | [`m00-overview/`](m00-overview/overview.md) |
| Transferprojekt „EventHub Release“ (5-Tage-Variante) | [`m14-exc.md`](m14-ci-transfer/m14-exc.md), Lösung [`m14-sol.md`](m14-ci-transfer/m14-sol.md) |

Pro Lab: **Theorie** (`-thx.md`) mit Leitfragen, **Übung** (`-exc.md`) mit Starter und Checkpoints, **Lösung** (`-sol.md`) mit Verweis auf das Beispiel. Pro Modul ein Cheatsheet.

## Karte: Modul → Handout → Beispiel

### Modul 1: Recap Angular-Grundlagen (Tag 1)

Cheatsheet: [`angular-recap-cheatsheet.md`](m01-angular-recap/angular-recap-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 1.1 Kurs-Workspace und Angular 22 | [thx](m01-angular-recap/l01-workspace/l01-workspace-thx.md) | [exc](m01-angular-recap/l01-workspace/l01-workspace-exc.md) | [sol](m01-angular-recap/l01-workspace/l01-workspace-sol.md) | [`/examples/m01-angular-recap/l01-workspace`](project/src/app/examples/m01-angular-recap/l01-workspace/) |
| 1.2 Recap: Komponenten, Bindings, Services, Routing | [thx](m01-angular-recap/l02-recap/l02-recap-thx.md) | [exc](m01-angular-recap/l02-recap/l02-recap-exc.md) | [sol](m01-angular-recap/l02-recap/l02-recap-sol.md) | [`/examples/m01-angular-recap/l02-recap`](project/src/app/examples/m01-angular-recap/l02-recap/) |

### Modul 2: Standalone-Komponenten (Tag 1)

Cheatsheet: [`standalone-cheatsheet.md`](m02-standalone/standalone-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 2.1 Standalone statt NgModule | [thx](m02-standalone/l01-standalone/l01-standalone-thx.md) | [exc](m02-standalone/l01-standalone/l01-standalone-exc.md) | [sol](m02-standalone/l01-standalone/l01-standalone-sol.md) | [`/examples/m02-standalone/l01-standalone`](project/src/app/examples/m02-standalone/l01-standalone/) |
| 2.2 Bootstrapping mit app.config.ts und app.routes.ts | [thx](m02-standalone/l02-bootstrapping/l02-bootstrapping-thx.md) | [exc](m02-standalone/l02-bootstrapping/l02-bootstrapping-exc.md) | [sol](m02-standalone/l02-bootstrapping/l02-bootstrapping-sol.md) | [`/examples/m02-standalone/l02-bootstrapping`](project/src/app/examples/m02-standalone/l02-bootstrapping/) |
| 2.3 Bestandsprojekt migrieren | [thx](m02-standalone/l03-migration/l03-migration-thx.md) | [exc](m02-standalone/l03-migration/l03-migration-exc.md) | [sol](m02-standalone/l03-migration/l03-migration-sol.md) | [`/examples/m02-standalone/l03-migration`](project/src/app/examples/m02-standalone/l03-migration/) |

### Modul 3: Komponenten Deep Dive (Tag 1)

Cheatsheet: [`component-deep-dive-cheatsheet.md`](m03-component-deep-dive/component-deep-dive-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 3.1 Control Flow Syntax | [thx](m03-component-deep-dive/l01-control-flow/l01-control-flow-thx.md) | [exc](m03-component-deep-dive/l01-control-flow/l01-control-flow-exc.md) | [sol](m03-component-deep-dive/l01-control-flow/l01-control-flow-sol.md) | [`/examples/m03-component-deep-dive/l01-control-flow`](project/src/app/examples/m03-component-deep-dive/l01-control-flow/) |
| 3.2 Deferred Loading | [thx](m03-component-deep-dive/l02-defer/l02-defer-thx.md) | [exc](m03-component-deep-dive/l02-defer/l02-defer-exc.md) | [sol](m03-component-deep-dive/l02-defer/l02-defer-sol.md) | [`/examples/m03-component-deep-dive/l02-defer`](project/src/app/examples/m03-component-deep-dive/l02-defer/) |
| 3.3 Standalone Directives und Host Directives | [thx](m03-component-deep-dive/l03-directives/l03-directives-thx.md) | [exc](m03-component-deep-dive/l03-directives/l03-directives-exc.md) | [sol](m03-component-deep-dive/l03-directives/l03-directives-sol.md) | [`/examples/m03-component-deep-dive/l03-directives`](project/src/app/examples/m03-component-deep-dive/l03-directives/) |

### Modul 4: Reactive Forms Deep Dive (Tag 1)

Cheatsheet: [`reactive-forms-cheatsheet.md`](m04-reactive-forms/reactive-forms-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 4.1 Typed Reactive Forms | [thx](m04-reactive-forms/l01-typed-forms/l01-typed-forms-thx.md) | [exc](m04-reactive-forms/l01-typed-forms/l01-typed-forms-exc.md) | [sol](m04-reactive-forms/l01-typed-forms/l01-typed-forms-sol.md) | [`/examples/m04-reactive-forms/l01-typed-forms`](project/src/app/examples/m04-reactive-forms/l01-typed-forms/) |
| 4.2 Eigene Validatoren: synchron, asynchron, feldübergreifend | [thx](m04-reactive-forms/l02-validators/l02-validators-thx.md) | [exc](m04-reactive-forms/l02-validators/l02-validators-exc.md) | [sol](m04-reactive-forms/l02-validators/l02-validators-sol.md) | [`/examples/m04-reactive-forms/l02-validators`](project/src/app/examples/m04-reactive-forms/l02-validators/) |
| 4.3 Eigenes Formular-Control mit ControlValueAccessor | [thx](m04-reactive-forms/l03-custom-control/l03-custom-control-thx.md) | [exc](m04-reactive-forms/l03-custom-control/l03-custom-control-exc.md) | [sol](m04-reactive-forms/l03-custom-control/l03-custom-control-sol.md) | [`/examples/m04-reactive-forms/l03-custom-control`](project/src/app/examples/m04-reactive-forms/l03-custom-control/) |

### Modul 5: Reaktive Programmierung mit RxJS (Tag 2)

Cheatsheet: [`rxjs-cheatsheet.md`](m05-rxjs/rxjs-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 5.1 Observables und Marble-Diagramme | [thx](m05-rxjs/l01-marbles/l01-marbles-thx.md) | [exc](m05-rxjs/l01-marbles/l01-marbles-exc.md) | [sol](m05-rxjs/l01-marbles/l01-marbles-sol.md) | [`/examples/m05-rxjs/l01-marbles`](project/src/app/examples/m05-rxjs/l01-marbles/) |
| 5.2 Higher-Order-Operatoren: Live-Suche ohne Race Conditions | [thx](m05-rxjs/l02-operators/l02-operators-thx.md) | [exc](m05-rxjs/l02-operators/l02-operators-exc.md) | [sol](m05-rxjs/l02-operators/l02-operators-sol.md) | [`/examples/m05-rxjs/l02-operators`](project/src/app/examples/m05-rxjs/l02-operators/) |
| 5.3 Streams debuggen und aufräumen | [thx](m05-rxjs/l03-debugging/l03-debugging-thx.md) | [exc](m05-rxjs/l03-debugging/l03-debugging-exc.md) | [sol](m05-rxjs/l03-debugging/l03-debugging-sol.md) | [`/examples/m05-rxjs/l03-debugging`](project/src/app/examples/m05-rxjs/l03-debugging/) |

### Modul 6: Reaktivität mit Signals (Tag 2)

Cheatsheet: [`signals-cheatsheet.md`](m06-signals/signals-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 6.1 Signals API | [thx](m06-signals/l01-signals/l01-signals-thx.md) | [exc](m06-signals/l01-signals/l01-signals-exc.md) | [sol](m06-signals/l01-signals/l01-signals-sol.md) | [`/examples/m06-signals/l01-signals`](project/src/app/examples/m06-signals/l01-signals/) |
| 6.2 Signals und Observables im Zusammenspiel | [thx](m06-signals/l02-interop/l02-interop-thx.md) | [exc](m06-signals/l02-interop/l02-interop-exc.md) | [sol](m06-signals/l02-interop/l02-interop-sol.md) | [`/examples/m06-signals/l02-interop`](project/src/app/examples/m06-signals/l02-interop/) |
| 6.3 Komponenten-Kommunikation mit Signals | [thx](m06-signals/l03-communication/l03-communication-thx.md) | [exc](m06-signals/l03-communication/l03-communication-exc.md) | [sol](m06-signals/l03-communication/l03-communication-sol.md) | [`/examples/m06-signals/l03-communication`](project/src/app/examples/m06-signals/l03-communication/) |
| 6.4 Signal Forms im Vergleich zu Reactive Forms | [thx](m06-signals/l04-signal-forms/l04-signal-forms-thx.md) | [exc](m06-signals/l04-signal-forms/l04-signal-forms-exc.md) | [sol](m06-signals/l04-signal-forms/l04-signal-forms-sol.md) | [`/examples/m06-signals/l04-signal-forms`](project/src/app/examples/m06-signals/l04-signal-forms/) |

### Modul 7: State Management mit NgRx (Tag 2)

Cheatsheet: [`ngrx-cheatsheet.md`](m07-ngrx/ngrx-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 7.1 Welcher State gehört wohin? | [thx](m07-ngrx/l01-state-decision/l01-state-decision-thx.md) | [exc](m07-ngrx/l01-state-decision/l01-state-decision-exc.md) | [sol](m07-ngrx/l01-state-decision/l01-state-decision-sol.md) | [`/examples/m07-ngrx/l01-state-decision`](project/src/app/examples/m07-ngrx/l01-state-decision/) |
| 7.2 NgRx Store: Actions, Reducer, Selectors | [thx](m07-ngrx/l02-store/l02-store-thx.md) | [exc](m07-ngrx/l02-store/l02-store-exc.md) | [sol](m07-ngrx/l02-store/l02-store-sol.md) | [`/examples/m07-ngrx/l02-store`](project/src/app/examples/m07-ngrx/l02-store/) |
| 7.3 Effects für Seiteneffekte | [thx](m07-ngrx/l03-effects/l03-effects-thx.md) | [exc](m07-ngrx/l03-effects/l03-effects-exc.md) | [sol](m07-ngrx/l03-effects/l03-effects-sol.md) | [`/examples/m07-ngrx/l03-effects`](project/src/app/examples/m07-ngrx/l03-effects/) |
| 7.4 NgRx Signal Store | [thx](m07-ngrx/l04-signal-store/l04-signal-store-thx.md) | [exc](m07-ngrx/l04-signal-store/l04-signal-store-exc.md) | [sol](m07-ngrx/l04-signal-store/l04-signal-store-sol.md) | [`/examples/m07-ngrx/l04-signal-store`](project/src/app/examples/m07-ngrx/l04-signal-store/) |
| 7.5 Events-Plugin und Entscheidung im Team | [thx](m07-ngrx/l05-events/l05-events-thx.md) | [exc](m07-ngrx/l05-events/l05-events-exc.md) | [sol](m07-ngrx/l05-events/l05-events-sol.md) | [`/examples/m07-ngrx/l05-events`](project/src/app/examples/m07-ngrx/l05-events/) |

### Modul 8: Fortgeschrittenes Routing (Tag 3)

Cheatsheet: [`advanced-routing-cheatsheet.md`](m08-advanced-routing/advanced-routing-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 8.1 Lazy Loading mit loadComponent und loadChildren | [thx](m08-advanced-routing/l01-lazy-loading/l01-lazy-loading-thx.md) | [exc](m08-advanced-routing/l01-lazy-loading/l01-lazy-loading-exc.md) | [sol](m08-advanced-routing/l01-lazy-loading/l01-lazy-loading-sol.md) | [`/examples/m08-advanced-routing/l01-lazy-loading`](project/src/app/examples/m08-advanced-routing/l01-lazy-loading/) |
| 8.2 Preloading-Strategien | [thx](m08-advanced-routing/l02-preloading/l02-preloading-thx.md) | [exc](m08-advanced-routing/l02-preloading/l02-preloading-exc.md) | [sol](m08-advanced-routing/l02-preloading/l02-preloading-sol.md) | [`/examples/m08-advanced-routing/l02-preloading`](project/src/app/examples/m08-advanced-routing/l02-preloading/) |
| 8.3 Dynamische Komponenten | [thx](m08-advanced-routing/l03-dynamic-components/l03-dynamic-components-thx.md) | [exc](m08-advanced-routing/l03-dynamic-components/l03-dynamic-components-exc.md) | [sol](m08-advanced-routing/l03-dynamic-components/l03-dynamic-components-sol.md) | [`/examples/m08-advanced-routing/l03-dynamic-components`](project/src/app/examples/m08-advanced-routing/l03-dynamic-components/) |

### Modul 9: Absicherung von Angular-Anwendungen (Tag 3)

Cheatsheet: [`security-cheatsheet.md`](m09-security/security-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 9.1 Token-basierte Authentifizierung verstehen | [thx](m09-security/l01-tokens/l01-tokens-thx.md) | [exc](m09-security/l01-tokens/l01-tokens-exc.md) | [sol](m09-security/l01-tokens/l01-tokens-sol.md) | [`/examples/m09-security/l01-tokens`](project/src/app/examples/m09-security/l01-tokens/) |
| 9.2 JWT im Angular-Client: Interceptor und Guards | [thx](m09-security/l02-jwt/l02-jwt-thx.md) | [exc](m09-security/l02-jwt/l02-jwt-exc.md) | [sol](m09-security/l02-jwt/l02-jwt-sol.md) | [`/examples/m09-security/l02-jwt`](project/src/app/examples/m09-security/l02-jwt/) |
| 9.3 OAuth 2.0 und OpenID Connect | [thx](m09-security/l03-oidc/l03-oidc-thx.md) | [exc](m09-security/l03-oidc/l03-oidc-exc.md) | [sol](m09-security/l03-oidc/l03-oidc-sol.md) | [`/examples/m09-security/l03-oidc`](project/src/app/examples/m09-security/l03-oidc/) |

### Modul 10: Fortgeschrittenes Testing (Tag 3)

Cheatsheet: [`testing-cheatsheet.md`](m10-testing/testing-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 10.1 Teststrategie und Vitest | [thx](m10-testing/l01-strategy/l01-strategy-thx.md) | [exc](m10-testing/l01-strategy/l01-strategy-exc.md) | [sol](m10-testing/l01-strategy/l01-strategy-sol.md) | [`/examples/m10-testing/l01-strategy`](project/src/app/examples/m10-testing/l01-strategy/) |
| 10.2 Komponenten- und Service-Tests | [thx](m10-testing/l02-component-tests/l02-component-tests-thx.md) | [exc](m10-testing/l02-component-tests/l02-component-tests-exc.md) | [sol](m10-testing/l02-component-tests/l02-component-tests-sol.md) | [`/examples/m10-testing/l02-component-tests`](project/src/app/examples/m10-testing/l02-component-tests/) |
| 10.3 Marble-Testing für RxJS-Streams | [thx](m10-testing/l03-marble-testing/l03-marble-testing-thx.md) | [exc](m10-testing/l03-marble-testing/l03-marble-testing-exc.md) | [sol](m10-testing/l03-marble-testing/l03-marble-testing-sol.md) | [`/examples/m10-testing/l03-marble-testing`](project/src/app/examples/m10-testing/l03-marble-testing/) |
| 10.4 Stores testen | [thx](m10-testing/l04-store-tests/l04-store-tests-thx.md) | [exc](m10-testing/l04-store-tests/l04-store-tests-exc.md) | [sol](m10-testing/l04-store-tests/l04-store-tests-sol.md) | [`/examples/m10-testing/l04-store-tests`](project/src/app/examples/m10-testing/l04-store-tests/) |
| 10.5 End-to-End-Tests mit Cypress | [thx](m10-testing/l05-cypress/l05-cypress-thx.md) | [exc](m10-testing/l05-cypress/l05-cypress-exc.md) | [sol](m10-testing/l05-cypress/l05-cypress-sol.md) | [`/examples/m10-testing/l05-cypress`](project/src/app/examples/m10-testing/l05-cypress/) |

### Modul 11: Wiederverwendbarkeit mit Libraries und Angular Elements (Tag 4)

Cheatsheet: [`libraries-cheatsheet.md`](m11-libraries/libraries-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 11.1 Nx Workspace | [thx](m11-libraries/l01-nx/l01-nx-thx.md) | [exc](m11-libraries/l01-nx/l01-nx-exc.md) | [sol](m11-libraries/l01-nx/l01-nx-sol.md) | [`/examples/m11-libraries/l01-nx`](project/src/app/examples/m11-libraries/l01-nx/) |
| 11.2 Angular Library bauen und veröffentlichen | [thx](m11-libraries/l02-library/l02-library-thx.md) | [exc](m11-libraries/l02-library/l02-library-exc.md) | [sol](m11-libraries/l02-library/l02-library-sol.md) | [`/examples/m11-libraries/l02-library`](project/src/app/examples/m11-libraries/l02-library/) |
| 11.3 Angular Elements | [thx](m11-libraries/l03-elements/l03-elements-thx.md) | [exc](m11-libraries/l03-elements/l03-elements-exc.md) | [sol](m11-libraries/l03-elements/l03-elements-sol.md) | [`/examples/m11-libraries/l03-elements`](project/src/app/examples/m11-libraries/l03-elements/) |

### Modul 12: Micro-Frontends und Progressive Web Apps (Tag 4)

Cheatsheet: [`microfrontends-pwa-cheatsheet.md`](m12-microfrontends-pwa/microfrontends-pwa-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 12.1 Micro-Frontend-Architektur | [thx](m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-thx.md) | [exc](m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-exc.md) | [sol](m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-sol.md) | [`/examples/m12-microfrontends-pwa/l01-mfe-architecture`](project/src/app/examples/m12-microfrontends-pwa/l01-mfe-architecture/) |
| 12.2 Micro-Frontend mit Native Federation | [thx](m12-microfrontends-pwa/l02-native-federation/l02-native-federation-thx.md) | [exc](m12-microfrontends-pwa/l02-native-federation/l02-native-federation-exc.md) | [sol](m12-microfrontends-pwa/l02-native-federation/l02-native-federation-sol.md) | [`/examples/m12-microfrontends-pwa/l02-native-federation`](project/src/app/examples/m12-microfrontends-pwa/l02-native-federation/) |
| 12.3 Progressive Web App | [thx](m12-microfrontends-pwa/l03-pwa/l03-pwa-thx.md) | [exc](m12-microfrontends-pwa/l03-pwa/l03-pwa-exc.md) | [sol](m12-microfrontends-pwa/l03-pwa/l03-pwa-sol.md) | [`/examples/m12-microfrontends-pwa/l03-pwa`](project/src/app/examples/m12-microfrontends-pwa/l03-pwa/) |

### Modul 13: Performance und Containerisierung (Tag 4)

Cheatsheet: [`performance-docker-cheatsheet.md`](m13-performance-docker/performance-docker-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 13.1 Performance messen mit Lighthouse und DevTools | [thx](m13-performance-docker/l01-measure/l01-measure-thx.md) | [exc](m13-performance-docker/l01-measure/l01-measure-exc.md) | [sol](m13-performance-docker/l01-measure/l01-measure-sol.md) | `/examples/m13-performance-docker/l01-measure` (Infoseite) |
| 13.2 Optimieren und nachmessen | [thx](m13-performance-docker/l02-optimize/l02-optimize-thx.md) | [exc](m13-performance-docker/l02-optimize/l02-optimize-exc.md) | [sol](m13-performance-docker/l02-optimize/l02-optimize-sol.md) | `/examples/m13-performance-docker/l02-optimize` (Infoseite) |
| 13.3 Containerisierung mit Docker | [thx](m13-performance-docker/l03-docker/l03-docker-thx.md) | [exc](m13-performance-docker/l03-docker/l03-docker-exc.md) | [sol](m13-performance-docker/l03-docker/l03-docker-sol.md) | `/examples/m13-performance-docker/l03-docker` (Infoseite) |

### Modul 14: Continuous Integration und Transfer (Tag 4)

Cheatsheet: [`ci-transfer-cheatsheet.md`](m14-ci-transfer/ci-transfer-cheatsheet.md)

| Lab | Theorie | Übung | Lösung | Beispiel |
| --- | --- | --- | --- | --- |
| 14.1 CI-Pipeline für Angular | [thx](m14-ci-transfer/l01-ci/l01-ci-thx.md) | [exc](m14-ci-transfer/l01-ci/l01-ci-exc.md) | [sol](m14-ci-transfer/l01-ci/l01-ci-sol.md) | `/examples/m14-ci-transfer/l01-ci` (Infoseite) |
| 14.2 Architektur-Review: Bestands-App modernisieren | [thx](m14-ci-transfer/l02-architecture-review/l02-architecture-review-thx.md) | [exc](m14-ci-transfer/l02-architecture-review/l02-architecture-review-exc.md) | [sol](m14-ci-transfer/l02-architecture-review/l02-architecture-review-sol.md) | `/examples/m14-ci-transfer/l02-architecture-review` (Infoseite) |
