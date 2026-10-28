import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionApi } from '../../../shared/api';
import { WorkshopStats, bookingRate } from './workshop-stats';

// Lab 10.1: Die Seite zeigt, was workshop-stats.ts berechnet.
// Die eigentliche Lösung des Labs ist workshop-stats.spec.ts (Vitest-Version der Jasmine-Tests).
@Component({
  selector: 'app-strategy-example',
  template: `
    <h1>Lab 10.1: Teststrategie und Vitest</h1>
    <p class="muted">
      Tests: <code>npx ng test --include=src/app/examples/m10-testing/l01-strategy</code>
    </p>

    <p>
      Workshops laut API: <strong>{{ workshopCount() ?? '…' }}</strong>
    </p>

    <div class="grid">
      @for (session of sessions(); track session.id) {
        <article class="card">
          <h3>{{ session.title }}</h3>
          <span class="badge" [class.badge-warn]="rate(session) >= 90"
            >{{ rate(session) }} % gebucht</span
          >
        </article>
      }
    </div>
  `,
})
export class StrategyExample {
  protected readonly sessions = toSignal(inject(SessionApi).getSessions(), { initialValue: [] });
  protected readonly workshopCount = toSignal(inject(WorkshopStats).countWorkshops());
  protected readonly rate = bookingRate;
}
