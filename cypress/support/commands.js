// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('add_product_from_card', (index) => { 
    //This command adds a product at the specified index of any product card sets in a section and validates the card and shopping cart icon counters

    //Using class selector due to lack of selectors, also, class name doesn't look likely to change
    //Select the product card
    cy.get('.product-thumbnail-image-wrapper')
      .eq(`${index}`)
      .parent()
      .parent()
      .scrollIntoView()
      .realHover();

    //Select the "+" button in the product card
    //Force true because button is hidden
    cy.get('.input-group-append')
      .eq(`${index}`)
      .children()
      .click({force:true})
      .wait(1000);
    
    //Select the shopping cart icon to validate the counter
    cy.get('.shopping-bag-item-count')
      .should('contain','1');

    //Select and validate the counter inside the card
    cy.get('.input-group-prepend')
      .eq(`${index}`) 
      .siblings()
      .eq(0)
      .invoke('attr', 'value')
      .should('contain', '1');
});

Cypress.Commands.add('remove_product_from_card', (index) => { 
    //This command removes a product at the specified index of any product card sets in a section and validates the card and shopping cart icon counters

    //Using class selector due to lack of selectors, also, class name doesn't look likely to change
    //Select the product card
    cy.get('.product-thumbnail-image-wrapper')
      .eq(`${index}`)
      .parent()
      .parent()
      .scrollIntoView()
      .realHover();
      
    //Select the "-" button in the product card
    //Force true because button is hidden
    cy.get('.input-group-prepend')
      .eq(`${index}`)
      .children()
      .wait(500)
      .click({force:true})
      .wait(1500);

    //Select and validate the counter inside the cart
    cy.get('.input-group-prepend')
      .eq(`${index}`)
      .siblings()
      .eq(0)
      .invoke('attr', 'value')
      .should('contain', '0');

    //Select the shopping cart icon to validate the counter
    cy.get('.shopping-bag-item-count')
      .should('contain','0'); 
});

Cypress.Commands.add('add_product_from_plp', (index) => { 
  //This command adds a product at the specified index of any product card sets in a PLP section and validates the card and shopping cart icon counters

  //Using class selector due to lack of selectors, also, class name doesn't look likely to change
  //Select the product card
  cy.get('.product-thumbnail-image-wrapper')
    .eq(`${index}`)
    .parent()
    .parent()
    .scrollIntoView()
    .realHover();

  //Select the "+" button in the product card
  //Force true because button is hidden
  cy.get('.input-group-append')
  //Index -3 because of weird numeration on cards in PLP page
    .eq(`${index}`- 3)
    .children()
    .click({force:true})
    .wait(1000);
  
  //Select the shopping cart icon to validate the counter
  cy.get('.shopping-bag-item-count')
    .should('contain','1');

  //Select and validate the counter inside the card
  cy.get('.input-group-prepend')
  //Index -3 because of weird numeration on cards in PLP page
    .eq(`${index}` - 3) 
    .siblings()
    .eq(0)
    .invoke('attr', 'value')
    .should('contain', '1');
});

Cypress.Commands.add('remove_product_from_plp', (index) => { 
  //This command removes a product at the specified index of any product card sets in a section and validates the card and shopping cart icon counters

  //Using class selector due to lack of selectors, also, class name doesn't look likely to change
  //Select the product card
  cy.get('.product-thumbnail-image-wrapper')
    .eq(`${index}`)
    .parent()
    .parent()
    .scrollIntoView()
    .realHover();
    
  //Select the "-" button in the product card
  //Force true because button is hidden
  //Index -3 because of weird numeration on cards in PLP page
  cy.get('.input-group-prepend')
    .eq(`${index}`- 3)
    .children()
    .wait(500)
    .click({force:true})
    .wait(1500);

  //Select and validate the counter inside the cart
  //Index -3 because of weird numeration on cards in PLP page
  cy.get('.input-group-prepend')
    .eq(`${index}`- 3)
    .siblings()
    .eq(0)
    .invoke('attr', 'value')
    .should('contain', '0');

  //Select the shopping cart icon to validate the counter
  cy.get('.shopping-bag-item-count')
    .should('contain','0'); 
});

Cypress.Commands.add('get_price', (index) => { 
  //This command returns the specified item full price
  //Save number without decimals on variable
  cy.get('.money-whole')
    .eq(`${index}`)
    .invoke('text')
    .then((val) => {
      cy.task('setInt', val);
  });

  //Save decimals on variable
  cy.get('.money-decimal')
    .eq(`${index}`)
    .invoke('text')
    .then((val) => {
      cy.task('setDec', val);
  });

  //function to concat the total price of each item
  function concat_total(val_1,val_2) {
    //console.log(val_1.concat('.',val_2));
    return val_1.concat('.',val_2);
  };

  //Get number without decimals variable
  cy.task('getInt')
    .then((val_1) => {
    //Get decimals variable
    cy.task('getDec')
      .then((val_2) => {
      //call the function to get the full price and store the returned value in a variable
      cy.task('setConcat', concat_total(val_1,val_2));
    });
  });

  
});