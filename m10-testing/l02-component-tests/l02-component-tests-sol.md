# Lab 10.2 – Lösung: Komponenten- und Service-Tests

Referenz: `src/app/examples/m10-testing/l02-component-tests/` (`session-card.spec.ts`, `session-api.spec.ts`, `auth.spec.ts`) · Beispielseite `/examples/m10-testing/l02-component-tests`

## Aufgabe 1: Starter kopieren

```bash
cp -r src/app/starters/m10-l02-component-tests src/app/playground/
npx ng test --include=src/app/playground/m10-l02-component-tests
```

```text
 Test Files  3 skipped (3)
      Tests  6 todo (6)
```

## Aufgabe 2–4: Session-Karte

```ts
beforeEach(async () => {
  TestBed.configureTestingModule({ imports: [SessionCard] });
  fixture = TestBed.createComponent(SessionCard);
  element = fixture.nativeElement;
  fixture.componentRef.setInput('session', makeSession()); // Aufgabe 2
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
```

Ohne `setInput` in Aufgabe 2 bricht jeder Test mit `NG0950: Input "session" is required but no value is available yet.` ab.

## Aufgabe 5–7: SessionApi

Die ersten vier Zeilen ergänzen die Importe des Starters; die Starter-Zeile `import { SessionApi } from '../../shared/api';` wird durch die Zeile mit `API_URL` ersetzt.

```ts
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL, SessionApi } from '../../shared/api';
import { Session } from '../../shared/models';

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
      .flush({ message: 'Simulierter Fehler 500' }, { status: 500, statusText: 'Internal Server Error' });

    expect(error?.status).toBe(500);
    expect(error?.error.message).toBe('Simulierter Fehler 500');
  });
});
```

`expectOne` vergleicht die URL samt Query-String. Dass `level: ''` fehlt, beweist die Filterung in `SessionApi.getSessions`.

## Aufgabe 8: Subscribe vergessen

```text
Error: Expected one matching request for criteria "Match URL: http://localhost:3000/sessions?q=angular", found none.
```

Observables von `HttpClient` sind kalt: Ohne `subscribe` geht keine Anfrage raus (Lab 5.1).

## Erweiterung 9–10: Guard und Interceptor

Importe in `auth.spec.ts`: Die Starter-Zeile `import { provideRouter } from '@angular/router';` durch die Router-Zeile unten ersetzen, die übrigen drei Zeilen ergänzen. `TestBed` und `User` sind schon importiert.

```ts
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PartialMatchRouteSnapshot, Router, UrlSegment, UrlTree, provideRouter } from '@angular/router';
import { AuthService, adminGuard, authInterceptor } from './auth';

describe('adminGuard', () => {
  const segments = [new UrlSegment('admin', {})];
  const snapshot = {} as PartialMatchRouteSnapshot;
  const runGuard = () =>
    TestBed.runInInjectionContext(() => adminGuard({ path: 'admin' }, segments, snapshot));

  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('lässt die Rolle admin durch', () => {
    TestBed.inject(AuthService).setSession('token-admin', admin);
    expect(runGuard()).toBe(true);
  });

  it('leitet die Rolle user zum Login mit Rücksprung-URL um', () => {
    TestBed.inject(AuthService).setSession('token-user', user);
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fadmin');
  });
});

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('hängt das Token als Bearer-Header an', () => {
    TestBed.inject(AuthService).setSession('abc.def.ghi', user);
    http.get('/favorites').subscribe();
    const req = httpTesting.expectOne('/favorites');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
    req.flush([]);
  });

  it('schickt ohne Anmeldung keinen Header', () => {
    http.get('/sessions').subscribe();
    const req = httpTesting.expectOne('/sessions');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });
});
```

`TestBed` legt vor jedem Test einen frischen Injector an; der `AuthService` startet deshalb in jedem Test abgemeldet.

## Erweiterung 11: Zwei-Wege-Bindung mit Host

Zusätzlicher Import in `session-card.spec.ts`: `import { Component, signal } from '@angular/core';`. Host-Komponente oberhalb von `describe`, der Test innerhalb des `describe('SessionCard', …)`.

```ts
@Component({
  imports: [SessionCard],
  template: `<app-session-card [session]="session" [(favorite)]="isFavorite" />`,
})
class HostComponent {
  readonly session = makeSession();
  readonly isFavorite = signal(true);
}

it('schreibt den Klick in das Signal des Hosts zurück', async () => {
  const fixture = TestBed.createComponent(HostComponent);
  await fixture.whenStable();

  (fixture.nativeElement as HTMLElement).querySelector('button')!.click();
  await fixture.whenStable();

  expect(fixture.componentInstance.isFavorite()).toBe(false);
});
```

Ergebnis im Referenzordner:

```text
 ✓ session-card.spec.ts (4 tests)
 ✓ session-api.spec.ts (2 tests)
 ✓ auth.spec.ts (5 tests)
```
