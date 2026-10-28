// Starter Lab 7.5: Sessions und Warenkorb sind fertig; „Absagen“ wirkt noch nicht.
// Kopieren nach src/app/playground/playground.ts; Ordner m07-l05-events/ nach src/app/playground/m07-l05-events/.
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component, inject } from '@angular/core';
import { Session } from '../shared/models';
import { CartStore } from './m07-l05-events/cart.store';
import { SessionsStore } from './m07-l05-events/sessions.store';

// Preise im deutschen Format (580,00 €); die App selbst bleibt ohne globale LOCALE_ID.
registerLocaleData(localeDe);

@Component({
  selector: 'app-playground',
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
export class Playground {
  readonly sessions = inject(SessionsStore);
  readonly cart = inject(CartStore);

  // Aufgabe 3: private readonly dispatch = injectDispatch(sessionAdminEvents);

  cancel(session: Session): void {
    // Aufgabe 3: Ereignis cancelled mit sessionId und title auslösen
    console.log('Absagen', session.id);
  }
}
