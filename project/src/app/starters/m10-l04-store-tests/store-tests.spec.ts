import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Session } from '../../shared/models';
import { SessionsActions, initialState, sessionsFeature } from './sessions.feature';

// Starter Lab 10.4: drei Tests über beide Store-Varianten.
const sessions = [
  { id: 1, title: 'Angular heute' },
  { id: 7, title: 'Testen ohne Tränen' },
] as Session[];

describe('sessions reducer', () => {
  const { reducer } = sessionsFeature;

  it.todo('setzt einen Favoriten und entfernt ihn beim zweiten Umschalten');
});

describe('loadSessions effect', () => {
  let actions$: Observable<Action>;
  let scheduler: TestScheduler;
  const api = { getSessions: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // TODO Aufgabe 3: Mock-Actions und gemockte SessionApi bereitstellen
      ],
    });
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it.todo('meldet loadFailure, wenn das Laden fehlschlägt');
});

describe('SessionsStore (Signal Store)', () => {
  it.todo('zählt Favoriten beim Umschalten');
});
