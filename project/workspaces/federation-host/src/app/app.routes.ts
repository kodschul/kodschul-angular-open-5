import type { NativeFederationResult } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { Home } from './home';

export const routes = ({ loadRemoteModule }: NativeFederationResult): Routes => [
  { path: '', component: Home, title: 'EventHub' },
  {
    path: 'admin',
    // Lazy Loading wie in Lab 8.1, nur kommt der Code zur Laufzeit von einem anderen Server.
    loadChildren: () =>
      loadRemoteModule<typeof import('./admin-remote')>('federation-admin', './routes').then((m) => m.ADMIN_ROUTES),
  },
];
