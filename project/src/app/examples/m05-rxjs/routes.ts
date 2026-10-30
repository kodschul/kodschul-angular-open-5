import { Routes } from '@angular/router';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername.
export default [
  {
    path: 'l01-marbles',
    title: 'Lab 5.1 Observables und Marble-Diagramme',
    loadComponent: () => import('./l01-marbles/example').then((m) => m.MarblesExample),
  },
  {
    // Fehlerbild: mergeMap mit debounceTime(0), praktisch startet jeder Tastendruck eine Anfrage,
    // alte Antworten können neue überholen
    path: 'l02-operators/ohne',
    title: 'Lab 5.2 Live-Suche mit mergeMap (Fehlerbild)',
    data: { flatten: 'merge', debounceMs: 0 },
    loadComponent: () => import('./l02-operators/example').then((m) => m.OperatorsExample),
  },
  {
    path: 'l02-operators',
    title: 'Lab 5.2 Live-Suche mit switchMap',
    data: { flatten: 'switch' },
    loadComponent: () => import('./l02-operators/example').then((m) => m.OperatorsExample),
  },
  {
    path: 'l03-debugging',
    title: 'Lab 5.3 Streams debuggen und aufräumen',
    loadComponent: () => import('./l03-debugging/example').then((m) => m.DebuggingExample),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'ticker-leck' },
      { path: 'ticker-leck', loadComponent: () => import('./l03-debugging/leaky-ticker').then((m) => m.LeakyTicker) },
      { path: 'ticker', loadComponent: () => import('./l03-debugging/fixed-ticker').then((m) => m.FixedTicker) },
      { path: 'info', loadComponent: () => import('./l03-debugging/info-page').then((m) => m.InfoPage) },
    ],
  },
] satisfies Routes;
