class IssueModal {
    constructor() {
      this.submitButton = 'button[type="submit"]';
      this.issueModal = '[data-testid="modal:issue-create"]';
      this.issueDetailModal = '[data-testid="modal:issue-details"]';
      this.title = 'input[name="title"]';
      this.issueType = '[data-testid="select:type"]';
      this.descriptionField = ".ql-editor";
      this.assignee = '[data-testid="select:userIds"]';
      this.backlogList = '[data-testid="board-list:backlog"]';
      this.issuesList = '[data-testid="list-issue"]';
      this.deleteButton = '[data-testid="icon:trash"]';
      this.deleteButtonName = "Delete issue";
      this.cancelDeletionButtonName = "Cancel";
      this.confirmationPopup = '[data-testid="modal:confirm"]';
      this.closeButton = '[data-testid="icon:close"]';
      this.issueTitle = "This is an issue of type: Task.";
      this.addCommentField = "Add a comment...";
      this.commentTextarea = 'textarea[placeholder="Add a comment..."]';
      this.saveButton = "Save";
      this.commentList = '[data-testid="issue-comment"]';
      this.previousComment = "An old silent pond...";
      this.editButton = "Edit";
      this.commentDelete = "Delete";
      this.commentDeleteConfirm = "Delete comment";
      this.numberField = 'input[placeholder="Number"]';
      this.timeTrackerStopwatch = '[data-testid="icon:stopwatch"]';
      this.placeholderNumber = "Number";
      this.trackingModal = '[data-testid="modal:tracking"]';
      this.buttonDone = "Done";
      this.noTimeLoggedLabel = "No time logged";
    }
  
    getFirstListIssue() {
      return cy
        .get(this.issuesList, { timeout: 120000 })
        .eq(0)
        .should("be.visible", { timeout: 120000 })
        .click();
    }
  
    getTrackingModal() {
      return cy.get(this.trackingModal, { timeout: 80000 });
    }
  
    getIssueModal() {
      return cy.get(this.issueModal, { timeout: 80000 });
    }
  
    getIssueDetailModal() {
      return cy.get(this.issueDetailModal, { timeout: 80000 });
    }
  
    getConfirmationPopup() {
      return cy.get(this.confirmationPopup);
    }
  
    selectIssueType(issueType) {
      cy.get(this.issueType).click("bottomRight");
      cy.get(`[data-testid="select-option:${issueType}"]`)
        .trigger("mouseover")
        .trigger("click");
    }
  
    selectAssignee(assigneeName) {
      cy.get(this.assignee).click("bottomRight");
      cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
    }
  
    editTitle(title) {
      cy.get(this.title).debounced("type", title);
    }
  
    editDescription(description) {
      cy.get(this.descriptionField).type(description);
    }
  
    createIssue(issueDetails) {
      this.getIssueModal().within(() => {
        this.selectIssueType(issueDetails.type);
        this.editDescription(issueDetails.description);
        this.editTitle(issueDetails.title);
        this.selectAssignee(issueDetails.assignee);
        cy.get(this.submitButton).click();
      });
      cy.log("Issue created successfully");
    }
  
    ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
      cy.get(this.issueModal).should("not.exist");
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");
  
