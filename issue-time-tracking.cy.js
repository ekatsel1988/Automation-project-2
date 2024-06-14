import IssueModal from "../pages/IssueModal.js";
import { faker } from "@faker-js/faker";

describe("Time estimation & tracking functionalities", () => {
  beforeEach(() => {
    // Visit the base URL and navigate to the project board
    cy.visit("/");
    cy.url({ timeout: 120000 })
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url);
        // Select the first issue in the list
        IssueModal.getFirstListIssue();
      });
  });

  const issueDetails = {
    estimatedTime: "10",
    newEstimatedTime: "20",
    removedEstimatedTime: "",
    timeSpent: "2",
    timeRemaining: "5",
  };

  it("Should add, edit & remove time estimation successfully", () => {
    // Add a time estimation to the issue
    IssueModal.addEstimation(issueDetails);
    // Validate that the time estimation has been saved correctly
    IssueModal.validateEstimationSaved(
      issueDetails,
      issueDetails.estimatedTime
    );
    // Update the time estimation with a new value
    IssueModal.updateEstimation(issueDetails);
    // Validate that the new time estimation has been saved correctly
    IssueModal.validateEstimationSaved(
      issueDetails,
      issueDetails.newEstimatedTime
    );
    // Remove the time estimation from the issue
    IssueModal.removeEstimation(issueDetails);
    // Validate that the time estimation has been removed correctly
    IssueModal.validateEstimationRemoved(issueDetails);
  });

  it("Should log & remove logged time successfully", () => {
    // Delete any previously logged time on the issue
    IssueModal.deleteLoggedTime();
    // Log time spent and remaining time for the issue
    IssueModal.logTime(issueDetails);
  });
});
