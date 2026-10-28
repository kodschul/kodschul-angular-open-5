# Lab 7.4 – Lösung: NgRx Signal Store

Fertiges Beispiel: `src/app/examples/m07-ngrx/l04-signal-store/` (`sessions.store.ts`, `example.ts`), im Browser unter `/examples/m07-ngrx/l04-signal-store`. Die Route braucht keine Provider.

## Aufgabe 1: Starter kopieren, Route aufräumen

```bash
cp src/app/starters/m07-l04-signal-store.ts src/app/playground/playground.ts
cp -r src/app/starters/m07-l04-signal-store src/app/playground/
```

```ts
// src/app/app.routes.ts: Playground-Route wieder ohne Provider
{
  path: 'playground',
  title: 'Playground',
  loadComponent: () => import('./playground/playground').then((m) => m.Playground),
},
```

Der Signal Store braucht weder `provideStore` noch `provideEffects`; er wird in Aufgabe 1 schon über `providers: [SessionsStore]` an der Komponente bereitgestellt.

## Aufgabe 2: `withComputed` (Checkpoint)

```ts
export const SessionsStore = signalStore(
  withState(initialState),
  withComputed(({ favoriteIds }) => ({
    favoriteCount: computed(() => favoriteIds().length),
  })),
);
```

Template: `<p class="muted">Favoriten: {{ store.favoriteCount() }}</p>` zeigt `Favoriten: 2`.

## Aufgabe 3–6: Vollständiger Store

Endstand nach Aufgabe 6 (`favoriteIds` startet wieder mit `[]`):

```ts
// src/app/playground/m07-l04-signal-store/sessions.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { SessionApi } from '../../shared/api';
import { Session } from '../../shared/models';
import { FavoritesStorage } from '../../examples/m07-ngrx/shared/favorites-storage';

interface SessionsState {
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  savedCount: number | null;
}

const initialState: SessionsState = {
  favoriteIds: [],
  loading: false,
  error: null,
  saving: false,
  savedCount: null,
};

export const SessionsStore = signalStore(
  // Sessions als Entities: State ids + entityMap, abgeleitetes Signal entities()
  withEntities<Session>(),
  withState(initialState),

  // abgeleitete Werte (entspricht den Selectors aus Lab 7.2)
  withComputed(({ entities, favoriteIds }) => ({
    favoriteSessions: computed(() => entities().filter((session) => favoriteIds().includes(session.id))),
    favoriteCount: computed(() => favoriteIds().length),
  })),

  // Methoden (entspricht Actions + Reducer + Effects)
  withMethods((store, api = inject(SessionApi), storage = inject(FavoritesStorage)) => ({
    toggleFavorite(sessionId: number): void {
      // patchState: Teil-Zustand setzen; die Funktion bekommt den aktuellen Zustand
      patchState(store, ({ favoriteIds }) => ({
        favoriteIds: favoriteIds.includes(sessionId)
          ? favoriteIds.filter((id) => id !== sessionId)
          : [...favoriteIds, sessionId],
      }));
    },

    // rxMethod: Methode, die intern ein RxJS-Strom ist; switchMap wie im Effect aus Lab 7.3
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          api.getSessions().pipe(
            tap((sessions) => patchState(store, setAllEntities(sessions), { loading: false })),
            catchError((error: HttpErrorResponse) => {
              patchState(store, { loading: false, error: `Laden fehlgeschlagen (HTTP ${error.status})` });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    // exhaustMap wie in Lab 7.3: weitere Klicks während des Speicherns werden ignoriert
    saveFavorites: rxMethod<void>(
      pipe(
        exhaustMap(() => {
          patchState(store, { saving: true });
          return storage.save(store.favoriteIds()).pipe(
            tap((saved) => patchState(store, { saving: false, savedCount: saved.length })),
            catchError(() => {
              patchState(store, { saving: false, error: 'Speichern fehlgeschlagen' });
              return EMPTY;
            }),
          );
        }),
      ),
    ),
  })),

  // Lebenszyklus: beim Erzeugen des Stores einmal laden (ersetzt die Action „Opened“)
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
```

| Aufgabe | Ergänzung | Entspricht in Lab 7.2–7.3 |
| --- | --- | --- |
| 3 | `withEntities<Session>()`, `load` mit `rxMethod` + `switchMap`, `favoriteSessions` | `Sessions Loaded`-Actions, `on`-Fälle, Effect `loadSessions`, `selectFavoriteSessions` |
| 4 | `toggleFavorite` mit `patchState` | Action `Favorite Toggled` + `on`-Fall |
| 5 | `saveFavorites` mit `rxMethod` + `exhaustMap` | Action `Save Favorites Clicked`, Effect `saveFavorites`, zwei `on`-Fälle |
| 6 | `withHooks({ onInit })` | Action `Opened` aus dem Konstruktor der Komponente |

## Aufgabe 3–5: Komponente

