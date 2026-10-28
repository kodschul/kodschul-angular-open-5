import { Component, booleanAttribute, computed, input, model, output } from '@angular/core';
import { Session } from '../../../shared/models';

// Lab 6.3: Session-Karte mit Signal-APIs statt @Input/@Output.
@Component({
  selector: 'app-session-card',
  template: `
    <article class="card">
      <div class="row">
        <strong>{{ session().title }}</strong>
        <button class="btn" (click)="toggleFavorite()" [attr.aria-pressed]="favorite()">
          {{ favorite() ? '★ Favorit' : '☆ Merken' }}
        </button>
      </div>
      @if (!compact()) {
        <p>{{ session().abstract }}</p>
      }
      <p class="muted">{{ session().level }} · noch {{ seatsLeft() }} Plätze</p>
      <button class="btn" (click)="selected.emit(session())">Details</button>
    </article>
  `,
})
export class SessionCard {
  /** Pflicht-Input: ohne [session] meldet der Compiler einen Fehler. */
  readonly session = input.required<Session>();
  /** Erlaubt <app-session-card compact />: transform macht aus "" ein true. */
  readonly compact = input(false, { transform: booleanAttribute });
  /** model(): Input "favorite" plus Output "favoriteChange" in einem. */
  readonly favorite = model(false);
  readonly selected = output<Session>();

  // Inputs sind Signals: abgeleitete Werte direkt per computed
  protected readonly seatsLeft = computed(() => this.session().capacity - this.session().booked);

  protected toggleFavorite(): void {
    this.favorite.update((value) => !value); // sendet favoriteChange
  }
}
