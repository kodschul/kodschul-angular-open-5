import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import * as sessionsEffects from './l03-effects/sessions.effects';
import { sessionsFeature as sessionsFeature73 } from './l03-effects/sessions.feature';
import { sessionsFeature as sessionsFeature72 } from './l02-store/sessions.feature';
import { provideEffectsRuntimeAtRoute } from './shared/effects-at-route';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername.
// Lab 7.2 und 7.3 bekommen je einen eigenen NgRx Store an ihrer Route (Kurs-App: Beispiele bleiben getrennt).
// In einer normalen App stehen provideStore() und provideStoreDevtools() einmal in app.config.ts.
export default [
  {
    path: 'l01-state-decision',
    title: 'Lab 7.1 Welcher State gehört wohin?',
    loadComponent: () => import('./l01-state-decision/example').then((m) => m.StateDecisionExample),
  },
  {
    path: 'l02-store',
    title: 'Lab 7.2 NgRx Store',
    providers: [
      provideStore(),
      provideState(sessionsFeature72),
      // nach provideStore(): DevTools ersetzen den Zustandsstrom des Stores
      provideStoreDevtools({ name: 'EventHub Lab 7.2', maxAge: 25 }),
    ],
    loadComponent: () => import('./l02-store/example').then((m) => m.StoreExample),
  },
  {
    path: 'l03-effects',
    title: 'Lab 7.3 Effects',
    providers: [
      provideStore(),
      provideState(sessionsFeature73),
      provideEffectsRuntimeAtRoute(),
      provideEffects(sessionsEffects),
      provideStoreDevtools({ name: 'EventHub Lab 7.3', maxAge: 25 }),
    ],
    loadComponent: () => import('./l03-effects/example').then((m) => m.EffectsExample),
  },
  {
    path: 'l04-signal-store',
    title: 'Lab 7.4 NgRx Signal Store',
    loadComponent: () => import('./l04-signal-store/example').then((m) => m.SignalStoreExample),
  },
  {
    path: 'l05-events',
    title: 'Lab 7.5 Events-Plugin',
    loadComponent: () => import('./l05-events/example').then((m) => m.EventsExample),
  },
] satisfies Routes;
