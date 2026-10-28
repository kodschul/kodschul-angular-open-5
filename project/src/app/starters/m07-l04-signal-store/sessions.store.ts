// Starter Lab 7.4: Sessions-Feature als NgRx Signal Store, alles in dieser Datei.
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { FavoritesStorage } from '../../examples/m07-ngrx/shared/favorites-storage';
import { SessionApi } from '../../shared/api';
import { Session } from '../../shared/models';

interface SessionsState {
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  savedCount: number | null;
}

const initialState: SessionsState = {
  favoriteIds: [1, 3], // zwei Demo-Favoriten für den Checkpoint nach Aufgabe 2
  loading: false,
  error: null,
  saving: false,
  savedCount: null,
};

export const SessionsStore = signalStore(
  // Aufgabe 3: withEntities<Session>() als erstes Feature ergänzen
  withState(initialState),
  // Aufgabe 2: withComputed(...) mit favoriteCount (und nach Aufgabe 3 favoriteSessions)
  // Aufgabe 3–5: withMethods((store, api = inject(SessionApi), storage = inject(FavoritesStorage)) => ({ ... }))
  // Aufgabe 6: withHooks({ onInit(store) { ... } })
);
