import { Routes } from '@angular/router';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername.
export default [
  {
    path: 'l01-signals',
    title: 'Lab 6.1 Signals API',
    loadComponent: () => import('./l01-signals/example').then((m) => m.SignalsExample),
  },
  {
    // Detail per Query-Parameter: /examples/m06-signals/l02-interop?id=3
    path: 'l02-interop',
    title: 'Lab 6.2 Signals und Observables im Zusammenspiel',
    loadComponent: () => import('./l02-interop/example').then((m) => m.InteropExample),
  },
  {
    path: 'l03-communication',
    title: 'Lab 6.3 Komponenten-Kommunikation mit Signals',
    loadComponent: () => import('./l03-communication/example').then((m) => m.CommunicationExample),
  },
  {
    path: 'l04-signal-forms',
    title: 'Lab 6.4 Signal Forms',
    loadComponent: () => import('./l04-signal-forms/example').then((m) => m.SignalFormsExample),
  },
] satisfies Routes;
