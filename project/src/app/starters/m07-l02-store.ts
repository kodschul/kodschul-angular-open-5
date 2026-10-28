// Starter Lab 7.2: Session-Liste aus dem NgRx Store.
// Kopieren nach src/app/playground/playground.ts; Ordner m07-l02-store/ nach src/app/playground/m07-l02-store/.
import { Component, signal } from '@angular/core';
import { SessionList } from '../examples/m07-ngrx/shared/session-list';
import { Session } from '../shared/models';

@Component({
  selector: 'app-playground',
  imports: [SessionList],
  template: `
    <h1>Sessions (NgRx Store)</h1>
    <p class="muted">Favoriten: {{ favoriteSessions().length }}</p>
    @for (favorite of favoriteSessions(); track favorite.id) {
      <span class="badge badge-ok">{{ favorite.title }}</span>
    }

    @if (loading()) {
      <p class="loading">Lade Sessions …</p>
    }
    @if (error(); as message) {
      <p class="error">{{ message }}</p>
    }

    <app-m07-session-list
      [sessions]="sessions()"
      [favoriteIds]="favoriteIds()"
      (favoriteToggled)="toggleFavorite($event)"
    />
  `,
})
export class Playground {
  // Aufgabe 5: Store per inject() holen und diese Platzhalter durch store.selectSignal(...) ersetzen
  readonly sessions = signal<Session[]>([]);
  readonly favoriteIds = signal<number[]>([]);
  readonly favoriteSessions = signal<Session[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Aufgabe 6: im Konstruktor „Opened“ melden, Sessions laden und das Ergebnis als Action melden

  toggleFavorite(sessionId: number): void {
    // Aufgabe 5: Action „Favorite Toggled“ auslösen
    console.log('Favorit umschalten', sessionId);
  }
}
