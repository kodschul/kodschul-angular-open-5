import { Routes } from '@angular/router';
import { Home } from './launcher/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'EventHub – Kurs-Beispiele' },
  {
    path: 'playground',
    title: 'Playground',
    loadComponent: () => import('./playground/playground').then((m) => m.Playground),
  },
  { path: 'examples/m01-angular-recap', loadChildren: () => import('./examples/m01-angular-recap/routes') },
  { path: 'examples/m02-standalone', loadChildren: () => import('./examples/m02-standalone/routes') },
  { path: 'examples/m03-component-deep-dive', loadChildren: () => import('./examples/m03-component-deep-dive/routes') },
  { path: 'examples/m04-reactive-forms', loadChildren: () => import('./examples/m04-reactive-forms/routes') },
  { path: 'examples/m05-rxjs', loadChildren: () => import('./examples/m05-rxjs/routes') },
  { path: 'examples/m06-signals', loadChildren: () => import('./examples/m06-signals/routes') },
  { path: 'examples/m07-ngrx', loadChildren: () => import('./examples/m07-ngrx/routes') },
  { path: 'examples/m08-advanced-routing', loadChildren: () => import('./examples/m08-advanced-routing/routes') },
  { path: 'examples/m09-security', loadChildren: () => import('./examples/m09-security/routes') },
  { path: 'examples/m10-testing', loadChildren: () => import('./examples/m10-testing/routes') },
  { path: 'examples/m11-libraries', loadChildren: () => import('./examples/m11-libraries/routes') },
  { path: 'examples/m12-microfrontends-pwa', loadChildren: () => import('./examples/m12-microfrontends-pwa/routes') },
  { path: 'examples/m13-performance-docker', loadChildren: () => import('./examples/m13-performance-docker/routes') },
  { path: 'examples/m14-ci-transfer', loadChildren: () => import('./examples/m14-ci-transfer/routes') },
  { path: '**', redirectTo: '' },
];
