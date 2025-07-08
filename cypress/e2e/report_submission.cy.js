describe('Anonymous Report Submission', () => {
  it('allows a user to submit a report anonymously', () => {
    // Visit the report submission page
    cy.visit('/src/landing-page/report.html');

    // Fill out the form
    cy.get('#crime-type').select('Theft');
    cy.get('#description').type('My bike was stolen from the park.');
    cy.get('#attachment').selectFile('cypress/fixtures/example.json');

    // Submit the form
    cy.get('form').submit();

    // Assert that the submission was successful
    cy.url().should('include', '/submission-success');
    cy.contains('Thank you for your report!');
  });
});