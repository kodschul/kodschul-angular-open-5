// Lab 7.3: Zustand aus Lab 7.2, ergänzt um den Speicherzustand der Favoriten.
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Session } from '../../../shared/models';
import { sessionsApiActions, sessionsPageActions } from './sessions.actions';

export interface SessionsState {
  sessions: Session[];
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  savedCount: number | null;
}

export const initialState: SessionsState = {
  sessions: [],
  favoriteIds: [],
  loading: false,
  error: null,
  saving: false,
  savedCount: null,
};

const reducer = createReducer(
  initialState,
  // zwei Auslöser, eine Reaktion: on() nimmt mehrere Actions
  on(sessionsPageActions.opened, sessionsPageActions.reloadClicked, (state) => ({ ...state, loading: true, error: null })),
  on(sessionsApiActions.sessionsLoadedSuccess, (state, { sessions }) => ({ ...state, sessions, loading: false })),
  on(sessionsApiActions.sessionsLoadedFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(sessionsPageActions.favoriteToggled, (state, { sessionId }) => ({
    ...state,
    favoriteIds: state.favoriteIds.includes(sessionId)
      ? state.favoriteIds.filter((id) => id !== sessionId)
      : [...state.favoriteIds, sessionId],
  })),
  on(sessionsPageActions.saveFavoritesClicked, (state) => ({ ...state, saving: true })),
  on(sessionsApiActions.favoritesSavedSuccess, (state, { favoriteIds }) => ({
    ...state,
    saving: false,
    savedCount: favoriteIds.length,
  })),
  on(sessionsApiActions.favoritesSavedFailure, (state, { error }) => ({ ...state, saving: false, error })),
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
