import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { API_URL, Session } from '../data';

// Feature-State der Session-Liste (Signal Store aus Lab 7.4).
export const SessionsStore = signalStore(
  { providedIn: 'root' }, // global registriert: jede Komponente der App kann den Store injizieren
  withState({ sessions: [] as Session[], loading: false }),
  withComputed(({ sessions }) => ({
    count: computed(() => sessions().length),
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    load(): void {
      patchState(store, { loading: true });
      http.get<Session[]>(`${API_URL}/sessions`).subscribe((sessions) => patchState(store, { sessions, loading: false }));
    },
  })),
  withHooks({
    onInit(store) {
      console.log('[SessionsStore] erzeugt');
      store.load();
    },
  }),
);
