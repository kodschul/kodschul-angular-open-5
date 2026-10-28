# Lab 9.3 – Lösung: OAuth 2.0 und OpenID Connect

Fertiges Ergebnis: `src/app/examples/m09-security/l03-oidc/` (Ordner `eventhub/`, `app.config.ts`, `oidc.config.ts`) für den Workspace `eventhub-lab`; Keycloak-Konfiguration in `workspaces/keycloak/`. Die Route `/examples/m09-security/l03-oidc` der Kurs-App ist eine Infoseite, weil `provideAuth` die Root-Konfiguration braucht.

## Aufgabe 1: Starter übernehmen

```bash
cp src/app/starters/m09-l03-oidc/oidc.config.ts workspaces/eventhub-lab/src/app/
cp -R src/app/starters/m09-l03-oidc/eventhub/oidc workspaces/eventhub-lab/src/app/eventhub/
```

## Aufgabe 2: Werte aus der Realm-Datei

| Eintrag | Wert |
| --- | --- |
| Realm | `eventhub` |
| Client-ID | `eventhub-spa`, `publicClient: true` |
| PKCE | `pkce.code.challenge.method: S256` |
| Redirect-URIs | `http://localhost:4200/*`, `http://localhost:4201/*`, `http://localhost:4202/*` |
| Benutzer | `alice` (Rollen `admin`, `user`), `bob` (Rolle `user`) |

## Aufgabe 3: Konfiguration

```ts
// oidc.config.ts
import { LogLevel, OpenIdConfiguration } from 'angular-auth-oidc-client';

export const oidcConfig: OpenIdConfiguration = {
  authority: 'http://localhost:8080/realms/eventhub',
  clientId: 'eventhub-spa',
  responseType: 'code',
  scope: 'openid profile email',
  redirectUrl: `${window.location.origin}/oidc`,
  postLogoutRedirectUri: `${window.location.origin}/oidc`,
  silentRenew: false,
  logLevel: LogLevel.Warn,
};
```

`authority` ist die Issuer-URL: `http://localhost:8080/realms/<realm>`. Die Bibliothek hängt `/.well-known/openid-configuration` an und liest daraus alle Endpunkte.

## Aufgabe 4: provideAuth, Route, Link

```ts
// app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideAuth } from 'angular-auth-oidc-client';
import { authInterceptor } from './eventhub/auth/auth.interceptor';
import { DelayedPreloading } from './eventhub/delayed-preloading';
import { EVENTHUB_ROUTES } from './eventhub/eventhub.routes';
import { oidcConfig } from './oidc.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(EVENTHUB_ROUTES, withComponentInputBinding(), withPreloading(DelayedPreloading)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAuth({ config: oidcConfig }),
  ],
};
```

```ts
// eventhub/eventhub.routes.ts (neue Kind-Route)
{ path: 'oidc', title: 'OIDC-Login', loadComponent: () => import('./oidc/oidc-page').then((m) => m.OidcPage) },
```

```html
<!-- eventhub/shell.ts, im <nav> -->
<a routerLink="oidc" routerLinkActive="badge">OIDC</a>
```

Der Interceptor aus Lab 9.2 hängt sein Token nur an Anfragen an `http://localhost:3000`; Anfragen an Keycloak bleiben unberührt.

## Aufgaben 5 und 6: Login-Seite

```ts
// eventhub/oidc/oidc-page.ts
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { filter } from 'rxjs';

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

    this.oidc.checkAuth().subscribe({
      next: ({ isAuthenticated }) => {
        if (isAuthenticated) {
          this.oidc.getPayloadFromIdToken().subscribe((claims) => this.idTokenClaims.set(claims));
        }
      },
      error: () => this.error.set('Keycloak nicht erreichbar (http://localhost:8080). Läuft docker compose up?'),
    });
  }

  login(): void {
    this.oidc.authorize();
  }

  logout(): void {
    this.oidc.logoff().subscribe();
  }
}
```

