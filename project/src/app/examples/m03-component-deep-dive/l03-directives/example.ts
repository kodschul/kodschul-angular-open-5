// Lab 3.3: Attribut-Direktiven appHighlight und appTooltip, per hostDirectives in SessionBadge komponiert.
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionApi } from '../../../shared/api';
import { Highlight } from './highlight.directive';
import { SessionBadge } from './session-badge';
import { Tooltip } from './tooltip.directive';

@Component({
  selector: 'app-directives-example',
  imports: [AsyncPipe, Highlight, Tooltip, SessionBadge],
  template: `
    <h1 appHighlight appTooltip="Alle Sessions der EventHub-Konferenz">Sessions</h1>

    @if (sessions$ | async; as sessions) {
      @for (session of sessions; track session.id) {
        <div class="card" appHighlight="#eef3ff">
          <div class="row">
            <strong>{{ session.title }}</strong>
            <!-- color und tooltip sind Eingaben der Host Directives, level ist Eingabe der Komponente -->
            <app-session-badge
              [level]="session.level"
              color="#ffe08a"
              [tooltip]="session.track + ' · ' + session.room"
            />
          </div>
        </div>
      }
    } @else {
      <p class="loading">Lade Sessions …</p>
    }
  `,
})
export class DirectivesExample {
  private readonly api = inject(SessionApi);
  readonly sessions$ = this.api.getSessions();
}
