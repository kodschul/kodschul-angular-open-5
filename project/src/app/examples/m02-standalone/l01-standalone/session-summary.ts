import { Component, Input } from '@angular/core';
import { Session } from '../../../shared/models';
import { DurationPipe } from './duration.pipe';
import { LevelBadge } from './level-badge';

/** Zweite Verwendungsstelle: importiert Badge und Pipe direkt, kein SharedModule mehr. */
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
