import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let user;
    let factory;

    beforeAll(() => {
        user = ENVIRONMENTS.testUser; // Assuming a standard test user setup exists in environment
        factory = new GenericFactory();
    });

    beforeEach(async () => {
        // Setup: Login logic assumed to be handled by page objects or factory initialization
        await SAUCEDEMOPage.loginAs(user.username, user.password);
    });

    // Scenario 1: Successful search for an existing product
    test('Successful search for an existing product', async () => {
        // Given the user is on the search page (Assumed by initial state or navigation)
        await SAUCEDEMOPage.navigateToSearchPage();

        // When the user searches for a known product name
        const productName = 'Known Product Name'; // Placeholder, actual test data would be dynamic
        await SAUCEDEMOPage.searchForProduct(productName);

        // And clicks Search
        await SAUCEDEMOPage.clickSearchButton();

        // Then the search results should display the correct product
        await SAUCEDEMOPage.assertSearchResultsDisplayCorrectProduct(productName);
    });

    // Scenario 2: Successfully adding multiple items to the cart
    test('Successfully adding multiple items to the cart', async () => {
        // Given the user is on a product page (Assume starting on a product detail page)
        await SAUCEDEMOPage.navigateToProductPage('Product A');

        // When the user adds Product A and Product B to the cart
        await SAUCEDEMOPage.addToCart('Product A');
        await SAUCEDEMOPage.addToCart('Product B');

        // And views the cart summary
        await SAUCEDEMOPage.navigateToCart();

        // Then the total price calculation should be accurate
        await SAUCEDEMOPage.assertCartTotalIsAccurate();
    });

    // Scenario 3: Updating the quantity of an existing cart item
    test('Updating the quantity of an existing cart item', async () => {
        const initialQuantity = 2;
        const newQuantity = 5;

        // Given an item is in the cart with quantity Q1
        await SAUCEDEMOPage.setCartItemQuantity(initialQuantity, 'Product X');

        // When the user updates the quantity to Q2 (where Q2 > Q1)
        await SAUCEDEMOPage.updateCartItemQuantity(newQuantity, 'Product X');

        // And saves the change
        await SAUCEDEMOPage.saveCartChanges();

        // Then the cart total should reflect the new quantity and updated price
        await SAUCEDEMOPage.assertCartTotalReflectsNewQuantityAndPrice(newQuantity);
    });

    // Scenario 4: Attempting to access admin panel as standard user
    test('Attempting to access admin panel as standard user', async () => {
        // Given the user is logged in as a Standard User (Setup handled by beforeEach)

        // When the user attempts to navigate to /admin
        await SAUCEDEMOPage.navigateToRoute(ROUTES.ADMIN_PANEL);

        // Then the system must redirect or display an access denied message
        await SAUCEDEMOPage.assertAccessDeniedOrRedirect();
    });

    // Scenario 5: Attempting to add zero quantity to the cart
    test('Attempting to add zero quantity to the cart', async () => {
        // Given the user is on a product page
        await SAUCEDEMOPage.navigateToProductPage('Any Product');

        // When the user attempts to set quantity to 0
        await SAUCEDEMOPage.setQuantity(0);

        // And clicks Add to Cart
        await SAUCEDEMOPage.addToCart();

        // Then the system should reject the action and display an appropriate message
        await SAUCEDEMOPage.assertActionRejectedAndDisplayMessage(ALERT_MESSAGES.ZERO_QUANTITY_REJECT);
    });

    // Scenario 6: Attempting to add minimum quantity (1)
    test('Attempting to add minimum quantity (1)', async () => {
        // Given the user is viewing a product page
        await SAUCEDEMOPage.navigateToProductPage('Product Y');

        // When the user sets the quantity input to 1
        await SAUCEDEMOPage.setQuantity(1);

        // And clicks Add to Cart
        await SAUCEDEMOPage.addToCart();

        // Then the item should be added successfully
        await SAUCEDEMOPage.assertItemAddedSuccessfully();
    });

    // Scenario 7: Attempting to add maximum allowed quantity
    test('Attempting to add maximum allowed quantity', async () => {
        const maxStock = 10; // Assuming N=10 for this test context

        // Given the product has a maximum stock limit of N
        await SAUCEDEMOPage.setProductMaxStock(maxStock);

        // When the user attempts to set quantity to N (or slightly above)
        await SAUCEDEMOPage.setQuantity(maxStock + 1);

        // And clicks Add to Cart
        await SAUCEDEMOPage.addToCart();

        // Then the system should display an appropriate error message regarding stock limits
        await SAUCEDEMOPage.assertStockLimitErrorMessage();
    });

    // Scenario 8: Verifying the final price calculation includes taxes/fees
    test('Verifying the final price calculation includes taxes/fees', async () => {
        // Given the cart total is calculated (Assume items are in cart from previous steps or setup)
        await SAUCEDEMOPage.navigateToCart();

        // When the user proceeds to payment stage
        await SAUCEDEMOPage.proceedToPayment();

        // Then the displayed final amount must strictly match the calculated total plus any mandatory fees
        const expectedFinalAmount = await SAUCEDEMOPage.calculateTotalWithFees();
        await SAUCEDEMOPage.assertFinalAmountMatchesCalculatedTotalWithFees(expectedFinalAmount);
    });

    // Scenario 9: Entering an invalid email format for account creation
    test('Entering an invalid email format for account creation', async () => {
        // Given the user is on the registration form
        await SAUCEDEMOPage.navigateToRegistrationForm();

        // When the user enters an improperly formatted email address
        const invalidEmail = 'invalid-email-format';
        await SAUCEDEMOPage.enterEmail(invalidEmail);

        // And attempts to register
        await SAUCEDEMOPage.submitRegistration();

        // Then a clear validation error must be displayed for the email field
        await SAUCEDEMOPage.assertValidationErrorDisplayedForEmail(ALERT_MESSAGES.INVALID_EMAIL_FORMAT);
    });

    // Scenario 10: Searching for a non-existent product
    test('Searching for a non-existent product', async () => {
        // Given the user is on the search page
        await SAUCEDEMOPage.navigateToSearchPage();

        // When the user searches for a random, non-existent item
        const nonExistentItem = 'DefinitelyNotARealProduct123';
        await SAUCEDEMOPage.searchForProduct(nonExistentItem);

        // And clicks Search
        await SAUCEDEMOPage.clickSearchButton();

        // Then a message stating 'No results found' should be displayed
        await SAUCEDEMOPage.assertNoResultsFoundMessage();
    });
});