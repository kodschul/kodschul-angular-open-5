# Überblick: Mastering Angular – Advanced Skills for Professional Development

Aufbaukurs für Angular-Entwickelnde: vom Projekt aus der NgModule-Ära zur Angular-22-App mit Standalone-Komponenten, Signals, NgRx, abgesicherten Routen, Tests, Libraries, Micro-Frontends und Container-Auslieferung.

## Die Entwicklung von Angular

- Bis etwa 2023 prägten `NgModule`, `*ngIf`/`*ngFor`, `@Input`/`@Output` und Zone.js fast jedes Angular-Projekt.
- Seit v17 bis v22 hat sich das Framework grundlegend erneuert: Standalone ist Default, Templates nutzen Control Flow (`@if`, `@for`, `@defer`), Signals steuern die Change Detection.
- Neue Apps laufen seit v21 ohne Zone.js (zoneless), neue Komponenten nutzen seit v22 `OnPush` als Standard, Vitest ersetzt Karma als Test-Runner.
- Bestandsprojekte mischen beide Welten; Teams brauchen deshalb beides: den alten Code lesen und den neuen Weg sicher anwenden.

## Was ist modernes Angular?

- **Standalone-Komponenten:** Komponenten, Direktiven und Pipes deklarieren ihre Abhängigkeiten selbst über `imports`; ein `NgModule` ist nicht mehr nötig ([Lab 2.1](../m02-standalone/l01-standalone/l01-standalone-thx.md)).
- **Signals:** reaktive Werte (`signal`, `computed`), bei deren Änderung Angular genau die betroffenen Stellen neu zeichnet ([Lab 6.1](../m06-signals/l01-signals/l01-signals-thx.md)).
- **Zoneless:** Change Detection ohne Zone.js; sie läuft nach Template-Ereignissen, `async`-Pipe-Werten und Signal-Änderungen ([Lab 1.1](../m01-angular-recap/l01-workspace/l01-workspace-thx.md)).
- **Funktionale APIs:** `inject()`, funktionale Guards, Interceptors und Effects statt Klassen mit Konstruktor-Injection.

## Warum modernes Angular?

| Frage | Klassisch | Heute (Angular 22) | Im Kurs |
| --- | --- | --- | --- |
| Wie wird gebündelt? | `NgModule` | Standalone | Modul 2 |
| Wie wird gerendert? | `*ngIf`, `*ngFor` | `@if`, `@for` mit `track`, `@defer` | Modul 3 |
| Wie fließen Daten zwischen Komponenten? | `@Input`, `@Output` | `input()`, `output()`, `model()` | Lab 1.2 → Lab 6.3 |
| Wer erkennt Änderungen? | Zone.js, `Default`-Strategie | zoneless, `OnPush` | Lab 1.1, Lab 6.1 |
| Wo lebt geteilter Zustand? | Service + `BehaviorSubject` | Service mit Signals, NgRx Signal Store, NgRx Store | Module 6 und 7 |
| Wie wird getestet? | Karma + Jasmine | Vitest, Cypress | Modul 10 |

Weniger Boilerplate, präzisere Change Detection und bessere Typprüfung im Template machen Apps schneller und Code leichter wartbar.

## Ziel und Endergebnis

Nach dem Kurs sind folgende Aufgaben ohne fremde Hilfe machbar:

- eine NgModule-App auf Standalone migrieren und Templates auf Control Flow und `@defer` umstellen
- komplexe Reactive Forms mit eigenen Validatoren und eigenen Formular-Controls bauen
- reaktive Datenströme mit RxJS-Operatoren und Marble-Diagrammen entwerfen, debuggen und testen
- Signals für Zustand und Komponenten-Kommunikation einsetzen, Signal Forms einordnen
- Feature-State mit NgRx Store und NgRx Signal Store umsetzen und den passenden Ansatz begründen
- Routen per Lazy Loading und Preloading optimieren, dynamische Komponenten laden
- Apps per JWT, Interceptor, Guards sowie OAuth 2.0/OIDC absichern
- Unit-, Komponenten-, Marble-, Store- und E2E-Tests schreiben
- Libraries, Angular Elements, Micro-Frontends und PWAs bauen
- Performance messen, optimieren, die App containerisieren und eine CI-Pipeline beschreiben

Endergebnis: die EventHub-Konferenzplattform in vielen Ausbaustufen, ein Modernisierungsplan für eine Bestands-App und ein Kurs-Repo als Nachschlagewerk.

## Zielgruppe und Voraussetzungen

