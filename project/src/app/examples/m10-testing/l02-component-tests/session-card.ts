import { Component, input, model } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Session } from '../../../shared/models';

// Code unter Test: Session-Karte mit der API aus Lab 6.3
// (Signal-Input für die Session, model() für den Favoriten-Schalter).
@Component({
  selector: 'app-session-card',
  imports: [DatePipe],
  template: `
    <article class="card" data-cy="session-card">
      <h3>{{ session().title }}</h3>
      <p class="muted">{{ session().start | date: 'dd.MM. HH:mm' }} · {{ session().room }}</p>
      <button
        type="button"
        class="btn"
        [attr.aria-pressed]="favorite()"
        (click)="favorite.set(!favorite())"
      >
        {{ favorite() ? '★ Favorit' : '☆ Merken' }}
      </button>
    </article>
  `,
})
export class SessionCard {
  readonly session = input.required<Session>();
  readonly favorite = model(false);
}
