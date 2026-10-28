// Starter Lab 2.1: diese Datei -> src/app/playground/playground.ts,
// Ordner m02-l01-standalone/ -> src/app/playground/m02-l01-standalone/ kopieren.
import { Component, inject } from '@angular/core';
import { SessionApi } from '../shared/api';
import { SessionSummary } from './m02-l01-standalone/session-summary';
import { SharedModule } from './m02-l01-standalone/shared.module';

@Component({
  selector: 'app-playground',
  // SharedModule liefert LevelBadge, DurationPipe, SpeakerChip – und versteckt auch CommonModule (async-Pipe, *ngIf)
  imports: [SharedModule, SessionSummary],
  template: `
    <h1>Sessions</h1>
    @if (sessions$ | async; as sessions) {
      <app-session-summary [sessions]="sessions" />
      <div class="grid">
        @for (session of sessions; track session.id) {
          <div class="card">
            <strong>{{ session.title }}</strong>
            <p class="muted">{{ session.durationMin | duration }} · {{ session.room }}</p>
            <div class="row">
              <app-level-badge [level]="session.level" />
              <app-speaker-chip [speaker]="session.speaker" />
            </div>
          </div>
        }
      </div>
    } @else {
      <p class="loading">Lade Sessions …</p>
    }
  `,
})
export class Playground {
  private readonly api = inject(SessionApi);
  protected readonly sessions$ = this.api.getSessions();
}
