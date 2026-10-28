import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';

/** Versionsnummer des Remotes: in Lab 12.2 ändern, nur den Remote neu bauen. */
export const ADMIN_VERSION = '1.0.0';

interface SessionLoad {
  id: number;
  title: string;
  capacity: number;
  booked: number;
}

/** Admin-Übersicht: Auslastung aller Sessions (Mock-API, Port 3000). */
@Component({
  selector: 'admin-dashboard',
  template: `
    <section class="card">
      <h2>Admin-Bereich <span class="badge">Remote v{{ version }}</span></h2>
      @if (sessions.isLoading()) {
        <p class="loading">Lade Auslastung …</p>
      } @else if (sessions.error()) {
        <p class="muted">Mock-API nicht erreichbar (npm run api im Kursprojekt).</p>
      } @else {
        <p class="muted">{{ sessions.value().length }} Sessions, {{ fullCount() }} ausgebucht</p>
        <ul>
          @for (s of sessions.value(); track s.id) {
            <li>{{ s.title }}: {{ s.booked }} / {{ s.capacity }}</li>
          }
        </ul>
      }
    </section>
  `,
})
export class AdminDashboard {
  protected readonly version = ADMIN_VERSION;
  protected readonly sessions = httpResource<SessionLoad[]>(() => 'http://localhost:3000/sessions', { defaultValue: [] });
  protected readonly fullCount = computed(() => this.sessions.value().filter((s) => s.booked >= s.capacity).length);
}
