/// <reference types="cypress" />

describe('Issue Deletion', () => {
  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

  beforeEach(() => {
    // Visit the project board page and open the first issue
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      // Open the issue with the specified text
      cy.contains('This is an issue of type: Task.').click();
      // Assert the visibility of the issue detail view modal
      getIssueDetailsModal().should('be.visible');
    });
  });

  // TEST CASE 1: Issue Deletion
  it('Should delete an issue and validate it successfully', () => {
    // Within the issue details modal, click the delete button
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });

    // Confirm the deletion
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Delete issue').click();
    });

    // Assert that the confirmation modal is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    // Assert that the issue details modal is not visible
    cy.get('[data-testid="modal:issue-details"]').should('not.exist');
    // Assert that the issue is deleted and no longer displayed on the board
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains('This is an issue of type: Task.').should('not.exist');
      cy.get('[data-testid="list-issue"]').should('have.length', 3); // Adjust the number as per your setup
    });
  });

  // TEST CASE 2: Issue Deletion Cancellation
  it('Should initiate the deletion and then cancel it successfully', () => {
    // Within the issue details modal, click the delete button
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });

    // Cancel the deletion
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Cancel').click();
    });

    // Assert that the confirmation modal is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    // Assert that the issue details modal is still visible
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    // Close the issue details modal
    cy.get('[data-testid="icon:close"]').eq(0).click();
    // Assert that the issue is still displayed on the board
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains('This is an issue of type: Task.').should('be.visible');
      cy.get('[data-testid="list-issue"]').should('have.length', 4); // Adjust the number as per your setup
    });
  });
});

