import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SessionDetail } from './sessions/session-detail';

export const routes: Routes = [
  { path: '', component: Home, title: 'EventHub – Konferenz 2027' },
  { path: 'sessions/:id', component: SessionDetail, title: 'EventHub – Session' },
  { path: '**', redirectTo: '' },
];
