# Lab 9.2 – Übung: JWT im Angular-Client: Interceptor und Guards

**Dauer:** ca. 23 Minuten (danach 5 Minuten Debrief)
**Ändert die EventHub-Projektbasis?** Ja — der Workspace `eventhub-lab` bekommt Login, Interceptor und Guards; Lab 9.3 baut darauf auf.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`.
- Terminal 2 im Ordner `output/project/workspaces/eventhub-lab/`: `npx ng serve` (Port 4201).
- Arbeitsordner: `workspaces/eventhub-lab/src/app/` (`app.config.ts`, `eventhub/eventhub.routes.ts`, neue Dateien in `eventhub/auth/`)
- Ausgangsstand: Ergebnis von Lab 8.2. Der Starter bringt den Ordner `eventhub/` vollständig mit; aus Lab 8.2 bleibt nur `app.config.ts` mit `withPreloading(DelayedPreloading)`. Ohne dieses Ergebnis `src/app/examples/m08-advanced-routing/l02-preloading/app.config.ts` nach `workspaces/eventhub-lab/src/app/` kopieren.
- Starter: Ordner `src/app/starters/m09-l02-jwt/eventhub/` mit Stand Lab 8.2 plus fertigem `AuthService`, `jwt.ts`, `LOGIN_URL`, Login-Seite (ohne Login-Logik), Konto-, Admin- und „Kein Zugriff“-Seite, Shell mit Login-Status, Routen `login`, `account` und zweiter `admin`-Route sowie Gerüst `auth/auth.guards.ts`.
- Login-Formular: `LoginFormComponent` aus Lab 6.4, im Workspace über `src/app/login-form.ts` eingebunden (Datei nicht ändern).
- Browser: http://localhost:4201, DevTools mit Tab „Network“ (Filter `Fetch/XHR`) und „Application“ → Session Storage.

## Aufgaben

1. Kopiere den Ordner `src/app/starters/m09-l02-jwt/eventhub/` nach `workspaces/eventhub-lab/src/app/` (vorhandene Dateien überschreiben). Lies `eventhub/auth/auth.service.ts` und `eventhub/eventhub.routes.ts`.
2. Implementiere `login()` in `eventhub/auth/login-page.ts` (TODO 2): `AuthService.login` mit `expiresIn` 10 oder 3600 (Checkbox), bei Erfolg zu `returnUrl` oder `../sessions` navigieren, bei Fehler `error` setzen; `busy` während der Anfrage auf `true`. Führe den Login als `user@eventhub.test` aus und öffne „Mein Konto“.
3. Lege `eventhub/auth/auth.interceptor.ts` mit einem `HttpInterceptorFn` an: Token aus dem `AuthService` als `Authorization: Bearer …` an alle Anfragen an `API_URL` hängen. Registriere ihn in `app.config.ts` mit `withInterceptors`.
4. **Checkpoint Interceptor:** Lade „Mein Konto“ neu. Im Network-Tab trägt `GET /auth/me` den Header `Authorization`, die Seite zeigt Name und Rolle vom Server.
5. Erweitere den Interceptor: Bei `401` einer API-Anfrage (außer `/auth/login`) abmelden und mit `router.navigate` zur Adresse aus `LOGIN_URL` leiten, Query-Parameter `returnUrl` (aktuelle URL) und `reason: 'expired'`. Prüfe: Logout, dann „Mein Konto“ öffnen (noch ohne Guard).
6. Implementiere in `eventhub/auth/auth.guards.ts` die beiden Guards (TODO 6a, 6b): `loggedInGuard` (`CanActivateFn`): angemeldet → `true`, sonst `UrlTree` zum Login mit `returnUrl`; `adminMatchGuard` (`CanMatchFn`): Admin → `true`, angemeldet ohne Admin-Rolle → `false`, nicht angemeldet → `UrlTree` zum Login mit `returnUrl`.
7. Aktiviere in `eventhub.routes.ts` die vorbereiteten Zeilen (TODO 7): `account` mit `canActivate: [loggedInGuard]`, die erste `admin`-Route mit `canMatch: [adminMatchGuard]`.
8. Teste drei Fälle und notiere jeweils URL und Anzeige: abgemeldet „Admin“ öffnen; als `user@eventhub.test` „Admin“ öffnen (Network-Tab: lädt der Admin-Chunk?); als `admin@eventhub.test` „Admin“ öffnen.

## Checkpoint

- Aufgabe 2: Login führt auf Sessions; „Mein Konto“ zeigt noch „Anfrage abgelehnt.“ (`GET /auth/me` ohne Token → `401`).
- Aufgabe 4: Header `Authorization: Bearer eyJ…` an `/auth/me`.
- Aufgabe 5: abgemeldet „Mein Konto“ → `GET /auth/me` antwortet `401`, die App zeigt `/login?returnUrl=%2Faccount&reason=expired` mit „Sitzung abgelaufen“.
- Aufgabe 8: abgemeldet → `/login?returnUrl=%2Fadmin`, nach Login als Admin zurück auf `/admin` mit Statistik; als User → „Kein Zugriff“, kein Admin-Chunk im Network-Tab.

## Abschlusskriterien

- Kein Service und keine Komponente setzt den `Authorization`-Header selbst.
- Admin ist nur nach Login mit Rolle `admin` erreichbar; `401` führt zum Login mit Rücksprung.
- Session Storage enthält nach dem Logout keinen Eintrag `eventhub.auth` mehr.

## Erweiterung (optional)

- Token-Ablauf: Login mit Haken „Token nach 10 s ablaufen lassen“, „Mein Konto“ öffnen, 10 Sekunden warten und „Erneut beim Server fragen“ klicken. Erwartet: `GET /auth/me` → `401`, `/login?returnUrl=%2Faccount&reason=expired`; nach erneutem Login wieder „Mein Konto“.
- Melde vorsorglich ab, bevor das Token abläuft: `effect` im `AuthService`, der mit `setTimeout` bis `exp` wartet und dann `logout()` aufruft (Aufräumen über `onCleanup`).
- Blende den Link „Admin“ im Shell für Nicht-Admins aus und prüfe mit `curl -H "Authorization: Bearer <user-token>" http://localhost:3000/admin/stats`, dass die API trotzdem `403` liefert.

## Fallback

- Ergebnis übernehmen: `src/app/examples/m09-security/l02-jwt/eventhub/` und `…/l02-jwt/app.config.ts` nach `workspaces/eventhub-lab/src/app/` kopieren (`login-form.ts` im Workspace nicht ersetzen).
- Vergleich im Browser ohne Workspace: http://localhost:4200/examples/m09-security/l02-jwt (gleiche Dateien; Interceptor und `LOGIN_URL` dort als Routen-Provider).
