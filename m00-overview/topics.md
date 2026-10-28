# Themen

Alle Module mit Labs und Kernthemen. Details und Zeiten: [`overview.md`](overview.md).

| Modul | Titel | Tag | Labs | Kernthemen |
| --- | --- | --- | --- | --- |
| [m01](../m01-angular-recap/) | Recap Angular-Grundlagen | 1 | 1.1 Kurs-Workspace und Angular 22 · 1.2 Recap | `ng new` in v22, zoneless, Bindungen, `@Input`/`@Output`, `inject()`, `HttpClient`, `async`-Pipe, Routing |
| [m02](../m02-standalone/) | Standalone-Komponenten | 1 | 2.1 Standalone statt NgModule · 2.2 Bootstrapping · 2.3 Bestandsprojekt migrieren | `imports`, `bootstrapApplication`, `ApplicationConfig`, `provideAppInitializer`, Migrations-Schematic |
| [m03](../m03-component-deep-dive/) | Komponenten Deep Dive | 1 | 3.1 Control Flow · 3.2 Deferred Loading · 3.3 Standalone und Host Directives | `@if`, `@for` mit `track`, `@switch`, `@let`, `@defer` mit Triggern, `host`, `hostDirectives` |
| [m04](../m04-reactive-forms/) | Reactive Forms Deep Dive | 1 | 4.1 Typed Reactive Forms · 4.2 Eigene Validatoren · 4.3 Eigenes Formular-Control | `nonNullable`, `FormArray`, sync/async/Gruppen-Validatoren, `ControlValueAccessor` |
| [m05](../m05-rxjs/) | Reaktive Programmierung mit RxJS | 2 | 5.1 Observables und Marble-Diagramme · 5.2 Higher-Order-Operatoren · 5.3 Streams debuggen | Cold/Hot, Marble-Notation, `switchMap`/`mergeMap`/`concatMap`/`exhaustMap`, Race Conditions, `takeUntilDestroyed` |
| [m06](../m06-signals/) | Reaktivität mit Signals | 2 | 6.1 Signals API · 6.2 Signals und Observables · 6.3 Komponenten-Kommunikation · 6.4 Signal Forms | `signal`, `computed`, `effect`, `linkedSignal`, `toSignal`, `httpResource`, `input()`, `model()`, `form()` |
| [m07](../m07-ngrx/) | State Management mit NgRx | 2 | 7.1 Welcher State gehört wohin? · 7.2 NgRx Store · 7.3 Effects · 7.4 Signal Store · 7.5 Events-Plugin | Actions, Reducer, `createFeature`, Effects, `signalStore`, `rxMethod`, `withEntities`, Events |
| [m08](../m08-advanced-routing/) | Fortgeschrittenes Routing | 3 | 8.1 Lazy Loading · 8.2 Preloading-Strategien · 8.3 Dynamische Komponenten | `loadComponent`, `loadChildren`, Chunks, `PreloadingStrategy`, `NgComponentOutlet`, `createComponent` |
| [m09](../m09-security/) | Absicherung von Angular-Anwendungen | 3 | 9.1 Token-basierte Authentifizierung · 9.2 JWT im Client · 9.3 OAuth 2.0 und OIDC | JWT-Aufbau, Speicherorte, XSS/CSRF, `HttpInterceptorFn`, `CanMatchFn`, Authorization Code Flow mit PKCE, Keycloak |
| [m10](../m10-testing/) | Fortgeschrittenes Testing | 3 | 10.1 Teststrategie und Vitest · 10.2 Komponenten- und Service-Tests · 10.3 Marble-Testing · 10.4 Stores testen · 10.5 E2E mit Cypress | Testpyramide, Vitest vs. Jasmine, `TestBed`, `HttpTestingController`, `TestScheduler`, `provideMockStore`, `cy.intercept` |
| [m11](../m11-libraries/) | Libraries und Angular Elements | 4 | 11.1 Nx Workspace · 11.2 Angular Library · 11.3 Angular Elements | Monorepo, Projektgraph, `affected`, `ng-packagr`, `public-api.ts`, `peerDependencies`, `createCustomElement` |
| [m12](../m12-microfrontends-pwa/) | Micro-Frontends und Progressive Web Apps | 4 | 12.1 Micro-Frontend-Architektur · 12.2 Native Federation · 12.3 Progressive Web App | Entscheidungskriterien, Host/Remote, `loadRemoteModule`, Service Worker, `ngsw-config.json`, `SwUpdate` |
| [m13](../m13-performance-docker/) | Performance und Containerisierung | 4 | 13.1 Performance messen · 13.2 Optimieren · 13.3 Docker | Core Web Vitals, Lighthouse, Profiler, Budgets, `NgOptimizedImage`, Multi-Stage-Dockerfile, nginx-SPA-Fallback |
| [m14](../m14-ci-transfer/) | Continuous Integration und Transfer | 4 | 14.1 CI-Pipeline · 14.2 Architektur-Review | GitHub Actions, Stufen Lint/Test/E2E/Build/Image, Modernisierungsplan |

## Roter Faden

1. **Tag 1:** Bausteine modernisieren (Standalone, Templates, Formulare).
2. **Tag 2:** Daten fließen lassen (RxJS, Signals, State).
3. **Tag 3:** schneller, sicher, getestet (Routing, Security, Tests).
4. **Tag 4:** wiederverwenden und ausliefern (Libraries, Micro-Frontends, PWA, Performance, Container, CI).

Transferprojekt „EventHub Release“ für die 5-Tage-Variante: [`m14-exc.md`](../m14-ci-transfer/m14-exc.md).
