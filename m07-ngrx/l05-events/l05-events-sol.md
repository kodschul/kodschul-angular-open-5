# Lab 7.5 – Lösung: Events-Plugin und Entscheidung im Team

Fertiges Beispiel: `src/app/examples/m07-ngrx/l05-events/` (`session.events.ts`, `sessions.store.ts`, `cart.store.ts`, `example.ts`), im Browser unter `/examples/m07-ngrx/l05-events`. Das Beispiel enthält zusätzlich `withDevtools` aus der Erweiterung.

## Aufgabe 1: Starter kopieren

```bash
cp src/app/starters/m07-l05-events.ts src/app/playground/playground.ts
cp -r src/app/starters/m07-l05-events src/app/playground/
```

## Aufgabe 2: Event-Gruppe

```ts
// src/app/playground/m07-l05-events/session.events.ts
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const sessionAdminEvents = eventGroup({
  source: 'Session Admin',
  events: {
    // Typ: '[Session Admin] cancelled', Payload: welche Session
    cancelled: type<{ sessionId: number; title: string }>(),
  },
});
```

## Aufgabe 3: Event auslösen

```ts
// src/app/playground/playground.ts (Ausschnitt)
import { injectDispatch } from '@ngrx/signals/events';
import { sessionAdminEvents } from './m07-l05-events/session.events';

export class Playground {
  readonly sessions = inject(SessionsStore);
  readonly cart = inject(CartStore);

  private readonly dispatch = injectDispatch(sessionAdminEvents);

  cancel(session: Session): void {
    // Die Komponente meldet nur, was passiert ist. Wer reagiert, entscheiden die Stores.
    this.dispatch.cancelled({ sessionId: session.id, title: session.title });
  }
}
```

## Aufgabe 4 und 6: SessionsStore

```ts
// src/app/playground/m07-l05-events/sessions.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { SessionApi } from '../../shared/api';
import { Session } from '../../shared/models';
import { sessionAdminEvents } from './session.events';

interface SessionsState {
  favoriteIds: number[];
  cancelledIds: number[];
  loading: boolean;
  error: string | null;
}

export const SessionsStore = signalStore(
  withEntities<Session>(),
  withState<SessionsState>({ favoriteIds: [], cancelledIds: [], loading: false, error: null }),

  withComputed(({ entities, favoriteIds, cancelledIds }) => ({
    favoriteSessions: computed(() =>
      entities().filter((s) => favoriteIds().includes(s.id) && !cancelledIds().includes(s.id)),
    ),
  })),

  withMethods((store, api = inject(SessionApi)) => ({
    toggleFavorite(sessionId: number): void {
      patchState(store, ({ favoriteIds }) => ({
        favoriteIds: favoriteIds.includes(sessionId)
          ? favoriteIds.filter((id) => id !== sessionId)
          : [...favoriteIds, sessionId],
      }));
    },
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
  })),

  // Reaktion auf das Ereignis: Zustandsübergang wie ein Reducer im klassischen Store
  withReducer(
    on(sessionAdminEvents.cancelled, ({ payload }, state) => ({
      cancelledIds: [...state.cancelledIds, payload.sessionId],
      favoriteIds: state.favoriteIds.filter((id) => id !== payload.sessionId),
    })),
  ),

  // Seiteneffekt auf ein Ereignis (wie ein Effect ohne Dispatch)
  withEventHandlers((_store, events = inject(Events)) => ({
    logCancelled$: events
      .on(sessionAdminEvents.cancelled)
      .pipe(tap(({ payload }) => console.info('[SessionsStore] abgesagt:', payload.title))),
  })),

  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
```

`favoriteIds` wird im selben Schritt bereinigt: Eine abgesagte Session soll nicht mehr als Favorit zählen. Der Handler `logCancelled$` liefert das empfangene Event unverändert weiter; das Plugin verschickt es nicht erneut, weil es aus `events.on(...)` stammt.

## Aufgabe 5: CartStore

```ts
// src/app/playground/m07-l05-events/cart.store.ts
import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { Session } from '../../shared/models';
import { sessionAdminEvents } from './session.events';

export interface CartItem {
  sessionId: number;
  title: string;
  price: number;
  tickets: number;
}

interface CartState {
  items: CartItem[];
  notice: string | null;
}

export const CartStore = signalStore(
  withState<CartState>({ items: [], notice: null }),

  withComputed(({ items }) => ({
    total: computed(() => items().reduce((sum, item) => sum + item.price * item.tickets, 0)),
    ticketCount: computed(() => items().reduce((sum, item) => sum + item.tickets, 0)),
  })),

  withMethods((store) => ({
    add(session: Session): void {
      patchState(store, ({ items }) => {
        const existing = items.find((item) => item.sessionId === session.id);
        return {
          notice: null,
          items: existing
            ? items.map((item) => (item === existing ? { ...item, tickets: item.tickets + 1 } : item))
            : [...items, { sessionId: session.id, title: session.title, price: session.price, tickets: 1 }],
        };
      });
    },
    remove(sessionId: number): void {
      patchState(store, ({ items }) => ({ items: items.filter((item) => item.sessionId !== sessionId) }));
    },
  })),

  // Dasselbe Ereignis wie im SessionsStore, eigene Reaktion
  withReducer(
    on(sessionAdminEvents.cancelled, ({ payload }, state) => {
      const affected = state.items.some((item) => item.sessionId === payload.sessionId);
      if (!affected) {
        return {};
      }
      return {
        items: state.items.filter((item) => item.sessionId !== payload.sessionId),
        notice: `„${payload.title}“ wurde abgesagt. Die Tickets wurden aus dem Warenkorb entfernt.`,
      };
    }),
  ),
);
```

