// Lab 7.2: Zustand, Reducer und Selectors des Sessions-Features.
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Session } from '../../../shared/models';
import { sessionsApiActions, sessionsPageActions } from './sessions.actions';

export interface SessionsState {
  sessions: Session[];
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
}

export const initialState: SessionsState = {
  sessions: [],
  favoriteIds: [],
  loading: false,
  error: null,
};

// Reducer: reine Funktion (alter Zustand + Action -> neuer Zustand), kein HTTP, kein Zufall
const reducer = createReducer(
  initialState,
  on(sessionsPageActions.opened, (state) => ({ ...state, loading: true, error: null })),
  on(sessionsApiActions.sessionsLoadedSuccess, (state, { sessions }) => ({ ...state, sessions, loading: false })),
  on(sessionsApiActions.sessionsLoadedFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(sessionsPageActions.favoriteToggled, (state, { sessionId }) => ({
    ...state,
    // neues Array statt push: der Zustand wird nie verändert, nur ersetzt
    favoriteIds: state.favoriteIds.includes(sessionId)
      ? state.favoriteIds.filter((id) => id !== sessionId)
      : [...state.favoriteIds, sessionId],
  })),
);

// createFeature erzeugt selectSessionsState, selectSessions, selectFavoriteIds, selectLoading, selectError
export const sessionsFeature = createFeature({
  name: 'sessions',
  reducer,
  extraSelectors: ({ selectSessions, selectFavoriteIds }) => ({
    selectFavoriteSessions: createSelector(selectSessions, selectFavoriteIds, (sessions, favoriteIds) =>
      sessions.filter((session) => favoriteIds.includes(session.id)),
    ),
  }),
});
