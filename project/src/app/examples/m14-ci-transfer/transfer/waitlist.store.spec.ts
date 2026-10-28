import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dispatcher } from '@ngrx/signals/events';
import { API_URL } from '../../../shared/api';
import { waitlistPageEvents } from './waitlist.events';
import { WaitlistStore } from './waitlist.store';

describe('WaitlistStore', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [WaitlistStore, provideHttpClient(), provideHttpClientTesting()],
    });
    return {
      store: TestBed.inject(WaitlistStore),
      dispatcher: TestBed.inject(Dispatcher),
      http: TestBed.inject(HttpTestingController),
    };
  }

  it('trägt nach erfolgreicher API-Antwort ein', () => {
    const { store, dispatcher, http } = setup();

    dispatcher.dispatch(waitlistPageEvents.joinRequested({ sessionId: 6, name: 'Uli', email: 'u@eventhub.test' }));
    expect(store.pending()).toBe(true);

    const req = http.expectOne(`${API_URL}/registrations`);
    expect(req.request.body).toMatchObject({ waitlistSessionId: 6, tickets: 0 });
    req.flush({ id: 5, name: 'Uli', email: 'u@eventhub.test', tickets: 0, workshopIds: [], waitlistSessionId: 6 });

    expect(store.pending()).toBe(false);
    expect(store.count()).toBe(1);
  });

  it('merkt sich einen Fehler', () => {
    const { store, dispatcher, http } = setup();

    dispatcher.dispatch(waitlistPageEvents.joinRequested({ sessionId: 6, name: 'Uli', email: 'u@eventhub.test' }));
    http.expectOne(`${API_URL}/registrations`).flush({ message: 'kaputt' }, { status: 500, statusText: 'Server Error' });

    expect(store.error()).toBe('Eintrag fehlgeschlagen (HTTP 500)');
    expect(store.count()).toBe(0);
  });
});
