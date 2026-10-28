# Lab 10.5 – Lösung: End-to-End-Tests mit Cypress

Referenz: `cypress/e2e/favorites.cy.ts`, `cypress/e2e/api-down.cy.ts`, `cypress/support/commands.ts` · Testseite `src/app/examples/m10-testing/l05-cypress/example.ts`, URL `/examples/m10-testing/l05-cypress`

## Aufgabe 1: Binary prüfen

```bash
npx cypress verify
# nur falls das Binary fehlt:
npx cypress install && npx cypress verify
```

`verify` startet das Binary einmal testweise und meldet Erfolg mit Pfad und Version. Das Binary liegt im Benutzer-Cache (macOS `~/Library/Caches/Cypress`, Linux `~/.cache/Cypress`, Windows `%LOCALAPPDATA%\Cypress\Cache`), nicht in `node_modules`.

## Aufgabe 2: data-cy-Werte

| Element | `data-cy` |
| --- | --- |
| E-Mail, Passwort, Absenden | `login-email`, `login-password`, `login-submit` |
| Fehlermeldung Login | `login-error` |
| Name im Header, Abmelden | `user-name`, `logout` |
| Header-Zähler | `favorites-count` |
| Suchfeld | `search-input` |
| Ergebnis-Eintrag, Favoriten-Button | `search-result`, `favorite-toggle` |
| Fehlermeldung Suche | `search-error` |

## Aufgabe 3: Starter kopieren

```bash
cp cypress/starters/m10-l05-flow.cy.ts cypress/e2e/playground.cy.ts
npm run cy:open
```

Die drei Tests erscheinen als „pending“ (leere `it`-Blöcke).

## Aufgabe 4–6: playground.cy.ts

```ts
describe('EventHub E2E (Playground)', () => {
  const page = '/examples/m10-testing/l05-cypress';

  // Aufgabe 4
  it('meldet über das Formular an', () => {
    cy.visit(page);

    cy.getByCy('login-email').type('user@eventhub.test');
    cy.getByCy('login-password').type('user123');
    cy.getByCy('login-submit').click();

    cy.getByCy('user-name').should('have.text', 'Uli User');
    cy.getByCy('search-input').should('be.visible');
  });

  // Aufgabe 5
  it('zählt einen gesuchten Favoriten im Header', () => {
    cy.login('user@eventhub.test', 'user123');
    cy.intercept({ method: 'GET', pathname: '/sessions' }).as('search');
    cy.visit(page);

    cy.getByCy('favorites-count').should('contain.text', '0');
    cy.getByCy('search-input').type('testing');
    cy.wait('@search').its('request.url').should('include', 'q=testing');

    cy.getByCy('search-result')
      .should('have.length', 2)
      .first()
      .should('contain.text', 'Testen ohne Tränen');
    cy.getByCy('search-result').first().find('[data-cy=favorite-toggle]').click();

    cy.getByCy('favorites-count').should('contain.text', '1');
    cy.screenshot('favorit-gezaehlt'); // Aufgabe 7
  });

  // Aufgabe 6
  it('zeigt eine Fehlermeldung, wenn die API nicht erreichbar ist', () => {
    cy.login('user@eventhub.test', 'user123');
    cy.intercept(
      { method: 'GET', pathname: '/sessions' },
      { statusCode: 500, body: { message: 'Interner Fehler' } },
    ).as('search');
    cy.visit(page);

    cy.getByCy('search-input').type('angular');
    cy.wait('@search');

    cy.getByCy('search-error').should('be.visible').and('contain.text', 'konnten nicht geladen werden');
    cy.getByCy('search-result').should('not.exist');
  });
});
```

Entscheidungen:

