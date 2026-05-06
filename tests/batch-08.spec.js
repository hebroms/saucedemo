import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

describe('SauceDemo Feature Tests', () => {
    let browser;
    let page;
    let saucedemoPage;
    let genericFactory;

    const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    beforeEach(async () => {
        await page.goto(BASE_URL);
        saucedemoPage = new SAUCEDEMOPage(page);
        genericFactory = new GenericFactory(page);
        // Assuming login setup is required for most tests, though specific scenarios might require different initial states.
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Scenario: Attempting to add minimum quantity (1)', async () => {
        // Given the user is viewing a product page
        await saucedemoPage.navigateToProductPage(); 
        
        // When the user sets the quantity input to 1
        await genericFactory.setQuantityInput(1);
        
        // And clicks Add to Cart
        await saucedemoPage.addToCart();
        
        // Then the item should be added successfully
        await saucedemoPage.assertItemAddedSuccessfully();
    });

    test('Scenario: Attempting to add maximum allowed quantity', async () => {
        // Given the product has a maximum stock limit of N (Assuming N=99 for testing purposes if not explicitly defined)
        const maxStockLimit = 99; 
        await genericFactory.setProductMaxStock(maxStockLimit);

        // When the user attempts to set quantity to N (or slightly above)
        await genericFactory.setQuantityInput(maxStockLimit + 1);
        
        // And clicks Add to Cart
        await saucedemoPage.addToCart();
        
        // Then the system should display an appropriate error message regarding stock limits
        await saucedemoPage.assertStockLimitErrorDisplayed();
    });

    test('Scenario: Verifying the final price calculation includes taxes/fees (if applicable)', async () => {
        // Given the cart total is calculated
        await saucedemoPage.navigateToCart();
        
        // When the user proceeds to payment stage
        await saucedemoPage.proceedToPayment();
        
        // Then the displayed final amount must strictly match the calculated total plus any mandatory fees
        const expectedFinalAmount = 100 + 5; // Example calculation: $100 item + $5 fee
        await saucedemoPage.assertFinalAmountMatchesCalculation(expectedFinalAmount);
    });

    test('Scenario: Entering an invalid email format for account creation', async () => {
        // Given the user is on the registration form
        await saucedemoPage.navigateToRegistrationForm();
        
        // When the user enters an improperly formatted email address
        const invalidEmail = 'invalid-email-format';
        await genericFactory.enterInvalidEmail(invalidEmail);
        
        // And attempts to register
        await saucedemoPage.attemptRegistration();
        
        // Then a clear validation error must be displayed for the email field
        await saucedemoPage.assertValidationErrorDisplayedForEmail(invalidEmail);
    });

    test('Scenario: Searching for a non-existent product', async () => {
        // Given the user is on the search page
        await saucedemoPage.navigateToSearchPage();
        
        // When the user searches for a random, non-existent item
        const nonExistentItem = 'nonexistentproduct12345';
        await genericFactory.searchForProduct(nonExistentItem);
        
        // And clicks Search
        await saucedemoPage.performSearch();
        
        // Then a message stating 'No results found' should be displayed
        await saucedemoPage.assertNoResultsFoundMessageDisplayed();
    });
});