import { Routes } from '@angular/router';

// Die Labs von Modul 12 laufen in eigenen Workspaces; die Seiten hier zeigen nur, wo sie liegen.
export default [
  {
    path: 'l01-mfe-architecture',
    title: 'Lab 12.1 Micro-Frontend-Architektur',
    loadComponent: () => import('./l01-mfe-architecture/example').then((m) => m.MfeArchitectureExample),
  },
  {
    path: 'l02-native-federation',
    title: 'Lab 12.2 Native Federation',
    loadComponent: () => import('./l02-native-federation/example').then((m) => m.NativeFederationExample),
  },
  {
    path: 'l03-pwa',
    title: 'Lab 12.3 Progressive Web App',
    loadComponent: () => import('./l03-pwa/example').then((m) => m.PwaExample),
  },
] satisfies Routes;
