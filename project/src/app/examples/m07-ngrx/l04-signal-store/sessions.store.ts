// Lab 7.4: Dasselbe Sessions-Feature wie in Lab 7.2–7.3, als NgRx Signal Store in einer Datei.
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';
import { FavoritesStorage } from '../shared/favorites-storage';

interface SessionsState {
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  savedCount: number | null;
}

const initialState: SessionsState = {
  favoriteIds: [],
  loading: false,
  error: null,
  saving: false,
  savedCount: null,
};

export const SessionsStore = signalStore(
  // Sessions als Entities: State ids + entityMap, abgeleitetes Signal entities()
  withEntities<Session>(),
  withState(initialState),

  // abgeleitete Werte (entspricht den Selectors aus Lab 7.2)
  withComputed(({ entities, favoriteIds }) => ({
    favoriteSessions: computed(() => entities().filter((session) => favoriteIds().includes(session.id))),
    favoriteCount: computed(() => favoriteIds().length),
  })),

  // Methoden (entspricht Actions + Reducer + Effects)
  withMethods((store, api = inject(SessionApi), storage = inject(FavoritesStorage)) => ({
    toggleFavorite(sessionId: number): void {
      // patchState: Teil-Zustand setzen; die Funktion bekommt den aktuellen Zustand
      patchState(store, ({ favoriteIds }) => ({
        favoriteIds: favoriteIds.includes(sessionId)
          ? favoriteIds.filter((id) => id !== sessionId)
          : [...favoriteIds, sessionId],
      }));
    },

    // rxMethod: Methode, die intern ein RxJS-Strom ist; switchMap wie im Effect aus Lab 7.3
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

    // exhaustMap wie in Lab 7.3: weitere Klicks während des Speicherns werden ignoriert
    saveFavorites: rxMethod<void>(
      pipe(
        exhaustMap(() => {
          patchState(store, { saving: true });
          return storage.save(store.favoriteIds()).pipe(
            tap((saved) => patchState(store, { saving: false, savedCount: saved.length })),
            catchError(() => {
              patchState(store, { saving: false, error: 'Speichern fehlgeschlagen' });
              return EMPTY;
            }),
          );
        }),
      ),
    ),
  })),

  // Lebenszyklus: beim Erzeugen des Stores einmal laden (ersetzt die Action „Opened“)
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
