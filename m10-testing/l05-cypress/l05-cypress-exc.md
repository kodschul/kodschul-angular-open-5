# Lab 10.5 – Übung: End-to-End-Tests mit Cypress

**Dauer:** ca. 35 Minuten (davon 10 Minuten Debrief „flackernde Tests“)
**Ändert die EventHub-Projektbasis?** Ja — neue Spec `cypress/e2e/playground.cy.ts`; App und Konfiguration bleiben unverändert.

## Vorbereitung

- Terminal 1: `npm run api` (Mock-API, Port 3000)
- Terminal 2: `npm start` (App, Port 4200)
- Terminal 3: Cypress (siehe Aufgabe 1)
- Testseite: http://localhost:4200/examples/m10-testing/l05-cypress
- Starter: `cypress/starters/m10-l05-flow.cy.ts` (drei leere `it`-Blöcke)
- Arbeitsdatei: `cypress/e2e/playground.cy.ts`
- Vorbereitet und nicht zu ändern: `cypress.config.ts`, `cypress/support/commands.ts` mit `cy.login(email, password)` und `cy.getByCy(name)`.
- Zugang: `user@eventhub.test` / `user123`

## Aufgaben

1. Prüfe, ob das Cypress-Binary aus der Kursvorbereitung startet:

   ```bash
   npx cypress verify
   ```

   Meldet der Befehl, dass das Binary fehlt, lade es mit `npx cypress install` nach (mehrere 100 MB) und führe `npx cypress verify` erneut aus.

2. Spiele den Ablauf einmal von Hand durch: Seite öffnen, anmelden, nach `testing` suchen, die erste Session als Favorit markieren. Öffne die DevTools (Elements) und notiere die `data-cy`-Werte von Suchfeld, Ergebnis-Eintrag, Favoriten-Button und Header-Zähler. Klicke danach auf „Abmelden“.
3. Kopiere `cypress/starters/m10-l05-flow.cy.ts` nach `cypress/e2e/playground.cy.ts`. Starte `npm run cy:open`, wähle „E2E Testing“, einen Browser und die Spec `playground.cy.ts`.
4. **Login-Test:** Fülle im ersten `it` E-Mail und Passwort über `cy.getByCy(...)` aus, klicke auf Anmelden und prüfe, dass `user-name` den Text `Uli User` zeigt und das Suchfeld sichtbar ist.
5. **Flow-Test:** Nutze im zweiten `it` `cy.login(...)` für die Anmeldung per API. Registriere vor `cy.visit` ein `cy.intercept` für `GET /sessions` mit Alias `search`. Prüfe: Zähler zeigt `0`, nach Eingabe von `testing` geht eine Anfrage mit `q=testing` raus, die Liste hat zwei Einträge, der erste ist „Testen ohne Tränen“; nach Klick auf dessen Favoriten-Button zeigt der Zähler `1`.
6. **Fehlerfall:** Nutze im dritten `it` ebenfalls `cy.login(...)` und lasse jede Anfrage an `GET /sessions` mit Status `500` antworten. Prüfe, dass `search-error` sichtbar ist und kein `search-result` existiert.
7. Führe die Spec headless aus:

   ```bash
   npx cypress run --spec cypress/e2e/playground.cy.ts
   ```

   Öffne danach das Video unter `cypress/videos/` und ergänze im Flow-Test am Ende `cy.screenshot('favorit-gezaehlt')`; nach dem nächsten Lauf liegt das Bild unter `cypress/screenshots/`.
8. **Flackern provozieren:** Setze in einem freien Terminal eine feste Verzögerung der Mock-API, starte den Flow-Test erneut und notiere die Meldung. Setze die Verzögerung danach zurück.

   ```bash
   curl -X POST http://localhost:3000/_control -H 'Content-Type: application/json' -d '{"delay":5000}'
   # … Test laufen lassen …
   curl -X POST http://localhost:3000/_control -H 'Content-Type: application/json' -d '{"delay":0}'
   ```

## Checkpoint

- Nach Aufgabe 4: Der Login-Test ist in der Cypress-Oberfläche grün; die Zeitreise zeigt jeden `type`- und `click`-Schritt.
- Nach Aufgabe 6: drei grüne Tests in `playground.cy.ts`.

## Abschlusskriterien

- `npx cypress run --spec cypress/e2e/playground.cy.ts` ist grün; Video und ein Screenshot liegen vor.
- Kein Test nutzt `cy.wait(<Millisekunden>)`, CSS-Klassen oder `nth-child` als Selektor.
- Für Aufgabe 8 ist die Ursache des roten Laufs in einem Satz notiert; die Verzögerung ist wieder `0`.

## Debrief (10 Minuten)

- Welche Meldung kam in Aufgabe 8, und welche der Abhilfen aus der Tabelle „Warum Tests flackern“ passt?
- Welcher der drei Tests wäre ohne `cy.intercept` nur schwer zu schreiben?

## Erweiterung

- Ersetze im Flow-Test die echte Suche durch die Fixture `cypress/fixtures/sessions-stub.json` (`cy.intercept(…, { fixture: 'sessions-stub.json' })`) und prüfe, dass genau „Stub-Session aus der Fixture“ erscheint.
- Ergänze im Fehlerfall einen zweiten Test mit `{ forceNetworkError: true }`.
- Schreibe einen Test „Abmelden setzt den Zähler auf 0 zurück“.

## Fallback

- Ohne Download-Rechte für das Binary (Firmenproxy): `CYPRESS_INSTALL_BINARY` auf eine lokal bereitgestellte ZIP-Datei zeigen lassen und `npx cypress install` erneut ausführen, oder die Tests in der Trainer-Demo mitverfolgen.
- Ohne Binary lassen sich die Specs statisch prüfen: `npx tsc -p cypress/tsconfig.json` meldet Tippfehler und falsche Befehle.
- Referenz: `cypress/e2e/favorites.cy.ts` und `cypress/e2e/api-down.cy.ts`.
