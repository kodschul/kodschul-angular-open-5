import { DatePipe, JsonPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { API_URL } from '../../../shared/api';
import { LoginResponse } from '../../../shared/models';
import { decodeJwt } from './jwt';

// Lab 9.1: Token holen, lesen und zeigen, dass ein verändertes Token beim Server durchfällt.
@Component({
  selector: 'app-tokens-example',
  imports: [DatePipe, JsonPipe],
  template: `
    <h1>JWT lesen, nicht vertrauen</h1>
    <div class="row">
      <button class="btn btn-primary" (click)="login('user@eventhub.test', 'user123')">Login als User</button>
      <button class="btn" (click)="login('admin@eventhub.test', 'admin123')">Login als Admin</button>
    </div>

    @if (decoded(); as jwt) {
      <section class="card">
        <h3>Token (drei Teile, durch Punkte getrennt)</h3>
        <p style="word-break: break-all"><code>{{ token() }}</code></p>
      </section>
      <div class="grid">
        <section class="card"><h3>Header</h3><pre>{{ jwt.header | json }}</pre></section>
        <section class="card"><h3>Payload</h3><pre>{{ jwt.payload | json }}</pre></section>
      </div>
      <section class="card">
        <p>Rolle: <span class="badge">{{ jwt.payload.role }}</span></p>
        <p>Ausgestellt: {{ jwt.payload.iat * 1000 | date: 'dd.MM.yyyy HH:mm:ss' }}</p>
        <p>Läuft ab: {{ jwt.payload.exp * 1000 | date: 'dd.MM.yyyy HH:mm:ss' }}</p>
      </section>

      <section class="card">
        <h3>Gegenprobe: GET /admin/stats</h3>
        <div class="row">
          <button class="btn" (click)="callAdmin(token())">mit echtem Token</button>
          <button class="btn" (click)="callAdmin(forgedToken())">mit gefälschter Rolle "admin"</button>
        </div>
        @if (adminResult()) {
          <p><code>{{ adminResult() }}</code></p>
        }
      </section>
    }
  `,
})
export class TokensExample {
  private readonly http = inject(HttpClient);
  protected readonly token = signal('');
  protected readonly decoded = computed(() => (this.token() ? decodeJwt(this.token()) : null));
  protected readonly adminResult = signal('');

  /** Payload mit role "admin" neu kodiert, Signatur unverändert -> Server muss ablehnen. */
  protected readonly forgedToken = computed(() => {
    const jwt = this.decoded();
    if (!jwt) return '';
    const [header, , signature] = this.token().split('.');
    const fakePayload = btoa(JSON.stringify({ ...jwt.payload, role: 'admin' }))
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return `${header}.${fakePayload}.${signature}`;
  });

  login(email: string, password: string): void {
    this.adminResult.set('');
    this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, { email, password })
      .subscribe((res) => this.token.set(res.accessToken));
  }

  callAdmin(token: string): void {
    this.http.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }).subscribe({
      next: (stats) => this.adminResult.set(`200 OK ${JSON.stringify(stats)}`),
      error: (err: HttpErrorResponse) => this.adminResult.set(`${err.status} ${err.error?.message ?? ''}`),
    });
  }
}