      cy.get(this.backlogList)
        .should("be.visible")
        .and("have.length", "1")
        .within(() => {
          cy.get(this.issuesList)
            .should("have.length", expectedAmountIssues)
            .first()
            .find("p")
            .contains(issueDetails.title);
          cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
            "be.visible"
          );
        });
    }
  
    ensureIssueIsVisibleOnBoard(issueTitle) {
      cy.get(this.issueDetailModal).should("not.exist");
      cy.reload();
      cy.contains(issueTitle).should("be.visible");
    }
  
    ensureIssueIsNotVisibleOnBoard(issueTitle) {
      cy.get(this.issueDetailModal).should("not.exist");
      cy.reload();
      cy.contains(issueTitle).should("not.exist");
    }
  
    validateIssueVisibilityState(issueTitle, isVisible = true) {
      cy.get(this.issueDetailModal).should("not.exist");
      cy.reload();
      cy.get(this.backlogList).should("be.visible");
      if (isVisible) cy.contains(issueTitle).should("be.visible");
      if (!isVisible) cy.contains(issueTitle).should("not.exist");
    }
  
    clickDeleteButton() {
      cy.get(this.deleteButton).click();
      cy.get(this.confirmationPopup).should("be.visible");
    }
  
    confirmDeletion() {
      cy.get(this.confirmationPopup).within(() => {
        cy.contains(this.deleteButtonName).click();
      });
      cy.get(this.confirmationPopup).should("not.exist");
      cy.get(this.backlogList).should("be.visible");
    }
  
    cancelDeletion() {
      cy.get(this.confirmationPopup).within(() => {
        cy.contains(this.cancelDeletionButtonName).click();
      });
      cy.get(this.confirmationPopup).should("not.exist");
      cy.get(this.issueDetailModal).should("be.visible");
    }
  
    closePopUp() {
      cy.get(this.closeButton).first().click();
    }
  
    closeDetailModal() {
      cy.get(this.issueDetailModal).get(this.closeButton).eq(0).click();
      cy.get(this.issueDetailModal).should("not.exist");
    }
  
    addComment(comment) {
      this.getIssueDetailModal().within(() => {
        cy.contains(this.addCommentField).click();
  
        cy.get(this.commentTextarea).type(comment);
  
        cy.contains("button", this.saveButton).click().should("not.exist");
  
        cy.contains(this.addCommentField).should("exist");
        cy.get(this.commentList).should("contain", comment);
      });
    }
  
    editComment(comment, editedComment) {
      this.getIssueDetailModal().within(() => {
        cy.get(this.commentList)
          .first()
          .contains(this.editButton)
          .click()
          .should("not.exist");
  
        cy.get(this.commentTextarea)
          .should("contain", comment)
          .clear()
          .type(editedComment);
  
        cy.contains(this.saveButton).click().should("not.exist");
  
        cy.get(this.commentList)
          .should("contain", this.editButton)
          .and("contain", editedComment);
      });
    }
  
    deleteComment(editedComment) {
      this.getIssueDetailModal().within(() => {
        cy.get(this.commentList).contains(this.commentDelete).click();
      });
  
      this.getConfirmationPopup().within(() => {
        cy.contains("button", this.commentDeleteConfirm)
          .click()
          .should("not.exist");
      });
      this.getIssueDetailModal().within(() => {
        cy.get(editedComment).should("not.exist");
      });
    }
  
    // P5S2W2 Estimation tests (Assignment 2)
  
    addEstimation(issueDetails) {
      this.deleteLoggedTime();
      this.getIssueDetailModal().within(() => {
        cy.get(this.numberField)
          .clear()
          .type(issueDetails.estimatedTime)
          .should("have.attr", "value", issueDetails.estimatedTime);
        cy.get(this.timeTrackerStopwatch)
          .next()
          .contains(issueDetails.estimatedTime + "h estimated");
      });
      cy.log("Estimation added");
    }
  
    validateEstimationSaved(issueDetails, timeEstimated) {
      this.closeDetailModal();
      this.getFirstListIssue(issueDetails);
      this.getIssueDetailModal().within(() => {
        cy.get(this.numberField)
          .should("be.visible")
          .should("have.attr", "value", timeEstimated);
        cy.get(this.timeTrackerStopwatch)
          .next()
          .contains(timeEstimated + "h estimated");
      });
      cy.log("Estimation saved successfully");
    }
  
    validateEstimationRemoved(issueDetails) {
      this.closeDetailModal();
      this.getFirstListIssue(issueDetails);
      this.getIssueDetailModal().within(() => {
        cy.get(this.numberField)
          .should("be.visible")
          .should("have.attr", "value", issueDetails.removedEstimatedTime)
          .should("have.attr", "placeholder", this.placeholderNumber);
      });
      cy.log("Estimation saved successfully");
    }
  
    updateEstimation(issueDetails) {
      this.getIssueDetailModal().within(() => {
        cy.get(this.numberField)
          .clear()
          .type(issueDetails.newEstimatedTime)
          .should("have.attr", "value", issueDetails.newEstimatedTime);
        cy.get(this.timeTrackerStopwatch)
          .next()
          .contains(issueDetails.newEstimatedTime + "h estimated");
      });
      cy.log("Estimation updated");
    }
  
    removeEstimation(issueDetails) {
      this.getIssueDetailModal().within(() => {
        cy.get(this.numberField)
          .clear()
          .should("have.attr", "value", issueDetails.removedEstimatedTime)
          .should("have.attr", "placeholder", this.placeholderNumber)
          .and("be.visible");
        cy.get(this.timeTrackerStopwatch)
          .next()
          .should("not.contain", issueDetails.newEstimatedTime);
      });
      cy.log("Estimation removed");
    }
  
    // P5S2W2 Time tracking tests (Assignment 2)
  
    deleteLoggedTime() {
      this.getIssueDetailModal().within(() => {
        cy.get(this.timeTrackerStopwatch).click();
      });
      this.getTrackingModal().within(() => {
        cy.get(this.numberField)
          .eq(0)
          .clear()
          .should("have.attr", "value", "")
          .should("have.attr", "placeholder", this.placeholderNumber);
        cy.get(this.numberField)
          .eq(1)
          .clear()
          .should("have.attr", "value", "")
          .should("have.attr", "placeholder", this.placeholderNumber);
        cy.get("button").contains(this.buttonDone).click();
      });
      cy.get(this.trackingModal).should("not.exist");
      this.getIssueDetailModal().within(() => {
        cy.get(this.timeTrackerStopwatch)
          .next()
          .should("contain", this.noTimeLoggedLabel);
      });
      cy.log("Logged time deleted");
    }
  
    logTime(issueDetails) {
      this.getIssueDetailModal().within(() => {
        cy.get(this.timeTrackerStopwatch).click();
      });
      this.getTrackingModal().within(() => {
        cy.get(this.numberField)
          .eq(0)
          .type(issueDetails.timeSpent)
          .should("have.attr", "value", issueDetails.timeSpent)
          .should("be.visible");
        cy.get(this.numberField)
          .eq(1)
          .type(issueDetails.timeRemaining)
          .should("have.attr", "value", issueDetails.timeRemaining)
          .should("be.visible");
        cy.get("button").contains(this.buttonDone).click();
      });
      cy.get(this.trackingModal).should("not.exist");
      this.getIssueDetailModal().within(() => {
        cy.get(this.timeTrackerStopwatch)
          .next()
          .should("not.contain", this.noTimeLoggedLabel)
          .should("contain", issueDetails.timeSpent + "h logged")
          .and("contain", issueDetails.timeRemaining + "h remaining");
      });
      cy.log("Time logged");
    }
  }
  
  export default new IssueModal();