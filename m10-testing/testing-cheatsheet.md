# Testing-Cheatsheet

Schnellreferenz für Modul 10 (Vitest, TestBed, Marble-Tests, Store-Tests, Cypress). Stand: Angular 22.2, Vitest 5, NgRx 22, Cypress 16 (28.10.2026).

## Testlauf (Lab 10.1)

| Befehl | Wirkung |
| --- | --- |
| `npm test` / `ng test` | alle Specs, Watch-Modus |
| `npm run test:run` / `ng test --watch=false` | einmal ausführen (CI) |
| `ng test --include=src/app/playground/m10-l02-component-tests` | nur ein Ordner (oder Datei, Glob `…/**/*.spec.ts`) |
| `ng test --filter="SessionCard"` | nur Tests, deren Name zum Ausdruck passt |
| `ng test --coverage` | Coverage (Paket `@vitest/coverage-v8`, im Kurs-Projekt installiert), Bericht in `coverage/project/` |
| `ng test --list-tests` | gefundene Testdateien auflisten, nichts ausführen |
| `ng g @schematics/angular:refactor-jasmine-vitest` | Jasmine-Specs auf Vitest umschreiben (experimentell) |

## Jasmine → Vitest (Lab 10.1)

| Jasmine | Vitest |
| --- | --- |
| `jasmine.createSpy('x')` | `vi.fn()` |
| `spyOn(obj, 'm')` (ersetzt) | `vi.spyOn(obj, 'm').mockImplementation(() => undefined)` |
| `spyOn(obj, 'm').and.callThrough()` | `vi.spyOn(obj, 'm')` |
| `.and.returnValue(v)` | `.mockReturnValue(v)` |
| `.and.callFake(fn)` | `.mockImplementation(fn)` |
| `spy.calls.count()` | `spy.mock.calls.length` |
| `toHaveBeenCalledOnceWith(a)` | `toHaveBeenCalledExactlyOnceWith(a)` |
| `toBeTrue()` / `toBeFalse()` | `toBe(true)` / `toBe(false)` |
| automatische Spy-Bereinigung | `afterEach(() => vi.restoreAllMocks())` |

## Komponenten und Services (Lab 10.2)

| Syntax | Wirkung |
| --- | --- |
| `TestBed.configureTestingModule({ imports: [SessionCard] })` | Standalone-Komponente bereitstellen |
| `const fixture = TestBed.createComponent(SessionCard)` | Komponente erzeugen |
| `fixture.componentRef.setInput('session', s)` | Input setzen (auch `input()`/`model()`) |
| `await fixture.whenStable()` | warten, bis die Ansicht aktuell ist (zoneless) |
| `fixture.nativeElement.querySelector('h3')` | DOM lesen |
| `fixture.componentInstance.favorite.subscribe(fn)` | `model()`/`output()` beobachten |
| `providers: [provideHttpClient(), provideHttpClientTesting()]` | HTTP-Attrappe statt Server |
| `TestBed.inject(HttpTestingController)` | Controller holen |
| `httpTesting.expectOne(url)` | genau eine Anfrage erwarten |
| `req.flush(body)` / `req.flush(body, { status: 500, statusText: '…' })` | Antwort / Fehler liefern |
| `afterEach(() => httpTesting.verify())` | offene Anfragen melden |
| `TestBed.runInInjectionContext(() => guard(route, segments, snapshot))` | funktionalen Guard ausführen |
| `provideHttpClient(withInterceptors([authInterceptor]))` | Interceptor im Test einhängen |
| `router.serializeUrl(urlTree)` | Umleitungsziel als String prüfen |

## Marble-Tests (Lab 10.3)

