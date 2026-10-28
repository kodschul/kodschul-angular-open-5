import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL, SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';

// Service-Test ohne laufenden Server: HttpTestingController fängt jede Anfrage ab.
describe('SessionApi', () => {
  let api: SessionApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(SessionApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  // Schlägt fehl, wenn eine Anfrage offen bleibt oder unerwartet abgeschickt wurde.
  afterEach(() => httpTesting.verify());

  it('fragt /sessions mit Suchbegriff ab und lässt leere Filter weg', () => {
    let result: Session[] | undefined;
    api.getSessions({ q: 'angular', level: '' }).subscribe((sessions) => (result = sessions));

    const req = httpTesting.expectOne(`${API_URL}/sessions?q=angular`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, title: 'Angular heute' }]);

    expect(result?.length).toBe(1);
  });

  it('reicht einen Serverfehler als HttpErrorResponse weiter', () => {
    let error: HttpErrorResponse | undefined;
    api.getSessions().subscribe({ error: (e: HttpErrorResponse) => (error = e) });

    httpTesting
      .expectOne(`${API_URL}/sessions`)
      .flush(
        { message: 'Simulierter Fehler 500' },
        { status: 500, statusText: 'Internal Server Error' },
      );

    expect(error?.status).toBe(500);
    expect(error?.error.message).toBe('Simulierter Fehler 500');
  });
});
