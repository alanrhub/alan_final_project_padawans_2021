let valid_address_inside_1 = '180 Alvarado Street Los Angeles, CA 90057';
let valid_address_inside_2 = '2208 Sawtelle Boulevard, Los Angeles, CA 90064';
let valid_address_outside_1 = '1168 Burbank Boulevard, Burbank, CA, USA';
let unvalid_address_1 = '12356 North Altadena Drive, Pasadena, CA, USA';
let product_to_add_1 = 'Organic Hemp Rolling Papers';

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  });
  
describe('Checkout End to End', () => {


    before(() => {
        cy.clearCookies();
        cy.visit('/');
    });

    afterEach(() => {
        //Code to Handle the Sesssions in cypress.
			  //Keep the Session alive when you jump to another test
        let str = [];
        cy.getCookies().then((cook) => {
          cy.log(cook);
          for (let l = 0; l < cook.length; l++) {
            if (cook.length > 0 && l == 0) {
              str[l] = cook[l].name;
              Cypress.Cookies.preserveOnce(str[l]);
            } else if (cook.length > 1 && l > 1) {
              str[l] = cook[l].name;
              Cypress.Cookies.preserveOnce(str[l]);
            }
          }
        })
    });

    it('age_restriction_modal', ()=> {

        //Select modal container, used class selector because it was the only possible selector
        cy.get('.container-sm')
          .within(()=> {
            //Validate "No" button redirection
            cy.contains('No')
                .invoke('attr', 'href')
                .should('contain', 'https://www.samhsa.gov/');
            
            //Validate Yes button access
            cy.contains('Yes')
              .invoke('attr', 'onclick')
              .should('contain', 'setAdultCookie()');

            //Validate Yes button modal close
            cy.contains('Yes')
              .should('have.attr', 'data-dismiss')

            //Button click
            cy.contains('Yes')
              .click();  
              
        });

    });

    it('unvalid_address_bar', () => {

        //Select address search bar
        cy.get('#landing-search-address')
          .focus()
          .type(unvalid_address_1)
          .wait(1000)
          .type('{downArrow}{enter}');
        
        //Select validation popup
        cy.contains('Missing Street Number')
          .should('exist');

    });

    it('valid_address_bar_outside_area', () => {

        //Select address search bar
        cy.get('#landing-search-address')
          .focus()
          .clear()
          .type(valid_address_outside_1)
          .wait(1000)
          .type('{downArrow}{enter}');
          
        
        //Select popup (using "" instead of '' because text has an aphostrofe in don't)
        cy.contains("We don't deliver to you...yet.")
          .should('exist')
          .wait(1000);
          
        
        //Select gray area behind modal to close it
        cy.get('#deliveryAddressModal')
          .click()
          .wait(1500);

    });


    it('valid_address_bar_inside_area', () => {
      //Select address search bar
      cy.get('#landing-search-address')
        .focus()
        .clear()
        .type(valid_address_inside_1)
        .wait(500)
        .type('{downArrow}{enter}');

      //Validate store page
      cy.contains('Welcome to HERB!')
        .should('exist');
    });


    it('add/remove_item_from_product_card', () => {

        //Best sellers section
        cy.add_product_from_card(0);
        cy.wait(1500);
        cy.remove_product_from_card(0);
        cy.wait(1500);

        //New arrivals section
        cy.add_product_from_card(11);
        cy.wait(1500);
        cy.remove_product_from_card(11);
        cy.wait(1500);

        //Navigate to PLP section
        cy.contains('Shop')
          .click();
        cy.contains('Sativa')
          .click()
          .wait(3000);
        cy.add_product_from_plp(5);
        cy.wait(2000);
        cy.remove_product_from_plp(5);

    });

    it('add_item_from_pdp', () => {

      //Navigate to PDP sectin
      cy.contains('Shop')
        .click();
      cy.contains('Papers')
        .click();

      //Select the product
      cy.contains(product_to_add_1)
        .should('exist')
        .click();

      //Validate PDP page matches the product
      cy.contains(product_to_add_1)
        .should('exist');
      
      //Select the "+" button 
      cy.get('.input-group-append')
        .eq(0)
        .children()
        .click()
        .wait(1000);

      //Select the "Add to cart button" button 
      cy.get('#add-to-cart-button')
        .click()

    });
  
    it('maintain_address_deliver_to', () => {
      //Select the Deliver to search bar
        cy.wait(3000);
        cy.get('#ship-address')
          .focus()
          .clear()
          .type(valid_address_inside_2)
          .wait(1000)
          .type('{downArrow}{enter}')
          .wait(500);

        //Click on modal button to mantain current address
        cy.contains('Use Original Address')
          .click()
          .wait(1000);
        
        //Validate product remains in cart
        cy.contains(product_to_add_1)
          .should('exist');
    });

    it('change_address_deliver_to', () => {
      //Select the Deliver to search bar
        cy.wait(1000);
        cy.get('#ship-address')
          .focus()
          .clear()
          .type(valid_address_inside_2)
          .wait(1000)
          .type('{downArrow}{enter}')
          .wait(500);
        
        //Click on modal button to mantain current address
        cy.contains('Change address')
          .click()
          .wait(1000);
        
        //Validate product remains in cart
        cy.contains('There are no items in your cart.')
          .should('exist');
    });

    it('empty_cart_checkout', () => {
      cy.contains('Checkout')
        .should('be.disabled');
    });

    it('validate_shopping_cart', () => {

      //Add items from suggestion
      //Select the product card
      cy.get('.product-thumbnail-image-wrapper')
        .eq(0)
        .parent()
        .parent()
        .scrollIntoView()
        .realHover();

      //Select the "+" button in the product card
      //Force true because button is hidden
      cy.get('.input-group-append')
        .eq(0)
        .children()
        .wait(500)
        .click({force:true})
        .wait(2000);

      //Select the product card
      cy.get('.product-thumbnail-image-wrapper')
        .eq(1)
        .parent()
        .parent()
        .scrollIntoView()
        .realHover();

      //Select the "+" button in the product card
      //Force true because button is hidden
      cy.get('.input-group-append')
        .eq(2)
        .children()
        .wait(500)
        .click({force:true})
        .wait(2000);

      //Validate shopping cart icon counter
      cy.get('.shopping-bag-item-count')
      .should('contain','2');

       //------ Remove product from cart ------
      //Add items from suggestion
      //Select the product card
      cy.get('.product-thumbnail-image-wrapper')
        .eq(3)
        .parent()
        .parent()
        .scrollIntoView()
        .realHover();

      //Select the "+" button in the product card
      //Force true because button is hidden
      cy.get('.input-group-append')
        .eq(5)
        .children()
        .wait(500)
        .click({force:true})
        .wait(2000);

        //Select Remove hyperlink
        cy.contains('Remove')
          .eq(0)
          .click();
        
        //Validate shopping cart icon counter
        cy.get('.shopping-bag-item-count')
        .should('contain','2');
      //------ End remove product code -------
  
      //Get the price of item one
      cy.get_price(1)
      cy.task('getConcat')
        .then((concat_val_1) => {
          //call the function to get the full price
          let float_val_1 = parseFloat(concat_val_1);

          //Get the price of item two
          cy.get_price(3)
          cy.task('getConcat')
            .then((concat_val_2) => {
              //call the function to get the full price
              let float_val_2 = parseFloat(concat_val_2);

              //Get the subtotal
              cy.get('#order-subtotal > .text-right')
                .invoke('text')
                .then((subtotal) => {
                  //Manage string to get just the amount and parse it as a float value
                    let total_from_items = float_val_1+float_val_2;
                    let subtotal_number = parseFloat(subtotal.replace('$',''));
                    //Store the subtotal value for later use in another tc
                    cy.task('setSubTotal',subtotal_number);

                    //Get the total
                    cy.get('#order-total > .text-right')
                      .invoke('text')
                      .then((total) => {
                          //Manage string to get just the amount and parse it as a float value
                          let total_number = total.split(" ")[8];
                          let total_number_2 = parseFloat(total_number.replace('$',''));
                          //Store the subtotal value for later use in another tc
                          cy.task('setTotal',total_number_2);
                          //Validate all prices match
                          expect(total_from_items).to.equal(subtotal_number)
                                                  .to.equal(total_number_2);
                      });
                });
          });
      });
    });


    it('success_checkout', () => {

        //Select checkout button
        cy.contains('Checkout')
          .click();

        //Validate checkout page redirection
        cy.contains('Checkout')
          .should('exist');

        //Validate checkout page redirection
        cy.contains('Order Summary')
          .should('exist');
        
        //Get the subtotal price 
        cy.contains('Subtotal')
          .next('td')
          .invoke('text')
          .then((text_subtotal) => {
              //Manage string to get just the amount and parse it as a float value
              let subtotal_number = parseFloat(text_subtotal.replace('$',''));

              //Get the stored subtotal price from the cart
              cy.task('getSubTotal')
                .then((subtotal_val) => {
                  //Validate subtotal value match
                  expect(subtotal_val).to.equal(subtotal_number);
                  
                    //Get the total price
                    cy.contains('Total')
                      .next('td')
                      .invoke('text')
                      .then((text_total) => {
                          //Manage string to get just the amount and parse it as a float value
                          let total_number = parseFloat(text_total.replace('$',''));

                          //Get the stored total price from the cart
                          cy.task('getTotal')
                            .then((total_val) => {
                                //Validate total value match
                                expect(total_val).to.equal(total_number);
                                //Validate subtotal and total value match
                                expect(subtotal_val).to.equal(total_val);
                            });
                      });
                    
                });
          });
          
    });
});
