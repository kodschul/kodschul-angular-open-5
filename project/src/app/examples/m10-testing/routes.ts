import { Routes } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { sessionsFeature } from './l04-store-tests/sessions.feature';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername.
export default [
  {
    path: 'l01-strategy',
    title: 'Lab 10.1 Teststrategie und Vitest',
    loadComponent: () => import('./l01-strategy/example').then((m) => m.StrategyExample),
  },
  {
    path: 'l02-component-tests',
    title: 'Lab 10.2 Komponenten- und Service-Tests',
    loadComponent: () =>
      import('./l02-component-tests/example').then((m) => m.ComponentTestsExample),
  },
  {
    path: 'l03-marble-testing',
    title: 'Lab 10.3 Marble-Testing für RxJS-Streams',
    loadComponent: () => import('./l03-marble-testing/example').then((m) => m.MarbleTestingExample),
  },
  {
    path: 'l04-store-tests',
    title: 'Lab 10.4 Stores testen',
    // Eigener Store nur für dieses Beispiel (die App-Konfiguration enthält keinen Store).
    // provideEffects bräuchte den Store im Root-Injector, deshalb lädt die Beispielseite selbst (siehe example.ts).
    providers: [provideStore({ [sessionsFeature.name]: sessionsFeature.reducer })],
    loadComponent: () => import('./l04-store-tests/example').then((m) => m.StoreTestsExample),
  },
  {
    path: 'l05-cypress',
    title: 'Lab 10.5 End-to-End-Tests mit Cypress',
    loadComponent: () => import('./l05-cypress/example').then((m) => m.CypressExample),
  },
] satisfies Routes;
