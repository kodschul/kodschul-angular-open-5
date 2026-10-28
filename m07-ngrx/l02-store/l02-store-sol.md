# Lab 7.2 – Lösung: NgRx Store: Actions, Reducer, Selectors

Fertiges Beispiel: `src/app/examples/m07-ngrx/l02-store/` (`example.ts`, `sessions.actions.ts`, `sessions.feature.ts`), im Browser unter `/examples/m07-ngrx/l02-store`. Die Provider stehen dort in `src/app/examples/m07-ngrx/routes.ts`.

## Aufgabe 1: Starter kopieren

```bash
cp src/app/starters/m07-l02-store.ts src/app/playground/playground.ts
cp -r src/app/starters/m07-l02-store src/app/playground/
```

## Aufgabe 2: Actions

```ts
// src/app/playground/m07-l02-store/sessions.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Session } from '../../shared/models';

export const sessionsPageActions = createActionGroup({
  source: 'Sessions Page',
  events: {
    Opened: emptyProps(),
    'Favorite Toggled': props<{ sessionId: number }>(),
  },
});

export const sessionsApiActions = createActionGroup({
  source: 'Sessions API',
  events: {
    'Sessions Loaded Success': props<{ sessions: Session[] }>(),
    'Sessions Loaded Failure': props<{ error: string }>(),
  },
});
```

Zwei Gruppen, weil die Quelle verschieden ist: die Seite meldet Klicks, die API meldet Ergebnisse. In den DevTools ist so sofort sichtbar, woher eine Änderung kam.

## Aufgabe 3 und 7: Reducer, Feature und Selector „Favoriten-Sessions“

```ts
// src/app/playground/m07-l02-store/sessions.feature.ts
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Session } from '../../shared/models';
import { sessionsApiActions, sessionsPageActions } from './sessions.actions';

export interface SessionsState {
  sessions: Session[];
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
}

export const initialState: SessionsState = {
  sessions: [], // nach Aufgabe 6; bis zum Checkpoint DEMO_SESSIONS
  favoriteIds: [],
  loading: false,
  error: null,
};

const reducer = createReducer(
  initialState,
  on(sessionsPageActions.opened, (state) => ({ ...state, loading: true, error: null })),
  on(sessionsApiActions.sessionsLoadedSuccess, (state, { sessions }) => ({ ...state, sessions, loading: false })),
  on(sessionsApiActions.sessionsLoadedFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(sessionsPageActions.favoriteToggled, (state, { sessionId }) => ({
    ...state,
    favoriteIds: state.favoriteIds.includes(sessionId)
      ? state.favoriteIds.filter((id) => id !== sessionId)
      : [...state.favoriteIds, sessionId],
  })),
);

export const sessionsFeature = createFeature({
  name: 'sessions',
  reducer,
  extraSelectors: ({ selectSessions, selectFavoriteIds }) => ({
    selectFavoriteSessions: createSelector(selectSessions, selectFavoriteIds, (sessions, favoriteIds) =>
      sessions.filter((session) => favoriteIds.includes(session.id)),
    ),
  }),
});
```

Der Fall für `opened` und das `createFeature`-Gerüst stehen schon im Starter; Aufgabe 3 ergänzt die drei übrigen `on`-Fälle, Aufgabe 7 die `extraSelectors`.

Die Favoriten-Sessions sind kein eigenes Feld im Zustand, sondern abgeleitet. So können Liste und Favoriten nie auseinanderlaufen.

## Aufgabe 4: Provider an der Playground-Route

```ts
// src/app/app.routes.ts (Ausschnitt)
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { sessionsFeature } from './playground/m07-l02-store/sessions.feature';

{
  path: 'playground',
  title: 'Playground',
  providers: [
    provideStore(),
    provideState(sessionsFeature),
    provideStoreDevtools({ name: 'EventHub Playground', maxAge: 25 }),
  ],
  loadComponent: () => import('./playground/playground').then((m) => m.Playground),
},
```

## Aufgabe 5 und 6: Komponente

```ts
// src/app/playground/playground.ts
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SessionList } from '../examples/m07-ngrx/shared/session-list';
import { SessionApi } from '../shared/api';
import { sessionsApiActions, sessionsPageActions } from './m07-l02-store/sessions.actions';
import { sessionsFeature } from './m07-l02-store/sessions.feature';

@Component({
  selector: 'app-playground',
  imports: [SessionList],
  template: `<!-- unverändert aus dem Starter -->`,
})
export class Playground {
  private readonly store = inject(Store);
  private readonly api = inject(SessionApi);

  readonly sessions = this.store.selectSignal(sessionsFeature.selectSessions);
  readonly favoriteIds = this.store.selectSignal(sessionsFeature.selectFavoriteIds);
  readonly favoriteSessions = this.store.selectSignal(sessionsFeature.selectFavoriteSessions); // Aufgabe 7
  readonly loading = this.store.selectSignal(sessionsFeature.selectLoading);
  readonly error = this.store.selectSignal(sessionsFeature.selectError);

  constructor() {
    this.store.dispatch(sessionsPageActions.opened());
    // Zwischenstand: HTTP in der Komponente, Ergebnis als Action. Lab 7.3 verschiebt das in einen Effect.
    this.api.getSessions().subscribe({
      next: (sessions) => this.store.dispatch(sessionsApiActions.sessionsLoadedSuccess({ sessions })),
      error: () => this.store.dispatch(sessionsApiActions.sessionsLoadedFailure({ error: 'Sessions konnten nicht geladen werden.' })),
    });
  }

  toggleFavorite(sessionId: number): void {
    this.store.dispatch(sessionsPageActions.favoriteToggled({ sessionId }));
  }
}
```

Das `subscribe` braucht kein Abmelden: Die HTTP-Anfrage liefert einen Wert und endet (Lab 5.3).

## Aufgabe 8: Redux DevTools

Erwartete Liste im Tab **Redux** (Instanz `EventHub Playground`):

```text
@ngrx/store/init
@ngrx/store/update-reducers          <- Feature „sessions“ wurde eingehängt
[Sessions Page] Opened
[Sessions API] Sessions Loaded Success
[Sessions Page] Favorite Toggled     { sessionId: 1 }
[Sessions Page] Favorite Toggled     { sessionId: 5 }
[Sessions Page] Favorite Toggled     { sessionId: 7 }
[Sessions Page] Favorite Toggled     { sessionId: 5 }
```

- Tab **Diff** bei der letzten Action: `sessions.favoriteIds` von `[1, 5, 7]` auf `[1, 7]`.
- **Jump** bei der zweiten `Favorite Toggled`: Seite zeigt zwei Favoriten (1 und 5). Während ein früherer Zustand angezeigt wird, am besten nicht klicken; **Jump** bei der letzten Action stellt den aktuellen Zustand wieder her.

## Erweiterung

- Fehlerfall: Ohne laufende API zeigt der Tab Redux `[Sessions API] Sessions Loaded Failure` mit `error`, die Seite zeigt „Sessions konnten nicht geladen werden.“
- Workshops:

  ```ts
  extraSelectors: ({ selectSessions, selectFavoriteIds }) => ({
    selectFavoriteSessions: /* wie oben */,
    selectWorkshops: createSelector(selectSessions, (sessions) => sessions.filter((s) => s.type === 'workshop')),
  }),
  ```

  In der Komponente: `readonly workshops = this.store.selectSignal(sessionsFeature.selectWorkshops);`, im Template `{{ workshops().length }} Workshops`.
