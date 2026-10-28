import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'EventHub – Konferenz 2027' },
  {
    // Detailseite als eigener Chunk (Lazy Loading aus Lab 8.1)
    path: 'sessions/:id',
    loadComponent: () => import('./sessions/session-detail').then((m) => m.SessionDetail),
    title: 'EventHub – Session',
  },
  { path: '**', redirectTo: '' },
];
