import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { sessionSearch } from './session-search';

// Lab 10.3: Die getestete Suchfunktion an echter API und echtem Eingabefeld.
// Die Lösung des Labs ist session-search.spec.ts.
@Component({
  selector: 'app-marble-testing-example',
  template: `
    <h1>Lab 10.3: Marble-Testing für RxJS-Streams</h1>
    <p class="muted">
      Tests: <code>npx ng test --include=src/app/examples/m10-testing/l03-marble-testing</code>
    </p>

    <input
      type="search"
      placeholder="Session suchen …"
      (input)="terms.next($any($event.target).value)"
    />

    @if (result(); as state) {
      @if (state.error) {
        <p class="error">{{ state.error }}</p>
      }
      <p class="muted">{{ state.sessions.length }} Treffer für „{{ state.term }}“</p>
      <ul>
        @for (session of state.sessions; track session.id) {
          <li>{{ session.title }}</li>
        }
      </ul>
    }
  `,
})
export class MarbleTestingExample {
  private readonly api = inject(SessionApi);
  protected readonly terms = new Subject<string>();
  // _randomDelay=1 lässt die Mock-API zufällig langsam antworten: switchMap hält die Liste trotzdem korrekt.
  protected readonly result = toSignal(
    sessionSearch(this.terms, (q) => this.api.getSessions({ q })),
  );
}
