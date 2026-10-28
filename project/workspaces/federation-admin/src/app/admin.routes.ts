import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard';

/**
 * Öffentliche Routen des Remotes (in federation.config.mjs als './routes' freigegeben).
 * Keine eigenen Provider für HttpClient: Im Host nutzt der Remote den HttpClient des Hosts
 * (inklusive Interceptors, z. B. für das Token aus Lab 9.2), allein gestartet den aus app.config.ts.
 */
export const ADMIN_ROUTES: Routes = [{ path: '', component: AdminDashboard, title: 'EventHub – Admin' }];
