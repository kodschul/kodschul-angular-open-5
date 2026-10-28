// Starter Lab 7.3: Funktionale Effects. Seiteneffekte (HTTP, Speicher, Logging) gehören hierher.
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { FavoritesStorage } from '../../examples/m07-ngrx/shared/favorites-storage';
import { SessionApi } from '../../shared/api';
import { sessionsApiActions, sessionsPageActions } from './sessions.actions';

// Aufgabe 2: export const loadSessions = createEffect((actions$ = inject(Actions), api = inject(SessionApi)) => ..., { functional: true });
//            auf Opened und Reload Clicked reagieren, switchMap, Erfolg und Fehler als Action

// Aufgabe 5: export const saveFavorites = createEffect(...)  auf Save Favorites Clicked, exhaustMap, FavoritesStorage.save()

// Aufgabe 6: export const logErrors = createEffect(..., { functional: true, dispatch: false })  Fehler in die Konsole

