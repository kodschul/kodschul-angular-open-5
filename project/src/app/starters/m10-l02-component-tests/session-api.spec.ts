import { TestBed } from '@angular/core/testing';
import { SessionApi } from '../../shared/api';

// Starter Lab 10.2 (b): Service-Test für SessionApi (src/app/shared/api.ts) ohne laufenden Server.
describe('SessionApi', () => {
  let api: SessionApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // TODO Aufgabe 5: HttpClient und HttpClient-Testing bereitstellen
      ],
    });
    api = TestBed.inject(SessionApi);
  });

  it.todo('fragt /sessions mit Suchbegriff ab und lässt leere Filter weg');
  it.todo('reicht einen Serverfehler als HttpErrorResponse weiter');
});
