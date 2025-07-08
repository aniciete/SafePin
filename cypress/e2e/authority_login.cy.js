describe('Authority Login', () => {
  it('allows an authority user to log in', () => {
    // Visit the login page
    cy.visit('/src/login.html');

    // Fill in the credentials
    cy.get('#email').type('authority@test.com');
    cy.get('#password').type('password123');

    // Submit the form
    cy.get('form').submit();

    // Assert that the login was successful
    cy.url().should('include', '/authority-page/index.html');
    cy.contains('Welcome, Authority');
  });
});