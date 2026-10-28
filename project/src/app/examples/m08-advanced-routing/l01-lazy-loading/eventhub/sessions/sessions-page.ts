import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionsStore } from './sessions-store';

@Component({
  selector: 'eh-sessions-page',
  imports: [DatePipe],
  template: `
    <h1>Sessions ({{ store.count() }})</h1>
    @if (store.loading()) {
      <p class="loading">Lade Sessions …</p>
    }
    <div class="grid">
      @for (s of store.sessions(); track s.id) {
        <article class="card">
          <h3>{{ s.title }}</h3>
          <p class="muted">{{ s.start | date: 'dd.MM. HH:mm' }} · {{ s.room }} · {{ s.track }}</p>
          <span class="badge">{{ s.booked }}/{{ s.capacity }} Plätze</span>
        </article>
      }
    </div>
  `,
})
export class SessionsPage {
  protected readonly store = inject(SessionsStore);
}
