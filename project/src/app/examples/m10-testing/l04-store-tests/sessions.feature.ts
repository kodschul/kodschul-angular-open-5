import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { Session } from '../../../shared/models';

// Code unter Test: vereinfachte Kopie des Sessions-Features aus Lab 7.2.

export const SessionsActions = createActionGroup({
  source: 'Sessions',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ sessions: Session[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Toggle Favorite': props<{ id: number }>(),
  },
});

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

export const sessionsFeature = createFeature({
  name: 'sessions',
  reducer: createReducer(
    initialState,
    on(SessionsActions.load, (state): SessionsState => ({ ...state, loading: true, error: null })),
    on(SessionsActions.loadSuccess, (state, { sessions }): SessionsState => ({
      ...state,
      sessions,
      loading: false,
    })),
    on(SessionsActions.loadFailure, (state, { error }): SessionsState => ({
      ...state,
      error,
      loading: false,
    })),
    on(SessionsActions.toggleFavorite, (state, { id }): SessionsState => ({
      ...state,
      favoriteIds: state.favoriteIds.includes(id)
        ? state.favoriteIds.filter((favoriteId) => favoriteId !== id)
        : [...state.favoriteIds, id],
    })),
  ),
  extraSelectors: ({ selectSessions, selectFavoriteIds }) => ({
    selectFavoriteSessions: createSelector(selectSessions, selectFavoriteIds, (sessions, ids) =>
      sessions.filter((s) => ids.includes(s.id)),
    ),
    selectFavoriteCount: createSelector(selectFavoriteIds, (ids) => ids.length),
  }),
});
