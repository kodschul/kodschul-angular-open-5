// Lab 7.2: Session-Liste aus dem NgRx Store (ohne Effects).
// Store, Feature und DevTools sind an der Route registriert (examples/m07-ngrx/routes.ts).
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SessionApi } from '../../../shared/api';
import { SessionList } from '../shared/session-list';
import { sessionsApiActions, sessionsPageActions } from './sessions.actions';
import { sessionsFeature } from './sessions.feature';

@Component({
  selector: 'app-store-example',
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
export class StoreExample {
  private readonly store = inject(Store);
  private readonly api = inject(SessionApi);

  // Lesen: Selector -> Signal
  readonly sessions = this.store.selectSignal(sessionsFeature.selectSessions);
  readonly favoriteIds = this.store.selectSignal(sessionsFeature.selectFavoriteIds);
  readonly favoriteSessions = this.store.selectSignal(sessionsFeature.selectFavoriteSessions);
  readonly loading = this.store.selectSignal(sessionsFeature.selectLoading);
  readonly error = this.store.selectSignal(sessionsFeature.selectError);

  constructor() {
    this.store.dispatch(sessionsPageActions.opened());
    // Zwischenstand: Die Komponente lädt selbst und meldet das Ergebnis als Action.
    // Lab 7.3 verschiebt diesen Aufruf in einen Effect.
    this.api.getSessions().subscribe({
      next: (sessions) => this.store.dispatch(sessionsApiActions.sessionsLoadedSuccess({ sessions })),
      error: () => this.store.dispatch(sessionsApiActions.sessionsLoadedFailure({ error: 'Sessions konnten nicht geladen werden.' })),
    });
  }

  // Schreiben: nur Actions, die Komponente entscheidet nicht, wie sich der Zustand ändert
  toggleFavorite(sessionId: number): void {
    this.store.dispatch(sessionsPageActions.favoriteToggled({ sessionId }));
  }
}
