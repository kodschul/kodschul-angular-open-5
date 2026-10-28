import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';
import { WorkshopStats, bookingRate, logSoldOut, warnIfAlmostFull } from './workshop-stats';

// Testdaten: nur die Felder, die der Test braucht, der Rest ist Standard.
function makeSession(partial: Partial<Session> = {}): Session {
  return {
    id: 1,
    title: 'Testen ohne Tränen',
    abstract: '',
    type: 'workshop',
    level: 'Fortgeschritten',
    track: 'Testing',
    speakerId: 4,
    room: 'Workshop 1',
    start: '2027-03-11T14:00:00',
    durationMin: 180,
    capacity: 20,
    booked: 10,
    price: 290,
    tags: [],
    ...partial,
  };
}

describe('bookingRate', () => {
  it('rechnet die Auslastung in Prozent', () => {
    expect(bookingRate(makeSession({ capacity: 20, booked: 15 }))).toBe(75);
  });
});

describe('warnIfAlmostFull', () => {
  // Jasmine: const notify = jasmine.createSpy('notify');
  it('meldet eine fast volle Session über den Callback', () => {
    const notify = vi.fn();

    const warned = warnIfAlmostFull(makeSession({ booked: 19 }), notify);

    expect(warned).toBe(true);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith('Testen ohne Tränen: 95 % gebucht');
  });

  it('bleibt bei geringer Auslastung still', () => {
    const notify = vi.fn();
    expect(warnIfAlmostFull(makeSession({ booked: 5 }), notify)).toBe(false);
    expect(notify).not.toHaveBeenCalled();
  });
});

describe('logSoldOut', () => {
  // Jasmine: spyOn(console, 'warn'); – wird nach jedem Test automatisch zurückgesetzt.
  // Vitest: vi.spyOn(...) + mockRestore() (oder restoreMocks in der Konfiguration).
  afterEach(() => vi.restoreAllMocks());

  it('schreibt eine Warnung pro ausgebuchter Session', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const count = logSoldOut([makeSession({ booked: 20 }), makeSession({ id: 2, booked: 3 })]);

    expect(count).toBe(1);
    expect(warn).toHaveBeenCalledWith('Ausgebucht: Testen ohne Tränen');
  });
});

describe('WorkshopStats', () => {
  // Jasmine: spyOn(api, 'getSessions').and.returnValue(of([...]));
  it('zählt die Workshops aus der API-Antwort', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    const api = TestBed.inject(SessionApi);
    const getSessions = vi
      .spyOn(api, 'getSessions')
      .mockReturnValue(of([makeSession(), makeSession({ id: 2 })]));

    const count = await firstValueFrom(TestBed.inject(WorkshopStats).countWorkshops());

    expect(count).toBe(2);
    expect(getSessions).toHaveBeenCalledWith({ type: 'workshop' });
  });
});
