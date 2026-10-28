import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { filter } from 'rxjs';

// Starter Lab 9.3: Seite für den Login über Keycloak.
@Component({
  selector: 'eh-oidc-page',
  imports: [JsonPipe],
  template: `
    <h1>Login über Keycloak (OIDC)</h1>
    @if (error(); as message) {
      <p class="error">{{ message }}</p>
    }
    @if (oidc.authenticated().isAuthenticated) {
      <!-- TODO 6: Name, preferred_username, E-Mail und Rollen aus oidc.userData().userData anzeigen -->
      <section class="card">
        <h3>Claims aus dem ID-Token</h3>
        <pre>{{ idTokenClaims() | json }}</pre>
      </section>
      <button class="btn" type="button" (click)="logout()">Logout bei Keycloak</button>
    } @else {
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

    // TODO 5: checkAuth() aufrufen; wenn angemeldet, getPayloadFromIdToken() in idTokenClaims schreiben;
    //         bei Fehler (Keycloak nicht erreichbar) einen Hinweis in error setzen
  }

  login(): void {
    // TODO 5: Login bei Keycloak starten
  }

  logout(): void {
    this.oidc.logoff().subscribe();
  }
}
