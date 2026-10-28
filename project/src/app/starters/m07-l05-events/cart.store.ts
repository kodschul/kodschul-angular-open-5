// Starter Lab 7.5: Warenkorb für Workshop-Tickets (Idee aus Lab 6.1) als Signal Store.
// Kennt den SessionsStore nicht; reagiert nur auf das Ereignis „Session abgesagt“.
import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { Session } from '../../shared/models';

export interface CartItem {
  sessionId: number;
  title: string;
  price: number;
  tickets: number;
}

interface CartState {
  items: CartItem[];
  notice: string | null;
}

export const CartStore = signalStore(
  // Erweiterung: withDevtools('cart')
  withState<CartState>({ items: [], notice: null }),

  withComputed(({ items }) => ({
    total: computed(() => items().reduce((sum, item) => sum + item.price * item.tickets, 0)),
    ticketCount: computed(() => items().reduce((sum, item) => sum + item.tickets, 0)),
  })),

  withMethods((store) => ({
    add(session: Session): void {
      patchState(store, ({ items }) => {
        const existing = items.find((item) => item.sessionId === session.id);
        return {
          notice: null,
          items: existing
            ? items.map((item) => (item === existing ? { ...item, tickets: item.tickets + 1 } : item))
            : [...items, { sessionId: session.id, title: session.title, price: session.price, tickets: 1 }],
        };
      });
    },
    remove(sessionId: number): void {
      patchState(store, ({ items }) => ({ items: items.filter((item) => item.sessionId !== sessionId) }));
    },
  })),

  // Aufgabe 5: withReducer(on(sessionAdminEvents.cancelled, ({ payload }, state) => ...))
  //            betroffene Positionen entfernen und notice setzen; sonst {} zurückgeben
);
