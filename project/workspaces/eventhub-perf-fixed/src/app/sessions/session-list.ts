import { httpResource } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventHubConfigService } from '../config';
import { Session } from '../session';

/** Session plus vorberechneter Score: das Template ruft keine teure Methode mehr auf. */
interface SessionView {
  session: Session;
  score: number;
}

// Session-Liste nach Lab 13.2.
// Fix 3: Score einmal pro Datenstand in computed() berechnen, track nach session.id.
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
        @for (item of filtered(); track item.session.id) {
          <article class="card" [class.score-high]="item.score > 50" [class.score-low]="item.score <= 50">
            <h3><a [routerLink]="['/sessions', item.session.id]">{{ item.session.title }}</a></h3>
            <p class="muted">{{ item.session.track }} · {{ item.session.room }} · {{ item.session.durationMin }} min</p>
            <span class="badge">Empfehlung {{ item.score }} %</span>
            <span class="badge">{{ item.session.capacity - item.session.booked }} Plätze frei</span>
          </article>
        } @empty {
          <p class="muted">Keine Session passt zur Suche.</p>
        }
      </div>
    } @else if (sessions.error()) {
      <p class="error">Programm konnte nicht geladen werden. Läuft die Mock-API (npm run api)?</p>
    } @else {
      <!-- Platz für die Liste reservieren, damit nachfolgende Inhalte nicht springen -->
      <p class="loading list-skeleton">Programm wird geladen …</p>
    }
  `,
  styles: `
    .list-skeleton { min-height: 1200px; }
  `,
})
export class SessionList {
  private readonly config = inject(EventHubConfigService).config;

  readonly query = signal('');
  readonly sessions = httpResource<Session[]>(() => `${this.config.apiUrl}/sessions`);

  /** Läuft nur, wenn neue Daten kommen – nicht bei jedem Tick und nicht bei jeder Eingabe. */
  private readonly scored = computed<SessionView[]>(() => {
    const list = this.sessions.hasValue() ? this.sessions.value() : [];
    return list.map((session) => ({ session, score: relevance(session) }));
  });

  readonly filtered = computed(() => {
    const term = this.query().toLowerCase();
    return this.scored().filter((item) => item.session.title.toLowerCase().includes(term));
  });

  private readonly now = signal(Date.now());
  private readonly lastRefresh = signal(Date.now());
  readonly secondsSinceRefresh = computed(() => Math.round((this.now() - this.lastRefresh()) / 1000));

  constructor() {
    const tick = setInterval(() => this.now.set(Date.now()), 1000);
    const refresh = setInterval(() => {
      this.sessions.reload();
      this.lastRefresh.set(Date.now());
    }, 10_000);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(tick);
      clearInterval(refresh);
    });
  }
}

/** „Empfehlungs-Score“ – weiterhin teuer, läuft aber nur einmal pro Session und Datenstand. */
function relevance(session: Session): number {
  let score = 0;
  for (let i = 0; i < 100_000; i++) {
    score += Math.sqrt(i % (session.id + 7)) * Math.sin(i);
  }
  return Math.round(Math.abs(score) % 100);
}
