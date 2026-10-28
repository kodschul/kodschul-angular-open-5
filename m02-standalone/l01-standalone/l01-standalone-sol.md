# Lab 2.1 – Lösung: Standalone statt NgModule

## Aufgabe 1: Ausgangszustand

`/playground` zeigt „Längste Session: State Management mit NgRx (3 h)“ mit Badge „Experte“ und darunter zwölf Karten mit Dauer (`45 min`, `3 h`), Level-Badge und Speaker.

## Aufgabe 2: Was kommt über das SharedModule?

| Verwender | bekommt über `SharedModule` | verwendet davon |
| --- | --- | --- |
| `Playground` | `CommonModule` (u. a. `AsyncPipe`, `NgIf`, `NgClass`), `LevelBadge`, `DurationPipe`, `SpeakerChip` | `async`, `app-level-badge`, `duration`, `app-speaker-chip` |
| `SessionSummary` | dasselbe | nur `app-level-badge` und `duration` |

Die `async`-Pipe in `Playground` funktioniert nur, weil `SharedModule` das `CommonModule` exportiert: eine versteckte Abhängigkeit.

## Aufgabe 3: LevelBadge standalone

```ts
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SessionLevel } from '../../shared/models';

@Component({
  selector: 'app-level-badge',
  imports: [NgClass],
  template: `<span class="badge" [ngClass]="cssClass">{{ level }}</span>`,
})
export class LevelBadge {
  @Input({ required: true }) level!: SessionLevel;

  get cssClass(): string {
    if (this.level === 'Experte') return 'badge-error';
    return this.level === 'Fortgeschritten' ? 'badge-warn' : 'badge-ok';
  }
}
```

Direkt nach dem Entfernen von `standalone: false` meldet der Build:

```text
shared.module.ts:9:18 - error NG6008: Component LevelBadge is standalone, and cannot be declared in an NgModule. Did you mean to import it instead?
```

Ohne `imports: [NgClass]` folgt nach Aufgabe 5 `NG8002: Can't bind to 'ngClass' since it isn't a known property of 'span'`.

## Aufgabe 4: DurationPipe standalone

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} min`;
    return m ? `${h} h ${m} min` : `${h} h`;
  }
}
```

Die Pipe hat kein Template und braucht keine `imports`.

## Aufgabe 5: SharedModule verkleinern

```ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpeakerChip } from './speaker-chip';

@NgModule({
  declarations: [SpeakerChip],
  imports: [CommonModule],
  exports: [CommonModule, SpeakerChip],
})
export class SharedModule {}
```

`SpeakerChip` braucht weiter `CommonModule` für `*ngIf`.

## Aufgabe 6: SessionSummary ohne SharedModule

```ts
import { Component, Input } from '@angular/core';
import { Session } from '../../shared/models';
import { DurationPipe } from './duration.pipe';
import { LevelBadge } from './level-badge';

@Component({
  selector: 'app-session-summary',
  imports: [LevelBadge, DurationPipe],
  template: `
    <div class="card">
      <strong>Längste Session:</strong> {{ longest.title }}
      ({{ longest.durationMin | duration }})
      <app-level-badge [level]="longest.level" />
    </div>
  `,
})
export class SessionSummary {
  @Input({ required: true }) sessions!: Session[];

  get longest(): Session {
    return this.sessions.reduce((a, b) => (b.durationMin > a.durationMin ? b : a));
  }
}
```

## Aufgabe 7: Playground im Mischbetrieb

```ts
import { Component, inject } from '@angular/core';
import { SessionApi } from '../shared/api';
import { DurationPipe } from './m02-l01-standalone/duration.pipe';
import { LevelBadge } from './m02-l01-standalone/level-badge';
import { SessionSummary } from './m02-l01-standalone/session-summary';
import { SharedModule } from './m02-l01-standalone/shared.module';

@Component({
  selector: 'app-playground',
  imports: [SharedModule, LevelBadge, DurationPipe, SessionSummary],
  template: `…unverändert…`,
})
export class Playground {
  private readonly api = inject(SessionApi);
  protected readonly sessions$ = this.api.getSessions();
}
```

Die Referenz-App importiert zusätzlich `AsyncPipe` direkt, damit `async` nicht mehr nur über `CommonModule` des SharedModule kommt.

## Aufgabe 8: Meldungen beim Umbau

| Zeitpunkt | Meldung | Fix |
| --- | --- | --- |
| nach Aufgabe 3 | `NG6008 … cannot be declared in an NgModule` und `NG6004 Can't be exported from this NgModule` | Aufgabe 5 |
| nach Aufgabe 5 | `NG8001 'app-level-badge' is not a known element` in `playground.ts` und `session-summary.ts` | Aufgaben 6 und 7 |
| nach Aufgabe 5 | `NG8004 No pipe found with name 'duration'` | Aufgaben 6 und 7 |

Referenz-App: `src/app/examples/m02-standalone/l01-standalone/` (`example.ts`, `level-badge.ts`, `duration.pipe.ts`, `session-summary.ts`, `shared.module.ts`, `speaker-chip.ts`), URL `/examples/m02-standalone/l01-standalone`.

## Erweiterung

`speaker-chip.ts` standalone:

```ts
import { NgIf } from '@angular/common';
// …
@Component({
  selector: 'app-speaker-chip',
  imports: [NgIf],
  template: `…unverändert…`,
})
export class SpeakerChip { @Input() speaker?: Speaker | null; }
```

Danach `SharedModule` löschen; `Playground` braucht dann `imports: [AsyncPipe, LevelBadge, DurationPipe, SpeakerChip, SessionSummary]`. Ohne `AsyncPipe` meldet der Build `NG8004: No pipe found with name 'async'`.

Bündeln ohne Modul:

```ts
// m02-l01-standalone/session-ui.ts
import { DurationPipe } from './duration.pipe';
import { LevelBadge } from './level-badge';

export const SESSION_UI = [LevelBadge, DurationPipe] as const;

// playground.ts
imports: [AsyncPipe, SESSION_UI, SpeakerChip, SessionSummary],
```

Angular akzeptiert verschachtelte Arrays in `imports`. Anders als ein SharedModule bleibt sichtbar, was im Array steht.