```ts
// src/app/playground/playground.ts
import { Component, inject } from '@angular/core';
import { ApiFailSwitch } from '../examples/m07-ngrx/shared/api-fail-switch';
import { SessionList } from '../examples/m07-ngrx/shared/session-list';
import { SessionsStore } from './m07-l04-signal-store/sessions.store';

@Component({
  selector: 'app-playground',
  imports: [SessionList, ApiFailSwitch],
  // Store-Instanz lebt so lange wie diese Seite
  providers: [SessionsStore],
  template: `
    <h1>Sessions (NgRx Signal Store)</h1>
    <app-api-fail-switch />

    <div class="row">
      <button class="btn" (click)="store.load()">Neu laden</button>
      <button class="btn btn-primary" [disabled]="store.favoriteCount() === 0" (click)="store.saveFavorites()">
        Favoriten speichern ({{ store.favoriteCount() }})
      </button>
      @if (store.saving()) {
        <span class="loading">Speichere …</span>
      } @else if (store.savedCount() !== null) {
        <span class="badge badge-ok">{{ store.savedCount() }} Favoriten gespeichert</span>
      }
    </div>

    @for (favorite of store.favoriteSessions(); track favorite.id) {
      <span class="badge badge-ok">{{ favorite.title }}</span>
    }

    @if (store.loading()) {
      <p class="loading">Lade Sessions …</p>
    }
    @if (store.error(); as message) {
      <div class="card">
        <p class="error">{{ message }}</p>
        <button class="btn" (click)="store.load()">Erneut versuchen</button>
      </div>
    }

    <app-m07-session-list
      [sessions]="store.entities()"
      [favoriteIds]="store.favoriteIds()"
      (favoriteToggled)="store.toggleFavorite($event)"
    />
  `,
})
export class Playground {
  // Signals und Methoden direkt aus dem Store; kein Store.dispatch, keine Selectors
  readonly store = inject(SessionsStore);
}
```

Die Zeilen `Ladezustand: … · Favoriten-IDs: …` aus dem Starter und `Favoriten: N` aus Aufgabe 2 entfallen im Endstand: Den Zähler zeigt jetzt der Button „Favoriten speichern (N)“, die Favoriten selbst die grünen Badges. Wer die Zeile `Favoriten: N` behalten möchte, lässt sie über den Buttons stehen.

## Aufgabe 7: Fehlerfall

| Aktion | Seite |
| --- | --- |
| Schalter an, „Neu laden“ | „Laden fehlgeschlagen (HTTP 500)“, Liste bleibt mit dem alten Stand stehen |
| Schalter aus, „Erneut versuchen“ | Liste lädt, Fehlermeldung verschwindet (`error: null` beim Start von `load`) |

Die Erholung funktioniert, weil `catchError` im inneren Observable `EMPTY` liefert und die äußere Pipeline von `rxMethod` weiterläuft.

## Aufgabe 8: Codevergleich

| Aspekt | NgRx Store (Lab 7.3) | Signal Store (Lab 7.4) |
| --- | --- | --- |
| Dateien | 3 (`sessions.actions.ts`, `sessions.feature.ts`, `sessions.effects.ts`) plus Provider an der Route | 1 (`sessions.store.ts`), Provider an der Komponente |
| Zeilen ohne Imports, Kommentare, Leerzeilen | ca. 100 (18 + 44 + 36) | ca. 65 |
| Wo steht „Favorit umschalten“? | Action `Favorite Toggled` + `on`-Fall im Reducer | Methode `toggleFavorite` mit `patchState` |
| Wo steht der HTTP-Aufruf? | Effect `loadSessions` | `rxMethod` `load` |
| Was zeigen die Redux DevTools? | jede Action mit Zustand und Diff, Zeitreise | nichts ohne Zusatz-Plugin (Lab 7.5) |

**Einordnung:** Der Signal Store spart etwa ein Drittel Code und zwei Dateien. Er verliert die Actions als gemeinsame Sprache: Der Verlauf in den DevTools fehlt, und kein anderer Store kann auf „Favorit umgeschaltet“ reagieren, ohne den SessionsStore zu kennen.

## Erweiterung

**Suche mit `rxMethod<string>`:**

```ts
// withState: { ..., query: '' }
search: rxMethod<string>(
  pipe(
    debounceTime(300),
    tap((query) => patchState(store, { query, loading: true })),
    switchMap((query) =>
      api.getSessions({ q: query }).pipe(
        tap((sessions) => patchState(store, setAllEntities(sessions), { loading: false })),
        catchError(() => {
          patchState(store, { loading: false, error: 'Suche fehlgeschlagen' });
          return EMPTY;
        }),
      ),
    ),
  ),
),
```

```html
<input #q placeholder="Suche" (input)="store.search(q.value)" />
```

**`providedIn: 'root'`:** Mit `signalStore({ providedIn: 'root' }, ...)` und ohne `providers: [SessionsStore]` bleiben die Favoriten beim Wechsel zur Startseite und zurück erhalten; `onInit` läuft nur beim ersten Öffnen. Mit `providers` an der Komponente beginnt jede Rückkehr mit einem neuen Store.
