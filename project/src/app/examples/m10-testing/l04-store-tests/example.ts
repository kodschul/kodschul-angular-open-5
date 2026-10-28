import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionApi } from '../../../shared/api';
import { Store } from '@ngrx/store';
import { FavoritesBadge } from './favorites-badge';
import { SessionsActions, sessionsFeature } from './sessions.feature';
import { SessionsStore } from './sessions.store';

// Lab 10.4: dieselbe Favoriten-Logik einmal im NgRx Store (links) und einmal im Signal Store (rechts).
// Den NgRx Store stellt die Route bereit (routes.ts), den Signal Store die Komponente.
// Die Lösung des Labs sind die *.spec.ts-Dateien.
@Component({
  selector: 'app-store-tests-example',
  imports: [FavoritesBadge],
  providers: [SessionsStore],
  template: `
    <h1>Lab 10.4: Stores testen</h1>
    <p class="muted">
      Tests: <code>npx ng test --include=src/app/examples/m10-testing/l04-store-tests</code>
    </p>

    <div class="grid">
      <section class="card">
        <h2>NgRx Store <app-favorites-badge /></h2>
        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
        @for (session of sessions(); track session.id) {
          <div class="row">
            <button type="button" class="btn" (click)="toggleInStore(session.id)">
              {{ favoriteIds().includes(session.id) ? '★' : '☆' }}
            </button>
            {{ session.title }}
          </div>
        }
      </section>

      <section class="card">
        <h2>
          Signal Store <span class="badge">★ {{ signalStore.favoriteCount() }}</span>
        </h2>
        @if (signalStore.error()) {
          <p class="error">{{ signalStore.error() }}</p>
        }
        @for (session of signalStore.entities(); track session.id) {
          <div class="row">
            <button type="button" class="btn" (click)="signalStore.toggleFavorite(session.id)">
              {{ signalStore.favoriteIds().includes(session.id) ? '★' : '☆' }}
            </button>
            {{ session.title }}
          </div>
        }
      </section>
    </div>
  `,
})
export class StoreTestsExample implements OnInit {
  private readonly store = inject(Store);
  private readonly api = inject(SessionApi);
  protected readonly signalStore = inject(SessionsStore);
  protected readonly sessions = this.store.selectSignal(sessionsFeature.selectSessions);
  protected readonly favoriteIds = this.store.selectSignal(sessionsFeature.selectFavoriteIds);
  protected readonly error = this.store.selectSignal(sessionsFeature.selectError);

  ngOnInit(): void {
    // Ohne provideEffects übernimmt die Seite die Arbeit des Effects aus sessions.effects.ts.
    this.store.dispatch(SessionsActions.load());
    this.api.getSessions().subscribe({
      next: (sessions) => this.store.dispatch(SessionsActions.loadSuccess({ sessions })),
      error: (error: HttpErrorResponse) =>
        this.store.dispatch(
          SessionsActions.loadFailure({ error: `Laden fehlgeschlagen (${error.status})` }),
        ),
    });
    this.signalStore.load();
  }

  protected toggleInStore(id: number): void {
    this.store.dispatch(SessionsActions.toggleFavorite({ id }));
  }
}
