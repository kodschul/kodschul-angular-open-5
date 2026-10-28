// Transferprojekt: Signal Store der Warteliste mit Events-Plugin (Lab 7.4, 7.5).
import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { map } from 'rxjs';
import { API_URL } from '../../../shared/api';
import { joinWaitlist } from './join-waitlist';
import { waitlistApiEvents, waitlistPageEvents } from './waitlist.events';
import { WaitlistEntry } from './waitlist.model';

interface WaitlistState {
  entries: WaitlistEntry[];
  pending: boolean;
  error: string | null;
}

export const WaitlistStore = signalStore(
  withState<WaitlistState>({ entries: [], pending: false, error: null }),

  withComputed(({ entries }) => ({
    count: computed(() => entries().length),
  })),

  withReducer(
    on(waitlistPageEvents.joinRequested, () => ({ pending: true, error: null })),
    on(waitlistApiEvents.joined, ({ payload }, state) => ({
      pending: false,
      entries: [...state.entries, payload],
    })),
    on(waitlistApiEvents.joinFailed, ({ payload }) => ({ pending: false, error: payload })),
  ),

  // Seiteneffekt: Anfrage an die API; zurückgegebene Ereignisse dispatcht der Store selbst
  withEventHandlers((_store, events = inject(Events), http = inject(HttpClient)) => ({
    join$: joinWaitlist(
      events.on(waitlistPageEvents.joinRequested).pipe(map(({ payload }) => payload)),
      (request) =>
        http.post<WaitlistEntry>(`${API_URL}/registrations`, {
          name: request.name,
          email: request.email,
          tickets: 0,
          workshopIds: [],
          waitlistSessionId: request.sessionId,
        }),
    ),
  })),
);
