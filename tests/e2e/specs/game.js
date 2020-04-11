describe('Game page', () => {
  it('Is game starting when space pressed', () => {
    cy.visit('/game');
    cy.get('#gameAreaWrapper').trigger('keydown', { code: 'Space' });
    cy.get('.gameInfoWrapper').contains('Pause:');
  });

  it('Is game paused when space pressed', () => {
    cy.visit('/game');
    cy.get('#gameAreaWrapper').trigger('keydown', { code: 'Space' });
    cy.wait(500);
    cy.get('#gameAreaWrapper').trigger('keydown', { code: 'Space' });
    cy.get('.gameInfoWrapper').contains('Play:');
  });

  it('Is snake visible', () => {
    cy.visit('/game');
    const startSnakeCoords = '5:5';
    cy.get('#gameAreaWrapper > div')
      .then((el) => {
        for (let i = 0; i < el.length; i += 1) {
          if (el[i].getAttribute('id') === startSnakeCoords) {
            return el[i];
          }
        }
      })
      .then((el) => {
        cy.get(el).should('have.class', 'snakeHead');
      });
  });

  it('Is meat visible', () => {
    cy.visit('/game');
    cy.get('#gameAreaWrapper > div')
      .then((el) => {
        for (let i = 0; i < el.length; i++) {
          if (el[i].getAttribute('class') === 'areaField meatField') {
            return el[i];
          }
        }
      })
      .then((el) => {
        cy.get(el).should('have.class', 'meatField');
      });
  });
});
