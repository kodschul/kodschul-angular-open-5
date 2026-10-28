# Lab 11.2: Angular Library bauen und veröffentlichen

**Leitfragen:**

<details>
<summary>Was darf sich an einer geteilten Komponente ändern, ohne dass andere Teams etwas anpassen müssen?</summary>

Alles, was von außen nicht sichtbar ist: interne Hilfsfunktionen, Styles im Rahmen des Designs, Performance. Neue optionale Eingaben sind ebenfalls harmlos. Umbenannte oder entfernte Eingaben, Selektoren oder Exporte brechen die Nutzer.

</details>

<details>
<summary>Warum soll eine Library Angular nicht selbst mitbringen?</summary>

Die App hat bereits Angular installiert. Brächte die Library eine eigene Kopie mit, gäbe es zwei Angular-Instanzen mit getrennter Dependency Injection und doppelter Bundle-Größe. Deshalb steht Angular in `peerDependencies`: Die App liefert es, die Library nennt nur die passende Version.

</details>

<details>
<summary>Was gehört nicht in die öffentliche Schnittstelle?</summary>

Interne Hilfsfunktionen, Implementierungsdetails und alles, was sich ohne Absprache ändern soll. Was in `public-api.ts` exportiert wird, ist ein Versprechen an alle Nutzer.

</details>

- Die Angular CLI baut Libraries mit `ng-packagr` im Angular Package Format; `public-api.ts` legt fest, was importierbar ist.
- Ein Paket entsteht mit `npm pack` als `.tgz`-Datei; Apps installieren es wie jedes npm-Paket, Versionen folgen Semantic Versioning.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| Library-Projekt | Projekt mit `projectType: "library"` in `angular.json`; wird gebaut, nicht gestartet |
| `ng-packagr` | Werkzeug hinter `ng build <lib>`; erzeugt ein npm-fähiges Paket |
| Angular Package Format | Standard-Aufbau eines Angular-Pakets (ES-Module, Typen, `package.json` mit `exports`) |
| `public-api.ts` | Einstiegsdatei der Library; nur ihre Exporte sind von außen nutzbar |
| Secondary Entry Point | zweiter Importpfad im selben Paket, z. B. `eventhub-ui/testing` |
| `peerDependencies` | Pakete, die die nutzende App bereitstellen muss (Angular selbst) |
| Tarball | gepacktes npm-Paket (`.tgz`), so wie es auch in einer Registry liegt |
| Semantic Versioning | Versionsschema `MAJOR.MINOR.PATCH` mit festen Regeln für Änderungen |

## Workspace für eine Library anlegen

Der Workspace `output/project/workspaces/eventhub-ui-lib/` entstand mit zwei Befehlen (Angular CLI 22.2.5):

```bash
npx @angular/cli@22 new eventhub-ui-lib --no-create-application --skip-git
cd eventhub-ui-lib
npx ng generate library eventhub-ui --prefix=eh
```

`--no-create-application` legt einen leeren Workspace ohne App an. `ng new` funktioniert nur außerhalb eines anderen Angular-Workspace; innerhalb von `output/project/` meldet die CLI „This command is not available when running the Angular CLI inside a workspace“.

```text
eventhub-ui-lib/
├── angular.json                         # Projekt "eventhub-ui", projectType "library", Builder @angular/build:ng-packagr
├── tsconfig.json                        # Pfad "eventhub-ui" -> ./dist/eventhub-ui
└── projects/eventhub-ui/
    ├── ng-package.json                  # Ziel dist/eventhub-ui, Einstieg src/public-api.ts
    ├── package.json                     # Name, Version, peerDependencies des Pakets
    └── src/
        ├── public-api.ts                # Vertrag nach außen
        └── lib/
            ├── session-badge/session-badge.ts     # aus Lab 3.3, vereinfacht
            ├── ticket-counter/ticket-counter.ts   # aus Lab 4.3, auf Signals umgestellt
            └── internal/level-style.ts            # intern, nicht exportiert
```

## `public-api.ts` als Vertrag

```ts
// projects/eventhub-ui/src/public-api.ts
export * from './lib/session-badge/session-badge';
export * from './lib/ticket-counter/ticket-counter';
export type { BadgeLevel } from './lib/internal/level-style';   // nur der Typ, nicht levelClass()
```

Was hier fehlt, ist nach dem Build nicht importierbar. Der Versuch scheitert schon beim Kompilieren der nutzenden App:

```text
error TS2305: Module '"eventhub-ui"' has no exported member 'levelClass'.
error TS2307: Cannot find module 'eventhub-ui/lib/internal/level-style' or its corresponding type declarations.
```

## `package.json` der Library

```json
{
  "name": "eventhub-ui",
  "version": "0.1.0",
  "peerDependencies": {
    "@angular/common": "^22.2.0",
    "@angular/core": "^22.2.0",
    "@angular/forms": "^22.2.0"
  },
  "dependencies": {
    "tslib": "^2.3.0"
  },
  "sideEffects": false
}
```

| Feld | Wann | Beispiel |
| --- | --- | --- |
| `peerDependencies` | Paket muss in der App genau einmal existieren | `@angular/core`, `@angular/forms` (für `ControlValueAccessor`), `rxjs` |
| `dependencies` | kleines Hilfspaket, das die Library selbst braucht | `tslib`, eine Datumsbibliothek |
| `devDependencies` | nur zum Bauen und Testen der Library | gehören in die Workspace-`package.json`, nicht hierher |
| `sideEffects: false` | Import ohne Nutzung darf beim Bundling entfallen | ermöglicht Tree-Shaking |

