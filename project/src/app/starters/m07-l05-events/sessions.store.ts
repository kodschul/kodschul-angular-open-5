// Starter Lab 7.5: Sessions-Store aus Lab 7.4 (ohne Speichern). cancelledIds ist im Zustand schon vorhanden.
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { SessionApi } from '../../shared/api';
import { Session } from '../../shared/models';

interface SessionsState {
  favoriteIds: number[];
  cancelledIds: number[];
  loading: boolean;
  error: string | null;
}

export const SessionsStore = signalStore(
  // Erweiterung: withDevtools('sessions') aus @angular-architects/ngrx-toolkit
  withEntities<Session>(),
  withState<SessionsState>({ favoriteIds: [], cancelledIds: [], loading: false, error: null }),

  withComputed(({ entities, favoriteIds, cancelledIds }) => ({
    favoriteSessions: computed(() =>
      entities().filter((s) => favoriteIds().includes(s.id) && !cancelledIds().includes(s.id)),
    ),
  })),

  withMethods((store, api = inject(SessionApi)) => ({
    toggleFavorite(sessionId: number): void {
      patchState(store, ({ favoriteIds }) => ({
        favoriteIds: favoriteIds.includes(sessionId)
          ? favoriteIds.filter((id) => id !== sessionId)
          : [...favoriteIds, sessionId],
      }));
    },
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getSessions().pipe(
            tap((sessions) => patchState(store, setAllEntities(sessions), { loading: false })),
            catchError((error: HttpErrorResponse) => {
              patchState(store, { loading: false, error: `Laden fehlgeschlagen (HTTP ${error.status})` });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),

  // Aufgabe 4: withReducer(on(sessionAdminEvents.cancelled, ({ payload }, state) => ({ ... })))
  // Aufgabe 6: withEventHandlers((_store, events = inject(Events)) => ({ ... }))

  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
