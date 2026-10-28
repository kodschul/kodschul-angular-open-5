// Lab 7.5: Ein Ereignis, zwei Stores. „Absagen“ ändert Sessions-Liste und Warenkorb,
// ohne dass sich die Stores gegenseitig kennen.
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { Session } from '../../../shared/models';
import { CartStore } from './cart.store';
import { sessionAdminEvents } from './session.events';
import { SessionsStore } from './sessions.store';

// Preise im deutschen Format (580,00 €); die App selbst bleibt ohne globale LOCALE_ID.
registerLocaleData(localeDe);

@Component({
  selector: 'app-events-example',
  imports: [CurrencyPipe],
  providers: [SessionsStore, CartStore],
  template: `
    <h1>Sessions, Warenkorb und Absagen</h1>

    <div class="card">
      <h2>Warenkorb ({{ cart.ticketCount() }} Tickets)</h2>
      @if (cart.notice(); as notice) {
        <p class="badge badge-warn">{{ notice }}</p>
      }
      @for (item of cart.items(); track item.sessionId) {
        <div class="row">
          <span>{{ item.tickets }} × {{ item.title }}</span>
          <span class="muted">{{ item.price * item.tickets | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}</span>
          <button class="btn" (click)="cart.remove(item.sessionId)">Entfernen</button>
        </div>
      } @empty {
        <p class="muted">Noch keine Workshops im Warenkorb.</p>
      }
      <p><strong>Summe: {{ cart.total() | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}</strong></p>
    </div>

    @if (sessions.loading()) {
      <p class="loading">Lade Sessions …</p>
    }
    @if (sessions.error(); as message) {
      <p class="error">{{ message }}</p>
    }

    @for (session of sessions.entities(); track session.id) {
      @let cancelled = sessions.cancelledIds().includes(session.id);
      <div class="card">
        <div class="row">
          <strong>{{ session.title }}</strong>
          <span class="badge">{{ session.type === 'workshop' ? 'Workshop' : 'Talk' }}</span>
          @if (cancelled) {
            <span class="badge badge-error">abgesagt</span>
          }
        </div>
        <div class="row">
          <button class="btn" [disabled]="cancelled" (click)="sessions.toggleFavorite(session.id)">
            {{ sessions.favoriteIds().includes(session.id) ? '★ Favorit' : '☆ Merken' }}
          </button>
          @if (session.type === 'workshop') {
            <button class="btn" [disabled]="cancelled" (click)="cart.add(session)">
              In den Warenkorb ({{ session.price | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }})
            </button>
          }
          <button class="btn" [disabled]="cancelled" (click)="cancel(session)">Absagen (Admin)</button>
        </div>
      </div>
    }
  `,
})
export class EventsExample {
  readonly sessions = inject(SessionsStore);
  readonly cart = inject(CartStore);

  // Ereignisse, die sich selbst über den Dispatcher verschicken
  private readonly dispatch = injectDispatch(sessionAdminEvents);

  cancel(session: Session): void {
    // Die Komponente meldet nur, was passiert ist. Wer reagiert, entscheiden die Stores.
    this.dispatch.cancelled({ sessionId: session.id, title: session.title });
  }
}
