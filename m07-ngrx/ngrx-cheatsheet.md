# NgRx-Cheatsheet

Schnellreferenz für Modul 7 (Lab 7.1–7.5). Versionen: NgRx 22.0 (`@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`, `@ngrx/signals`), Stand 28.10.2026.

## Wohin mit dem Zustand? (Lab 7.1)

| Zustand | Ort |
| --- | --- |
| nur eine Komponente, verschwindet mit ihr | `signal()` in der Komponente |
| soll per Link oder Lesezeichen wiederherstellbar sein | URL (Pfad, Query-Parameter) |
| soll nur einen Reload überleben | Ort wie unten wählen, zusätzlich speichern (`localStorage`, Server) |
| Eingaben vor dem Absenden | Formular (Reactive Forms, Signal Forms) |
| geteilt, wenig Logik | Service mit Signals |
| geteilt, Laden/Fehler/Speichern, Sammlungen | NgRx Signal Store |
| viele Teams, jede Änderung nachvollziehbar, NgRx-Bestand | NgRx Store |

## Actions (Lab 7.2)

| Syntax | Wirkung |
| --- | --- |
| `createActionGroup({ source: 'Sessions Page', events: { ... } })` | Gruppe von Actions einer Quelle |
| `Opened: emptyProps()` | Action ohne Daten, Funktion `opened()` |
| `'Favorite Toggled': props<{ sessionId: number }>()` | Action mit Daten, Funktion `favoriteToggled({ sessionId })` |
| `type` einer Action | `'[Sessions Page] Favorite Toggled'` |
| `store.dispatch(sessionsPageActions.opened())` | Action an den Store schicken |

## Reducer, Feature, Selectors (Lab 7.2)

| Syntax | Wirkung |
| --- | --- |
| `createReducer(initialState, on(action, (state, props) => ({ ...state, ... })))` | Reducer; jede `on`-Funktion liefert ein neues Objekt |
| `on(a1, a2, (state) => ...)` | eine Reaktion auf mehrere Actions |
| `createFeature({ name: 'sessions', reducer })` | Feature mit automatischen Selectors `selectSessionsState`, `selectSessions`, … |
| `extraSelectors: ({ selectA, selectB }) => ({ selectX: createSelector(selectA, selectB, (a, b) => ...) })` | eigene abgeleitete Selectors |
| `store.selectSignal(sessionsFeature.selectSessions)` | Selector als Signal |
| `store.select(selector)` | Selector als Observable (für `async`-Pipe) |

## Registrieren (Lab 7.2–7.3)

| Syntax | Wirkung |
| --- | --- |
| `provideStore()` | Store anlegen (normale App: `app.config.ts`; Kurs-App: an der Lab-Route) |
| `provideState(sessionsFeature)` | Feature einhängen |
| `provideEffects(sessionsEffects)` | Effects registrieren (`import * as sessionsEffects from '...'`) |
| `provideStoreDevtools({ name, maxAge: 25, logOnly: !isDevMode() })` | Redux DevTools anbinden; nach `provideStore()` |
| `provideEffectsRuntimeAtRoute()` | nur Kurs-App: Effects-Laufzeit an der Route (`examples/m07-ngrx/shared/effects-at-route.ts`) |

## Effects (Lab 7.3)

| Syntax | Wirkung |
| --- | --- |
| `createEffect((actions$ = inject(Actions)) => actions$.pipe(...), { functional: true })` | funktionaler Effect |
| `ofType(a1, a2)` | nur diese Actions durchlassen |
| `switchMap(() => api.get().pipe(map(...), catchError(() => of(failure(...)))))` | Laden; `catchError` innen |
| `exhaustMap(...)` | Speichern per Button; Klicks während des Speicherns ignorieren |
| `concatMap(...)` | jede Änderung nacheinander speichern |
| `{ functional: true, dispatch: false }` | Effect ohne Ergebnis-Action (Logging, Navigation) |

## Redux DevTools (Lab 7.2–7.5)

