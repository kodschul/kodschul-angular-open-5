// Katalog aller Module und Labs laut agenda.md; die Startseite baut daraus ihre Links.
export interface LabEntry {
  /** Lab-Nummer, z. B. "3.1" */
  n: string;
  title: string;
  /** Ordnername, z. B. "l01-control-flow" */
  code: string;
  /** Zusätzliche Varianten des Beispiels als Unterpfad, z. B. das Fehlerbild "ohne". */
  variants?: { path: string; label: string }[];
}

export interface ModuleEntry {
  n: number;
  day: number;
  title: string;
  /** Ordnername, z. B. "m03-component-deep-dive" */
  code: string;
  labs: LabEntry[];
}

export const CATALOG: ModuleEntry[] = [
  {
    n: 1,
    day: 1,
    title: "Recap Angular-Grundlagen",
    code: 'm01-angular-recap',
    labs: [
      { n: '1.1', title: "Kurs-Workspace und Angular 22", code: 'l01-workspace' },
      { n: '1.2', title: "Recap: Komponenten, Bindings, Services, Routing", code: 'l02-recap' },
    ],
  },
  {
    n: 2,
    day: 1,
    title: "Standalone-Komponenten",
    code: 'm02-standalone',
    labs: [
      { n: '2.1', title: "Standalone statt NgModule", code: 'l01-standalone' },
      { n: '2.2', title: "Bootstrapping mit app.config.ts und app.routes.ts", code: 'l02-bootstrapping' },
      { n: '2.3', title: "Bestandsprojekt migrieren", code: 'l03-migration' },
    ],
  },
  {
    n: 3,
    day: 1,
    title: "Komponenten Deep Dive",
    code: 'm03-component-deep-dive',
    labs: [
      { n: '3.1', title: "Control Flow Syntax", code: 'l01-control-flow' },
      { n: '3.2', title: "Deferred Loading", code: 'l02-defer' },
      { n: '3.3', title: "Standalone Directives und Host Directives", code: 'l03-directives' },
    ],
  },
  {
    n: 4,
    day: 1,
    title: "Reactive Forms Deep Dive",
    code: 'm04-reactive-forms',
    labs: [
      { n: '4.1', title: "Typed Reactive Forms", code: 'l01-typed-forms' },
      { n: '4.2', title: "Eigene Validatoren: synchron, asynchron, feldübergreifend", code: 'l02-validators' },
      { n: '4.3', title: "Eigenes Formular-Control mit ControlValueAccessor", code: 'l03-custom-control' },
    ],
  },
  {
    n: 5,
    day: 2,
    title: "Reaktive Programmierung mit RxJS",
    code: 'm05-rxjs',
    labs: [
      { n: '5.1', title: "Observables und Marble-Diagramme", code: 'l01-marbles' },
      { n: '5.2', title: "Higher-Order-Operatoren: Live-Suche ohne Race Conditions", code: 'l02-operators', variants: [{ path: 'ohne', label: 'Variante ohne switchMap (Race Condition)' }] },
      { n: '5.3', title: "Streams debuggen und aufräumen", code: 'l03-debugging' },
    ],
  },
  {
    n: 6,
    day: 2,
    title: "Reaktivität mit Signals",
    code: 'm06-signals',
    labs: [
      { n: '6.1', title: "Signals API", code: 'l01-signals' },
      { n: '6.2', title: "Signals und Observables im Zusammenspiel", code: 'l02-interop' },
      { n: '6.3', title: "Komponenten-Kommunikation mit Signals", code: 'l03-communication' },
      { n: '6.4', title: "Signal Forms im Vergleich zu Reactive Forms", code: 'l04-signal-forms' },
    ],
  },
  {
    n: 7,
    day: 2,
    title: "State Management mit NgRx",
    code: 'm07-ngrx',
    labs: [
      { n: '7.1', title: "Welcher State gehört wohin?", code: 'l01-state-decision' },
      { n: '7.2', title: "NgRx Store: Actions, Reducer, Selectors", code: 'l02-store' },
      { n: '7.3', title: "Effects für Seiteneffekte", code: 'l03-effects' },
      { n: '7.4', title: "NgRx Signal Store", code: 'l04-signal-store' },
      { n: '7.5', title: "Events-Plugin und Entscheidung im Team", code: 'l05-events' },
    ],
  },
  {
    n: 8,
    day: 3,
    title: "Fortgeschrittenes Routing",
    code: 'm08-advanced-routing',
    labs: [
      { n: '8.1', title: "Lazy Loading mit loadComponent und loadChildren", code: 'l01-lazy-loading' },
      { n: '8.2', title: "Preloading-Strategien", code: 'l02-preloading' },
      { n: '8.3', title: "Dynamische Komponenten", code: 'l03-dynamic-components', variants: [{ path: 'vcr', label: 'Variante mit ViewContainerRef' }] },
    ],
  },
  {
    n: 9,
    day: 3,
    title: "Absicherung von Angular-Anwendungen",
    code: 'm09-security',
    labs: [
      { n: '9.1', title: "Token-basierte Authentifizierung verstehen", code: 'l01-tokens' },
      { n: '9.2', title: "JWT im Angular-Client: Interceptor und Guards", code: 'l02-jwt' },
      { n: '9.3', title: "OAuth 2.0 und OpenID Connect", code: 'l03-oidc' },
    ],
  },
  {
    n: 10,
    day: 3,
    title: "Fortgeschrittenes Testing",
    code: 'm10-testing',
    labs: [
      { n: '10.1', title: "Teststrategie und Vitest", code: 'l01-strategy' },
      { n: '10.2', title: "Komponenten- und Service-Tests", code: 'l02-component-tests' },
      { n: '10.3', title: "Marble-Testing für RxJS-Streams", code: 'l03-marble-testing' },
      { n: '10.4', title: "Stores testen", code: 'l04-store-tests' },
      { n: '10.5', title: "End-to-End-Tests mit Cypress", code: 'l05-cypress' },
    ],
  },
  {
    n: 11,
    day: 4,
    title: "Wiederverwendbarkeit mit Libraries und Angular Elements",
    code: 'm11-libraries',
    labs: [
      { n: '11.1', title: "Nx Workspace", code: 'l01-nx' },
      { n: '11.2', title: "Angular Library bauen und veröffentlichen", code: 'l02-library' },
      { n: '11.3', title: "Angular Elements", code: 'l03-elements' },
    ],
  },
  {
    n: 12,
    day: 4,
    title: "Micro-Frontends und Progressive Web Apps",
    code: 'm12-microfrontends-pwa',
    labs: [
      { n: '12.1', title: "Micro-Frontend-Architektur", code: 'l01-mfe-architecture' },
      { n: '12.2', title: "Micro-Frontend mit Native Federation", code: 'l02-native-federation' },
      { n: '12.3', title: "Progressive Web App", code: 'l03-pwa' },
    ],
  },
  {
    n: 13,
    day: 4,
    title: "Performance und Containerisierung",
    code: 'm13-performance-docker',
    labs: [
      { n: '13.1', title: "Performance messen mit Lighthouse und DevTools", code: 'l01-measure' },
      { n: '13.2', title: "Optimieren und nachmessen", code: 'l02-optimize' },
      { n: '13.3', title: "Containerisierung mit Docker", code: 'l03-docker' },
    ],
  },
  {
    n: 14,
    day: 4,
    title: "Continuous Integration und Transfer",
    code: 'm14-ci-transfer',
    labs: [
      { n: '14.1', title: "CI-Pipeline für Angular", code: 'l01-ci' },
      { n: '14.2', title: "Architektur-Review: Bestands-App modernisieren", code: 'l02-architecture-review' },
    ],
  },
];
