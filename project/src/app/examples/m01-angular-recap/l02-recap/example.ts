// Lab 1.2: "Fix the EventHub" – reparierte Fassung. Liste, Detail per Query-Parameter, Favoriten.
import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { SessionApi } from '../../../shared/api';
import { FavoritesService } from './favorites.service';
import { SessionCard } from './session-card';
import { SessionDetail } from './session-detail';

@Component({
  selector: 'app-recap-example',
  imports: [AsyncPipe, SessionCard, SessionDetail], // Fix 1: SessionCard importieren
  template: `
    <h1>EventHub – Sessions</h1>
    <p class="muted">Gemerkt: {{ favorites.count }}</p>

    @if (id) {
      <app-session-detail [sessionId]="id" />
    }

    @if (sessions$ | async; as sessions) {
      <div class="grid">
        @for (session of sessions; track session.id) {
          <!-- Fix 2: [session] bindet das Objekt, session="session" nur den Text "session" -->
          <app-session-card
            [session]="session"
            [isFavorite]="favorites.has(session.id)"
            (toggleFavorite)="favorites.toggle($event)"
          />
        }
      </div>
    } @else {
      <p class="loading">Lade Sessions …</p>
    }
  `,
})
export class RecapExample {
  private readonly api = inject(SessionApi);
  protected readonly favorites = inject(FavoritesService);

  /** Query-Parameter ?id=… ; withComponentInputBinding() in app.config.ts setzt ihn als Input. */
  @Input() id?: string;

  protected readonly sessions$ = this.api.getSessions();
}
