import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', title: 'EventHub – Programm', loadComponent: () => import('./sessions/session-list').then((m) => m.SessionList) },
];
