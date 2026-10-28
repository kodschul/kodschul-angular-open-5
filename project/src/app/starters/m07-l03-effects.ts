// Starter Lab 7.3: Laden und Speichern über Effects.
// Kopieren nach src/app/playground/playground.ts; Ordner m07-l03-effects/ nach src/app/playground/m07-l03-effects/.
// Die Komponente ist fertig: Sie meldet nur Ereignisse. Die Arbeit passiert in m07-l03-effects/sessions.effects.ts.
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiFailSwitch } from '../examples/m07-ngrx/shared/api-fail-switch';
import { SessionList } from '../examples/m07-ngrx/shared/session-list';
import { sessionsPageActions } from './m07-l03-effects/sessions.actions';
import { sessionsFeature } from './m07-l03-effects/sessions.feature';

@Component({
  selector: 'app-playground',
  imports: [SessionList, ApiFailSwitch],
  template: `
    <h1>Sessions (NgRx Store + Effects)</h1>
    <app-api-fail-switch />

    <div class="row">
      <button class="btn" (click)="reload()">Neu laden</button>
      <button class="btn btn-primary" [disabled]="favoriteIds().length === 0" (click)="saveFavorites()">
        Favoriten speichern ({{ favoriteIds().length }})
      </button>
      @if (saving()) {
        <span class="loading">Speichere …</span>
      } @else if (savedCount() !== null) {
        <span class="badge badge-ok">{{ savedCount() }} Favoriten gespeichert</span>
      }
    </div>

    @if (loading()) {
      <p class="loading">Lade Sessions …</p>
    }
    @if (error(); as message) {
      <div class="card">
        <p class="error">{{ message }}</p>
        <button class="btn" (click)="reload()">Erneut versuchen</button>
      </div>
    }

    <app-m07-session-list
      [sessions]="sessions()"
      [favoriteIds]="favoriteIds()"
      (favoriteToggled)="toggleFavorite($event)"
    />
  `,
})
export class Playground {
  private readonly store = inject(Store);

  readonly sessions = this.store.selectSignal(sessionsFeature.selectSessions);
  readonly favoriteIds = this.store.selectSignal(sessionsFeature.selectFavoriteIds);
  readonly loading = this.store.selectSignal(sessionsFeature.selectLoading);
  readonly error = this.store.selectSignal(sessionsFeature.selectError);
  readonly saving = this.store.selectSignal(sessionsFeature.selectSaving);
  readonly savedCount = this.store.selectSignal(sessionsFeature.selectSavedCount);

  constructor() {
    // Kein HTTP-Aufruf mehr in der Komponente (anders als in Lab 7.2)
    this.store.dispatch(sessionsPageActions.opened());
  }

  reload(): void {
    this.store.dispatch(sessionsPageActions.reloadClicked());
  }

  toggleFavorite(sessionId: number): void {
    this.store.dispatch(sessionsPageActions.favoriteToggled({ sessionId }));
  }

  saveFavorites(): void {
    this.store.dispatch(sessionsPageActions.saveFavoritesClicked({ favoriteIds: this.favoriteIds() }));
  }
}
