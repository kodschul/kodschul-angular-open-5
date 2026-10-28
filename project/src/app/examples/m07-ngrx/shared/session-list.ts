// Modul 7: gemeinsame Anzeige der Session-Liste für Lab 7.2–7.4.
// Reine Darstellung: Daten kommen per input(), Klicks gehen per output() hinaus (Lab 6.3).
// Woher die Daten stammen (NgRx Store oder Signal Store), weiß die Komponente nicht.
import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Session } from '../../../shared/models';

@Component({
  selector: 'app-m07-session-list',
  imports: [DatePipe],
  template: `
    @for (session of sessions(); track session.id) {
      <div class="card">
        <div class="row">
          <strong>{{ session.title }}</strong>
          <span class="badge">{{ session.type === 'workshop' ? 'Workshop' : 'Talk' }}</span>
        </div>
        <p class="muted">
          {{ session.start | date: 'EEE, HH:mm' }} · {{ session.room }} ·
          {{ session.speaker?.name ?? 'Speaker folgt' }}
        </p>
        <button class="btn" (click)="favoriteToggled.emit(session.id)">
          {{ favoriteIds().includes(session.id) ? '★ Favorit' : '☆ Merken' }}
        </button>
      </div>
    } @empty {
      <p class="muted">Keine Sessions geladen.</p>
    }
  `,
})
export class SessionList {
  readonly sessions = input.required<Session[]>();
  readonly favoriteIds = input<number[]>([]);
  readonly favoriteToggled = output<number>();
}
