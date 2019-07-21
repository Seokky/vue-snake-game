describe('Home page', () => {
  it('Home page is okay', () => {
    cy.visit('/');
    cy.contains('h1', 'Vue-snake-game');
    cy.contains('.startGameBtn .btnText', 'Start a game!');
  });

  it('Redirect to game area is working', () => {
    cy.visit('/');
    cy.get('.startGameBtn').click();
    cy.url().should('include', '/game');
  });
});
