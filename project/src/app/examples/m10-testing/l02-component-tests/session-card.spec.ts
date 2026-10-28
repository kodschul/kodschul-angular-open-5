import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Session } from '../../../shared/models';
import { SessionCard } from './session-card';

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
    // Standalone-Komponente: direkt in imports, kein declarations-Array.
    TestBed.configureTestingModule({ imports: [SessionCard] });
    fixture = TestBed.createComponent(SessionCard);
    element = fixture.nativeElement;
    // Signal-Input setzen wie ein Eltern-Template es täte.
    fixture.componentRef.setInput('session', makeSession());
    await fixture.whenStable();
  });

  it('zeigt Titel und Raum der Session', () => {
    expect(element.querySelector('h3')?.textContent).toContain('Testen ohne Tränen');
    expect(element.textContent).toContain('Workshop 1');
  });

  it('setzt beim Klick den Favoriten und meldet die Änderung', async () => {
    const changes: boolean[] = [];
    fixture.componentInstance.favorite.subscribe((value) => changes.push(value));

    element.querySelector('button')!.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.favorite()).toBe(true);
    expect(changes).toEqual([true]);
    expect(element.querySelector('button')?.textContent).toContain('★ Favorit');
  });

  it('übernimmt einen neuen Input-Wert', async () => {
    fixture.componentRef.setInput(
      'session',
      makeSession({ title: 'E2E-Tests, die nicht flackern' }),
    );
    await fixture.whenStable();
    expect(element.querySelector('h3')?.textContent).toContain('E2E-Tests, die nicht flackern');
  });
});

// Zwei-Wege-Bindung prüfen: Ein kleiner Host bindet [(favorite)] an ein eigenes Signal.
@Component({
  imports: [SessionCard],
  template: `<app-session-card [session]="session" [(favorite)]="isFavorite" />`,
})
class HostComponent {
  readonly session = makeSession();
  readonly isFavorite = signal(true);
}

describe('SessionCard im Host', () => {
  it('schreibt den Klick in das Signal des Hosts zurück', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.isFavorite()).toBe(false);
  });
});
