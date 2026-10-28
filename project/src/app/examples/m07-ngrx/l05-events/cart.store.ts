// Lab 7.5: Warenkorb für Workshop-Tickets (Idee aus Lab 6.1) als Signal Store.
// Kennt den SessionsStore nicht; reagiert nur auf das Ereignis „Session abgesagt“.
import { computed } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { Session } from '../../../shared/models';
import { sessionAdminEvents } from './session.events';

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
  withDevtools('cart'),
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

  // Dasselbe Ereignis wie im SessionsStore, eigene Reaktion
  withReducer(
    on(sessionAdminEvents.cancelled, ({ payload }, state) => {
      const affected = state.items.some((item) => item.sessionId === payload.sessionId);
      if (!affected) {
        return {};
      }
      return {
        items: state.items.filter((item) => item.sessionId !== payload.sessionId),
        notice: `„${payload.title}“ wurde abgesagt. Die Tickets wurden aus dem Warenkorb entfernt.`,
      };
    }),
  ),
);
