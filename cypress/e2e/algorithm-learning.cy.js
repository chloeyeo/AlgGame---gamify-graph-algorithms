describe("Algorithm Learning Flow", () => {
  it("completes full learning journey", () => {
    cy.visit("/education/dfs");

    // Check initial page load
    cy.get("h1").should("contain", "Learn Depth First Search");

    // Generate new graph
    cy.get("button").contains("Generate New Graph").click();
    cy.get("[data-testid=graph-visualization]").should("exist");

    // Run algorithm
    cy.get("button").contains("Run DFS").click();

    // Verify explanations update
    cy.get("[data-testid=explanation-text]").should(
      "not.contain",
      "No explanation available"
    );

    // Check pseudocode highlighting
    cy.get("[data-testid=highlighted-code]").should("exist");

    // Test navigation
    cy.get("button").contains("Next").click();
    cy.get("[data-testid=step-counter]").should("contain", "2");
  });
});
