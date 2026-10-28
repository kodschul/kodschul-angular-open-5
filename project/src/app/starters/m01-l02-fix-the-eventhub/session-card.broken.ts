// Teil des Starters Lab 1.2 – enthält absichtlich Fehler. Nach dem Kopieren in session-card.ts umbenennen.
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Session } from '../../shared/models';

@Component({
  selector: 'app-session-card',
  imports: [RouterLink],
  template: `
    <div class="card">
      <strong>{{ session.title }}</strong>
      <p class="muted">{{ session.start | date: 'dd.MM.yyyy, HH:MM' }} · {{ session.room }}</p>
      <div class="row">
        <a [routerLink]="[]">Details</a>
        <button class="btn" (click)="onFavorite()">{{ isFavorite ? '★ Gemerkt' : '☆ Merken' }}</button>
      </div>
    </div>
  `,
})
export class SessionCard {
  @Input({ required: true }) session!: Session;
  @Input() isFavorite = false;
  @Output() toggleFavorite = new EventEmitter<number>();

  onFavorite(): void {
    console.log('Merken geklickt', this.session.id);
  }
}
