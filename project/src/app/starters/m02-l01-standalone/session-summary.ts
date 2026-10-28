import { Component, Input } from '@angular/core';
import { Session } from '../../shared/models';
import { SharedModule } from './shared.module';

/** Zweite Verwendungsstelle: zeigt die längste Session. Holt Badge und Pipe noch über das SharedModule. */
@Component({
  selector: 'app-session-summary',
  imports: [SharedModule],
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
