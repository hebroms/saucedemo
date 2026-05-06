import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let basePage: BasePage;
    let saucedemoPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    // Setup environment variables and factory instance
    beforeAll(() => {
        basePage = new BasePage();
        saucedemoPage = new SAUCEDEMOPage(basePage);
        genericFactory = new GenericFactory();
    });

    // Setup for user login (assuming a standard setup flow)
    beforeEach(async () => {
        // Assuming a login sequence is required for most tests
        await saucedemoPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);
    });

    // --- Scenario 1: Successful search for an existing product ---
    test('Successful search for an existing product', async () => {
        // Given the user is on the search page (handled by setup or navigation)
        await saucedemoPage.navigateToSearchPage();

        // When the user searches for a known product name
        const productName = 'Existing Product Name'; // Placeholder, actual test would use data from factory/setup
        await saucedemoPage.searchForProduct(productName);

        // And clicks Search
        await saucedemoPage.clickSearchButton();

        // Then the search results should display the correct product
        await saucedemoPage.assertSearchResultsDisplay(productName);
    });

    // --- Scenario 2: Successfully adding multiple items to the cart ---
    test('Successfully adding multiple items to the cart', async () => {
        // Given the user is on a product page (assuming we start on a specific product)
        await saucedemoPage.navigateToProductPage('Product A');

        // When the user adds Product A and Product B to the cart
        await saucedemoPage.addToCart('Product A');
        await saucedemoPage.addToCart('Product B');

        // And views the cart summary
        await saucedemoPage.viewCartSummary();

        // Then the total price calculation should be accurate
        await saucedemoPage.assertCartTotalAccuracy();
    });

    // --- Scenario 3: Updating the quantity of an existing cart item ---
    test('Updating the quantity of an existing cart item', async () => {
        // Given an item is in the cart with quantity Q1 (Assume Product A is already added)
        await saucedemoPage.ensureItemInCart('Product A', 1);

        // When the user updates the quantity to Q2 (where Q2 > Q1)
        const newQuantity = 5;
        await saucedemoPage.updateCartItemQuantity('Product A', newQuantity);

        // And saves the change
        await saucedemoPage.saveCartChanges();

        // Then the cart total should reflect the new quantity and updated price
        await saucedemoPage.assertCartTotalReflectsNewQuantity(newQuantity);
    });

    // --- Scenario 4: Attempting to access admin panel as standard user ---
    test('Attempting to access admin panel as standard user', async () => {
        // Given the user is logged in as a Standard User (Setup handles this)
        await saucedemoPage.ensureUserRole('Standard');

        // When the user attempts to navigate to /admin
        await saucedemoPage.navigateToRoute(ROUTES.ADMIN_PANEL);

        // Then the system must redirect or display an access denied message
        await saucedemoPage.assertAccessDeniedMessage();
    });

    // --- Scenario 5: Attempting to add zero quantity to the cart ---
    test('Attempting to add zero quantity to the cart', async () => {
        // Given the user is on a product page
        await saucedemoPage.navigateToProductPage('Any Product');

        // When the user attempts to set quantity to 0
        await saucedemoPage.setQuantityInput(0);

        // And clicks Add to Cart
        await saucedemoPage.addToCart();

        // Then the system should reject the action and display an appropriate message
        await saucedemoPage.assertErrorMessage('Cannot add zero quantity.');
    });

    // --- Scenario 6: Attempting to add minimum quantity (1) ---
    test('Attempting to add minimum quantity (1)', async () => {
        // Given the user is viewing a product page
        await saucedemoPage.navigateToProductPage('Any Product');

        // When the user sets the quantity input to 1
        await saucedemoPage.setQuantityInput(1);

        // And clicks Add to Cart
        await saucedemoPage.addToCart();

        // Then the item should be added successfully
        await saucedemoPage.assertItemAddedToCart();
    });

    // --- Scenario 7: Attempting to add maximum allowed quantity ---
    test('Attempting to add maximum allowed quantity', async () => {
        // Given the product has a maximum stock limit of N (Assume N is defined in environment or setup)
        const maxStock = ENVIRONMENTS.MAX_STOCK_LIMIT || 10; // Use environment variable if available

        await saucedemoPage.navigateToProductPage('Product with Stock Limit');

        // When the user attempts to set quantity to N (or slightly above)
        await saucedemoPage.setQuantityInput(maxStock + 1);

        // And clicks Add to Cart
        await saucedemoPage.addToCart();

        // Then the system should display an appropriate error message regarding stock limits
        await saucedemoPage.assertErrorMessage('Exceeded maximum available stock.');
    });

    // --- Scenario 8: Verifying the final price calculation includes taxes/fees ---
    test('Verifying the final price calculation includes taxes/fees', async () => {
        // Given the cart total is calculated (Assume items are in cart)
        await saucedemoPage.ensureCartHasItems();

        // When the user proceeds to payment stage
        await saucedemoPage.proceedToPayment();

        // Then the displayed final amount must strictly match the calculated total plus any mandatory fees
        const expectedFinalAmount = await saucedemoPage.calculateExpectedTotalWithFees();
        await saucedemoPage.assertFinalAmountMatches(expectedFinalAmount);
    });

    // --- Scenario 9: Entering an invalid email format for account creation ---
    test('Entering an invalid email format for account creation', async () => {
        // Given the user is on the registration form
        await saucedemoPage.navigateToRegistrationForm();

        // When the user enters an improperly formatted email address
        const invalidEmail = 'invalid-email-format';
        await saucedemoPage.enterEmail(invalidEmail);

        // And attempts to register
        await saucedemoPage.submitRegistration();

        // Then a clear validation error must be displayed for the email field
        await saucedemoPage.assertValidationError('Email format is invalid.');
    });

    // --- Scenario 10: Searching for a non-existent product ---
    test('Searching for a non-existent product', async () => {
        // Given the user is on the search page
        await saucedemoPage.navigateToSearchPage();

        // When the user searches for a random, non-existent item
        const nonExistentItem = 'DefinitelyNotARealProduct123';
        await saucedemoPage.searchForProduct(nonExistentItem);

        // And clicks Search
        await saucedemoPage.clickSearchButton();

        // Then a message stating 'No results found' should be displayed
        await saucedemoPage.assertResultMessage('No results found');
    });
});