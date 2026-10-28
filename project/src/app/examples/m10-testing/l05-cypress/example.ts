import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { API_URL } from '../../../shared/api';
import { LoginResponse, Session, User } from '../../../shared/models';

/** Schlüssel im sessionStorage; cy.login (cypress/support/commands.ts) schreibt denselben Schlüssel. */
export const TOKEN_KEY = 'eventhub.token';

// Lab 10.5: kleine, eigenständige Seite für den E2E-Flow
// „Login → Session suchen → Favorit → Header-Zähler“. Alle prüfbaren Elemente tragen data-cy.
@Component({
  selector: 'app-cypress-example',
  template: `
    <header class="row card">
      <strong>EventHub</strong>
      @if (user(); as u) {
        <span data-cy="user-name">{{ u.name }}</span>
        <button type="button" class="btn" data-cy="logout" (click)="logout()">Abmelden</button>
      }
      <span class="badge" data-cy="favorites-count">★ {{ favoriteIds().length }}</span>
    </header>

    @if (!user()) {
      <form class="card" (submit)="$event.preventDefault(); login(email.value, password.value)">
        <h2>Anmelden</h2>
        <input #email type="email" placeholder="E-Mail" data-cy="login-email" />
        <input #password type="password" placeholder="Passwort" data-cy="login-password" />
        <button type="submit" class="btn btn-primary" data-cy="login-submit">Anmelden</button>
        @if (loginError()) {
          <p class="error" data-cy="login-error">{{ loginError() }}</p>
        }
      </form>
    } @else {
      <section class="card">
        <h2>Sessions suchen</h2>
        <input
          type="search"
          placeholder="Suchbegriff, z. B. testing"
          data-cy="search-input"
          (input)="terms.next($any($event.target).value)"
        />
        @if (searchError()) {
          <p class="error" data-cy="search-error">{{ searchError() }}</p>
        }
        <ul>
          @for (session of results(); track session.id) {
            <li data-cy="search-result">
              <button
                type="button"
                class="btn"
                data-cy="favorite-toggle"
                (click)="toggleFavorite(session.id)"
              >
                {{ favoriteIds().includes(session.id) ? '★' : '☆' }}
              </button>
              {{ session.title }}
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export class CypressExample implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user = signal<User | null>(null);
  protected readonly loginError = signal<string | null>(null);
  protected readonly results = signal<Session[]>([]);
  protected readonly searchError = signal<string | null>(null);
  protected readonly favoriteIds = signal<number[]>([]);
  protected readonly terms = new Subject<string>();

  ngOnInit(): void {
    // Token aus einem früheren Login (oder aus cy.login) wiederverwenden.
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) this.loadUser(token);

    this.terms
      .pipe(
        map((term) => term.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) =>
          this.http.get<Session[]>(`${API_URL}/sessions`, { params: { q } }).pipe(
            map((sessions) => ({ sessions, error: null })),
            catchError(() =>
              of({ sessions: [] as Session[], error: 'Sessions konnten nicht geladen werden.' }),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ sessions, error }) => {
        this.results.set(sessions);
        this.searchError.set(error);
      });
  }

  protected login(email: string, password: string): void {
    this.loginError.set(null);
    this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password }).subscribe({
      next: ({ accessToken, user }) => {
        sessionStorage.setItem(TOKEN_KEY, accessToken);
        this.user.set(user);
      },
      error: () => this.loginError.set('E-Mail oder Passwort falsch.'),
    });
  }

  protected logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.user.set(null);
    this.favoriteIds.set([]);
  }

  protected toggleFavorite(id: number): void {
    this.favoriteIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  private loadUser(token: string): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<User>(`${API_URL}/auth/me`, { headers }).subscribe({
      next: (user) => this.user.set(user),
      error: () => sessionStorage.removeItem(TOKEN_KEY), // abgelaufen → neu anmelden
    });
  }
}
