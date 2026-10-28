import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';
import { SessionsStore } from './sessions.store';

const sessions = [
  { id: 1, title: 'Angular heute' },
  { id: 7, title: 'Testen ohne Tränen' },
] as Session[];

describe('SessionsStore (Signal Store)', () => {
  const api = { getSessions: vi.fn(() => of(sessions)) };

  function setup() {
    TestBed.configureTestingModule({
      providers: [SessionsStore, { provide: SessionApi, useValue: api }],
    });
    return TestBed.inject(SessionsStore);
  }

  it('zählt Favoriten beim Umschalten', () => {
    const store = setup();

    store.toggleFavorite(1);
    store.toggleFavorite(7);
    store.toggleFavorite(1);

    expect(store.favoriteCount()).toBe(1);
    expect(store.favoriteIds()).toEqual([7]);
  });

  it('lädt Sessions über die gemockte API in die Entities', () => {
    const store = setup();

    store.load();

    expect(api.getSessions).toHaveBeenCalled();
    expect(store.entities()).toEqual(sessions);
    expect(store.loading()).toBe(false);
  });

  it('liefert die Favoriten als berechnete Liste', () => {
    const store = setup();
    store.load();
    store.toggleFavorite(7);

    expect(store.favorites().map((s) => s.title)).toEqual(['Testen ohne Tränen']);
  });

  it('merkt sich einen Ladefehler', () => {
    api.getSessions.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
    const store = setup();

    store.load();

    expect(store.error()).toBe('Laden fehlgeschlagen (500)');
    expect(store.entities()).toEqual([]);
  });
});
