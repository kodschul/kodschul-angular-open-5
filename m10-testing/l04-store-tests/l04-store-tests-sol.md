# Lab 10.4 – Lösung: Stores testen

Referenz: `src/app/examples/m10-testing/l04-store-tests/` (`sessions.reducer.spec.ts`, `sessions.effects.spec.ts`, `sessions.store.spec.ts`, `favorites-badge.spec.ts`) · Beispielseite `/examples/m10-testing/l04-store-tests`

## Aufgabe 1: Starter kopieren

```bash
cp -r src/app/starters/m10-l04-store-tests src/app/playground/
npx ng test --include=src/app/playground/m10-l04-store-tests
```

Die Zusammenfassung zeigt `3 todo`.

## Aufgabe 2: Reducer „Favorit umschalten“

```ts
describe('sessions reducer', () => {
  const { reducer } = sessionsFeature;

  it('setzt einen Favoriten und entfernt ihn beim zweiten Umschalten', () => {
    const once = reducer(initialState, SessionsActions.toggleFavorite({ id: 7 }));
    const twice = reducer(once, SessionsActions.toggleFavorite({ id: 7 }));

    expect(once.favoriteIds).toEqual([7]);
    expect(twice.favoriteIds).toEqual([]);
    expect(initialState.favoriteIds).toEqual([]);
  });
});
```

Die letzte Zeile beweist, dass der Reducer ein neues Objekt liefert, statt den alten Zustand zu verändern.

## Aufgabe 3: Effect „Laden fehlgeschlagen“

Zusätzliche Importe:

```ts
import { HttpErrorResponse } from '@angular/common/http';
import { provideMockActions } from '@ngrx/effects/testing';
import { SessionApi } from '../../shared/api';
import { loadSessions } from './sessions.effects';
```

```ts
describe('loadSessions effect', () => {
  let actions$: Observable<Action>;
  let scheduler: TestScheduler;
  const api = { getSessions: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$), { provide: SessionApi, useValue: api }],
    });
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('meldet loadFailure, wenn das Laden fehlschlägt', () => {
    scheduler.run(({ hot, cold, expectObservable }) => {
      actions$ = hot('-a', { a: SessionsActions.load() });
      api.getSessions.mockReturnValue(cold('--#', undefined, new HttpErrorResponse({ status: 500 })));

      const effect$ = TestBed.runInInjectionContext(() => loadSessions());

      expectObservable(effect$).toBe('---f', {
        f: SessionsActions.loadFailure({ error: 'Laden fehlgeschlagen (500)' }),
      });
    });
  });
});
```

| Frame | Ereignis |
| --- | --- |
| 1 | `load` trifft ein, `switchMap` ruft `getSessions()` auf |
| 3 | `getSessions` endet mit Fehler (1 + 2), `catchError` liefert `loadFailure` |

## Aufgabe 4: Signal Store „Favoriten-Zähler“

Zusätzliche Importe: `of` aus `rxjs`, `SessionApi`, `SessionsStore`.

```ts
describe('SessionsStore (Signal Store)', () => {
  const api = { getSessions: vi.fn(() => of(sessions)) };

  it('zählt Favoriten beim Umschalten', () => {
    TestBed.configureTestingModule({
      providers: [SessionsStore, { provide: SessionApi, useValue: api }],
    });
    const store = TestBed.inject(SessionsStore);

    store.toggleFavorite(1);
    store.toggleFavorite(7);
    store.toggleFavorite(1);

    expect(store.favoriteCount()).toBe(1);
    expect(store.favoriteIds()).toEqual([7]);
  });
});
```

Der Test braucht die gemockte API, obwohl `toggleFavorite` sie nicht nutzt: `withMethods` holt `SessionApi` beim Erzeugen des Stores per `inject`.

## Aufgabe 5: Rote Meldung

```text
AssertionError: expected [ Array(1) ] to deeply equal [ Array(1) ]
      "frame": 3,
      "notification": {
        "kind": "N",
        "value": {
-         "error": "Laden fehlgeschlagen (500)",
+         "error": "Fehler (500)",
          "type": "[Sessions] Load Failure",
```

Frame stimmt, Wert nicht: Die Diff-Zeilen zeigen genau das abweichende Feld.

```text
 ✓ src/app/playground/m10-l04-store-tests/store-tests.spec.ts (3 tests)
```

## Erweiterung

Effect-Erfolgsfall:

```ts
it('meldet loadSuccess mit den geladenen Sessions', () => {
  scheduler.run(({ hot, cold, expectObservable }) => {
    actions$ = hot('-a', { a: SessionsActions.load() });
    api.getSessions.mockReturnValue(cold('--r|', { r: sessions }));
    const effect$ = TestBed.runInInjectionContext(() => loadSessions());
    expectObservable(effect$).toBe('---s', { s: SessionsActions.loadSuccess({ sessions }) });
  });
});
```

Signal Store laden und Fehlerfall: Import von `of` um `throwError` erweitern (`import { Observable, of, throwError } from 'rxjs';`; `HttpErrorResponse` ist seit Aufgabe 3 importiert). Im `describe('SessionsStore (Signal Store)', …)` aus Aufgabe 4 eine Hilfsfunktion `setup()` anlegen, die das Bereitstellen aus Aufgabe 4 bündelt:

```ts
function setup() {
  TestBed.configureTestingModule({
    providers: [SessionsStore, { provide: SessionApi, useValue: api }],
  });
  return TestBed.inject(SessionsStore);
}

it('lädt Sessions über die gemockte API in die Entities', () => {
  const store = setup();
  store.load();
  expect(store.entities()).toEqual(sessions);
  expect(store.loading()).toBe(false);
});

it('merkt sich einen Ladefehler', () => {
  api.getSessions.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
  const store = setup();
  store.load();
  expect(store.error()).toBe('Laden fehlgeschlagen (500)');
});
```

`mockReturnValueOnce` gilt nur für den nächsten Aufruf; danach liefert `api.getSessions` wieder `of(sessions)`.

`FavoritesBadge` mit Mock-Store (`favorites-badge.spec.ts`):

```ts
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { FavoritesBadge } from './favorites-badge';
import { initialState, sessionsFeature } from './sessions.feature';

describe('FavoritesBadge', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FavoritesBadge],
      providers: [provideMockStore({ initialState: { sessions: initialState } })],
    });
    store = TestBed.inject(MockStore);
  });

  afterEach(() => store.resetSelectors());

  it('zeigt den überschriebenen Wert des Selectors an', async () => {
    store.overrideSelector(sessionsFeature.selectFavoriteCount, 3);
    const fixture = TestBed.createComponent(FavoritesBadge);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('★ 3');
  });
});
```

`resetSelectors()` ist nötig, weil `overrideSelector` den Selector selbst verändert und Selectors modulweit geteilt sind; ohne Zurücksetzen sähen spätere Tests weiterhin `3`.
