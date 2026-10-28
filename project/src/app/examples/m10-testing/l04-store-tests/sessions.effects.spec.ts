import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';
import { loadSessions } from './sessions.effects';
import { SessionsActions } from './sessions.feature';

describe('loadSessions effect', () => {
  let actions$: Observable<Action>;
  let scheduler: TestScheduler;
  const api = { getSessions: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$), // der Test bestimmt, welche Actions eintreffen
        { provide: SessionApi, useValue: api }, // kein HttpClient, keine Mock-API
      ],
    });
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('meldet loadSuccess mit den geladenen Sessions', () => {
    scheduler.run(({ hot, cold, expectObservable }) => {
      const sessions = [{ id: 1, title: 'Angular heute' }] as Session[];
      actions$ = hot('-a', { a: SessionsActions.load() });
      api.getSessions.mockReturnValue(cold('--r|', { r: sessions }));

      const effect$ = TestBed.runInInjectionContext(() => loadSessions());

      expectObservable(effect$).toBe('---s', { s: SessionsActions.loadSuccess({ sessions }) });
    });
  });

  it('meldet loadFailure, wenn das Laden fehlschlägt', () => {
    scheduler.run(({ hot, cold, expectObservable }) => {
      actions$ = hot('-a', { a: SessionsActions.load() });
      api.getSessions.mockReturnValue(
        cold('--#', undefined, new HttpErrorResponse({ status: 500 })),
      );

      const effect$ = TestBed.runInInjectionContext(() => loadSessions());

      expectObservable(effect$).toBe('---f', {
        f: SessionsActions.loadFailure({ error: 'Laden fehlgeschlagen (500)' }),
      });
    });
  });
});
