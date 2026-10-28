// Lab 7.4: Gleiche Oberfläche wie Lab 7.3, Zustand aus dem Signal Store.
import { Component, inject } from '@angular/core';
import { ApiFailSwitch } from '../shared/api-fail-switch';
import { SessionList } from '../shared/session-list';
import { SessionsStore } from './sessions.store';

@Component({
  selector: 'app-signal-store-example',
  imports: [SessionList, ApiFailSwitch],
  // Store-Instanz lebt so lange wie diese Seite
  providers: [SessionsStore],
  template: `
    <h1>Sessions (NgRx Signal Store)</h1>
    <app-api-fail-switch />

    <div class="row">
      <button class="btn" (click)="store.load()">Neu laden</button>
      <button class="btn btn-primary" [disabled]="store.favoriteCount() === 0" (click)="store.saveFavorites()">
        Favoriten speichern ({{ store.favoriteCount() }})
      </button>
      @if (store.saving()) {
        <span class="loading">Speichere …</span>
      } @else if (store.savedCount() !== null) {
        <span class="badge badge-ok">{{ store.savedCount() }} Favoriten gespeichert</span>
      }
    </div>

    @for (favorite of store.favoriteSessions(); track favorite.id) {
      <span class="badge badge-ok">{{ favorite.title }}</span>
    }

    @if (store.loading()) {
      <p class="loading">Lade Sessions …</p>
    }
    @if (store.error(); as message) {
      <div class="card">
        <p class="error">{{ message }}</p>
        <button class="btn" (click)="store.load()">Erneut versuchen</button>
      </div>
    }

    <app-m07-session-list
      [sessions]="store.entities()"
      [favoriteIds]="store.favoriteIds()"
      (favoriteToggled)="store.toggleFavorite($event)"
    />
  `,
})
export class SignalStoreExample {
  // Signals und Methoden direkt aus dem Store; kein Store.dispatch, keine Selectors
  readonly store = inject(SessionsStore);
}
