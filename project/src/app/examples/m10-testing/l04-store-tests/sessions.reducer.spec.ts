import { Session } from '../../../shared/models';
import { SessionsActions, SessionsState, initialState, sessionsFeature } from './sessions.feature';

const { reducer } = sessionsFeature;
const sessions = [
  { id: 1, title: 'Angular heute' },
  { id: 7, title: 'Testen ohne Tränen' },
] as Session[];

// Reducer und Selectors sind reine Funktionen: kein TestBed, kein Mock, nur Eingabe → Ausgabe.
describe('sessions reducer', () => {
  it('setzt einen Favoriten und entfernt ihn beim zweiten Umschalten', () => {
    const once = reducer(initialState, SessionsActions.toggleFavorite({ id: 7 }));
    const twice = reducer(once, SessionsActions.toggleFavorite({ id: 7 }));

    expect(once.favoriteIds).toEqual([7]);
    expect(twice.favoriteIds).toEqual([]);
    expect(initialState.favoriteIds).toEqual([]); // Ausgangszustand bleibt unverändert
  });

  it('speichert den Fehler und beendet das Laden', () => {
    const loading = reducer(initialState, SessionsActions.load());
    const failed = reducer(
      loading,
      SessionsActions.loadFailure({ error: 'Laden fehlgeschlagen (500)' }),
    );

    expect(loading.loading).toBe(true);
    expect(failed).toEqual({
      ...initialState,
      loading: false,
      error: 'Laden fehlgeschlagen (500)',
    });
  });
});

describe('sessions selectors', () => {
  const state: SessionsState = { ...initialState, sessions, favoriteIds: [7] };

  it('liefert nur die Favoriten-Sessions', () => {
    // projector: die Rechenfunktion des Selectors ohne den globalen State aufrufen
    expect(
      sessionsFeature.selectFavoriteSessions.projector(state.sessions, state.favoriteIds),
    ).toEqual([sessions[1]]);
  });

  it('zählt die Favoriten aus dem Gesamtzustand', () => {
    expect(sessionsFeature.selectFavoriteCount({ sessions: state })).toBe(1);
  });
});
