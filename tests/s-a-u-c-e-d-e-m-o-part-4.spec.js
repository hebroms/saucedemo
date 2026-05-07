import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    beforeEach(async () => {
        // Initialize Page Objects
        loginPage = new SAUCEDEMOPage();
        inventoryPage = new SAUCEDEMOPage();
        genericFactory = new GenericFactory();

        // Setup Login (Assuming standard setup for all tests)
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);
    });

    // --- Scenario 1: Successful search for an existing product ---
    test('Successful search for an existing product', async () => {
        // Given the user is on the search page (Assumed by initial state or navigation)
        await inventoryPage.navigate(ROUTES.SEARCH_ROUTE);

        // When the user searches for a known product name
        const productName = 'Existing Product Name'; // Placeholder for a known item
        await inventoryPage.searchForProduct(productName);

        // And clicks Search
        await inventoryPage.clickSearch();

        // Then the search results should display the correct product
        await inventoryPage.assertSearchResultsDisplay(productName);
    });

    // --- Scenario 2: Successfully adding multiple items to the cart ---
    test('Successfully adding multiple items to the cart', async () => {
        // Given the user is on a product page (Assume we start on a product detail page)
        await inventoryPage.navigate(ROUTES.PRODUCT_DETAIL_ROUTE);

        // When the user adds Product A and Product B to the cart
        const productAId = await genericFactory.getProductId('Product A');
        const productBId = await genericFactory.getProductId('Product B');

        await inventoryPage.addToCart(productAId, 1);
        await inventoryPage.addToCart(productBId, 2);

        // And views the cart summary
        await inventoryPage.viewCartSummary();

        // Then the total price calculation should be accurate
        const expectedTotal = 150.00; // Placeholder assertion based on known prices
        await inventoryPage.assertCartTotal(expectedTotal);
    });

    // --- Scenario 3: Updating the quantity of an existing cart item ---
    test('Updating the quantity of an existing cart item', async () => {
        // Given an item is in the cart with quantity Q1
        const itemId = await genericFactory.getProductId('Product A');
        await inventoryPage.addToCart(itemId, 5); // Start with Q1=5

        // When the user updates the quantity to Q2 (where Q2 > Q1)
        const newQuantity = 10;
        await inventoryPage.updateCartItemQuantity(itemId, newQuantity);

        // And saves the change
        await inventoryPage.saveChanges();

        // Then the cart total should reflect the new quantity and updated price
        const expectedNewTotal = 250.00; // Assuming Product A price is $50, new total is $100 (A) + $100 (B if B was also added)
        await inventoryPage.assertCartTotal(expectedNewTotal);
    });

    // --- Scenario 4: Attempting to access admin panel as standard user ---
    test('Attempting to access admin panel as standard user', async () => {
        // Given the user is logged in as a Standard User (Setup handled by beforeEach)

        // When the user attempts to navigate to /admin
        await inventoryPage.navigate(ROUTES.ADMIN_ROUTE);

        // Then the system must redirect or display an access denied message
        await inventoryPage.assertAccessDenied(); // Assumes this method checks for redirection/message based on context
    });

    // --- Scenario 5: Attempting to add zero quantity to the cart (Boundary) ---
    test('Attempting to add zero quantity to the cart', async () => {
        // Given the user is on a product page
        const itemId = await genericFactory.getProductId('Product A');

        // When the user attempts to set quantity to 0
        await inventoryPage.setQuantity(itemId, 0);

        // And clicks Add to Cart
        await inventoryPage.addToCart(itemId, 0);

        // Then the system should reject the action and display an appropriate message
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.INVALID_QUANTITY_ERROR);
    });

    // --- Scenario 6: Attempting to add minimum quantity (1) (Boundary) ---
    test('Attempting to add minimum quantity (1)', async () => {
        // Given the user is viewing a product page
        const itemId = await genericFactory.getProductId('Product A');

        // When the user sets the quantity input to 1
        await inventoryPage.setQuantity(itemId, 1);

        // And clicks Add to Cart
        await inventoryPage.addToCart(itemId, 1);

        // Then the item should be added successfully
        await inventoryPage.assertItemAddedToCart(itemId);
    });

    // --- Scenario 7: Attempting to add maximum allowed quantity (Boundary) ---
    test('Attempting to add maximum allowed quantity', async () => {
        // Given the product has a maximum stock limit of N
        const maxStock = await genericFactory.getMaxStockLimit('Product A');

        // When the user attempts to set quantity to N (or slightly above)
        await inventoryPage.setQuantity(await genericFactory.getProductId('Product A'), maxStock + 1);

        // And clicks Add to Cart
        await inventoryPage.addToCart(await genericFactory.getProductId('Product A'), maxStock + 1);

        // Then the system should display an appropriate error message regarding stock limits
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.STOCK_LIMIT_EXCEEDED);
    });

    // --- Scenario 8: Verifying the final price calculation includes taxes/fees (Business Rule) ---
    test('Verifying the final price calculation includes taxes/fees', async () => {
        // Given the cart total is calculated (Assume items are in cart from previous steps or setup)
        await inventoryPage.viewCartSummary();

        // When the user proceeds to payment stage
        await inventoryPage.proceedToPayment();

        // Then the displayed final amount must strictly match the calculated total plus any mandatory fees
        const calculatedTotalWithFees = 300.50; // Placeholder for actual calculation logic
        await inventoryPage.assertFinalAmountMatches(calculatedTotalWithFees);
    });

    // --- Scenario 9: Entering an invalid email format (Negative) ---
    test('Entering an invalid email format for account creation', async () => {
        // Given the user is on the registration form
        await inventoryPage.navigate(ROUTES.REGISTRATION_ROUTE);

        // When the user enters an improperly formatted email address
        const invalidEmail = 'invalid-email-format';
        await inventoryPage.enterRegistrationData({ email: invalidEmail, password: 'password123' });

        // And attempts to register
        await inventoryPage.submitRegistration();

        // Then a clear validation error must be displayed for the email field
        await inventoryPage.assertValidationError('email', ALERT_MESSAGES.INVALID_EMAIL_FORMAT);
    });

    // --- Scenario 10: Searching for a non-existent product (Negative) ---
    test('Searching for a non-existent product', async () => {
        // Given the user is on the search page
        await inventoryPage.navigate(ROUTES.SEARCH_ROUTE);

        // When the user searches for a random, non-existent item
        const nonExistentItem = 'DefinitelyNotARealProduct123';
        await inventoryPage.searchForProduct(nonExistentItem);

        // And clicks Search
        await inventoryPage.clickSearch();

        // Then a message stating 'No results found' should be displayed
        await inventoryPage.assertResultMessage('No results found');
    });
});