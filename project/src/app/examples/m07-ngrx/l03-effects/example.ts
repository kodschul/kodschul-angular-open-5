// Lab 7.3: Laden und Speichern über Effects; die Komponente kennt keinen HTTP-Aufruf mehr.
// Store, Feature, Effects und DevTools sind an der Route registriert (examples/m07-ngrx/routes.ts).
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiFailSwitch } from '../shared/api-fail-switch';
import { SessionList } from '../shared/session-list';
import { sessionsPageActions } from './sessions.actions';
import { sessionsFeature } from './sessions.feature';

@Component({
  selector: 'app-effects-example',
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
export class EffectsExample {
  private readonly store = inject(Store);

  readonly sessions = this.store.selectSignal(sessionsFeature.selectSessions);
  readonly favoriteIds = this.store.selectSignal(sessionsFeature.selectFavoriteIds);
  readonly loading = this.store.selectSignal(sessionsFeature.selectLoading);
  readonly error = this.store.selectSignal(sessionsFeature.selectError);
  readonly saving = this.store.selectSignal(sessionsFeature.selectSaving);
  readonly savedCount = this.store.selectSignal(sessionsFeature.selectSavedCount);

  constructor() {
    // nur noch das Ereignis melden; Laden übernimmt der Effect loadSessions
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
