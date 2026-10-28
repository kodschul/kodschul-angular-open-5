# Lab 7.3 – Lösung: Effects für Seiteneffekte

Fertiges Beispiel: `src/app/examples/m07-ngrx/l03-effects/` (`sessions.effects.ts`, `sessions.actions.ts`, `sessions.feature.ts`, `example.ts`), im Browser unter `/examples/m07-ngrx/l03-effects`. Provider: `src/app/examples/m07-ngrx/routes.ts`.

## Aufgabe 1: Starter kopieren

```bash
cp src/app/starters/m07-l03-effects.ts src/app/playground/playground.ts
cp -r src/app/starters/m07-l03-effects src/app/playground/
```

## Aufgabe 2, 5 und 6: Effects

```ts
// src/app/playground/m07-l03-effects/sessions.effects.ts
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { FavoritesStorage } from '../../examples/m07-ngrx/shared/favorites-storage';
import { SessionApi } from '../../shared/api';
import { sessionsApiActions, sessionsPageActions } from './sessions.actions';

// Aufgabe 2: Laden, nur das Neueste zählt
export const loadSessions = createEffect(
  (actions$ = inject(Actions), api = inject(SessionApi)) =>
    actions$.pipe(
      ofType(sessionsPageActions.opened, sessionsPageActions.reloadClicked),
      switchMap(() =>
        api.getSessions().pipe(
          map((sessions) => sessionsApiActions.sessionsLoadedSuccess({ sessions })),
          catchError((error: HttpErrorResponse) =>
            of(sessionsApiActions.sessionsLoadedFailure({ error: `Laden fehlgeschlagen (HTTP ${error.status})` })),
          ),
        ),
      ),
    ),
  { functional: true },
);

// Aufgabe 5: Speichern, Klicks während des Speicherns ignorieren
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

// Aufgabe 6: Effect ohne Dispatch
export const logErrors = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(sessionsApiActions.sessionsLoadedFailure, sessionsApiActions.favoritesSavedFailure),
      tap(({ error }) => console.error('[Sessions]', error)),
    ),
  { functional: true, dispatch: false },
);
```

Begründung der Operatoren: Beim Laden ist eine ältere Antwort wertlos, sobald neu geladen wird (`switchMap`). Beim Speichern per Button soll ein Doppelklick keinen zweiten Vorgang starten (`exhaustMap`).

## Aufgabe 3: Provider an der Playground-Route

```ts
// src/app/app.routes.ts (Ausschnitt)
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffectsRuntimeAtRoute } from './examples/m07-ngrx/shared/effects-at-route';
import * as sessionsEffects from './playground/m07-l03-effects/sessions.effects';
import { sessionsFeature } from './playground/m07-l03-effects/sessions.feature';

{
  path: 'playground',
  title: 'Playground',
  providers: [
    provideStore(),
    provideState(sessionsFeature),
    provideEffectsRuntimeAtRoute(),
    provideEffects(sessionsEffects),
    provideStoreDevtools({ name: 'EventHub Playground', maxAge: 25 }),
  ],
  loadComponent: () => import('./playground/playground').then((m) => m.Playground),
},
```

Die Imports aus `./playground/m07-l02-store/...` aus Lab 7.2 werden ersetzt.

`provideEffectsRuntimeAtRoute()` gehört nur zur Kurs-App, in der jede Route einen eigenen Store hat. In einer normalen App stehen `provideStore()`, `provideEffects()` und `provideStoreDevtools()` in `app.config.ts`; an der Route bleiben `provideState(sessionsFeature)` und `provideEffects(sessionsEffects)`.

## Aufgabe 4: Laden und Fehlerfall

| Aktion | Tab Redux | Seite |
| --- | --- | --- |
| Seite öffnen | `[Sessions Page] Opened`, `[Sessions API] Sessions Loaded Success` | Liste mit 12 Sessions |
| Haken setzen, „Neu laden“ | `[Sessions Page] Reload Clicked`, `[Sessions API] Sessions Loaded Failure` | „Laden fehlgeschlagen (HTTP 500)“, Button „Erneut versuchen“ |
| Haken entfernen, „Erneut versuchen“ | `[Sessions Page] Reload Clicked`, `[Sessions API] Sessions Loaded Success` | Liste wieder sichtbar |

Bei einem Fehler bleibt die alte Liste im Zustand und damit sichtbar; nur `error` wird gesetzt. Der dritte Schritt beweist, dass der Effect den Fehler überlebt hat.

## Aufgabe 5: Doppelklick auf „Favoriten speichern“

```text
[Sessions Page] Save Favorites Clicked   { favoriteIds: [1, 4] }
[Sessions Page] Save Favorites Clicked   { favoriteIds: [1, 4] }   <- von exhaustMap ignoriert
[Sessions API] Favorites Saved Success   { favoriteIds: [1, 4] }   <- nach ca. 800 ms
```

Konsole: einmal `[FavoritesStorage] speichere [1, 4]`. Die Seite zeigt „Speichere …“ und danach „2 Favoriten gespeichert“.

## Aufgabe 6: Konsole im Fehlerfall

```text
[Sessions] Laden fehlgeschlagen (HTTP 500)
```

Im Tab Redux erscheint dafür keine zusätzliche Action, weil `logErrors` mit `dispatch: false` nichts an den Store schickt.

## Aufgabe 7: Reihenfolge im Tab Redux

```text
@ngrx/store/init
@ngrx/store/update-reducers          <- Feature „sessions“ wurde eingehängt
@ngrx/effects/init
[Sessions Page] Opened
[Sessions API] Sessions Loaded Success
[Sessions Page] Favorite Toggled
[Sessions Page] Favorite Toggled
[Sessions Page] Save Favorites Clicked
[Sessions Page] Save Favorites Clicked
[Sessions API] Favorites Saved Success
[Sessions Page] Reload Clicked
[Sessions API] Sessions Loaded Failure
```

Die drei `@ngrx/...`-Einträge am Anfang erzeugt NgRx selbst beim Start (geprüft mit NgRx 22.0, Stand 28.10.2026).

## Erweiterung

**`concatMap` statt `exhaustMap`:** Der Doppelklick startet zwei Speichervorgänge nacheinander; die Konsole zeigt zweimal `speichere`, der Tab Redux zwei `Favorites Saved Success`. `concatMap` passt, wenn jede Änderung einzeln ankommen muss (z. B. automatisches Speichern nach jedem Umschalten); `exhaustMap` passt zum Button.

**`loadFavorites`:**

```ts
// sessions.actions.ts, in sessionsApiActions.events
'Favorites Loaded Success': props<{ favoriteIds: number[] }>(),

// sessions.feature.ts, im createReducer
on(sessionsApiActions.favoritesLoadedSuccess, (state, { favoriteIds }) => ({ ...state, favoriteIds })),

// sessions.effects.ts
export const loadFavorites = createEffect(
  (actions$ = inject(Actions), storage = inject(FavoritesStorage)) =>
    actions$.pipe(
      ofType(sessionsPageActions.opened),
      switchMap(() => storage.load().pipe(map((favoriteIds) => sessionsApiActions.favoritesLoadedSuccess({ favoriteIds })))),
    ),
  { functional: true },
);
```

Nach dem Neuladen der Seite erscheinen die gespeicherten Favoriten wieder.

**Verzögerung:** Mit `{"delay":2000}` und drei schnellen Klicks auf „Neu laden“ zeigt der Tab Netzwerk zwei abgebrochene Anfragen (Status „canceled“) und eine erfolgreiche; im Tab Redux stehen drei `Reload Clicked`, aber nur ein `Sessions Loaded Success`.
