import { Routes } from '@angular/router';
import { SessionsPage } from './sessions/sessions-page';
import { SessionsStore } from './sessions/sessions-store';
import { Shell } from './shell';

// Ergebnis Lab 8.1: Sessions bleiben im Start-Bundle, Speaker und Admin werden nachgeladen.
export const EVENTHUB_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sessions' },
      {
        path: 'sessions',
        title: 'Sessions',
        component: SessionsPage,
        providers: [SessionsStore], // Store existiert nur in diesem Feature
      },
      {
        path: 'speakers',
        loadChildren: () => import('./speakers/speakers.routes'), // ganze Routen-Datei, default export
      },
      {
        path: 'admin',
        title: 'Admin',
        loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage), // eine Komponente
      },
    ],
  },
];

export default EVENTHUB_ROUTES;
