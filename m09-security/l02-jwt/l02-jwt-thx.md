# Lab 9.2: JWT im Angular-Client: Interceptor und Guards

**Leitfragen:**

<details>
<summary>Wie kommt das Token an jede HTTP-Anfrage, ohne dass jeder Service daran denken muss?</summary>

Über eine zentrale Stelle, die jede Anfrage von `HttpClient` durchläuft: einen Interceptor. Er hängt den Header an, bevor die Anfrage den Browser verlässt.

</details>

<details>
<summary>Was soll passieren, wenn das Token mitten in der Arbeit abläuft?</summary>

Die API antwortet mit `401`. Die App meldet ab, leitet zum Login und merkt sich die Seite, damit es nach dem erneuten Login dort weitergeht.

</details>

<details>
<summary>Wann darf eine Route gar nicht erst geladen werden?</summary>

Wenn die Person sie ohnehin nicht nutzen darf, z. B. den Admin-Bereich ohne Admin-Rolle. Dann soll weder die Seite erscheinen noch ihr Code heruntergeladen werden.

</details>

- Drei Bausteine teilen sich die Arbeit: `AuthService` (Zustand), Interceptor (HTTP), Guards (Routen).
- Guards und ausgeblendete Links sind Bedienkomfort; die Mock-API prüft jede Anfrage selbst (Lab 9.1).

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| `HttpInterceptorFn` | Funktion `(req, next) => Observable`, die jede Anfrage eines `HttpClient` verändern oder beobachten kann |
| `req.clone({ setHeaders })` | Kopie der Anfrage mit zusätzlichen Headern; Anfragen sind unveränderlich |
| `throwError(() => err)` | RxJS-Funktion: Observable, das sofort mit diesem Fehler endet; reicht in `catchError` den Fehler weiter |
| Guard | Funktion an einer Route, die entscheidet, ob navigiert werden darf |
| `CanActivateFn` | Guard, der vor dem Aktivieren einer bereits gefundenen Route läuft |
| `CanMatchFn` | Guard, der entscheidet, ob eine Route überhaupt passt; bei `false` sucht der Router weiter |
| `UrlTree` | Navigationsziel als Objekt; liefert ein Guard eins zurück, leitet der Router dorthin um |
| `returnUrl` | Query-Parameter mit der ursprünglichen Seite, um nach dem Login zurückzukehren |

## Arbeitsumgebung

Interceptoren und Guards gehören in die Root-Konfiguration und die Root-Routen. Die Übung arbeitet deshalb wie Lab 8.1–8.2 im Workspace `workspaces/eventhub-lab/`: `npx ng serve` im Workspace startet die App auf http://localhost:4201 (fest in `angular.json`; die Kurs-App bleibt auf 4200). Das Login-Formular kommt aus Lab 6.4 (`LoginFormComponent`, Output `submitted` mit `{ email, password }`).

```mermaid
flowchart LR
  F["LoginFormComponent (Lab 6.4)"] -->|submitted| P["LoginPage"]
  P -->|login()| S["AuthService (Signals)"]
  S -->|token()| I["authInterceptor"]
  I -->|Authorization: Bearer| A["Mock-API"]
  A -->|401| I
  I -->|logout + /login?returnUrl| R["Router"]
  S -->|isAdmin()| G["adminMatchGuard"]
  G --> R
```

## AuthService: Login-Zustand als Signal

Der Starter bringt den `AuthService` fertig mit (`eventhub/auth/auth.service.ts`, `providedIn: 'root'`):

| Mitglied | Bedeutung |
| --- | --- |
| `token()`, `user()` | `computed` aus einem privaten `signal<AuthState \| null>` |
| `isLoggedIn()`, `isAdmin()` | abgeleitet: Zustand vorhanden bzw. `user()?.role === 'admin'` |
| `login(email, password, expiresIn = 3600)` | `POST /auth/login`, speichert Token und Person, liefert `Observable<User>` |
| `logout()` | leert das Signal und den Eintrag `eventhub.auth` im `sessionStorage` |

