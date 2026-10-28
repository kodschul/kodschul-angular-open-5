# Security-Cheatsheet

Schnellreferenz für Modul 9 (Tokens, JWT im Client, OIDC). Arbeitsort der Labs 9.2 und 9.3: `workspaces/eventhub-lab/` (Port 4201).

## Mock-API und Tokens

| Befehl / Aufruf | Wirkung |
| --- | --- |
| `POST /auth/login { email, password }` | liefert `{ accessToken, user }`, Token 1 h gültig |
| `POST /auth/login { …, expiresIn: 10 }` | Token läuft nach 10 s ab (Test) |
| `GET /auth/me` | Person zum Token; `401` ohne oder mit ungültigem Token |
| `GET /admin/stats` | `200` für Rolle `admin`, `403` für `user`, `401` ohne gültiges Token |
| `node src/app/examples/m09-security/l01-tokens/decode-jwt.mjs <email> <passwort>` | Login und Token dekodiert ausgeben |
| `JSON.parse(atob(teil.replace(/-/g, '+').replace(/_/g, '/')))` | Base64URL-Teil in der Konsole dekodieren |
| `new Date(exp * 1000)` | `exp`/`iat` (Sekunden) als Datum |
| Kurs-Konten | `admin@eventhub.test` / `admin123`, `user@eventhub.test` / `user123` |

## Statuscodes

| Code | Bedeutung | Reaktion im Client |
| --- | --- | --- |
| `401 Unauthorized` | nicht angemeldet, Token ungültig oder abgelaufen | abmelden, zum Login mit `returnUrl` |
| `403 Forbidden` | angemeldet, aber ohne Recht | Hinweis „Kein Zugriff“, kein Logout |

## AuthService (Signals)

| Syntax | Wirkung |
| --- | --- |
| `private readonly state = signal<AuthState \| null>(readStoredState());` | Login-Zustand, beim Start aus `sessionStorage` |
| `readonly token = computed(() => this.state()?.token ?? null);` | Token für den Interceptor |
| `readonly isAdmin = computed(() => this.user()?.role === 'admin');` | Rolle für Guards und Anzeige |
| `sessionStorage.setItem(KEY, JSON.stringify(state))` / `removeItem(KEY)` | Login speichern / beim Logout löschen |
| `isExpired(token)` | `exp * 1000 <= Date.now()` |

## Interceptor

| Syntax | Wirkung |
| --- | --- |
| `export const authInterceptor: HttpInterceptorFn = (req, next) => { … };` | funktionaler Interceptor |
| ``req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })`` | Kopie mit Token-Header |
| `req.url.startsWith(API_URL)` | Token nur an die eigene API |
| `next(request).pipe(catchError(…))` | Antwort und Fehler beobachten |
| `return throwError(() => error);` | Fehler weiterreichen |
| `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))` | registrieren (Root oder Routen-Provider) |
| `withInterceptorsFromDi()` | klassenbasierte Interceptoren aus Altprojekten einbinden |

## Guards

| Syntax | Wirkung |
| --- | --- |
| `export const g: CanActivateFn = (route, state) => …;` | vor dem Aktivieren einer gefundenen Route |
| `export const g: CanMatchFn = (route, segments) => …;` | entscheidet, ob die Route passt; Code lädt nur bei `true` |
| `return true;` / `return false;` | erlauben / ablehnen (`canMatch`: nächste Route prüfen) |
| `return router.createUrlTree(['/login'], { queryParams: { returnUrl } });` | umleiten |
| `state.url` | Ziel-URL in `CanActivateFn` |
| `router.currentNavigation()?.initialUrl.toString()` | Ziel-URL in `CanMatchFn` |
| `canActivate: [loggedInGuard]` / `canMatch: [adminMatchGuard]` | Guard an der Route |
| zweite Route mit gleichem `path` ohne Guard | Ersatzseite „Kein Zugriff“ bei `canMatch` = `false` |
| `readonly returnUrl = input<string>();` + `router.navigateByUrl(url)` | Rücksprung nach dem Login, nur innerhalb der App |

## OIDC mit Keycloak

| Befehl / Syntax | Wirkung |
| --- | --- |
| `cd workspaces/keycloak && docker compose up` | Keycloak 26.x mit Realm `eventhub` auf Port 8080 |
| `docker compose down` | stoppen, Daten verwerfen |
| `http://localhost:8080/realms/eventhub/.well-known/openid-configuration` | Endpunkte des Realms |
| Konten | `alice` / `alice123` (admin, user), `bob` / `bob123` (user) |
| `provideAuth({ config: oidcConfig })` | Bibliothek konfigurieren, nur in der Root-Konfiguration |
| `authority`, `clientId`, `responseType: 'code'`, `scope`, `redirectUrl` | Pflichtangaben der Konfiguration |
| `oidc.checkAuth().subscribe(({ isAuthenticated }) => …)` | Rücksprung verarbeiten / Tokens prüfen |
| `oidc.authorize()` | Login starten (Redirect mit PKCE) |
| `oidc.authenticated().isAuthenticated` | Signal: angemeldet? |
| `oidc.userData().userData` | Signal: Claims (`name`, `email`, `roles` …) |
| `oidc.getPayloadFromIdToken()` / `oidc.getAccessToken()` | Claims des ID-Tokens / Access-Token |
| `oidc.logoff().subscribe()` | Logout bei Keycloak |

## Angular-Schutzmechanismen

| Mechanismus | Wirkung |
| --- | --- |
| `{{ wert }}` | Text, nie HTML |
| `[innerHTML]="html"` | wird bereinigt (Sanitizing) |
| `DomSanitizer.bypassSecurityTrustHtml(…)` | Bereinigung aus; nur für geprüfte Inhalte |
| `provideHttpClient()` | XSRF aktiv: Cookie `XSRF-TOKEN` → Header `X-XSRF-TOKEN` bei schreibenden Anfragen an die eigene Origin |
