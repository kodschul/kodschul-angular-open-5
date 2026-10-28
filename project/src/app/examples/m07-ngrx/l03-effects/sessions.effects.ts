// Lab 7.3: Funktionale Effects. Seiteneffekte (HTTP, Speicher, Logging) leben hier, nicht im Reducer.
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { FavoritesStorage } from '../shared/favorites-storage';
import { sessionsApiActions, sessionsPageActions } from './sessions.actions';

// Laden: switchMap (Lab 5.2) – ein neuer Auslöser bricht die laufende Anfrage ab, nur die letzte zählt
export const loadSessions = createEffect(
  (actions$ = inject(Actions), api = inject(SessionApi)) =>
    actions$.pipe(
      ofType(sessionsPageActions.opened, sessionsPageActions.reloadClicked),
      switchMap(() =>
        api.getSessions().pipe(
          map((sessions) => sessionsApiActions.sessionsLoadedSuccess({ sessions })),
          // catchError innen: der Effect-Strom bleibt nach einem Fehler am Leben
          catchError((error: HttpErrorResponse) =>
            of(sessionsApiActions.sessionsLoadedFailure({ error: `Laden fehlgeschlagen (HTTP ${error.status})` })),
          ),
        ),
      ),
    ),
  { functional: true },
);

// Speichern: exhaustMap (Lab 5.2) – solange gespeichert wird, werden weitere Klicks ignoriert
export const saveFavorites = createEffect(
  (actions$ = inject(Actions), storage = inject(FavoritesStorage)) =>
    actions$.pipe(
      ofType(sessionsPageActions.saveFavoritesClicked),
      exhaustMap(({ favoriteIds }) =>
        storage.save(favoriteIds).pipe(
          map((saved) => sessionsApiActions.favoritesSavedSuccess({ favoriteIds: saved })),
          catchError(() => of(sessionsApiActions.favoritesSavedFailure({ error: 'Speichern fehlgeschlagen' }))),
        ),
      ),
    ),
  { functional: true },
);

// Effect ohne Dispatch: reagiert auf Fehler, erzeugt aber keine neue Action
export const logErrors = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(sessionsApiActions.sessionsLoadedFailure, sessionsApiActions.favoritesSavedFailure),
      tap(({ error }) => console.error('[Sessions]', error)),
    ),
  { functional: true, dispatch: false },
);