Beim Start übernimmt der Service einen gespeicherten Login, außer `isExpired()` aus `auth/jwt.ts` meldet ihn als abgelaufen (vergleicht `exp * 1000` mit `Date.now()`, vgl. `exp` in Lab 9.1).

## Interceptor: Header anhängen, Fehler zentral behandeln

Beispiel aus einer anderen App: Eine Raumbuchungs-API erwartet einen API-Schlüssel im Header `X-Api-Key` und antwortet mit `403`, wenn der Schlüssel ungültig ist.

```ts
// rooms/api-key.interceptor.ts
export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const keys = inject(ApiKeyStore);   // Service mit Signal key() und clear()
  const router = inject(Router);

  const key = keys.key();
  const isRoomsApi = req.url.startsWith(ROOMS_API); // Schlüssel nie an fremde Hosts
  const request = key && isRoomsApi ? req.clone({ setHeaders: { 'X-Api-Key': key } }) : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      const isKeyCheck = req.url.endsWith('/keys/verify'); // eigene Prüf-Anfrage: Fehler zeigt das Formular
      if (error instanceof HttpErrorResponse && error.status === 403 && isRoomsApi && !isKeyCheck) {
        keys.clear();
        void router.navigate(['/settings'], { queryParams: { returnUrl: router.url, reason: 'invalid-key' } });
      }
      return throwError(() => error); // Komponente sieht den Fehler trotzdem
    }),
  );
};
```

```ts
// app.config.ts
provideHttpClient(withFetch(), withInterceptors([apiKeyInterceptor])),
```

| Teil | Bedeutung |
| --- | --- |
| `inject()` im Interceptor | Funktionale Interceptoren laufen im Injection Context (Lab 1.2); `inject()` am Anfang aufrufen |
| `next(request)` | gibt die Anfrage an den nächsten Interceptor bzw. ans Netz weiter |
| `catchError` (Lab 5.2) + `throwError` | Fehler beobachten und weiterreichen statt ersetzen |
| `withInterceptors([a, b])` | Reihenfolge: `a` sieht die Anfrage zuerst und die Antwort zuletzt |

Für ein JWT gilt dasselbe Muster: Header `Authorization` mit dem Wert `Bearer <token>`, Status `401`, Ziel ist die Login-Seite. Im Workspace liefert `inject(LOGIN_URL)` deren Adresse (`'/login'`; `InjectionToken` aus dem Starter, die Kurs-App setzt einen anderen Wert).

## Guards: CanActivateFn und CanMatchFn

Beispiel aus derselben Raumbuchungs-App: Buchungen nur mit vollständigem Profil, ein neuer Kalender nur für Beta-Teilnehmende.

```ts
// rooms/rooms.guards.ts
export const profileCompleteGuard: CanActivateFn = (_route, state) => {
  if (inject(ProfileStore).isComplete()) return true;
  return inject(Router).createUrlTree(['/onboarding'], { queryParams: { returnUrl: state.url } });
};

export const betaMatchGuard: CanMatchFn = () => {
  const profile = inject(ProfileStore);
  const router = inject(Router);
  if (profile.isBeta()) return true;
  if (profile.isComplete()) return false; // kein Beta: nächste Route mit gleichem Pfad
  const returnUrl = router.currentNavigation()?.initialUrl.toString() ?? '/';
  return router.createUrlTree(['/onboarding'], { queryParams: { returnUrl } });
};
```

```ts
// rooms/rooms.routes.ts (Auszug)
{ path: 'bookings', canActivate: [profileCompleteGuard], loadComponent: () => import('./bookings-page').then((m) => m.BookingsPage) },
{ path: 'calendar', canMatch: [betaMatchGuard], loadComponent: () => import('./calendar-beta').then((m) => m.CalendarBeta) },
{ path: 'calendar', loadComponent: () => import('./calendar-classic').then((m) => m.CalendarClassic) }, // gleicher Pfad
```

`CanMatchFn` bekommt keinen `RouterStateSnapshot`; die Ziel-URL liefert `router.currentNavigation()` (Signal, Angular 20.2+).

