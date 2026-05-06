import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

// Initialize Page Objects and Factory
let inventoryPage: SAUCEDEMOPage;
let genericFactory: GenericFactory;

describe('SAUCEDEMO Feature Tests', () => {
    let user: any; // Placeholder for user data if needed for setup

    beforeAll(() => {
        inventoryPage = new SAUCEDEMOPage();
        genericFactory = new GenericFactory();
    });

    beforeEach(async () => {
        // Setup login logic (assumed to be handled by a specific method in the PO)
        await inventoryPage.login(ENVIRONMENTS.LOGIN_URL, ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);
    });

    // Scenario: Successful search for an existing product
    test('Successful search for an existing product', async () => {
        // Given the user is on the search page (Assumed by setup or navigation)
        await inventoryPage.navigateToSearchPage(); 
        
        // When the user searches for a known product name
        const productName = 'Existing Product Name'; // Assume this is a known product
        await inventoryPage.searchForProduct(productName);

        // And clicks Search
        await inventoryPage.clickSearchButton();

        // Then the search results should display the correct product
        await inventoryPage.assertSearchResultsDisplay(productName);
    });

    // Scenario: Successfully adding multiple items to the cart
    test('Successfully adding multiple items to the cart', async () => {
        // Given the user is on a product page (Assume we start on a specific product page)
        await inventoryPage.navigateToProductPage('Product A');

        // When the user adds Product A and Product B to the cart
        await inventoryPage.addToCart('Product A', 1);
        await inventoryPage.addToCart('Product B', 2);

        // And views the cart summary
        await inventoryPage.viewCartSummary();

        // Then the total price calculation should be accurate
        const expectedTotal = 150.00; // Placeholder assertion based on assumed data
        await inventoryPage.assertCartTotalMatches(expectedTotal);
    });

    // Scenario: Updating the quantity of an existing cart item
    test('Updating the quantity of an existing cart item', async () => {
        // Given an item is in the cart with quantity Q1
        const initialQuantity = 2;
        await inventoryPage.addItemToCart('Product X', initialQuantity);

        // When the user updates the quantity to Q2 (where Q2 > Q1)
        const newQuantity = 5;
        await inventoryPage.updateCartItemQuantity('Product X', newQuantity);

        // And saves the change
        await inventoryPage.saveCartChanges();

        // Then the cart total should reflect the new quantity and updated price
        await inventoryPage.assertCartTotalReflectsNewQuantity(newQuantity);
    });

    // Scenario: Attempting to access admin panel as standard user
    test('Attempting to access admin panel as standard user', async () => {
        // Given the user is logged in as a Standard User (Setup handles this)
        const adminRoute = ROUTES.ADMIN_ROUTE;

        // When the user attempts to navigate to /admin
        await inventoryPage.navigate(adminRoute);

        // Then the system must redirect or display an access denied message
        await inventoryPage.assertAccessDeniedMessage();
    });

    // Scenario: Attempting to add zero quantity to the cart
    test('Attempting to add zero quantity to the cart', async () => {
        // Given the user is on a product page
        await inventoryPage.navigateToProductPage('Test Product');

        // When the user attempts to set quantity to 0
        await inventoryPage.setQuantityInput(0);

        // And clicks Add to Cart
        await inventoryPage.addToCart();

        // Then the system should reject the action and display an appropriate message
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.ZERO_QUANTITY_ERROR);
    });

    // Scenario: Attempting to add minimum quantity (1)
    test('Attempting to add minimum quantity (1)', async () => {
        // Given the user is viewing a product page
        await inventoryPage.navigateToProductPage('Test Product');

        // When the user sets the quantity input to 1
        await inventoryPage.setQuantityInput(1);

        // And clicks Add to Cart
        await inventoryPage.addToCart();

        // Then the item should be added successfully
        await inventoryPage.assertItemAddedToCart('Test Product');
    });

    // Scenario: Attempting to add maximum allowed quantity
    test('Attempting to add maximum allowed quantity', async () => {
        // Given the product has a maximum stock limit of N (Assume N is defined in ENVIRONMENTS)
        const maxStock = parseInt(ENVIRONMENTS.MAX_STOCK_LIMIT || 10); // Use environment variable or default

        // When the user attempts to set quantity to N (or slightly above)
        await inventoryPage.setQuantityInput(maxStock + 1);

        // And clicks Add to Cart
        await inventoryPage.addToCart();

        // Then the system should display an appropriate error message regarding stock limits
        await inventoryPage.assertStockLimitErrorMessage();
    });

    // Scenario: Verifying the final price calculation includes taxes/fees (if applicable)
    test('Verifying the final price calculation includes taxes/fees', async () => {
        // Given the cart total is calculated (Assume items are in cart from previous steps or setup)
        await inventoryPage.viewCartSummary();

        // When the user proceeds to payment stage
        await inventoryPage.proceedToPayment();

        // Then the displayed final amount must strictly match the calculated total plus any mandatory fees
        const calculatedTotalWithFees = 185.50; // Placeholder expected value
        await inventoryPage.assertFinalAmountMatches(calculatedTotalWithFees);
    });

    // Scenario: Entering an invalid email format for account creation
    test('Entering an invalid email format for account creation', async () => {
        // Given the user is on the registration form
        await inventoryPage.navigateToRegistrationForm();

        // When the user enters an improperly formatted email address
        const invalidEmail = 'invalid-email-format';
        await inventoryPage.enterEmail(invalidEmail);

        // And attempts to register
        await inventoryPage.submitRegistration();

        // Then a clear validation error must be displayed for the email field
        await inventoryPage.assertValidationError('email', ALERT_MESSAGES.INVALID_EMAIL_FORMAT);
    });

    // Scenario: Searching for a non-existent product
    test('Searching for a non-existent product', async () => {
        // Given the user is on the search page
        await inventoryPage.navigateToSearchPage();

        // When the user searches for a random, non-existent item
        const nonExistentItem = 'DefinitelyNotARealProduct123';
        await inventoryPage.searchForProduct(nonExistentItem);

        // And clicks Search
        await inventoryPage.clickSearchButton();

        // Then a message stating 'No results found' should be displayed
        await inventoryPage.assertNoResultsFoundMessage();
    });
});