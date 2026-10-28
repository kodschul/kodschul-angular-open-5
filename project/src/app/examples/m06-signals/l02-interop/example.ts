import { Component, Input, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SessionApi } from '../../../shared/api';
import { createSessionSearch } from '../../m05-rxjs/l02-operators/session-search';
import { SessionDetail } from './session-detail';

// Lab 6.2: Live-Suche aus Lab 5.2 per toSignal, Detail per httpResource.
// Die ID kommt als Query-Parameter (?id=3) und landet dank withComponentInputBinding im Input "id".
@Component({
  selector: 'app-interop-example',
  imports: [RouterLink, SessionDetail],
  template: `
    <h1>Lab 6.2 Signals und Observables im Zusammenspiel</h1>
    <div class="row">
      <input placeholder="Suchbegriff" [value]="term()" (input)="term.set($any($event.target).value)" />
      <select (change)="level.set($any($event.target).value)">
        <option value="">Alle Level</option>
        <option>Einsteiger</option>
        <option>Fortgeschritten</option>
        <option>Experte</option>
      </select>
    </div>

    <div class="grid" style="margin-top: 1rem">
      <section>
        @if (result(); as r) {
          @if (r.error) {
            <p class="error">{{ r.error }}</p>
          }
          @for (session of r.sessions; track session.id) {
            <a class="card" style="display: block" [routerLink]="[]" [queryParams]="{ id: session.id }">
              {{ session.title }}
            </a>
          } @empty {
            <p class="muted">Keine Treffer.</p>
          }
        } @else {
          <p class="loading">Suche läuft …</p>
        }
      </section>

      <section class="card">
        @if (id) {
          <app-session-detail [id]="id" />
        } @else {
          <p class="muted">Session links auswählen.</p>
        }
      </section>
    </div>
  `,
})
export class InteropExample {
  /** Query-Parameter ?id=… (Router-Input). */
  @Input() id?: string;

  private readonly api = inject(SessionApi);
  protected readonly term = signal('');
  protected readonly level = signal('');

  // Signal → Observable → Suche aus Lab 5.2 → Signal; subscribe und unsubscribe übernimmt toSignal
  protected readonly result = toSignal(
    createSessionSearch(toObservable(this.term), toObservable(this.level), (q, level) =>
      this.api.getSessions({ q, level }),
    ),
    { initialValue: null },
  );
}
