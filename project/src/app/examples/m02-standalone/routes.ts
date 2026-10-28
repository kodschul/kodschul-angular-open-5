import { Routes } from '@angular/router';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername (z. B. 'l01-…').
export default [
  {
    path: 'l01-standalone',
    title: 'Lab 2.1 Standalone statt NgModule',
    loadComponent: () => import('./l01-standalone/example').then((m) => m.StandaloneExample),
  },
  {
    // Fehlerfall: /examples/m02-standalone/l02-bootstrapping?configUrl=/config-fehlt.json
    path: 'l02-bootstrapping',
    title: 'Lab 2.2 Bootstrapping mit app.config.ts und app.routes.ts',
    loadComponent: () => import('./l02-bootstrapping/example').then((m) => m.BootstrappingExample),
  },
  {
    path: 'l03-migration',
    title: 'Lab 2.3 Bestandsprojekt migrieren',
    loadComponent: () => import('./l03-migration/example').then((m) => m.MigrationExample),
  },
] satisfies Routes;
