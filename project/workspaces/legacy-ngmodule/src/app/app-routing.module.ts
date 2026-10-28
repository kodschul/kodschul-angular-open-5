import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about.component';

const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  // Feature-Modul wird lazy geladen (klassische Schreibweise mit loadChildren + Modulklasse)
  {
    path: 'sessions',
    loadChildren: () => import('./sessions/sessions.module').then((m) => m.SessionsModule),
  },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'sessions' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