| Element | Wirkung |
| --- | --- |
| Tab **Redux** in den Browser-Entwicklertools | Liste aller Actions der gewählten Instanz |
| Tabs **Action** / **State** / **Diff** | Daten der Action, Zustand danach, geänderte Felder |
| **Jump** | zu einem früheren Zustand springen (klassischer Store) |

## Fehlerfall testen (Lab 7.3–7.4)

| Element | Wirkung |
| --- | --- |
| Schalter `<app-api-fail-switch />` | Mock-API-Fehler an/aus; betrifft nur API-Anfragen (Laden), nicht das lokale Speichern |
| `POST /_control {"fail":500}` / `{"fail":0}` | dasselbe per `curl` im Terminal |

## Signal Store (Lab 7.4)

| Syntax | Wirkung |
| --- | --- |
| `signalStore(withState(...), withComputed(...), withMethods(...), withHooks(...))` | Store-Klasse aus Features; Reihenfolge zählt |
| `signalStore({ providedIn: 'root' }, ...)` | app-weiter Singleton |
| `providers: [SessionsStore]` an der Komponente | Instanz pro Komponente |
| `withState<SessionsState>({ ... })` | Startzustand, jedes Feld ein Signal |
| `withComputed(({ a, b }) => ({ x: computed(() => ...) }))` | abgeleitete Werte |
| `withMethods((store, api = inject(Api)) => ({ ... }))` | Methoden, Abhängigkeiten per `inject()` |
| `withHooks({ onInit(store) { store.load(); } })` | Code beim Erzeugen des Stores |
| `patchState(store, { loading: true })` | Felder setzen (nur im Store) |
| `patchState(store, (state) => ({ ... }))` | neuer Wert aus aktuellem Zustand |
| `rxMethod<void>(pipe(tap(...), switchMap(...)))` | Methode mit RxJS-Pipeline (`@ngrx/signals/rxjs-interop`) |
| `store.load()` / `store.search(signal)` | einmal auslösen / bei jeder Signal-Änderung |

## Entities (Lab 7.4)

| Syntax | Wirkung |
| --- | --- |
| `withEntities<Session>()` | Zustand `ids`, `entityMap`; Signal `entities()` |
| `setAllEntities(list)` | Sammlung ersetzen |
| `addEntity(x)` / `setEntity(x)` | hinzufügen / hinzufügen oder ersetzen |
| `updateEntity({ id, changes: { ... } })` | Felder eines Eintrags ändern |
| `removeEntity(id)` | Eintrag entfernen |

## Events-Plugin (Lab 7.5)

| Syntax | Wirkung |
| --- | --- |
| `eventGroup({ source: 'Session Admin', events: { cancelled: type<{ sessionId: number }>() } })` | Event-Gruppe (`@ngrx/signals/events`, `type` aus `@ngrx/signals`) |
| `event('[Quelle] name', type<P>())` | einzelnes Event |
| `withReducer(on(event, ({ payload }, state) => ({ ... })))` | Zustandsübergang bei einem Event |
| `withEventHandlers((store, events = inject(Events)) => ({ x$: events.on(event).pipe(...) }))` | Seiteneffekt bei einem Event (früher `withEffects`) |
| `dispatch = injectDispatch(gruppe)` → `dispatch.cancelled({ ... })` | Event auslösen (als Feld anlegen) |
| `inject(Dispatcher).dispatch(event(payload))` | Event auslösen ohne Gruppe |
| `withDevtools('name')` aus `@angular-architects/ngrx-toolkit` | Signal Store in den Redux DevTools (optional, Version `prüfen`) |

## Vokabular: klassischer Store ↔ Signal Store

| NgRx Store | Signal Store | Signal Store + Events |
| --- | --- | --- |
| Action | Methodenaufruf | Event |
| Reducer (`on`) | `patchState` in einer Methode | `withReducer(on(...))` |
| Selector | `withComputed` | `withComputed` |
| Effect | `rxMethod` | `withEventHandlers` |
| `store.dispatch(a())` | `store.methode()` | `dispatch.event()` |
| `store.selectSignal(sel)` | `store.feld()` | `store.feld()` |