Der `error`-Zweig von `checkAuth()` greift, wenn der Code-Tausch nach dem Rücksprung scheitert; ein Login-Klick bei gestopptem Keycloak meldet sich über das Ereignis `ConfigLoadingFailed` (im Starter gegeben). `checkAuth()` muss auf der Seite laufen, auf die Keycloak zurückleitet (`redirectUrl` = `/oidc`). Alternative: `provideAuth({ config }, withAppInitializerAuthCheck())` prüft schon beim App-Start, dann entfällt der Aufruf in der Seite.

## Aufgabe 7: PKCE im Network-Tab

| Anfrage | Wichtige Parameter |
| --- | --- |
| `GET http://localhost:8080/realms/eventhub/protocol/openid-connect/auth?…` | `client_id=eventhub-spa`, `redirect_uri=http://localhost:4201/oidc`, `response_type=code`, `scope=openid profile email`, `state=…`, `nonce=…`, `code_challenge=…`, `code_challenge_method=S256` |
| Rücksprung `GET http://localhost:4201/oidc?state=…&code=…` | Einmal-Code (plus `session_state`, `iss`) |
| `POST …/protocol/openid-connect/token` (Form-Body) | `grant_type=authorization_code`, `code=…`, `code_verifier=…`, `redirect_uri=…`, `client_id=eventhub-spa` |
| `GET …/protocol/openid-connect/userinfo` | `Authorization: Bearer <access_token>`; Antwort füllt `userData()` |

Kein Request der App enthält das Passwort; es geht nur an die Login-Seite von Keycloak.

## Aufgabe 8: Claims und Speicherort

Beispiel-Claims des ID-Tokens für `alice` (IDs und Zeiten weichen ab):

```jsonc
{
  "exp": 1793219000,
  "iat": 1793218700,
  "iss": "http://localhost:8080/realms/eventhub",   // = authority
  "aud": "eventhub-spa",                            // = clientId: Token ist für diesen Client
  "sub": "5b0c…",                                   // ID der Person in Keycloak
  "typ": "ID",
  "azp": "eventhub-spa",
  "nonce": "…",                                     // schützt vor wiederverwendeten Tokens
  "email_verified": true,
  "name": "Alice Admin",
  "preferred_username": "alice",
  "given_name": "Alice",
  "family_name": "Admin",
  "email": "alice@eventhub.test",
  "roles": ["admin", "user"]                        // Mapper "realm roles as roles"
}
```

Die Rollenliste kann zusätzlich `default-roles-eventhub` enthalten, je nachdem, wie Keycloak beim Import Standardrollen vergibt.

Session Storage von `http://localhost:4201`: Eintrag `0-eventhub-spa` (Config-ID = Index + Client-ID), darin u. a. `authnResult` mit `id_token` und `access_token`. Gleiche Abwägung wie in Lab 9.1: lesbar für JavaScript, weg beim Schließen des Tabs.

## Aufgabe 9: Zweite Person

| Person | `name` | `roles` |
| --- | --- | --- |
| `alice` | Alice Admin | `admin`, `user` |
| `bob` | Bob User | `user` |

`logoff()` leitet zum `end_session_endpoint` von Keycloak und zurück nach `/oidc`; ohne Logout bei Keycloak würde der nächste Login ohne Passwortabfrage wieder `alice` anmelden.

## Erweiterung

```ts
this.oidc.getAccessToken().subscribe((token) => console.log(decodeJwt(token).payload)); // decodeJwt aus Lab 9.1
```

| Claim | ID-Token | Access-Token |
| --- | --- | --- |
| `aud` | `eventhub-spa` | `account` (Standard von Keycloak) oder fehlt |
| `typ` | `ID` | `Bearer` |
| `scope` | fehlt | `openid profile email` |
| `realm_access.roles` | fehlt | Realm-Rollen (Standard-Scope `roles` von Keycloak) |
| `roles` | ja (eigener Mapper) | ja (eigener Mapper) |

Die genauen Claims hängen von den Standard-Client-Scopes der Keycloak-Version ab (`prüfen`). Zweiter Tab: „Login mit Keycloak“ springt ohne Passworteingabe zurück, weil Keycloak die Sitzung per Cookie auf `localhost:8080` kennt.
