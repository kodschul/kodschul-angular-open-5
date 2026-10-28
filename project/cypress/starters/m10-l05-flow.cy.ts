// Starter Lab 10.5: nach cypress/e2e/playground.cy.ts kopieren.
// Fertig vorbereitet: cy.login und cy.getByCy (cypress/support/commands.ts),
// die Testseite /examples/m10-testing/l05-cypress mit data-cy-Attributen.
// Ein it() ohne Funktion ist in Mocha "pending" und wird übersprungen.

describe('EventHub E2E (Playground)', () => {
  const page = '/examples/m10-testing/l05-cypress';

  // Aufgabe 4: Login über das Formular (Checkpoint)
  it('meldet über das Formular an');

  // Aufgabe 5: Login per API → suchen → Favorit → Header-Zähler
  it('zählt einen gesuchten Favoriten im Header');

  // Aufgabe 6: Fehlerfall mit cy.intercept
  it('zeigt eine Fehlermeldung, wenn die API nicht erreichbar ist');
});
