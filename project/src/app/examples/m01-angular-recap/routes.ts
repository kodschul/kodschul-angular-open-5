import { Routes } from '@angular/router';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername (z. B. 'l01-…').
export default [
  {
    path: 'l01-workspace',
    title: 'Lab 1.1 Kurs-Workspace und Angular 22',
    loadComponent: () => import('./l01-workspace/example').then((m) => m.WorkspaceExample),
  },
  {
    path: 'l02-recap',
    title: 'Lab 1.2 Recap: Fix the EventHub',
    loadComponent: () => import('./l02-recap/example').then((m) => m.RecapExample),
  },
] satisfies Routes;
