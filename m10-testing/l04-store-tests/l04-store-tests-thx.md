# Lab 10.4: Stores testen

**Leitfragen:**

<details>
<summary>Warum sind Reducer besonders leicht zu testen?</summary>

Ein Reducer ist eine reine Funktion: alter Zustand + Action → neuer Zustand, ohne HTTP, Zeit oder DI. Der Test ruft ihn auf und vergleicht das Ergebnis.

</details>

<details>
<summary>Was braucht ein Test für etwas, das einen HTTP-Aufruf auslöst?</summary>

Eine Attrappe für den Aufruf (gemockter Service) und eine kontrollierte Quelle für den Auslöser. Bei Effects sind das ein Ersatz für `Actions` und ein gemockter `SessionApi`; Marble-Diagramme aus Lab 10.3 beschreiben den zeitlichen Ablauf.

</details>

<details>
<summary>Welcher der beiden Stores aus m07 ließ sich angenehmer testen?</summary>

Beim NgRx Store sind Reducer, Selector und Effect einzeln testbar, brauchen aber je eigene Werkzeuge. Der Signal Store wird wie ein Service per `TestBed.inject` geholt und über Methoden und Signale geprüft. Beides hat seinen Preis; die Übung macht den Vergleich greifbar.

</details>

- Code unter Test liegt als vereinfachte Kopie im Lab-Ordner: Sessions-Feature aus Lab 7.2 (`sessions.feature.ts`), Effect aus Lab 7.3 (`sessions.effects.ts`), Signal Store aus Lab 7.4 (`sessions.store.ts`).
- Jede Store-Schicht hat ihr passendes Testwerkzeug; nur Effects und Komponenten brauchen `TestBed`.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| `provideMockActions` | aus `@ngrx/effects/testing`: ersetzt den `Actions`-Strom durch ein Observable, das der Test vorgibt |
| `provideMockStore` | aus `@ngrx/store/testing`: Store-Attrappe ohne Reducer und Effects; Zustand und Selector-Ergebnisse setzt der Test |
| `overrideSelector` | legt fest, was ein Selector im Mock-Store liefert, unabhängig vom Zustand |
| `projector` | die Rechenfunktion eines mit `createSelector` gebauten Selectors, direkt aufrufbar |
| `unprotected` | aus `@ngrx/signals/testing`: erlaubt `patchState` von außen auf einen Signal Store, nur für Tests |

## Welches Werkzeug für welche Schicht?

| Schicht | Testart | Werkzeug | TestBed? |
| --- | --- | --- | --- |
| Reducer | Eingabe → Ausgabe | direkter Aufruf `reducer(state, action)` | nein |
| Selector | Eingabe → Ausgabe | `selector.projector(...)` oder `selector({ sessions: state })` | nein |
| Effect | Action rein → Action raus | `provideMockActions` + gemockter Service + `TestScheduler` | ja |
| Komponente mit Store | DOM zeigt Store-Daten | `provideMockStore`, `overrideSelector`, `setState` | ja |
| Signal Store | Methoden aufrufen, Signale lesen | `TestBed.inject(Store)` + gemockter Service | ja |

## Reducer und Selectors: reine Funktionen

```ts
const { reducer } = sessionsFeature;

it('merkt sich einen Ladefehler und beendet das Laden', () => {
  const loading = reducer(initialState, SessionsActions.load());
  const failed = reducer(loading, SessionsActions.loadFailure({ error: 'Offline' }));

  expect(loading.loading).toBe(true);
  expect(failed).toEqual({ ...initialState, loading: false, error: 'Offline' });
  expect(initialState.loading).toBe(false); // Ausgangszustand unverändert (immutable)
});

it('liefert nur die Favoriten-Sessions', () => {
  expect(sessionsFeature.selectFavoriteSessions.projector(sessions, [7])).toEqual([sessions[1]]);
});
```

`createFeature` erzeugt die Selectors (`selectSessions`, `selectFavoriteIds`, …) automatisch; zusätzliche stehen in `extraSelectors`.

## Effects mit provideMockActions und Marbles

Der Effect aus Lab 7.3 hört auf `load`, ruft `SessionApi.getSessions()` und meldet `loadSuccess` oder `loadFailure`.

```ts
let actions$: Observable<Action>;
const api = { getSessions: vi.fn() };

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideMockActions(() => actions$), // Fabrik: liest actions$ erst beim Abo
      { provide: SessionApi, useValue: api },
    ],
  });
  scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
});

it('meldet loadSuccess mit den geladenen Sessions', () => {
  scheduler.run(({ hot, cold, expectObservable }) => {
    actions$ = hot('--a', { a: SessionsActions.load() });
    api.getSessions.mockReturnValue(cold('---r|', { r: sessions })); // Antwort 3 Frames nach dem Abo

    // funktionaler Effect = Funktion mit inject()-Defaults → im Injection Context aufrufen
    const effect$ = TestBed.runInInjectionContext(() => loadSessions());

    expectObservable(effect$).toBe('-----s', { s: SessionsActions.loadSuccess({ sessions }) });
  });
});
```

