import { TestScheduler } from 'rxjs/testing';
import { Session } from '../../../shared/models';
import { SearchState, sessionSearch } from './session-search';

const angularTalk = { id: 1, title: 'Angular heute' } as Session;
const rxjsTalk = { id: 3, title: 'RxJS-Operatoren, die wirklich zählen' } as Session;

describe('sessionSearch (Marble-Tests)', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    // Vergleicht erwartete und tatsächliche Frames mit expect(...).toEqual(...).
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('wartet 300 ms Ruhe ab und sucht nur den letzten Begriff', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const terms = cold('a 100ms b 400ms c|', { a: 'an', b: 'ang', c: 'angular' });
      const search = (term: string) => cold('(r|)', { r: term === 'angular' ? [angularTalk] : [] });

      const values: Record<string, SearchState> = {
        x: { term: 'ang', sessions: [], error: null },
        y: { term: 'angular', sessions: [angularTalk], error: null },
      };
      // "an" verfällt (b kommt nach 101 ms), "ang" kommt bei 401, "angular" beim Abschluss (503).
      expectObservable(sessionSearch(terms, search)).toBe('401ms x 101ms (y|)', values);
    });
  });

  it('sucht einen gleichen Begriff nicht zweimal', () => {
    scheduler.run(({ hot, cold, expectObservable }) => {
      const terms = hot('a 400ms b', { a: 'rxjs', b: 'rxjs ' }); // Leerzeichen wird abgeschnitten
      const search = vi.fn((_term: string) => cold('(r|)', { r: [rxjsTalk] }));

      expectObservable(sessionSearch(terms, search)).toBe('300ms x', {
        x: { term: 'rxjs', sessions: [rxjsTalk], error: null },
      });
      scheduler.flush(); // virtuelle Zeit bis zum Ende laufen lassen, dann zählen
      expect(search).toHaveBeenCalledTimes(1);
    });
  });

  it('bestellt die langsame alte Anfrage ab (switchMap)', () => {
    scheduler.run(({ hot, cold, expectObservable, expectSubscriptions }) => {
      const terms = hot('a 400ms b', { a: 'ang', b: 'angular' });
      const slow = cold('500ms r|', { r: [rxjsTalk] }); // Antwort auf "ang" käme erst nach 500 ms
      const fast = cold('100ms s|', { s: [angularTalk] });
      const search = (term: string) => (term === 'ang' ? slow : fast);

      expectObservable(sessionSearch(terms, search)).toBe('801ms y', {
        y: { term: 'angular', sessions: [angularTalk], error: null },
      });
      // "ang" wird bei 300 abonniert und bei 701 (Debounce von "angular") abbestellt.
      expectSubscriptions(slow.subscriptions).toBe('300ms ^ 400ms !');
      expectSubscriptions(fast.subscriptions).toBe('701ms ^ 100ms !');
    });
  });

  it('macht aus einem API-Fehler einen Fehlerzustand und läuft weiter', () => {
    scheduler.run(({ hot, cold, expectObservable }) => {
      const terms = hot('a 400ms b', { a: 'ang', b: 'rxjs' });
      const search = (term: string) =>
        term === 'ang'
          ? cold<Session[]>('50ms #', undefined, new Error('500'))
          : cold('50ms (r|)', { r: [rxjsTalk] });

      expectObservable(sessionSearch(terms, search)).toBe('350ms e 400ms r', {
        e: { term: 'ang', sessions: [], error: 'Suche fehlgeschlagen' },
        r: { term: 'rxjs', sessions: [rxjsTalk], error: null },
      });
    });
  });
});