| | `CanActivateFn` | `CanMatchFn` |
| --- | --- | --- |
| Läuft | nachdem die Route gefunden ist | während der Router die passende Route sucht |
| Code bei Ablehnung | `loadComponent`: Komponente wird nicht geladen (lädt erst nach den Guards); `loadChildren`: Kind-Routen sind schon geladen | wird nicht geladen |
| Rückgabe `false` | Navigation bricht ab | Router prüft die nächste Route mit passendem Pfad |
| Rückgabe `UrlTree` | Umleitung | Umleitung |
| Typischer Einsatz | „eingeloggt?“ für bekannte Seiten | Rollen, Feature-Flags, Varianten derselben URL |

## Rücksprung nach dem Login

```ts
readonly returnUrl = input<string>(); // ?returnUrl=… über withComponentInputBinding (Lab 2.2)

done(): void {
  const target = this.returnUrl();
  void (target ? this.router.navigateByUrl(target) : this.router.navigate(['/rooms']));
}
```

`navigateByUrl` navigiert nur innerhalb der App; ein manipulierter `returnUrl` führt so nicht auf eine fremde Domain.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| Header `Authorization` fehlt im Network-Tab | Interceptor nicht in `withInterceptors` registriert oder URL beginnt nicht mit `API_URL` | `provideHttpClient(withInterceptors([authInterceptor]))` prüfen |
| Endlosschleife zum Login | 401 der Login-Anfrage selbst löst Redirect aus | Login-URL im Interceptor ausnehmen |
| `NG0203: inject() must be called from an injection context` | `inject()` innerhalb von `catchError` oder `subscribe` | `inject()` am Anfang der Funktion aufrufen |
| Admin mit User-Rolle: Fehler „Cannot match any routes“ (Workspace) bzw. Startseite (Kurs-App) | `canMatch` liefert `false`, keine zweite Route mit gleichem Pfad | Route „Kein Zugriff“ mit Pfad `admin` dahinter |
| Nach Login landet man immer auf Sessions | `returnUrl` nicht als `input()` gelesen oder `withComponentInputBinding` fehlt | Input-Name = Query-Parameter-Name |
| Formular reagiert nicht | falscher Selektor oder Output-Name des Formulars aus Lab 6.4 | `<app-login-form (submitted)="…">` |
| `npx ng serve` im Workspace meldet „Port 4201 is already in use“ | ein anderer Dev-Server belegt 4201 (z. B. eine zweite Instanz des Workspace oder ein anderer Workspace mit demselben Port) | anderen Prozess beenden oder `npx ng serve --port 4202`, dann http://localhost:4202 öffnen; die Rückfrage nach einem anderen Port mit „n“ beantworten, weil ein Zufallsport in Lab 9.3 nicht in den Redirect-URIs von Keycloak steht |

## Vertiefung

- Klassenbasierte Interceptoren (`implements HttpInterceptor` + `HTTP_INTERCEPTORS`) stehen in älteren Projekten; `withInterceptorsFromDi()` bindet sie in `provideHttpClient` ein.
- Ältere Projekte lesen die laufende Navigation mit `router.getCurrentNavigation()` statt `currentNavigation()`.
- Preloading (Lab 8.2) beachtet `canMatch` nicht: `PreloadAllModules` lädt einen geschützten Chunk trotzdem vor. `DelayedPreloading` mit `data.preload` lädt nur markierte Routen.
- `expiresIn` ist ein Schalter der Mock-API: `10` erzeugt ein Token, das nach 10 Sekunden abläuft; damit lässt sich der `401`-Pfad ohne Warten auf eine Stunde testen.

## Fazit

- `AuthService` hält Token und Person als Signals; alles andere liest daraus.
- Ein funktionaler Interceptor hängt den Header an API-Anfragen und behandelt Fehler wie `401` an einer Stelle.
- `canMatch` hält Code und Seite vor Unberechtigten zurück und erlaubt eine Ersatzroute; `canActivate` schützt bekannte Seiten; beide leiten per `UrlTree` mit `returnUrl` um.

Die Übung schließt das Login-Formular aus Lab 6.4 an, baut Interceptor und Guards im Workspace und prüft Umleitung, Rollen und den `401`-Pfad.
