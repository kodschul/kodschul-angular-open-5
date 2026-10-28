// Eigene Cypress-Befehle für EventHub.

/** Muss zum Schlüssel in src/app/examples/m10-testing/l05-cypress/example.ts passen. */
const TOKEN_KEY = 'eventhub.token';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Meldet per API an (ohne Formular) und merkt sich die Sitzung mit cy.session. */
      login(email: string, password: string): Chainable<void>;
      /** Kurzform für cy.get('[data-cy=…]'). */
      getByCy(name: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  // cy.session führt den Block nur beim ersten Aufruf aus und stellt danach
  // localStorage, sessionStorage und Cookies aus dem Cache wieder her.
  // Die Testseite speichert das Token wie Lab 9.2 im sessionStorage.
  cy.session([email], () => {
    cy.request('POST', `${Cypress.expose('apiUrl')}/auth/login`, { email, password }).then(
      ({ body }) => {
        window.sessionStorage.setItem(TOKEN_KEY, body.accessToken);
      },
    );
  });
});

Cypress.Commands.add('getByCy', (name: string) => cy.get(`[data-cy=${name}]`));

export {};
