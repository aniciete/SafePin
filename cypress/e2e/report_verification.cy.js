describe('Report Verification', () => {
  beforeEach(() => {
    // Log in as an authority user
    cy.login('authority@test.com', 'password123');
  });

  it('allows an authority user to verify a report', () => {
    // Visit the authority dashboard
    cy.visit('/src/authority-page/index.html');

    // Find the first report and click the "Verify" button
    cy.get('.report-item').first().within(() => {
      cy.get('.verify-button').click();
    });

    // Assert that the report is marked as verified
    cy.get('.report-item').first().should('contain', 'Verified');
  });
});