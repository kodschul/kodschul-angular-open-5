// Starter Lab 7.2 – Aufgabe 3 und 7: Zustand, Reducer, Feature und Selectors.
import { Session } from '../../shared/models';

export interface SessionsState {
  sessions: Session[];
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
}

// Zwei feste Sessions für den Checkpoint nach Aufgabe 5; in Aufgabe 6 durch [] ersetzen
const DEMO_SESSIONS: Session[] = [
  { id: 1, title: 'Demo: Angular heute', abstract: '', type: 'talk', level: 'Einsteiger', track: 'Frontend',
    speakerId: 1, room: 'Saal A', start: '2027-03-10T09:30:00', durationMin: 45, capacity: 200, booked: 0, price: 0, tags: [] },
  { id: 5, title: 'Demo: State Management mit NgRx', abstract: '', type: 'workshop', level: 'Fortgeschritten', track: 'Architektur',
    speakerId: 2, room: 'Raum 2', start: '2027-03-10T13:00:00', durationMin: 180, capacity: 20, booked: 0, price: 290, tags: [] },
];

export const initialState: SessionsState = {
  sessions: DEMO_SESSIONS,
  favoriteIds: [],
  loading: false,
  error: null,
};

// Aufgabe 3: Gerüst nach Aufgabe 2 einkommentieren (Imports oben ergänzen), den ersten on-Fall als Muster nutzen,
// die drei übrigen on-Fälle ausfüllen.
// import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
// import { sessionsApiActions, sessionsPageActions } from './sessions.actions';
//
// const reducer = createReducer(
//   initialState,
//   on(sessionsPageActions.opened, (state) => ({ ...state, loading: true, error: null })),
//   // on(sessionsApiActions.sessionsLoadedSuccess, ...): sessions übernehmen, loading: false
//   // on(sessionsApiActions.sessionsLoadedFailure, ...): error setzen, loading: false
//   // on(sessionsPageActions.favoriteToggled, ...): ID hinzufügen oder entfernen, neues Array
// );
//
// export const sessionsFeature = createFeature({
//   name: 'sessions',
//   reducer,
//   // Aufgabe 7: extraSelectors mit selectFavoriteSessions
// });