Ablauf mit zwei Workshops im Warenkorb (Preise aus der Mock-API):

| Aktion | Warenkorb | Hinweis |
| --- | --- | --- |
| Workshop A zweimal, Workshop B einmal hinzufügen | 2 × A, 1 × B, Summe = 2 × Preis A + Preis B | – |
| Workshop A absagen | 1 × B, Summe = Preis B | „„A“ wurde abgesagt. Die Tickets wurden aus dem Warenkorb entfernt.“ |
| Einen Talk absagen | unverändert | unverändert (Reducer liefert `{}`) |

Konsole nach jeder Absage: `[SessionsStore] abgesagt: <Titel>`.

## Aufgabe 7: Entscheidungsnotiz (Beispiele)

**Beispiel 1 (Signal Store mit Events):**

> EventHub wird von sechs Entwickelnden in zwei Teams gebaut, ohne bestehenden NgRx-Code. Wir verwenden für Features mit Logik den NgRx Signal Store, für Ereignisse über Feature-Grenzen (z. B. Absagen) das Events-Plugin, für einfachen geteilten Zustand wie die eingeloggte Person einen Service mit Signals. Ausschlaggebend sind die geringe Codemenge pro Feature und dass Teilnehmenden-App und Admin-Bereich über Events gekoppelt sind, ohne sich direkt zu kennen. Den klassischen NgRx Store mit Actions, Reducern und Effects führen wir nicht ein. Wir prüfen die Entscheidung neu, wenn ein drittes Team dazukommt oder ein Audit den vollständigen Änderungsverlauf verlangt.

**Beispiel 2 (gemischt):**

> EventHub hat zwei Teams und einen Admin-Bereich, in dem jede Änderung nachvollziehbar sein soll. Die Teilnehmenden-App nutzt Signal Stores, der Admin-Bereich den NgRx Store mit Redux DevTools. Ausschlaggebend sind die Nachvollziehbarkeit im Admin-Bereich und die geringe Einarbeitung in der Teilnehmenden-App. Wir mischen die Ansätze nicht innerhalb eines Features. Wir prüfen neu, sobald das DevTools-Plugin für den Signal Store Zeitreise und benannte Events zuverlässig unterstützt.

## Aufgabe 8: Häufige Kriterien im Vergleich

| Kriterium | Wirkung auf die Entscheidung |
| --- | --- |
| Teamgröße und Anzahl Teams | mehr Teams → mehr Konvention, Events oder NgRx Store |
| Nachvollziehbarkeit (Audit, Debugging) | eingebauter DevTools-Verlauf spricht für NgRx Store |
| Bestehender Code | vorhandener NgRx Store bleibt, neue Features als Signal Store |
| Codemenge und Einarbeitung | spricht für Signal Store |

## Erweiterung

**DevTools:** Mit `withDevtools('sessions')` und `withDevtools('cart')` als erstem Feature zeigt der Tab Redux die Instanz „NgRx SignalStore“ mit den Zweigen `sessions` und `cart`. Nach einer Absage erscheint ein Eintrag „Store Update“; im Diff stehen `sessions.cancelledIds` und, falls betroffen, `cart.items` und `cart.notice`. Stand: 28.10.2026, Kompatibilität von `@angular-architects/ngrx-toolkit` 21.0.1 mit NgRx 22 `prüfen`.

**Event `restored`:**

```ts
// session.events.ts
events: {
  cancelled: type<{ sessionId: number; title: string }>(),
  restored: type<{ sessionId: number }>(),
},

// sessions.store.ts, im selben withReducer
on(sessionAdminEvents.restored, ({ payload }, state) => ({
  cancelledIds: state.cancelledIds.filter((id) => id !== payload.sessionId),
})),
```

```html
<!-- playground.ts, an abgesagten Sessions -->
@if (cancelled) {
  <button class="btn" (click)="dispatch.restored({ sessionId: session.id })">Absage zurücknehmen</button>
}
```

Dafür `dispatch` in `playground.ts` von `private` auf `readonly` (öffentlich) ändern. Der Warenkorb bleibt unverändert: Entfernte Tickets kommen nicht automatisch zurück.