| Thema | Angabe |
| --- | --- |
| Zielgruppe | Angular-Entwickelnde mit Projekterfahrung, die fortgeschrittene Techniken anwenden wollen |
| Vorwissen | Angular-Projekt mit CLI, Komponenten, Services, Routing; RxJS-Grundlagen; Grundkenntnisse in State Management und Testing; Auffrischung in [`00-prework.md`](../00-prework.md) |
| Rechner | Node.js 22.22.3+ oder 24.15+, npm, VS Code mit Angular Language Service, Git; optional Docker |
| Browser | Chrome oder Edge mit Angular DevTools und Redux DevTools |
| Installation | Schritt für Schritt in [`00-setup-and-installation.md`](../00-setup-and-installation.md) |

## Kursszenario: EventHub

- **EventHub** ist eine fiktive Konferenz-Plattform: Sessions, Speaker, Anmeldungen, Favoriten, Admin-Bereich.
- Eine Mock-API (`project/api/`) liefert die Daten, inklusive Login mit JWT und Schaltern für Verzögerung und Fehler.
- Jedes Lab hat einen eigenen Starter; eine verpasste Übung blockiert keine spätere.
- Themen mit eigener Projektstruktur (Migration, Nx, Libraries, Micro-Frontends, PWA, Performance, Docker, CI) liegen in `project/workspaces/`.

## Arbeitsweise

- **Erst ohne, dann mit:** Jedes Thema beginnt bei der Lösung, wie sie in Bestandsprojekten steht, zeigt ihre Grenze und führt dann das moderne Werkzeug ein.
- **Playground:** Übungen laufen in `project/src/app/playground/playground.ts`, sichtbar unter `http://localhost:4200/playground`.
- **Starter:** Das `-exc.md` nennt den Starter in `project/src/app/starters/`.
- **Beispiele:** Die fertige Lösung jedes Labs liegt in `project/src/app/examples/` und läuft unter `/examples/<modul>/<lab>`.
- **Pro Lab drei Dateien:** `-thx.md` (Theorie mit Leitfragen), `-exc.md` (Übung), `-sol.md` (Lösung); pro Modul ein Cheatsheet.
- **Stand:** Angular 22.2, TypeScript 6, RxJS 7.8, NgRx 22, Vitest 5, Cypress 16 (Stand 28.10.2026).

## Tag 1: Fundament auf heutigem Stand

| Zeit | Block | Labs (Minuten) |
| --- | --- | --- |
| 09:00–09:30 | Auftakt | Vorstellung, Kursablauf, Fachdomäne EventHub |
| 09:30–10:30 | [Modul 1: Recap Angular-Grundlagen](../m01-angular-recap/) | 1.1 Kurs-Workspace und Angular 22 (20), 1.2 Recap: Komponenten, Bindings, Services, Routing (40) |
| 10:30–10:45 | Pause | |
| 10:45–12:15 | [Modul 2: Standalone-Komponenten](../m02-standalone/) | 2.1 Standalone statt NgModule (25), 2.2 Bootstrapping mit app.config.ts und app.routes.ts (30), 2.3 Bestandsprojekt migrieren (35) |
| 12:15–13:15 | Mittagspause | |
| 13:15–14:45 | [Modul 3: Komponenten Deep Dive](../m03-component-deep-dive/) | 3.1 Control Flow Syntax (25), 3.2 Deferred Loading (25), 3.3 Standalone Directives und Host Directives (40) |
| 14:45–15:00 | Pause | |
| 15:00–16:15 | [Modul 4: Reactive Forms Deep Dive](../m04-reactive-forms/) | 4.1 Typed Reactive Forms (20), 4.2 Eigene Validatoren: synchron, asynchron, feldübergreifend (25), 4.3 Eigenes Formular-Control mit ControlValueAccessor (30) |
| 16:15–16:30 | Tagesabschluss | Recap, offene Fragen, Brücke zum nächsten Tag |

## Tag 2: Reaktivität: RxJS, Signals und State Management

