import { Routes } from '@angular/router';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername (z. B. 'l01-…').
export default [
  {
    path: 'l01-typed-forms',
    title: 'Lab 4.1 Typed Reactive Forms',
    loadComponent: () => import('./l01-typed-forms/example').then((m) => m.TypedFormsExample),
  },
  {
    path: 'l02-validators',
    title: 'Lab 4.2 Eigene Validatoren',
    loadComponent: () => import('./l02-validators/example').then((m) => m.ValidatorsExample),
  },
  {
    path: 'l03-custom-control',
    title: 'Lab 4.3 Eigenes Formular-Control',
    loadComponent: () => import('./l03-custom-control/example').then((m) => m.CustomControlExample),
  },
] satisfies Routes;
