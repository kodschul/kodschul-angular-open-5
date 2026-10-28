import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { Session } from '@nx-eventhub/models';
import { SessionCard } from './session-card';

/** Seite: lädt die Sessions von der Mock-API (Port 3000) und zeigt sie als Karten. */
@Component({
  selector: 'app-session-list',
  imports: [SessionCard],
  template: `
    <h1>Programm</h1>
    @if (sessions.isLoading()) {
      <p class="loading">Lade Sessions …</p>
    } @else if (sessions.error()) {
      <p class="muted">Mock-API nicht erreichbar. Läuft <code>npm run api</code> im Kursprojekt?</p>
    } @else {
      <div class="grid">
        @for (session of sessions.value(); track session.id) {
          <app-session-card [session]="session" />
        }
      </div>
    }
  `,
})
export class SessionList {
  protected readonly sessions = httpResource<Session[]>(() => 'http://localhost:3000/sessions', { defaultValue: [] });
}
