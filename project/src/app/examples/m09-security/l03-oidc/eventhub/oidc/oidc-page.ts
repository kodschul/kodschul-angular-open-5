import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { filter } from 'rxjs';

// Login über Keycloak (Authorization Code Flow + PKCE). Die Bibliothek erledigt Redirect, Code-Tausch und Prüfung.
@Component({
  selector: 'eh-oidc-page',
  imports: [JsonPipe],
  template: `
    <h1>Login über Keycloak (OIDC)</h1>
    @if (error(); as message) {
      <p class="error">{{ message }}</p>
    }
    @if (oidc.authenticated().isAuthenticated) {
      @if (oidc.userData().userData; as user) {
        <section class="card">
          <p>Angemeldet als <strong>{{ user.name }}</strong> ({{ user.preferred_username }}, {{ user.email }})</p>
          <p>Rollen: @for (role of user.roles ?? []; track role) { <span class="badge">{{ role }}</span> }</p>
        </section>
      }
      <section class="card">
        <h3>Claims aus dem ID-Token</h3>
        <pre>{{ idTokenClaims() | json }}</pre>
      </section>
      <button class="btn" type="button" (click)="logout()">Logout bei Keycloak</button>
    } @else {
      <p class="muted">Nicht angemeldet. Login leitet zu Keycloak weiter (Port 8080) und kommt hierher zurück.</p>
      <button class="btn btn-primary" type="button" (click)="login()">Login mit Keycloak</button>
    }
  `,
})
export class OidcPage {
  protected readonly oidc = inject(OidcSecurityService);
  protected readonly idTokenClaims = signal<unknown>(null);
  protected readonly error = signal<string | null>(null);

  constructor() {
    // Gegeben: Klick auf "Login" bei gestopptem Keycloak scheitert sonst still (nur Konsole).
    inject(PublicEventsService)
      .registerForEvents()
      .pipe(filter((event) => event.type === EventTypes.ConfigLoadingFailed), takeUntilDestroyed())
      .subscribe(() => this.error.set('Keycloak nicht erreichbar (http://localhost:8080). Läuft docker compose up?'));

    // Nach dem Rücksprung steht ?code=…&state=… in der URL: checkAuth tauscht den Code gegen Tokens.
    // Ohne Code prüft checkAuth, ob gültige Tokens im sessionStorage liegen.
    this.oidc.checkAuth().subscribe({
      next: ({ isAuthenticated }) => {
        if (isAuthenticated) {
          this.oidc.getPayloadFromIdToken().subscribe((claims) => this.idTokenClaims.set(claims));
        }
      },
      // z. B. Keycloak gestoppt: .well-known/openid-configuration nicht ladbar
      error: () => this.error.set('Keycloak nicht erreichbar (http://localhost:8080). Läuft docker compose up?'),
    });
  }

  login(): void {
    this.oidc.authorize(); // Redirect zu Keycloak, inkl. code_challenge (PKCE)
  }

  logout(): void {
    this.oidc.logoff().subscribe(); // Redirect zum end_session_endpoint von Keycloak
  }
}