- `pathname: '/sessions'` statt Glob-Muster: passt auf `http://localhost:3000/sessions?q=…` unabhängig vom Query-String.
- `cy.wait('@search')` statt `cy.wait(500)`: Der Test wartet genau so lange wie nötig.
- Zwei Treffer für `testing`: Die Mock-API sucht in Titel und Tags; „Testen ohne Tränen“ (id 7) und „E2E-Tests, die nicht flackern“ (id 8) tragen das Tag `testing`.
- Nur der erste Test nutzt das Formular. Die anderen melden sich per `cy.login` an; `cy.session` stellt den gespeicherten `sessionStorage` (dort liegt das Token, wie in Lab 9.2) wieder her, statt bei jedem Test neu anzumelden.

## Aufgabe 7: Headless mit Video und Screenshot

```bash
npx cypress run --spec cypress/e2e/playground.cy.ts
```

Erwartetes Ergebnis:

- Die Zusammenfassung am Ende meldet für `playground.cy.ts` drei bestandene Tests, keine fehlgeschlagenen.
- `cypress/videos/playground.cy.ts.mp4` zeigt den Lauf.
- `cypress/screenshots/playground.cy.ts/favorit-gezaehlt.png` zeigt den Header mit `★ 1`.

Videos und Screenshots sind über `cypress/.gitignore` vom Einchecken ausgenommen.

## Aufgabe 8: Flackern provozieren

Mit `{"delay":5000}` antwortet jede API-Anfrage erst nach 5 s. Der Flow-Test wird rot, zum Beispiel mit dieser Meldung:

```text
Timed out retrying after 4000ms: Expected to find element: [data-cy=search-input], but never found it.
```

Ursache: Die Seite zeigt das Suchfeld erst, wenn `GET /auth/me` geantwortet hat; das dauert 5 s, der Standard-Timeout von `cy.get` liegt bei 4 s. Abhilfen aus der Tabelle „Warum Tests flackern“:

| Abhilfe | Umsetzung |
| --- | --- |
| Timeout gezielt erhöhen | `cy.get('[data-cy=search-input]', { timeout: 10000 })` |
| Langsame Abhängigkeit stubben | `cy.intercept({ method: 'GET', pathname: '/auth/me' }, { body: { name: 'Uli User', … } })` |
| Nicht: `cy.wait(6000)` | macht jeden Lauf 6 s langsamer und bricht bei 7 s Verzögerung erneut |

Danach `{"delay":0}` setzen; `GET http://localhost:3000/_control` zeigt den aktuellen Stand.

## Erweiterung

Fixture statt echter Suche:

```ts
it('zeigt Stub-Daten aus der Fixture', () => {
  cy.login('user@eventhub.test', 'user123');
  cy.intercept({ method: 'GET', pathname: '/sessions' }, { fixture: 'sessions-stub.json' }).as('search');
  cy.visit(page);

  cy.getByCy('search-input').type('egal');
  cy.wait('@search');

  cy.getByCy('search-result').should('have.length', 1).and('contain.text', 'Stub-Session aus der Fixture');
});
```

Netzwerkausfall:

```ts
it('zeigt eine Fehlermeldung, wenn das Netzwerk ausfällt', () => {
  cy.login('user@eventhub.test', 'user123');
  cy.intercept({ method: 'GET', pathname: '/sessions' }, { forceNetworkError: true }).as('search');
  cy.visit(page);
  cy.getByCy('search-input').type('angular');
  cy.getByCy('search-error').should('be.visible');
});
```

Abmelden:

```ts
it('setzt den Zähler beim Abmelden auf 0', () => {
  cy.login('user@eventhub.test', 'user123');
  cy.visit(page);

  cy.getByCy('search-input').type('testing');
  cy.getByCy('favorite-toggle').first().click();
  cy.getByCy('favorites-count').should('contain.text', '1');

  cy.getByCy('logout').click();

  cy.getByCy('favorites-count').should('contain.text', '0');
  cy.getByCy('login-email').should('be.visible');
});
```

Alle Erweiterungen stehen auch in den Referenz-Specs `cypress/e2e/favorites.cy.ts` und `cypress/e2e/api-down.cy.ts`.
