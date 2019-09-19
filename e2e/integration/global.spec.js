describe("Global", () => {
  it("should have a blue background, but not a red color", () => {
    cy.visit("http://localhost:3000/color-red?name=global");
    cy.visit("http://localhost:3000/background-blue?name=global");
    cy.get("body").should("have.css", "background-color", "rgb(0, 0, 255)");
    cy.get("body").should("not.have.css", "color", "rgb(255, 0, 0)");
  });
  it("should have a red color, but not a blue background", () => {
    cy.visit("http://localhost:3000/background-blue?name=global");
    cy.visit("http://localhost:3000/color-red?name=global");
    cy.get("body").should("have.css", "color", "rgb(255, 0, 0)");
    cy.get("body").should("not.have.css", "background-color", "rgb(0, 0, 255)");
  });
});
