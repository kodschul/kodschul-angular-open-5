import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Session } from '@nx-eventhub/models';

/** Präsentationskomponente: zeigt eine Session, lädt selbst keine Daten. */
@Component({
  selector: 'app-session-card',
  imports: [DatePipe],
  template: `
    <article class="card">
      <h3>{{ session().title }}</h3>
      <p class="muted">{{ session().speaker?.name }} · {{ session().room }} · {{ session().start | date: 'dd.MM. HH:mm' }}</p>
      <span class="badge" [class.badge-warn]="fewSeats()">{{ session().level }}</span>
    </article>
  `,
})
export class SessionCard {
  readonly session = input.required<Session>();
  protected readonly fewSeats = computed(() => this.session().capacity - this.session().booked < 5);
}
