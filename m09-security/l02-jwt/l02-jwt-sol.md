# Lab 9.2 – Lösung: JWT im Angular-Client: Interceptor und Guards

Fertiges Ergebnis: `src/app/examples/m09-security/l02-jwt/` (Ordner `eventhub/`, `app.config.ts` für den Workspace, `login-form.ts`). In der Kurs-App unter http://localhost:4200/examples/m09-security/l02-jwt; dort stehen Interceptor und `LOGIN_URL` als Routen-Provider in `src/app/examples/m09-security/routes.ts`:

```ts
{
  path: 'l02-jwt',
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])), // eigener HttpClient nur für dieses Beispiel
    { provide: LOGIN_URL, useValue: '/examples/m09-security/l02-jwt/login' },
  ],
  loadChildren: () => import('./l02-jwt/eventhub/eventhub.routes'),
},
```

## Aufgabe 1: Starter übernehmen

```bash
cp -R src/app/starters/m09-l02-jwt/eventhub workspaces/eventhub-lab/src/app/
```

Der Workspace kompiliert weiter. Die Routen `login`, `account` und beide `admin`-Routen sind schon eingetragen; ohne Guards öffnet „Admin“ für alle die Admin-Seite, weil die erste Route mit Pfad `admin` immer passt.

## Aufgabe 2: Login-Logik

```ts
// eventhub/auth/login-page.ts
login(credentials: LoginCredentials): void {
  this.error.set(null);
  this.busy.set(true);
  this.auth.login(credentials.email, credentials.password, this.shortToken() ? 10 : 3600).subscribe({
    next: () => {
      this.busy.set(false);
      const target = this.returnUrl();
      // navigateByUrl navigiert nur innerhalb der App, nie zu einer fremden Domain
      void (target ? this.router.navigateByUrl(target) : this.router.navigate(['../sessions'], { relativeTo: this.route }));
    },
    error: (err: HttpErrorResponse) => {
      this.busy.set(false);
      this.error.set(err.status === 401 ? 'E-Mail oder Passwort falsch.' : `Login fehlgeschlagen (HTTP ${err.status}).`);
    },
  });
}
```

`'../sessions'` relativ zur Login-Route führt auf die Geschwister-Route `sessions`, im Workspace wie in der Kurs-App. Ohne Interceptor zeigt „Mein Konto“ „Anfrage abgelehnt.“: `GET /auth/me` geht ohne Token raus und bekommt `401`.

## Aufgabe 3: Interceptor hängt das Token an

```ts
// eventhub/auth/auth.interceptor.ts (Stand Aufgabe 3)
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../data';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const isApiCall = req.url.startsWith(API_URL);
  const request = token && isApiCall ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(request);
};
```

```ts
// app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { authInterceptor } from './eventhub/auth/auth.interceptor';
import { DelayedPreloading } from './eventhub/delayed-preloading';
import { EVENTHUB_ROUTES } from './eventhub/eventhub.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(EVENTHUB_ROUTES, withComponentInputBinding(), withPreloading(DelayedPreloading)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
```

## Aufgabe 4: Checkpoint Interceptor

Request-Header von `GET http://localhost:3000/auth/me`:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwi…
```

Die Seite zeigt „Server kennt: Uli User (user@eventhub.test), Rolle user“.

## Aufgabe 5: 401 behandeln

```ts
// eventhub/auth/auth.interceptor.ts (vollständig)
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../data';
import { AuthService } from './auth.service';
import { LOGIN_URL } from './login-url';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loginUrl = inject(LOGIN_URL);

  const token = auth.token();
  const isApiCall = req.url.startsWith(API_URL);
  const request = token && isApiCall ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      const isLoginCall = req.url.endsWith('/auth/login');
      if (error instanceof HttpErrorResponse && error.status === 401 && isApiCall && !isLoginCall) {
        auth.logout();
        void router.navigate([loginUrl], { queryParams: { returnUrl: router.url, reason: 'expired' } });
      }
      return throwError(() => error);
    }),
  );
};
```

| Entscheidung | Grund |
| --- | --- |
| `inject()` vor `catchError` | im Callback von `catchError` besteht kein Injection Context mehr (`NG0203`) |
| `startsWith(API_URL)` | Token geht nur an die eigene API, nie an Dritte (CDN, Analytics) |
| Login-Aufruf ausgenommen | falsches Passwort (`401`) ist kein abgelaufenes Token; die Login-Seite zeigt die Meldung |
| `throwError` statt `EMPTY` | Komponenten sehen den Fehler weiterhin (z. B. `httpResource.error()`) |

Prüfung: Logout, dann „Mein Konto“. `GET /auth/me` ohne Header → `401`, die App wechselt auf `/login?returnUrl=%2Faccount&reason=expired` und zeigt „Sitzung abgelaufen. Bitte erneut anmelden.“

## Aufgabe 6: Guards

```ts
// eventhub/auth/auth.guards.ts
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LOGIN_URL } from './login-url';

