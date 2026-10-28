import { TestScheduler } from 'rxjs/testing';
import { Session } from '../../shared/models';
import { sessionSearch } from './session-search';

// Starter Lab 10.3: Scheduler und Testdaten sind vorbereitet, die vier Marble-Tests fehlen.
const angularTalk = { id: 1, title: 'Angular heute' } as Session;
const rxjsTalk = { id: 3, title: 'RxJS-Operatoren, die wirklich zählen' } as Session;

describe('sessionSearch (Marble-Tests)', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it.todo('wartet 300 ms Ruhe ab und sucht nur den letzten Begriff');
  it.todo('sucht einen gleichen Begriff nicht zweimal');
  it.todo('bestellt die langsame alte Anfrage ab (switchMap)');
  it.todo('macht aus einem API-Fehler einen Fehlerzustand und läuft weiter');
});
