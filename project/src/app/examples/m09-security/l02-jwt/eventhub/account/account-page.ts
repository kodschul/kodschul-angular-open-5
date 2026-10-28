import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { decodeJwt } from '../auth/jwt';
import { API_URL, User } from '../data';

// Geschützt per loggedInGuard. GET /auth/me braucht das Token -> Interceptor hängt es an.
@Component({
  selector: 'eh-account-page',
  imports: [DatePipe],
  template: `
    <h1>Mein Konto</h1>
    @if (me.hasValue()) {
      <p class="card">Server kennt: <strong>{{ me.value().name }}</strong> ({{ me.value().email }}), Rolle {{ me.value().role }}</p>
    } @else if (me.error()) {
      <p class="error">Anfrage abgelehnt.</p>
    }
    <p class="muted">Token läuft ab: {{ expiresAt() | date: 'HH:mm:ss' }}</p>
    <button class="btn" (click)="me.reload()">Erneut beim Server fragen</button>
  `,
})
export class AccountPage {
  private readonly auth = inject(AuthService);
  protected readonly me = httpResource<User>(() => `${API_URL}/auth/me`);
  protected readonly expiresAt = computed(() => {
    const token = this.auth.token();
    return token ? decodeJwt(token).payload.exp * 1000 : null;
  });
}
