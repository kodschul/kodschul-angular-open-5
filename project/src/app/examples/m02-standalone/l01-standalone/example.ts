// Lab 2.1: LevelBadge und DurationPipe aus dem SharedModule herausgelöst und standalone verwendet.
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionApi } from '../../../shared/api';
import { DurationPipe } from './duration.pipe';
import { LevelBadge } from './level-badge';
import { SessionSummary } from './session-summary';
import { SharedModule } from './shared.module';

@Component({
  selector: 'app-standalone-example',
  // Mischbetrieb: Standalone-Bausteine direkt, SpeakerChip weiter über das SharedModule
  imports: [AsyncPipe, LevelBadge, DurationPipe, SessionSummary, SharedModule],
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
export class StandaloneExample {
  private readonly api = inject(SessionApi);
  protected readonly sessions$ = this.api.getSessions();
}
