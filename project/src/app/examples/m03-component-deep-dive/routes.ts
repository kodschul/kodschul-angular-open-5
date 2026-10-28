import { Routes } from '@angular/router';

// Routen der Beispiele dieses Moduls: path = Lab-Ordnername (z. B. 'l01-…').
export default [
  {
    path: 'l01-control-flow',
    title: 'Lab 3.1 Control Flow Syntax',
    loadComponent: () => import('./l01-control-flow/example').then((m) => m.ControlFlowExample),
  },
  {
    path: 'l02-defer',
    title: 'Lab 3.2 Deferred Loading',
    loadComponent: () => import('./l02-defer/example').then((m) => m.DeferExample),
  },
  {
    path: 'l03-directives',
    title: 'Lab 3.3 Standalone Directives und Host Directives',
    loadComponent: () => import('./l03-directives/example').then((m) => m.DirectivesExample),
  },
] satisfies Routes;