| Syntax | Wirkung |
| --- | --- |
| `import { TestScheduler } from 'rxjs/testing'` | Import |
| `new TestScheduler((a, e) => expect(a).toEqual(e))` | Scheduler mit Vitest-Vergleich |
| `scheduler.run(({ cold, hot, expectObservable, expectSubscriptions }) => …)` | virtuelle Zeit für alles im Callback |
| `cold('-a-b|', { a: 1, b: 2 })` | kaltes Observable (startet beim Abo) |
| `hot('a 400ms b', …)` | heißes Observable (läuft ab Frame 0) |
| `cold<T>('50ms #', undefined, new Error('x'))` | Fehler nach 50 Frames |
| `expectObservable(obs$).toBe('300ms x', values)` | Ausgabe prüfen |
| `expectSubscriptions(inner.subscriptions).toBe('300ms ^ 400ms !')` | Abo/Abbestellung prüfen |
| `scheduler.flush()` | virtuelle Zeit vor einer normalen `expect`-Zeile durchlaufen |
| `-` / `a` / `(ab)` / `\|` / `#` / `300ms` | 1 Frame / Wert / gleicher Frame / Abschluss / Fehler / Zeitsprung |

## Store-Tests (Lab 10.4)

| Syntax | Wirkung |
| --- | --- |
| `sessionsFeature.reducer(state, action)` | Reducer direkt testen |
| `selector.projector(a, b)` | Rechenteil eines Selectors testen |
| `selector({ sessions: state })` | Selector mit Gesamtzustand testen |
| `provideMockActions(() => actions$)` | Actions-Strom vorgeben (`@ngrx/effects/testing`) |
| `TestBed.runInInjectionContext(() => loadSessions())` | funktionalen Effect erzeugen |
| `loadSessions(actions$, api)` | Effect ohne TestBed, Abhängigkeiten als Parameter |
| `provideMockStore({ initialState })` | Store-Attrappe für Komponenten (`@ngrx/store/testing`) |
| `store.overrideSelector(selector, value)` + `store.resetSelectors()` | Selector-Ergebnis festlegen und zurücksetzen |
| `store.setState(state)` | ganzen Zustand setzen |
| `providers: [SessionsStore, { provide: SessionApi, useValue: mock }]` | Signal Store mit Mock-Service |
| `patchState(unprotected(store), { … })` | Signal-Store-Zustand im Test setzen (`@ngrx/signals/testing`) |

## Cypress (Lab 10.5)

| Befehl / Syntax | Wirkung |
| --- | --- |
| `npx cypress install` / `npx cypress verify` | Binary laden / prüfen |
| `npm run cy:open` | interaktive Oberfläche |
| `npm run e2e` / `npx cypress run --spec <datei>` | headless, Video und Screenshots |
| `cy.visit('/examples/m10-testing/l05-cypress')` | Seite relativ zu `baseUrl` öffnen |
| `cy.get('[data-cy=search-input]')` / `cy.getByCy('search-input')` | stabiler Selektor / eigener Kurzbefehl |
| `.type('testing')`, `.click()` | Eingabe, Klick |
| `.should('contain.text', '1')`, `.should('have.length', 2)`, `.should('be.visible')` | Assertions mit automatischer Wiederholung |
| `cy.intercept({ method: 'GET', pathname: '/sessions' }).as('search')` | Anfrage beobachten |
| `cy.wait('@search')` | auf die Anfrage warten |
| `cy.intercept(…, { statusCode: 500 })` / `{ forceNetworkError: true }` / `{ fixture: 'x.json' }` | Fehler / Netzwerkausfall / Stub |
| `cy.session(key, setup)` | Login-Zustand cachen |
| `cy.request('POST', url, body)` | HTTP direkt aus dem Test (z. B. Login per API) |
| `Cypress.Commands.add('login', fn)` | eigenen Befehl anlegen (Typ in `namespace Cypress { interface Chainable }`) |
| `Cypress.expose('apiUrl')` | öffentlichen Wert aus `expose` in `cypress.config.ts` lesen (Cypress 16) |
| `cy.screenshot('name')` | Screenshot nach `cypress/screenshots/` |
| `npx tsc -p cypress/tsconfig.json` | Cypress-Dateien ohne Binary typprüfen |
