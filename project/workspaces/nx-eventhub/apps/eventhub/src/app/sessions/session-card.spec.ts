import { TestBed } from '@angular/core/testing';
import { SessionCard } from './session-card';

describe('SessionCard', () => {
  it('zeigt Titel und Level', async () => {
    const fixture = TestBed.createComponent(SessionCard);
    fixture.componentRef.setInput('session', {
      id: 1,
      title: 'Signals in der Praxis',
      level: 'Fortgeschritten',
      track: 'Frontend',
      room: 'Saal A',
      start: '2027-03-10T09:30:00',
      capacity: 100,
      booked: 40,
    });
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Signals in der Praxis');
    expect(text).toContain('Fortgeschritten');
  });
});
