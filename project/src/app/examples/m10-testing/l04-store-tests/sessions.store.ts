import { computed, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';

// Code unter Test: vereinfachte Kopie des Signal Stores aus Lab 7.4.
export const SessionsStore = signalStore(
  withEntities<Session>(),
  withState({ favoriteIds: [] as number[], loading: false, error: null as string | null }),
  withComputed(({ entities, favoriteIds }) => ({
    favoriteCount: computed(() => favoriteIds().length),
    favorites: computed(() => entities().filter((s) => favoriteIds().includes(s.id))),
  })),
  withMethods((store, api = inject(SessionApi)) => ({
    toggleFavorite(id: number): void {
      patchState(store, ({ favoriteIds }) => ({
        favoriteIds: favoriteIds.includes(id)
          ? favoriteIds.filter((x) => x !== id)
          : [...favoriteIds, id],
      }));
    },
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getSessions().pipe(
            tapResponse({
              next: (sessions) => patchState(store, setAllEntities(sessions), { loading: false }),
              error: (error: HttpErrorResponse) =>
                patchState(store, {
                  loading: false,
                  error: `Laden fehlgeschlagen (${error.status})`,
                }),
            }),
          ),
        ),
      ),
    ),
  })),
);
