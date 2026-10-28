import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Session } from '../models';
import { SessionService } from './session.service';

@Component({
  selector: 'app-session-detail',
  standalone: false,
  template: `
    <a routerLink="/sessions">← Alle Sessions</a>
    <ng-container *ngIf="session$ | async as session; else loading">
      <h1>{{ session.title }}</h1>
      <p class="muted">
        {{ session.start | date: 'EEEE, dd.MM.yyyy HH:mm' }} · {{ session.room }} ·
        {{ session.durationMin | duration }}
      </p>
      <app-level-badge [level]="session.level"></app-level-badge>
      <p>{{ session.abstract }}</p>
      <p *ngIf="session.speaker">
        Speaker: {{ session.speaker.name }} ({{ session.speaker.company }})
      </p>
    </ng-container>
    <ng-template #loading><p class="loading">Lade Session …</p></ng-template>
  `,
})
export class SessionDetailComponent implements OnInit {
  session$!: Observable<Session>;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.session$ = this.sessionService.getSession(id);
  }
}
