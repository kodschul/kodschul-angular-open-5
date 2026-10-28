// Lab 10.5: kritischer Ablauf „Login → Session suchen → Favorit → Header-Zähler“.
describe('Favoriten-Flow', () => {
  const page = '/examples/m10-testing/l05-cypress';

  it('meldet über das Formular an', () => {
    cy.visit(page);

    cy.getByCy('login-email').type('user@eventhub.test');
    cy.getByCy('login-password').type('user123');
    cy.getByCy('login-submit').click();

    cy.getByCy('user-name').should('have.text', 'Uli User');
    cy.getByCy('search-input').should('be.visible');
  });

  it('zählt einen gesuchten Favoriten im Header', () => {
    cy.login('user@eventhub.test', 'user123'); // schneller Login per API
    cy.intercept({ method: 'GET', pathname: '/sessions' }).as('search'); // nur beobachten, nicht ersetzen
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
    cy.screenshot('favorit-gezaehlt'); // landet in cypress/screenshots/
  });

  // Erweiterung: Suche mit fester Antwort aus cypress/fixtures/
  it('zeigt Stub-Daten aus der Fixture', () => {
    cy.login('user@eventhub.test', 'user123');
    cy.intercept({ method: 'GET', pathname: '/sessions' }, { fixture: 'sessions-stub.json' }).as(
      'search',
    );
    cy.visit(page);

    cy.getByCy('search-input').type('egal');
    cy.wait('@search');

    cy.getByCy('search-result')
      .should('have.length', 1)
      .and('contain.text', 'Stub-Session aus der Fixture');
  });

  // Erweiterung: Abmelden setzt den Zähler zurück
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
});
