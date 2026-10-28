import { defineConfig } from 'cypress';

// Cypress-Konfiguration für Lab 10.5. Voraussetzung: npm run api (Port 3000) und npm start (Port 4200) laufen.
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    // Video des Laufs bei "cypress run" (seit Cypress 13 standardmäßig aus).
    video: true,
  },
  // Öffentliche Werte für die Tests, lesbar über Cypress.expose('apiUrl') (Cypress 16).
  // Geheimnisse gehören in "env" und werden im Test mit cy.env([...]) gelesen.
  expose: {
    apiUrl: 'http://localhost:3000',
  },
});
