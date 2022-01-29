describe("vue-3-better-picker", () => {
  beforeEach(() => cy.visit("http://localhost:8080"));

  it("reflects the default text props", () => {
    cy.get("button:contains(Advanced)").click();

    cy.get(".advanced-picker .picker-title").should("have.text", "Picker");
    cy.get(".advanced-picker .cancel").should("have.text", "Cancel");
    cy.get(".advanced-picker .confirm").should("have.text", "OK");
  });

  it("reflects the specified text props", () => {
    cy.get("button:contains(Single)").click();

    cy.get(".single-picker .picker-title").should("have.text", "Single");
    cy.get(".single-picker .cancel").should("have.text", "cancel");
    cy.get(".single-picker .confirm").should("have.text", "confirm");
  });

  it("reflects the default selection prop", () => {
    cy.get("button:contains(Single)").click();

    cy.get(".args-of-change-event").should("have.text", '[{"index":0,"value":"a","text":"A"}]');
  });

  it("reflects the specified selection prop", () => {
    cy.get("button:contains(Double)").click();

    cy.get(".args-of-change-event").should(
      "have.text",
      '[{"index":13,"value":"n","text":"N"},{"index":14,"value":"o","text":"O"}]'
    );
  });

  it("reflects the updated data on props", () => {
    cy.get("button:contains(Advanced)").click();

    // When switch from 31 January to February, auto switching to 1 February
    cy.get(".args-of-change-event").should(
      "have.text",
      '[{"index":12,"value":2022,"text":"2022"},{"index":0,"value":1,"text":"01"},{"index":30,"value":31,"text":"31"}]'
    );
    cy.get(".advanced-picker .wheel:eq(1) .wheel-item:contains(02)").click({ force: true });
    cy.get(".args-of-change-event").should(
      "have.text",
      '[{"index":12,"value":2022,"text":"2022"},{"index":1,"value":2,"text":"02"},{"index":0,"value":1,"text":"01"}]'
    );
  });

  it("emits the change event when the scrolling ends", () => {
    cy.get("button:contains(Double)").click();

    cy.get(".double-picker .wheel:eq(0) .wheel-item:contains(P)").click({ force: true });
    cy.get(".double-picker .wheel:eq(1) .wheel-item:contains(C)").click({ force: true });
    cy.get(".args-of-change-event").should(
      "have.text",
      '[{"index":15,"value":"p","text":"P"},{"index":2,"value":"c","text":"C"}]'
    );
    cy.get(".args-of-select-event").should("have.text", "{}");
    cy.get(".picker").should("be.visible");
  });

  it("emits the select event when clicked confirm button", () => {
    cy.get("button:contains(Double)").click();

    cy.get(".double-picker .confirm").click();
    cy.get(".args-of-select-event").should(
      "have.text",
      '[{"index":13,"value":"n","text":"N"},{"index":14,"value":"o","text":"O"}]'
    );
    cy.get(".picker").should("not.be.visible");
  });

  it("emits no event when clicked cancel button", () => {
    cy.get("button:contains(Triple)").click();

    cy.get(".triple-picker .cancel").click();
    cy.get(".args-of-select-event").should("have.text", "{}");
    cy.get(".picker").should("not.be.visible");
  });

  it("emits no event when clicked outside picker", () => {
    cy.get("button:contains(Triple)").click();

    cy.get("body").click();
    cy.get(".args-of-select-event").should("have.text", "{}");
    cy.get(".picker").should("not.be.visible");
  });
});
