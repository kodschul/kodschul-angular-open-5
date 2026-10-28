import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionDetailComponent } from './session-detail.component';
import { SessionListComponent } from './session-list.component';

const routes: Routes = [
  { path: '', component: SessionListComponent },
  { path: ':id', component: SessionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsRoutingModule {}
