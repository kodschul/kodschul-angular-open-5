import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SessionDetailComponent } from './session-detail.component';
import { SessionListComponent } from './session-list.component';
import { SessionsRoutingModule } from './sessions-routing.module';

// Feature-Modul: Sessions-Liste und Detail, lazy geladen über app-routing.module.ts
@NgModule({
  declarations: [SessionListComponent, SessionDetailComponent],
  imports: [SharedModule, SessionsRoutingModule],
})
export class SessionsModule {}
