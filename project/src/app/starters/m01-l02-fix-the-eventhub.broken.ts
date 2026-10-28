// Starter Lab 1.2 "Fix the EventHub" – enthält absichtlich Fehler.
// Kopieren: diese Datei -> src/app/playground/playground.ts,
//           Ordner m01-l02-fix-the-eventhub/ -> src/app/playground/m01-l02-fix-the-eventhub/
//           und dort session-card.broken.ts in session-card.ts umbenennen (siehe Übung).
import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { SessionApi } from '../shared/api';
import { FavoritesService } from './m01-l02-fix-the-eventhub/favorites.service';
import { SessionCard } from './m01-l02-fix-the-eventhub/session-card';
import { SessionDetail } from './m01-l02-fix-the-eventhub/session-detail';

@Component({
  selector: 'app-playground',
  imports: [AsyncPipe, SessionDetail],
  template: `
    <h1>EventHub – Sessions</h1>
    <p class="muted">Gemerkt: {{ favorites.count }}</p>

    @if (id) {
      <app-session-detail [sessionId]="id" />
    }

    @if (sessions$ | async; as sessions) {
      <div class="grid">
        @for (session of sessions; track session.id) {
          <app-session-card
            session="session"
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
export class Playground {
  private readonly api = inject(SessionApi);
  protected readonly favorites = inject(FavoritesService);

  /** Query-Parameter ?id=… ; withComponentInputBinding() in app.config.ts setzt ihn als Input. */
  @Input() id?: string;

  protected readonly sessions$ = this.api.getSessions();
}
