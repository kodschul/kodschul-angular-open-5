// Lab 7.5: Sessions-Store aus Lab 7.4 (ohne Speichern), ergänzt um das Ereignis „Session abgesagt“.
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';
import { sessionAdminEvents } from './session.events';

interface SessionsState {
  favoriteIds: number[];
  cancelledIds: number[];
  loading: boolean;
  error: string | null;
}

export const SessionsStore = signalStore(
  // optional: Zustand im Redux DevTools anzeigen (ngrx-toolkit, Kompatibilität mit NgRx 22 prüfen)
  withDevtools('sessions'),
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

  // Reaktion auf das Ereignis: Zustandsübergang wie ein Reducer im klassischen Store
  withReducer(
    on(sessionAdminEvents.cancelled, ({ payload }, state) => ({
      cancelledIds: [...state.cancelledIds, payload.sessionId],
      favoriteIds: state.favoriteIds.filter((id) => id !== payload.sessionId),
    })),
  ),

  // Seiteneffekt auf ein Ereignis (wie ein Effect ohne Dispatch)
  withEventHandlers((_store, events = inject(Events)) => ({
    logCancelled$: events
      .on(sessionAdminEvents.cancelled)
      .pipe(tap(({ payload }) => console.info('[SessionsStore] abgesagt:', payload.title))),
  })),

  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
