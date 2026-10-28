// Lab 10.5: Fehlerfall „API nicht erreichbar“, simuliert mit cy.intercept.
describe('Suche bei API-Ausfall', () => {
  const page = '/examples/m10-testing/l05-cypress';

  beforeEach(() => cy.login('user@eventhub.test', 'user123'));

  it('zeigt eine Fehlermeldung bei Status 500', () => {
    cy.intercept(
      { method: 'GET', pathname: '/sessions' },
      { statusCode: 500, body: { message: 'Interner Fehler' } },
    ).as('search');
    cy.visit(page);

    cy.getByCy('search-input').type('angular');
    cy.wait('@search');

    cy.getByCy('search-error')
      .should('be.visible')
      .and('contain.text', 'konnten nicht geladen werden');
    cy.getByCy('search-result').should('not.exist');
  });

  it('zeigt eine Fehlermeldung, wenn das Netzwerk ausfällt', () => {
    cy.intercept({ method: 'GET', pathname: '/sessions' }, { forceNetworkError: true }).as(
      'search',
    );
    cy.visit(page);

    cy.getByCy('search-input').type('angular');

    cy.getByCy('search-error').should('be.visible');
  });
});
