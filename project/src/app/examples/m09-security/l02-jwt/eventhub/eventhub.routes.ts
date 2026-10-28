import { Routes } from '@angular/router';
import { adminMatchGuard, loggedInGuard } from './auth/auth.guards';
import { SessionsPage } from './sessions/sessions-page';
import { SessionsStore } from './sessions/sessions-store';
import { Shell } from './shell';

// Ergebnis Lab 9.2: Login, Konto nur mit Login, Admin nur mit Rolle admin.
export const EVENTHUB_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sessions' },
      { path: 'sessions', title: 'Sessions', component: SessionsPage, providers: [SessionsStore] },
      { path: 'speakers', data: { preload: true }, loadChildren: () => import('./speakers/speakers.routes') },
      { path: 'login', title: 'Login', loadComponent: () => import('./auth/login-page').then((m) => m.LoginPage) },
      {
        path: 'account',
        title: 'Mein Konto',
        canActivate: [loggedInGuard],
        loadComponent: () => import('./account/account-page').then((m) => m.AccountPage),
      },
      {
        path: 'admin',
        title: 'Admin',
        canMatch: [adminMatchGuard], // ohne Admin-Rolle wird admin-page nie geladen
        loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage),
      },
      {
        path: 'admin', // gleicher Pfad, greift nur, wenn der Guard oben false liefert
        title: 'Kein Zugriff',
        loadComponent: () => import('./auth/no-access-page').then((m) => m.NoAccessPage),
      },
    ],
  },
];

export default EVENTHUB_ROUTES;