`@angular/forms` steht hier, weil `TicketCounter` `NG_VALUE_ACCESSOR` nutzt; der Generator trägt nur `common` und `core` ein.

## Bauen und packen

```bash
npx ng build eventhub-ui          # Ausgabe: dist/eventhub-ui
cd dist/eventhub-ui
npm pack                          # erzeugt eventhub-ui-0.1.0.tgz
```

```text
dist/eventhub-ui/
├── fesm2022/eventhub-ui.mjs      # ein ES-Modul mit allen Komponenten (teilkompiliert, "partial")
├── types/eventhub-ui.d.ts        # Typen für die nutzende App
└── package.json                  # ergänzt um "exports", "module", "typings"
```

Libraries werden im Modus „partial compilation“ gebaut: Die nutzende App kompiliert sie mit ihrer eigenen Angular-Version fertig. Darum passt eine mit Angular 22.2 gebaute Library auch in eine App mit 22.3.

## Installieren in einer zweiten App

```bash
cd ../../../eventhub-ui-consumer
npm install ../eventhub-ui-lib/dist/eventhub-ui/eventhub-ui-0.1.0.tgz
```

```json
// eventhub-ui-consumer/package.json (Auszug)
"eventhub-ui": "file:../eventhub-ui-lib/dist/eventhub-ui/eventhub-ui-0.1.0.tgz"
```

```ts
import { SessionBadge, TicketCounter } from 'eventhub-ui';
// im Template:
// <eh-session-badge level="Fortgeschritten" />
// <eh-ticket-counter [formControl]="tickets" [max]="4" />
```

npm kopiert den Inhalt des Tarballs nach `node_modules/eventhub-ui`. Eine neue Library-Version braucht deshalb Build, `npm pack` und erneutes `npm install`.

## Secondary Entry Points

Ein zweiter Importpfad entsteht durch einen Unterordner mit eigener `ng-package.json`, z. B. für Test-Hilfen, die nicht in jedes Bundle sollen:

```text
projects/eventhub-ui/testing/
├── ng-package.json      # { "lib": { "entryFile": "src/public-api.ts" } }
└── src/public-api.ts    # export * from './fake-session';
```

Import in der App: `import { fakeSession } from 'eventhub-ui/testing';`

## Versionen und Veröffentlichung

| Änderung | Version | Beispiel |
| --- | --- | --- |
| Fehlerbehebung ohne API-Änderung | PATCH `0.1.0 → 0.1.1` | Farbe im Badge korrigiert |
| neue, optionale Funktion | MINOR `0.1.0 → 0.2.0` | neue Eingabe `hint` mit Standardwert |
| Bruch der API | MAJOR `1.4.0 → 2.0.0` | Selektor umbenannt, Eingabe entfernt, Angular-Major angehoben |

Vor `1.0.0` gilt die API als instabil; viele Teams starten mit `0.x` und gehen mit dem ersten verbindlichen Nutzer auf `1.0.0`.

Veröffentlichung in eine private Registry (Ablauf, im Kurs ohne echtes Publish):

1. Paketnamen mit Scope wählen, z. B. `@eventhub/ui` in `projects/eventhub-ui/package.json`.
2. Registry für den Scope in `.npmrc` eintragen: `@eventhub:registry=https://npm.firma.example/`.
3. Anmelden: `npm login --registry=https://npm.firma.example/` (oder Token aus der CI).
4. Version erhöhen, bauen, im Ordner `dist/eventhub-ui` `npm publish` ausführen.
5. Apps aktualisieren mit `npm install @eventhub/ui@^0.2.0`.

Typische private Registries: GitHub Packages, GitLab Package Registry, Azure Artifacts, Nexus, Verdaccio (lokal).

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `ng new` meldet „not available … inside a workspace“ | Befehl in einem Ordner mit `angular.json` darüber | Workspace außerhalb des Kursprojekts anlegen |
| Änderung an der Library erscheint nicht in der App | Tarball wurde kopiert, nicht verlinkt | bauen, packen, erneut `npm install …tgz` |
| `npm error ERESOLVE … peer @angular/core@"^22.2.0"` | App nutzt eine Angular-Version außerhalb des Peer-Bereichs | App aktualisieren oder Library mit passendem Bereich veröffentlichen |
| `NG0203` oder doppelte Services | zwei Angular-Kopien, z. B. Angular in `dependencies` statt `peerDependencies` | Angular nur als Peer angeben |
| Import aus `eventhub-ui/lib/...` scheitert | nur `public-api.ts` und Entry Points sind freigegeben | Export in `public-api.ts` ergänzen oder über die öffentliche API gehen |

## Fazit

- `ng generate library` plus `ng-packagr` erzeugen ein npm-Paket im Angular Package Format.
- `public-api.ts` ist der Vertrag, Angular gehört in `peerDependencies`, Versionen folgen Semantic Versioning.
- Ein Tarball aus `npm pack` testet die Installation genau so, wie sie aus einer Registry abläuft.

In der Übung wird das UI-Kit gebaut, gepackt und in einer zweiten App installiert.
