import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Session } from '../../shared/models';
import { SessionCard } from './session-card';

// Starter Lab 10.2 (a): Testdaten und TestBed sind vorbereitet, die Tests fehlen.
function makeSession(partial: Partial<Session> = {}): Session {
  return {
    id: 7,
    title: 'Testen ohne Tränen',
    abstract: '',
    type: 'workshop',
    level: 'Fortgeschritten',
    track: 'Testing',
    speakerId: 4,
    room: 'Workshop 1',
    start: '2027-03-11T14:00:00',
    durationMin: 180,
    capacity: 24,
    booked: 9,
    price: 290,
    tags: [],
    ...partial,
  };
}

describe('SessionCard', () => {
  let fixture: ComponentFixture<SessionCard>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [SessionCard] });
    fixture = TestBed.createComponent(SessionCard);
    element = fixture.nativeElement;
    // TODO Aufgabe 2: Input "session" setzen und auf stabile Ansicht warten
  });

  it.todo('zeigt Titel und Raum der Session');
  it.todo('setzt beim Klick den Favoriten und meldet die Änderung');
});
