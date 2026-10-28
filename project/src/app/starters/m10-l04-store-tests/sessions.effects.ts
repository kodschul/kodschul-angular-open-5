import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { SessionApi } from '../../shared/api';
import { SessionsActions } from './sessions.feature';

// Code unter Test: funktionaler Effect aus Lab 7.3.
export const loadSessions = createEffect(
  (actions$ = inject(Actions), api = inject(SessionApi)) =>
    actions$.pipe(
      ofType(SessionsActions.load),
      switchMap(() =>
        api.getSessions().pipe(
          map((sessions) => SessionsActions.loadSuccess({ sessions })),
          catchError((error: HttpErrorResponse) =>
            of(SessionsActions.loadFailure({ error: `Laden fehlgeschlagen (${error.status})` })),
          ),
        ),
      ),
    ),
  { functional: true },
);
