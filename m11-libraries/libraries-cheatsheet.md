# Libraries-Cheatsheet

Schnellreferenz für Modul 11 (Nx Workspace, Angular Library, Angular Elements). Versionen: Nx 24.0, Angular 22.2 (Stand: 28.10.2026).

## Nx: Workspace und Projekte

| Befehl | Wirkung |
| --- | --- |
| `npx create-nx-workspace@latest <name> --preset=angular-monorepo --appName=<app> --interactive=false` | neuer Nx-Workspace mit einer Angular-App |
| `npx nx show projects` | alle Projekte auflisten |
| `npx nx show project <name>` | Targets und Konfiguration eines Projekts |
| `npx nx serve <app>` | Dev-Server |
| `npx nx build <app>` | Produktions-Build nach `dist/apps/<app>` |
| `npx nx test <projekt>` / `npx nx lint <projekt>` | Tests / Lint eines Projekts |
| `npx nx run-many -t build test lint` | Targets für alle Projekte |
| `npx nx reset` | Cache und Daemon zurücksetzen |

## Nx: Generatoren

| Befehl | Wirkung |
| --- | --- |
| `npx nx g @nx/angular:library libs/shared/ui --tags=type:ui,scope:shared --prefix=ui` | Angular-Library mit Tags, Alias `@<workspace>/ui` |
| `npx nx g @nx/js:library libs/shared/models --bundler=none --unitTestRunner=none --tags=type:util` | reine TypeScript-Library |
| `npx nx g @nx/angular:component libs/shared/ui/src/lib/<name>/<name>` | Komponente in einer Library |
| `… --dry-run` | Dateiliste anzeigen, nichts schreiben |

## Nx: Graph, affected, Cache

| Befehl | Wirkung |
| --- | --- |
| `npx nx graph` | Projektgraph im Browser |
| `npx nx graph --focus=<projekt>` | nur ein Projekt mit Vorgängern und Nachfolgern |
| `npx nx graph --file=graph.html` | Graph als Datei |
| `npx nx show projects --affected` | betroffene Projekte gegenüber `main` |
| `npx nx affected -t test` | Tests nur der betroffenen Projekte |
| `npx nx affected -t test --files=<datei>` | betroffene Projekte für bestimmte Dateien |
| `npx nx affected -t test --base=origin/main --head=HEAD` | Vergleichsbasis festlegen (CI) |
| „Nx read the output from the cache …“ | Ergebnis kam aus dem Cache |

## Nx: Modulgrenzen

| Syntax | Wirkung |
| --- | --- |
| `"tags": ["type:ui", "scope:shared"]` in `project.json` | Projekt etikettieren |
| `{ sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:ui', 'type:util'] }` | erlaubte Abhängigkeiten |
| `bannedExternalImports: ['@angular/common/http']` | npm-Paket für diese Tags verbieten |
| `import { X } from '@nx-eventhub/ui'` | Library über Alias importieren (nie relativ) |

| Library-Typ | Inhalt | Darf importieren |
| --- | --- | --- |
| `type:feature` | Seiten, Routen | ui, data-access, util |
| `type:ui` | Präsentationskomponenten | ui, util |
| `type:data-access` | Services, HTTP, Store | data-access, util |
| `type:util` | Modelle, reine Funktionen | util |

## Angular Library (ohne Nx)

| Befehl | Wirkung |
| --- | --- |
| `npx @angular/cli@22 new <ws> --no-create-application` | leerer Workspace (nicht innerhalb eines anderen Workspace) |
| `npx ng generate library <lib> --prefix=<präfix>` | Library-Projekt unter `projects/<lib>` |
| `npx ng build <lib>` | Paket nach `dist/<lib>` (ng-packagr, partial compilation) |
| `npx ng test <lib> --watch=false` | Tests der Library |
| `cd dist/<lib> && npm pack` | Tarball `<lib>-<version>.tgz` |
| `npm install ../pfad/<lib>-<version>.tgz` | Tarball in einer App installieren |
| `npm publish` (in `dist/<lib>`) | Veröffentlichen in die Registry aus `.npmrc` |

| Datei / Feld | Wirkung |
| --- | --- |
| `src/public-api.ts` | öffentliche Schnittstelle; nur Exporte von hier sind importierbar |
| `ng-package.json` (`dest`, `lib.entryFile`) | Ziel und Einstieg des Pakets |
| `<lib>/<sub>/ng-package.json` | Secondary Entry Point, Import `<lib>/<sub>` |
| `peerDependencies` | Angular und Co.: bringt die App mit |
| `dependencies` | kleine Hilfspakete der Library (`tslib`) |
| `"version": "0.2.0"` | Semantic Versioning: PATCH Fehler, MINOR neue optionale Funktion, MAJOR Bruch |
| `@scope:registry=https://…` in `.npmrc` | private Registry für einen Scope |

## Angular Elements

| Syntax / Befehl | Wirkung |
| --- | --- |
| `npm install @angular/elements` | Paket installieren |
| `createApplication({ providers: [...] })` | Angular ohne Wurzelkomponente starten |
| `createCustomElement(Comp, { injector: appRef.injector })` | Custom-Element-Klasse aus Komponente |
| `customElements.define('eventhub-signup', Klasse)` | Tag registrieren (Bindestrich Pflicht) |
| `sessionTitle = input()` → `session-title="…"` | Input als Attribut (kebab-case) |
| `el.sessionTitle = '…'` | Input als Property (camelCase) |
| `input(5, { transform: numberAttribute })` | Attribut-Text in Zahl umwandeln |
| `registered = output<T>()` → `el.addEventListener('registered', e => e.detail)` | Output als `CustomEvent` |
| `encapsulation: ViewEncapsulation.ShadowDom` | Widget-CSS von der Gastseite trennen |
| `"outputHashing": "none"` in `angular.json` | stabiler Dateiname `main.js` zum Einbinden |
| `<script type="module" src="main.js"></script>` | Build in fremde Seite einbinden (nur über Webserver) |
