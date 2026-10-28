# Lab 10.2 – Übung: Komponenten- und Service-Tests

**Dauer:** ca. 23 Minuten
**Ändert die EventHub-Projektbasis?** Ja — neue Testdateien im Playground; Session-Karte und Auth-Code bleiben unverändert.

## Vorbereitung

- Kein Server nötig: Die Tests ersetzen die API. Für die Beispielseite optional `npm run api` und `npm start`.
- Starter: Ordner `src/app/starters/m10-l02-component-tests/` mit
  - `session-card.ts` (Session-Karte aus Lab 6.3: `input.required<Session>()`, `model(false)` für `favorite`),
  - `auth.ts` (vereinfachter `AuthService`, `authInterceptor`, `adminGuard` aus Lab 9.2),
  - `session-card.spec.ts`, `session-api.spec.ts`, `auth.spec.ts` (TestBed und Testdaten vorbereitet, Tests als `it.todo`).
- Arbeitsordner: `src/app/playground/m10-l02-component-tests/`
- Testlauf im Watch-Modus:

  ```bash
  npx ng test --include=src/app/playground/m10-l02-component-tests
  ```

- Beispielseite zum Vergleich: http://localhost:4200/examples/m10-testing/l02-component-tests

## Aufgaben

**(a) Session-Karte**

1. Kopiere den Ordner `src/app/starters/m10-l02-component-tests/` nach `src/app/playground/m10-l02-component-tests/` und starte den Testlauf. Die Zusammenfassung zeigt nur `todo`.
2. Ergänze in `session-card.spec.ts` im `beforeEach` das Setzen des Inputs `session` mit `makeSession()` und warte, bis die Ansicht stabil ist.
3. Ersetze `it.todo('zeigt Titel und Raum der Session')` durch einen Test, der Titel (`h3`) und Raum im DOM prüft.
4. Ersetze den zweiten `it.todo` durch einen Test: Klick auf den Button setzt `favorite()` auf `true`, meldet genau eine Änderung über `favorite.subscribe(...)` und zeigt danach `★ Favorit`.

**(b) Session-Service**

5. Stelle in `session-api.spec.ts` `provideHttpClient()` und `provideHttpClientTesting()` bereit, hole den `HttpTestingController` und ergänze `afterEach` mit `verify()`.
6. Teste: `getSessions({ q: 'angular', level: '' })` schickt genau eine `GET`-Anfrage an `http://localhost:3000/sessions?q=angular` (ohne `level`) und liefert die Antwort durch.
7. Teste den Fehlerfall: Status `500` kommt als `HttpErrorResponse` mit `status === 500` beim Aufrufer an.
8. Lösche testweise das `.subscribe(...)` in Aufgabe 6, notiere die Meldung und stelle den Test wieder her.

## Checkpoint

- Nach Aufgabe 4: `session-card.spec.ts` meldet zwei grüne Tests.
- Nach Aufgabe 7: mindestens vier grüne Tests, `verify()` meldet keine offenen Anfragen.

## Abschlusskriterien

- `npx ng test --watch=false --include=src/app/playground/m10-l02-component-tests` ist grün mit mindestens vier Tests (mit Erweiterung mindestens sechs).
- Kein Test greift auf private Felder zu oder setzt `component.session = …`.

## Erweiterung

**(c) Login-Schutz aus Lab 9.2**

9. Ersetze in `auth.spec.ts` die beiden `it.todo` durch Tests für `adminGuard`: Rolle `admin` → `true`; Rolle `user` → `UrlTree` auf `/login?returnUrl=%2Fadmin`. Nutze `TestBed.runInInjectionContext()`.
10. Ergänze einen Test für `authInterceptor`: Mit gesetztem Token trägt die Anfrage den Header `Authorization: Bearer <token>`, ohne Token keinen.
11. Ergänze in `session-card.spec.ts` einen Test mit einer Host-Komponente, die `[(favorite)]` an ein eigenes Signal bindet, und prüfe, dass ein Klick das Signal des Hosts ändert.

## Fallback

Bleibt der Watch-Modus hängen oder zeigt alte Ergebnisse: mit `q` beenden und `npx ng test --watch=false --include=…` nutzen. Die fertigen Tests liegen unter `src/app/examples/m10-testing/l02-component-tests/`.
