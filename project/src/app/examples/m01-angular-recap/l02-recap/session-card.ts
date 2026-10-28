import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Session } from '../../../shared/models';

/** Kindkomponente: bekommt eine Session (@Input) und meldet "Merken" nach oben (@Output). */
@Component({
  selector: 'app-session-card',
  imports: [DatePipe, RouterLink], // Fix 3: DatePipe importieren
  template: `
    <div class="card">
      <strong>{{ session.title }}</strong>
      <!-- Fix Zusatz 1: Minuten sind "mm", "MM" wäre der Monat -->
      <p class="muted">{{ session.start | date: 'dd.MM.yyyy, HH:mm' }} · {{ session.room }}</p>
      <div class="row">
        <!-- Fix 5: [routerLink]="[]" bleibt auf der aktuellen Route, queryParams hängt ?id=… an -->
        <a [routerLink]="[]" [queryParams]="{ id: session.id }">Details</a>
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
    this.toggleFavorite.emit(this.session.id); // Fix 6: Event an die Elternkomponente weitergeben
  }
}
