import { httpResource } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventHubConfigService } from '../config';
import { Session } from '../session';

// Session-Liste der langsamen Variante. Befund 3: teure Methode im Template, Tracking nach Objekt.
@Component({
  selector: 'app-session-list',
  imports: [RouterLink],
  template: `
    <div class="row">
      <input #search placeholder="Sessions durchsuchen" (input)="query.set(search.value)" />
      <span class="muted">Live-Auslastung · aktualisiert vor {{ secondsSinceRefresh() }} s</span>
    </div>

    @if (sessions.hasValue()) {
      <div class="grid" style="margin-top: 1rem">
        @for (session of filtered(); track session) {
          <article class="card" [class.score-high]="relevance(session) > 50" [class.score-low]="relevance(session) <= 50">
            <h3><a [routerLink]="['/sessions', session.id]">{{ session.title }}</a></h3>
            <p class="muted">{{ session.track }} · {{ session.room }} · {{ session.durationMin }} min</p>
            <span class="badge">Empfehlung {{ relevance(session) }} %</span>
            <span class="badge">{{ session.capacity - session.booked }} Plätze frei</span>
          </article>
        } @empty {
          <p class="muted">Keine Session passt zur Suche.</p>
        }
      </div>
    } @else if (sessions.error()) {
      <p class="error">Programm konnte nicht geladen werden. Läuft die Mock-API (npm run api)?</p>
    } @else {
      <p class="loading">Programm wird geladen …</p>
    }
  `,
})
export class SessionList {
  private readonly config = inject(EventHubConfigService).config;

  readonly query = signal('');
  readonly sessions = httpResource<Session[]>(() => `${this.config.apiUrl}/sessions`);
  readonly filtered = computed(() => {
    const term = this.query().toLowerCase();
    const list = this.sessions.hasValue() ? this.sessions.value() : [];
    return list.filter((s) => s.title.toLowerCase().includes(term));
  });

  private readonly now = signal(Date.now());
  private readonly lastRefresh = signal(Date.now());
  readonly secondsSinceRefresh = computed(() => Math.round((this.now() - this.lastRefresh()) / 1000));

  constructor() {
    // Uhr für „aktualisiert vor … s“: jede Sekunde ein neuer Wert, also jede Sekunde ein Template-Durchlauf
    const tick = setInterval(() => this.now.set(Date.now()), 1000);
    // Auslastung alle 10 s neu laden: liefert neue Objekte für dieselben Sessions
    const refresh = setInterval(() => {
      this.sessions.reload();
      this.lastRefresh.set(Date.now());
    }, 10_000);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(tick);
      clearInterval(refresh);
    });
  }

  /** „Empfehlungs-Score“ – absichtlich teuer (einige Millisekunden pro Aufruf). */
  relevance(session: Session): number {
    let score = 0;
    for (let i = 0; i < 100_000; i++) {
      score += Math.sqrt(i % (session.id + 7)) * Math.sin(i);
    }
    return Math.round(Math.abs(score) % 100);
  }
}
