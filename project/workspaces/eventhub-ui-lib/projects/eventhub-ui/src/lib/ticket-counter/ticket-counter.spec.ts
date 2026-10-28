import { TestBed } from '@angular/core/testing';
import { TicketCounter } from './ticket-counter';

describe('TicketCounter', () => {
  it('bleibt innerhalb der Grenzen', async () => {
    const fixture = TestBed.createComponent(TicketCounter);
    fixture.componentRef.setInput('max', 2);
    fixture.componentInstance.writeValue(2);
    await fixture.whenStable();
    const plus = (fixture.nativeElement as HTMLElement).querySelectorAll('button')[1];
    expect(plus.disabled).toBe(true);
  });
});
