import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionApi } from '../../../shared/api';
import { SessionCard } from './session-card';

// Lab 10.2: Die getestete Session-Karte im Einsatz. Die Lösung des Labs sind die *.spec.ts-Dateien.
@Component({
  selector: 'app-component-tests-example',
  imports: [SessionCard],
  template: `
    <h1>Lab 10.2: Komponenten- und Service-Tests</h1>
    <p class="muted">
      Tests: <code>npx ng test --include=src/app/examples/m10-testing/l02-component-tests</code>
    </p>
    <p>
      Favoriten: <strong>{{ favoriteIds().length }}</strong>
    </p>

    <div class="grid">
      @for (session of sessions(); track session.id) {
        <app-session-card
          [session]="session"
          [favorite]="favoriteIds().includes(session.id)"
          (favoriteChange)="toggle(session.id, $event)"
        />
      }
    </div>
  `,
})
export class ComponentTestsExample {
  protected readonly sessions = toSignal(inject(SessionApi).getSessions(), { initialValue: [] });
  protected readonly favoriteIds = signal<number[]>([]);

  protected toggle(id: number, isFavorite: boolean): void {
    this.favoriteIds.update((ids) => (isFavorite ? [...ids, id] : ids.filter((x) => x !== id)));
  }
}
