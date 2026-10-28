import { Routes } from '@angular/router';

// Die Labs von Modul 11 laufen in eigenen Workspaces; die Seiten hier zeigen nur, wo sie liegen.
export default [
  { path: 'l01-nx', title: 'Lab 11.1 Nx Workspace', loadComponent: () => import('./l01-nx/example').then((m) => m.NxExample) },
  {
    path: 'l02-library',
    title: 'Lab 11.2 Angular Library',
    loadComponent: () => import('./l02-library/example').then((m) => m.LibraryExample),
  },
  {
    path: 'l03-elements',
    title: 'Lab 11.3 Angular Elements',
    loadComponent: () => import('./l03-elements/example').then((m) => m.ElementsExample),
  },
] satisfies Routes;
