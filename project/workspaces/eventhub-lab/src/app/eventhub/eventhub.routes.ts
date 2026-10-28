import { Routes } from '@angular/router';
import { AdminPage } from './admin/admin-page';
import { SessionsPage } from './sessions/sessions-page';
import { Shell } from './shell';
import { SpeakerDetail } from './speakers/speaker-detail';
import { SpeakerList } from './speakers/speaker-list';

// Ausgangszustand Lab 8.1: alle Seiten statisch importiert -> alles im Start-Bundle.
export const EVENTHUB_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sessions' },
      { path: 'sessions', title: 'Sessions', component: SessionsPage },
      { path: 'speakers', title: 'Speaker', component: SpeakerList },
      { path: 'speakers/:id', title: 'Speaker', component: SpeakerDetail },
      { path: 'admin', title: 'Admin', component: AdminPage },
    ],
  },
];

export default EVENTHUB_ROUTES;
