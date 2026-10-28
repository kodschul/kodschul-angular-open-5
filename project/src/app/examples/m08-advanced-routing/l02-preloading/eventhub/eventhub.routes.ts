import { Routes } from '@angular/router';
import { SessionsPage } from './sessions/sessions-page';
import { SessionsStore } from './sessions/sessions-store';
import { Shell } from './shell';

// Ergebnis Lab 8.2: Speaker wird im Hintergrund vorgeladen, Admin nie.
export const EVENTHUB_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sessions' },
      { path: 'sessions', title: 'Sessions', component: SessionsPage, providers: [SessionsStore] },
      {
        path: 'speakers',
        data: { preload: true }, // Markierung für DelayedPreloading
        loadChildren: () => import('./speakers/speakers.routes'),
      },
      {
        path: 'admin',
        title: 'Admin',
        data: { preload: false }, // ausdrücklich: nur laden, wenn jemand den Admin-Bereich öffnet
        loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage),
      },
    ],
  },
];

export default EVENTHUB_ROUTES;
