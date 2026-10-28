import { Routes } from '@angular/router';

// Allein gestartet (Port 4201) zeigt der Remote seine Admin-Routen direkt an.
export const routes: Routes = [
  { path: '', loadChildren: () => import('./admin.routes').then((m) => m.ADMIN_ROUTES) },
];
