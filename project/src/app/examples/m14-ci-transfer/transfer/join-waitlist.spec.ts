import { TestScheduler } from 'rxjs/testing';
import { joinWaitlist } from './join-waitlist';
import { waitlistApiEvents } from './waitlist.events';
import { WaitlistEntry, WaitlistRequest } from './waitlist.model';

const request: WaitlistRequest = { sessionId: 6, name: 'Uli User', email: 'user@eventhub.test' };
const entry = { id: 9, name: 'Uli User', email: 'user@eventhub.test', tickets: 0, workshopIds: [], waitlistSessionId: 6 } as WaitlistEntry;

describe('joinWaitlist (Marble-Tests)', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('ignoriert einen Doppelklick, solange die erste Anfrage läuft', () => {
    scheduler.run(({ cold, hot, expectObservable }) => {
      const requests = hot('-a-a-----a-|', { a: request });
      const post = vi.fn(() => cold('---e|', { e: entry }));

      // Anfrage 1 bei Frame 1, Antwort bei 4; die zweite (Frame 3) fällt weg; Anfrage 3 bei 9, Antwort bei 12
      expectObservable(joinWaitlist(requests, post)).toBe('----j-------j|', { j: waitlistApiEvents.joined(entry) });
      scheduler.flush();
      expect(post).toHaveBeenCalledTimes(2);
    });
  });

  it('macht aus einem HTTP-Fehler ein joinFailed-Ereignis', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const requests = cold('a|', { a: request });
      const post = () => cold<WaitlistEntry>('--#', undefined, { status: 500 });

      expectObservable(joinWaitlist(requests, post)).toBe('--(f|)', {
        f: waitlistApiEvents.joinFailed('Eintrag fehlgeschlagen (HTTP 500)'),
      });
    });
  });
});