export const loggedInGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) return true;
  return inject(Router).createUrlTree([inject(LOGIN_URL)], { queryParams: { returnUrl: state.url } });
};

export const adminMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  if (auth.isLoggedIn()) return false;
  const returnUrl = router.currentNavigation()?.initialUrl.toString() ?? '/';
  return router.createUrlTree([inject(LOGIN_URL)], { queryParams: { returnUrl } });
};
```

`CanMatchFn` bekommt keinen `RouterStateSnapshot`; die Ziel-URL liefert `router.currentNavigation()` (Signal, Angular 20.2+; ältere Projekte nutzen `getCurrentNavigation()`).

## Aufgabe 7: Routen schützen

```ts
// eventhub/eventhub.routes.ts (vollständig)
import { Routes } from '@angular/router';
import { adminMatchGuard, loggedInGuard } from './auth/auth.guards';
import { SessionsPage } from './sessions/sessions-page';
import { SessionsStore } from './sessions/sessions-store';
import { Shell } from './shell';

export const EVENTHUB_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sessions' },
      { path: 'sessions', title: 'Sessions', component: SessionsPage, providers: [SessionsStore] },
      { path: 'speakers', data: { preload: true }, loadChildren: () => import('./speakers/speakers.routes') },
      { path: 'login', title: 'Login', loadComponent: () => import('./auth/login-page').then((m) => m.LoginPage) },
      {
        path: 'account',
        title: 'Mein Konto',
        canActivate: [loggedInGuard],
        loadComponent: () => import('./account/account-page').then((m) => m.AccountPage),
      },
      {
        path: 'admin',
        title: 'Admin',
        canMatch: [adminMatchGuard],
        loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage),
      },
      {
        path: 'admin',
        title: 'Kein Zugriff',
        loadComponent: () => import('./auth/no-access-page').then((m) => m.NoAccessPage),
      },
    ],
  },
];

export default EVENTHUB_ROUTES;
```

Die Reihenfolge zählt: Der Router prüft die geschützte Admin-Route zuerst; liefert `canMatch` `false`, greift die zweite.

## Aufgabe 8: Drei Fälle

| Fall | URL danach | Anzeige | Admin-Chunk geladen |
| --- | --- | --- | --- |
| abgemeldet | `/login?returnUrl=%2Fadmin` | Login; nach Admin-Login zurück auf `/admin` | erst nach dem Login |
| `user@eventhub.test` | `/admin` | „Kein Zugriff … Rolle user“ | nein |
| `admin@eventhub.test` | `/admin` | Statistik „12 Sessions · 6 Speaker · 1 Anmeldungen · Auslastung 66 %“ | ja |

Werte der Statistik ändern sich, sobald im Kurs Anmeldungen gespeichert werden. Bei `loadComponent` würde auch ein ablehnender `canActivate` den Chunk nicht laden (Komponenten lädt der Router erst nach den Guards); `canMatch` liefert zusätzlich die Ersatzroute „Kein Zugriff“ unter derselben URL.

## Erweiterung

Token-Ablauf mit `expiresIn: 10`:

| Schritt | Network | Anzeige |
| --- | --- | --- |
| Login mit Haken | `POST /auth/login` Body enthält `"expiresIn":10` | Sessions |
| „Mein Konto“ sofort | `GET /auth/me` → `200` | Name, „Token läuft ab: …“ 10 s nach dem Login |
| nach 10 s „Erneut beim Server fragen“ | `GET /auth/me` → `401` | `/login?returnUrl=%2Faccount&reason=expired`, „Sitzung abgelaufen“ |
| erneuter Login | `POST /auth/login` → `200` | zurück auf „Mein Konto“ |

Vorsorglich abmelden:

```ts
// im AuthService
constructor() {
  effect((onCleanup) => {
    const token = this.token();
    if (!token) return;
    const ms = decodeJwt(token).payload.exp * 1000 - Date.now();
    const timer = setTimeout(() => this.logout(), Math.max(ms, 0));
    onCleanup(() => clearTimeout(timer)); // neues Token oder Logout: alten Timer verwerfen
  });
}
```

Ausblenden im Shell: `@if (auth.isAdmin()) { <a routerLink="admin">Admin</a> }`. Die API bleibt die Instanz, die entscheidet:

```bash
curl -s -w " %{http_code}\n" http://localhost:3000/admin/stats -H "Authorization: Bearer <user-token>"
# {"message": "Nur für Admins"} 403
```
