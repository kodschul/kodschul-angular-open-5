import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, Input, OnChanges, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';

/** Detailansicht: lädt die Session zur übergebenen ID über den SessionApi-Service. */
@Component({
  selector: 'app-session-detail',
  imports: [AsyncPipe, DatePipe, RouterLink],
  template: `
    @if (session$ | async; as session) {
      <div class="card">
        <h2>{{ session.title }}</h2>
        <p class="muted">
          {{ session.start | date: 'dd.MM.yyyy, HH:mm' }} · {{ session.durationMin }} min · {{ session.room }}
        </p>
        <p>{{ session.abstract }}</p>
        <p>Speaker: {{ session.speaker?.name ?? 'folgt' }}</p>
        <a [routerLink]="[]">Schließen</a>
      </div>
    } @else {
      <p class="loading">Lade Session …</p>
    }
  `,
})
export class SessionDetail implements OnChanges {
  private readonly api = inject(SessionApi);

  /** ID aus dem Query-Parameter, kommt als Text an */
  @Input({ required: true }) sessionId!: string;
  protected session$?: Observable<Session>;

  // Fix Zusatz 2: ngOnChanges statt ngOnInit, damit ein Wechsel der ID neu lädt
  ngOnChanges(): void {
    this.session$ = this.api.getSession(Number(this.sessionId));
  }
}
