import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../models';
import { SessionService } from './session.service';

@Component({
  selector: 'app-session-list',
  standalone: false,
  template: `
    <h1>Sessions</h1>
    <div *ngIf="sessions$ | async as sessions; else loading" class="grid">
      <article *ngFor="let session of sessions" class="card">
        <h3>
          <a [routerLink]="[session.id]">{{ session.title }}</a>
        </h3>
        <p class="muted">
          {{ session.start | date: 'EEE, dd.MM. HH:mm' }} · {{ session.durationMin | duration }}
        </p>
        <app-level-badge [level]="session.level"></app-level-badge>
      </article>
    </div>
    <ng-template #loading><p class="loading">Lade Sessions …</p></ng-template>
  `,
})
export class SessionListComponent implements OnInit {
  sessions$!: Observable<Session[]>;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessions$ = this.sessionService.getSessions();
  }
}
