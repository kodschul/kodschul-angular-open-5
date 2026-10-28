import { Routes } from '@angular/router';
import { dashboardConfigResolver } from './l03-dynamic-components/dashboard-config.resolver';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername (z. B. 'l01-…').
export default [
  {
    // Mini-EventHub mit eigenen Kindrouten; Speaker und Admin werden nachgeladen.
    path: 'l01-lazy-loading',
    title: 'Lab 8.1 Lazy Loading',
    loadChildren: () => import('./l01-lazy-loading/eventhub/eventhub.routes'),
  },
  {
    // Gleiche Routen mit data.preload. Vorladen wirkt nur im Workspace eventhub-lab (Root-Router).
    path: 'l02-preloading',
    title: 'Lab 8.2 Preloading-Strategien',
    loadChildren: () => import('./l02-preloading/eventhub/eventhub.routes'),
  },
  {
    path: 'l03-dynamic-components',
    title: 'Lab 8.3 Dynamische Komponenten',
    resolve: { config: dashboardConfigResolver },
    loadComponent: () => import('./l03-dynamic-components/example').then((m) => m.DynamicDashboardExample),
  },
  {
    path: 'l03-dynamic-components/vcr',
    title: 'Lab 8.3 Dynamische Komponenten (ViewContainerRef)',
    resolve: { config: dashboardConfigResolver },
    loadComponent: () => import('./l03-dynamic-components/example-vcr').then((m) => m.DynamicDashboardVcrExample),
  },
] satisfies Routes;
