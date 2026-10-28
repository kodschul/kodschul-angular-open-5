# Lab 11.2 – Lösung: Angular Library bauen und veröffentlichen

Fertige Library: `output/project/workspaces/eventhub-ui-lib/` (Stand 0.1.0). Die zweite App `output/project/workspaces/eventhub-ui-consumer/` liegt im Ausgangszustand im Repo; die Änderungen stehen unten. Infoseite in der Kurs-App: `/examples/m11-libraries/l02-library`.

## Aufgabe 1: Vertrag, Peers, Ziel

| Datei | Inhalt |
| --- | --- |
| `public-api.ts` | exportiert `SessionBadge`, `TicketCounter` und den Typ `BadgeLevel`; `levelClass()` bleibt intern |
| `package.json` | `peerDependencies`: `@angular/common`, `@angular/core`, `@angular/forms` (je `^22.2.0`); `dependencies`: `tslib` |
| `ng-package.json` | `"dest": "../../dist/eventhub-ui"`, `"entryFile": "src/public-api.ts"` |

## Aufgabe 2: Build

```bash
npx ng build eventhub-ui
```

```text
Building entry point 'eventhub-ui'
✔ Compiling with Angular sources in partial compilation mode.
✔ Generating FESM and DTS bundles
✔ Built eventhub-ui
```

```text
dist/eventhub-ui/
├── fesm2022/eventhub-ui.mjs
├── fesm2022/eventhub-ui.mjs.map
├── types/eventhub-ui.d.ts
└── package.json
```

`dist/eventhub-ui/package.json` enthält zusätzlich `"module": "fesm2022/eventhub-ui.mjs"`, `"typings": "types/eventhub-ui.d.ts"`, `"type": "module"` und eine `exports`-Tabelle. Nur `.` und `./package.json` sind dort freigegeben; deshalb sind interne Pfade nicht importierbar.

## Aufgabe 3: Packen

```bash
cd dist/eventhub-ui
npm pack
```

```text
npm notice name: eventhub-ui
npm notice version: 0.1.0
npm notice filename: eventhub-ui-0.1.0.tgz
npm notice package size: 4.1 kB
npm notice total files: 4
eventhub-ui-0.1.0.tgz
```

## Aufgabe 4: Installation in der zweiten App

```bash
cd ../../../eventhub-ui-consumer
npm install ../eventhub-ui-lib/dist/eventhub-ui/eventhub-ui-0.1.0.tgz
```

```json
"dependencies": {
  "eventhub-ui": "file:../eventhub-ui-lib/dist/eventhub-ui/eventhub-ui-0.1.0.tgz",
  ...
}
```

## Aufgabe 5: Komponenten nutzen

`eventhub-ui-consumer/src/app/app.ts`:

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SessionBadge, TicketCounter } from 'eventhub-ui';   // aus dem Paket, nicht aus einem Pfad

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, SessionBadge, TicketCounter],
  template: `
    <main class="container">
      <h1>Anmeldung: Signals in der Praxis</h1>
      <eh-session-badge level="Fortgeschritten" hint="Grundlagen zu Signals vorausgesetzt" />

      <label for="tickets">Tickets</label>
      <eh-ticket-counter id="tickets" [formControl]="tickets" [max]="4" />

      <p class="muted">Gewählt: {{ tickets.value }} Ticket(s)</p>
    </main>
  `,
})
export class App {
  protected readonly tickets = new FormControl(1, { nonNullable: true });
}
```

`[formControl]` funktioniert, weil `TicketCounter` sich als `NG_VALUE_ACCESSOR` anmeldet (Lab 4.3). `hint` ist optional.

## Aufgabe 6: Start

```bash
npx ng serve          # http://localhost:4220
```

Der Zähler startet bei 1, „−“ ist gesperrt, „+“ sperrt bei 4. Die Zeile „Gewählt“ zeigt denselben Wert. Der Tooltip des Badges zeigt den `hint`-Text.

## Aufgabe 7: Öffentliche Schnittstelle

```text
✘ [ERROR] TS2305: Module '"eventhub-ui"' has no exported member 'levelClass'.
```

`levelClass` steht nicht in `public-api.ts` und fehlt deshalb in `types/eventhub-ui.d.ts`.

## Aufgabe 8: Neue Eingabe und Version

Die Eingabe ist optional und hat einen Standardwert: Bestehende Nutzer müssen nichts ändern, also MINOR → `0.2.0`.

`projects/eventhub-ui/src/lib/session-badge/session-badge.ts` (Änderungen):

```ts
import { Component, booleanAttribute, computed, input } from '@angular/core';

@Component({
  selector: 'eh-session-badge',
  host: {
    '[attr.title]': 'tooltip()',
    '[class.eh-compact]': 'compact()',            // neu
  },
  template: `<span class="eh-badge" [class]="cssClass()">{{ level() }}</span>`,
  styles: `
    /* ... bisherige Regeln ... */
    :host(.eh-compact) .eh-badge { padding: 0 0.35rem; font-size: 0.7rem; }
  `,
})
export class SessionBadge {
  readonly level = input.required<BadgeLevel>();
  readonly hint = input<string>();
  /** Neu in 0.2.0: kleinere Darstellung, Standard false. */
  readonly compact = input(false, { transform: booleanAttribute });
  // ...
}
```

```bash
# projects/eventhub-ui/package.json: "version": "0.2.0"
npx ng build eventhub-ui
cd dist/eventhub-ui && npm pack                     # eventhub-ui-0.2.0.tgz
cd ../../../eventhub-ui-consumer
npm install ../eventhub-ui-lib/dist/eventhub-ui/eventhub-ui-0.2.0.tgz
npx ng build                                        # baut ohne Änderung an app.ts
```

`booleanAttribute` erlaubt die Schreibweise `<eh-session-badge level="Experte" compact />` ohne Bindung.

## Erweiterung: Secondary Entry Point

```text
projects/eventhub-ui/testing/
├── ng-package.json          { "lib": { "entryFile": "src/public-api.ts" } }
└── src/public-api.ts
```

```ts
// projects/eventhub-ui/testing/src/public-api.ts
import { BadgeLevel } from 'eventhub-ui';   // Entry Points importieren den Haupteinstieg über den Paketnamen

/** Testdaten für Apps, die eventhub-ui nutzen. */
export function fakeSession(level: BadgeLevel = 'Einsteiger') {
  return { id: 1, title: 'Test-Session', level };
}
```

```text
Building entry point 'eventhub-ui'
✔ Built eventhub-ui
Building entry point 'eventhub-ui/testing'
✔ Built eventhub-ui/testing
```

`dist/eventhub-ui/` enthält danach zusätzlich `fesm2022/eventhub-ui-testing.mjs`, `types/eventhub-ui-testing.d.ts` und `testing/package.json`. Import in der App: `import { fakeSession } from 'eventhub-ui/testing';`.

Der eigene Workspace außerhalb von `output/project/` enthält nach `ng generate library my-ui` dieselbe Struktur wie `eventhub-ui-lib` vor der Übung, mit einer Platzhalter-Komponente `MyUi` und einer `.spec.ts`.