`load` kommt bei Frame 2, die Antwort 3 Frames später: `loadSuccess` bei Frame 5. Für den Fehlerweg liefert der Mock stattdessen einen Fehler-Marble, z. B. `cold('#', undefined, new HttpErrorResponse({ status: 503 }))` (Fehlerobjekt als dritter Parameter, Lab 10.3); `catchError` im Effect macht daraus `loadFailure`.

Kürzere Alternative ohne TestBed: Funktionale Effects nehmen ihre Abhängigkeiten als Parameter, z. B. `loadSessions(of(SessionsActions.load()), api as unknown as SessionApi)`.

## Komponente mit provideMockStore

```ts
TestBed.configureTestingModule({
  imports: [FavoritesBadge],
  providers: [provideMockStore({ initialState: { sessions: initialState } })],
});
const store = TestBed.inject(MockStore);
store.overrideSelector(sessionsFeature.selectFavoriteCount, 3); // Selector liefert fest 3

const fixture = TestBed.createComponent(FavoritesBadge);
await fixture.whenStable();
expect(fixture.nativeElement.textContent).toContain('★ 3');

// am Ende jedes Tests: überschriebene Selectors zurücksetzen
afterEach(() => store.resetSelectors());
```

`store.setState({...})` setzt stattdessen den ganzen Zustand; die echten Selectors rechnen dann darauf.

## Signal Store mit gemocktem Service

Der Signal Store aus Lab 7.4 ist nicht `providedIn: 'root'`; der Test stellt ihn wie einen Service bereit.

```ts
const api = { getSessions: vi.fn(() => of(sessions)) };

function setup() {
  TestBed.configureTestingModule({
    providers: [SessionsStore, { provide: SessionApi, useValue: api }],
  });
  return TestBed.inject(SessionsStore);
}

it('lädt Sessions über die gemockte API in die Entities', () => {
  const store = setup();
  store.load(); // rxMethod; of(...) antwortet synchron
  expect(store.entities()).toEqual(sessions);
});

it('liefert die Favoriten-Sessions aus Entities und favoriteIds', () => {
  const store = setup();
  store.load();
  patchState(unprotected(store), { favoriteIds: [7] }); // Zustand direkt vorgeben
  expect(store.favorites()).toEqual([sessions[1]]);
});
```

`unprotected` aus `@ngrx/signals/testing` erlaubt `patchState` von außen; Methoden wie `toggleFavorite` ruft der Test dagegen direkt am Store auf (`store.toggleFavorite(…)`) und liest danach die Signale.

## NgRx Store und Signal Store im Testvergleich

| Kriterium | NgRx Store (Lab 7.2–7.3) | Signal Store (Lab 7.4) |
| --- | --- | --- |
| Testdateien für das Feature | Reducer, Selectors, Effects, Komponente getrennt | eine Datei für den Store |
| Logik ohne TestBed testbar | Reducer, Selectors, Effects mit Parametern | nein (Store braucht DI) |
| Asynchrones | Marbles mit `provideMockActions` | Mock-Service liefert `of(...)` / `throwError(...)` |
| Komponente isolieren | `provideMockStore` | eigenen Fake-Store per `{ provide: SessionsStore, useValue: … }` |

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| Zweiter Komponententest zeigt den Wert aus dem ersten | `overrideSelector` verändert den global geteilten Selector | `afterEach(() => store.resetSelectors())` |
| `NG0201: No provider found for Store` in einer Komponente | Komponente nutzt `Store`, Test stellt keinen bereit | `provideMockStore(...)` ergänzen |
| Effect-Test bleibt leer (`toBe('-----s')` erhält nichts) | `actions$` nach dem Erzeugen des Effects gesetzt oder nicht über Fabrik | `provideMockActions(() => actions$)` und `actions$` vor `loadSessions()` zuweisen |
| `NG0203: … inject() function must be called from an injection context` | Effect direkt aufgerufen | `TestBed.runInInjectionContext(() => loadSessions())` oder Parameter übergeben |
| Fehlerfall im Signal Store wirkt auf alle folgenden Tests | `mockReturnValue` statt `mockReturnValueOnce` | `mockReturnValueOnce(throwError(...))` |
| `entities()` leer nach `load()` | Mock liefert verzögert (`cold`, `delay`) | `of(...)` verwenden oder `await`/`TestScheduler` |

## Fazit

- Reducer und Selectors sind reine Funktionen und brauchen keine Test-Infrastruktur.
- Effects testet man mit `provideMockActions`, gemocktem Service und Marble-Diagrammen aus Lab 10.3.
- Komponenten mit Store bekommen `provideMockStore`; ein Signal Store wird per `TestBed.inject` mit gemocktem Service geprüft.

Die Übung schreibt je einen Test für Reducer, Effect und Signal Store.
