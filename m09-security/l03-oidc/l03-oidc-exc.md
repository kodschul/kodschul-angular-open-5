# Lab 9.3 – Übung: OAuth 2.0 und OpenID Connect

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Ja — der Workspace `eventhub-lab` bekommt einen zweiten Login-Weg über Keycloak (`/oidc`).

## Vorbereitung

- Keycloak mit dem Realm `eventhub`, eine der beiden Varianten:
  - **lokal:** im Ordner `project/workspaces/keycloak/` `docker compose up` ausführen; Basis-Adresse `http://localhost:8080`.
  - **bereitgestellte Instanz:** Die Realm-Datei `workspaces/keycloak/realm/eventhub-realm.json` ist dort importiert; Basis-Adresse ist die Adresse dieser Instanz. Docker wird nicht gebraucht.
- Keycloak ist bereit, sobald `<Basis-Adresse>/realms/eventhub/.well-known/openid-configuration` im Browser JSON liefert.
- Die App läuft in beiden Varianten lokal auf http://localhost:4201. Die Redirect-URIs im Realm erlauben nur `localhost:4200`, `localhost:4201` und `localhost:4202`; ist 4201 belegt, den Workspace mit `npx ng serve --port 4202` starten.
- Terminal 1 im Ordner `project/`: `npm run api`.
- Terminal 2 im Ordner `project/workspaces/eventhub-lab/`: `npx ng serve` (Port 4201).
- Arbeitsordner: `workspaces/eventhub-lab/src/app/`
- Ausgangsstand: Ergebnis von Lab 9.2. Ohne dieses Ergebnis `src/app/examples/m09-security/l02-jwt/eventhub/` und `…/l02-jwt/app.config.ts` nach `workspaces/eventhub-lab/src/app/` kopieren.
- Starter: Ordner `src/app/starters/m09-l03-oidc/` mit `oidc.config.ts` (Felder leer) und `eventhub/oidc/oidc-page.ts` (Methoden leer; Hinweis bei nicht erreichbarem Keycloak über `PublicEventsService` schon eingebaut).
- Realm-Datei zum Nachschlagen: `workspaces/keycloak/realm/eventhub-realm.json`
- Browser: http://localhost:4201, DevTools mit Tab „Network“ („Preserve log“ aktivieren) und „Application“ → Session Storage.

## Aufgaben

1. Kopiere `src/app/starters/m09-l03-oidc/oidc.config.ts` nach `workspaces/eventhub-lab/src/app/` und den Ordner `src/app/starters/m09-l03-oidc/eventhub/oidc/` nach `workspaces/eventhub-lab/src/app/eventhub/`.
2. Öffne die Realm-Datei und notiere Realm-Name, Client-ID, PKCE-Methode, erlaubte Redirect-URIs und die beiden Benutzer mit ihren Rollen.
3. Trage in `oidc.config.ts` `authority` (Issuer-URL des Realms, gebildet aus Basis-Adresse und Realm-Name) und `clientId` ein und erweitere `scope` um `profile` und `email`.
4. Ergänze in `app.config.ts` `provideAuth({ config: oidcConfig })`. Ergänze in `eventhub.routes.ts` die Route `oidc` (Login-Seite per `loadComponent`) und in `eventhub/shell.ts` einen Link „OIDC“.
5. Implementiere in `oidc-page.ts` den Konstruktor (`checkAuth()`, bei Erfolg `getPayloadFromIdToken()` in `idTokenClaims`, bei Fehler Hinweis „Keycloak nicht erreichbar …“ in `error`) und `login()` (`authorize()`).
6. Zeige auf der Seite für angemeldete Personen Name, `preferred_username`, E-Mail und Rollen aus `oidc.userData().userData` an.
7. Öffne `/oidc`, klicke „Login mit Keycloak“ und führe den Login als `alice` / `alice123` aus. Notiere aus dem Network-Tab die Parameter `code_challenge_method` (Anfrage an `…/protocol/openid-connect/auth`) und `code_verifier` (Anfrage an `…/protocol/openid-connect/token`).
8. Vergleiche `aud`, `iss` und `roles` im ID-Token mit der Realm-Datei. Prüfe im Session Storage, wo die Bibliothek die Tokens ablegt.
9. Klicke „Logout bei Keycloak“ und führe danach den Login als `bob` / `bob123` aus. Notiere den Unterschied bei den Rollen.

## Checkpoint

- Nach dem Login zeigt `/oidc` „Angemeldet als Alice Admin (alice, alice@eventhub.test)“ und die Rollen `admin` und `user`.
- Die Auth-Anfrage enthält `code_challenge_method=S256`, die Token-Anfrage einen `code_verifier`, aber kein Passwort.
- `bob` hat nur die Rolle `user`.

## Abschlusskriterien

- Login über Keycloak funktioniert; Name und Rolle stammen aus den Token-Claims.
- `provideAuth` steht in der Root-Konfiguration `app.config.ts`.

## Erweiterung (optional)

- Lies mit `oidc.getAccessToken()` das Access-Token, dekodiere es wie in Lab 9.1 und vergleiche `aud`, `scope` und `realm_access` mit dem ID-Token.
- Starte den Login in einem zweiten Tab erneut: Keycloak fragt kein Passwort mehr ab (Single Sign-on), solange die Keycloak-Sitzung besteht.

## Fallback

- Ohne erreichbaren Keycloak (weder lokal noch bereitgestellt): Aufgaben 1–6 umsetzen, `npx ng build` muss fehlerfrei laufen; für Aufgaben 7–9 die Werte aus der Lösung (`l03-oidc-sol.md`) mit der Realm-Datei abgleichen.
- Ergebnis übernehmen: `src/app/examples/m09-security/l03-oidc/eventhub/`, `…/l03-oidc/app.config.ts` und `…/l03-oidc/oidc.config.ts` nach `workspaces/eventhub-lab/src/app/` kopieren (`login-form.ts` im Workspace nicht ersetzen).
- Die Kurs-App zeigt unter `/examples/m09-security/l03-oidc` nur eine Infoseite: `provideAuth` lässt sich dort nicht pro Route einbinden.
