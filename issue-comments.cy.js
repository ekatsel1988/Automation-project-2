import { faker } from "@faker-js/faker";

const myComment = "My test comment for Sprint_2";
const openFirstIssue = () =>
  cy.get('[data-testid="board-list:backlog"]').children().first().click();
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const newCommentOption = () => cy.contains("Add a comment...");
const getCommentTextArea = () =>
  cy.get('textarea[placeholder="Add a comment..."]');
const getIssueComment = () => cy.get('[data-testid="issue-comment"]');
const saveComment = () => cy.contains("button", "Save").click();
const getEditButton = () => cy.contains("Edit");
const getDeleteButton = () => cy.contains("Delete");
const getConfirmDeletionButton = () => cy.contains("button", "Delete comment");
const confirmationWindow = '[data-testid="modal:confirm"]';
const rndComment = faker.lorem.sentence(7);

describe("My tests for creating, editing and deleting issue comments", () => {
  beforeEach(() => {
    // Visit the project board page and open the first issue
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
      });
    // Open the first issue in the backlog
    openFirstIssue();
  });

  it("Should create new comment, edit it and then delete it", () => {
    // CREATE A COMMENT
    getIssueDetailsModal().within(() => {
      // Verify that there is already one comment present
      getIssueComment().should("have.length", 1);
      // Click the 'Add a comment...' placeholder
      newCommentOption().click();
      // Type the initial comment
      getCommentTextArea().type(myComment);
      // Save the comment and verify that the save button is not visible anymore
      saveComment().should("not.exist");
      // Assert that the 'Add a comment...' option exists and the newly added comment is visible
      newCommentOption().should("exist");
      getIssueComment()
        .should("have.length", 2)
        .first()
        .should("contain", myComment);
    });

    // EDIT THE COMMENT
    getIssueDetailsModal().within(() => {
      getIssueComment().first();
      // Click the 'Edit' button and verify that it is not visible after clicking
      getEditButton().click().should("not.exist");
      // Clear the previous comment and add a new comment
      getCommentTextArea()
        .should("contain", myComment)
        .clear()
        .type(rndComment);
      // Save the edited comment and verify that the save button is not visible anymore
      saveComment().should("not.exist");
      // Assert that the newly edited comment is visible and the previous comment is not
      getIssueComment()
        .should("have.length", 2)
        .first()
        .should("contain", rndComment);
      getIssueComment().contains(myComment).should("not.exist");
    });

    // DELETE THE COMMENT
    getIssueDetailsModal().within(() => {
      getIssueComment()
        .should("have.length", 2)
        .first()
        .should("contain", rndComment);
      // Click the 'Delete' button
      getDeleteButton().click();
    });
    // Verify that the confirmation window opens and confirm the deletion
    cy.get(confirmationWindow)
      .should("exist")
      .and("contain.text", "Are you sure you want to delete this comment?");
    getConfirmDeletionButton()
      .should("be.visible")
      .click()
      .should("not.exist");
    // Confirm that the previously created comment is deleted and not visible in the issue view
    getIssueComment().contains(rndComment).should("not.exist");
    getIssueComment().should("have.length", 1);
  });
});