| Zeit | Block | Labs (Minuten) |
| --- | --- | --- |
| 09:00–09:15 | Tagesauftakt | Recap des Vortags |
| 09:15–10:30 | [Modul 5: Reaktive Programmierung mit RxJS](../m05-rxjs/) | 5.1 Observables und Marble-Diagramme (25), 5.2 Higher-Order-Operatoren: Live-Suche ohne Race Conditions (30), 5.3 Streams debuggen und aufräumen (20) |
| 10:30–10:45 | Pause | |
| 10:45–12:15 | [Modul 6: Reaktivität mit Signals](../m06-signals/) | 6.1 Signals API (25), 6.2 Signals und Observables im Zusammenspiel (25), 6.3 Komponenten-Kommunikation mit Signals (20), 6.4 Signal Forms im Vergleich zu Reactive Forms (20) |
| 12:15–13:15 | Mittagspause | |
| 13:15–14:45 | [Modul 7: State Management mit NgRx](../m07-ngrx/) | 7.1 Welcher State gehört wohin? (20), 7.2 NgRx Store: Actions, Reducer, Selectors (40), 7.3 Effects für Seiteneffekte (30) |
| 14:45–15:00 | Pause | |
| 15:00–16:15 | [Modul 7: State Management mit NgRx](../m07-ngrx/) | 7.4 NgRx Signal Store (40), 7.5 Events-Plugin und Entscheidung im Team (35) |
| 16:15–16:30 | Tagesabschluss | Recap, offene Fragen, Brücke zum nächsten Tag |

## Tag 3: Routing, Sicherheit und Testing

| Zeit | Block | Labs (Minuten) |
| --- | --- | --- |
| 09:00–09:15 | Tagesauftakt | Recap des Vortags |
| 09:15–10:30 | [Modul 8: Fortgeschrittenes Routing](../m08-advanced-routing/) | 8.1 Lazy Loading mit loadComponent und loadChildren (25), 8.2 Preloading-Strategien (20), 8.3 Dynamische Komponenten (30) |
| 10:30–10:45 | Pause | |
| 10:45–12:15 | [Modul 9: Absicherung von Angular-Anwendungen](../m09-security/) | 9.1 Token-basierte Authentifizierung verstehen (25), 9.2 JWT im Angular-Client: Interceptor und Guards (35), 9.3 OAuth 2.0 und OpenID Connect (30) |
| 12:15–13:15 | Mittagspause | |
| 13:15–14:45 | [Modul 10: Fortgeschrittenes Testing](../m10-testing/) | 10.1 Teststrategie und Vitest (25), 10.2 Komponenten- und Service-Tests (35), 10.3 Marble-Testing für RxJS-Streams (30) |
| 14:45–15:00 | Pause | |
| 15:00–16:15 | [Modul 10: Fortgeschrittenes Testing](../m10-testing/) | 10.4 Stores testen (25), 10.5 End-to-End-Tests mit Cypress (50) |
| 16:15–16:30 | Tagesabschluss | Recap, offene Fragen, Brücke zum nächsten Tag |

## Tag 4: Architektur, Wiederverwendung und Auslieferung

| Zeit | Block | Labs (Minuten) |
| --- | --- | --- |
| 09:00–09:15 | Tagesauftakt | Recap des Vortags |
| 09:15–10:30 | [Modul 11: Wiederverwendbarkeit mit Libraries und Angular Elements](../m11-libraries/) | 11.1 Nx Workspace (30), 11.2 Angular Library bauen und veröffentlichen (25), 11.3 Angular Elements (20) |
| 10:30–10:45 | Pause | |
| 10:45–12:15 | [Modul 12: Micro-Frontends und Progressive Web Apps](../m12-microfrontends-pwa/) | 12.1 Micro-Frontend-Architektur (20), 12.2 Micro-Frontend mit Native Federation (40), 12.3 Progressive Web App (30) |
| 12:15–13:15 | Mittagspause | |
| 13:15–14:45 | [Modul 13: Performance und Containerisierung](../m13-performance-docker/) | 13.1 Performance messen mit Lighthouse und DevTools (30), 13.2 Optimieren und nachmessen (30), 13.3 Containerisierung mit Docker (30) |
| 14:45–15:00 | Pause | |
| 15:00–16:15 | [Modul 14: Continuous Integration und Transfer](../m14-ci-transfer/) | 14.1 CI-Pipeline für Angular (25), 14.2 Architektur-Review: Bestands-App modernisieren (50) |
| 16:15–16:30 | Kursabschluss | Recap, offene Fragen, Ausblick, Feedback |

## Aufbau des Kurs-Repos

| Pfad | Inhalt |
| --- | --- |
| [`README.md`](../README.md) | Einstieg, Karte Modul → Handout → Beispiel |
| [`m00-overview/`](.) | Überblick, [Themen](topics.md), [Glossar](glossary.md), [Best Practices](best-practices.md), [FAQ](faq.md) |
| `00-setup-and-installation.md`, `00-prework.md` | Setup, optionale Auffrischung |
| `m01-…` bis `m14-…` | Module mit Labs (`lNN-…/`) und Cheatsheet |
| [`project/`](../project/README.md) | Angular-App mit Mock-API, Beispielen, Startern, Playground und Workspaces |
