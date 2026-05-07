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

    // Setup before each test to ensure a fresh, logged-in state
    beforeEach(async () => {
        loginPage = new SAUCEDEMOPage(await genericFactory.createPage(ENVIRONMENTS.BASE_URL));
        inventoryPage = new SAUCEDEMOPage(await genericFactory.createPage(ENVIRONMENTS.BASE_URL));

        // Assume login setup is handled by a specific method in the page object
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASS);
    });

    // --- Scenario 1: Successful search for an existing product ---
    test('Successful search for an existing product', async () => {
        await inventoryPage.navigate(ROUTES.SEARCH_ROUTE);
        const knownProduct = 'Existing Product Name'; // Assuming this product exists in the test environment

        await inventoryPage.searchProduct(knownProduct);
        await inventoryPage.clickSearch();

        // Assertion: Check if the correct product is displayed (e.g., checking for a specific result element)
        await inventoryPage.assertSearchResultsContain(knownProduct);
    });

    // --- Scenario 2: Successfully adding multiple items to the cart ---
    test('Successfully adding multiple items to the cart', async () => {
        await inventoryPage.navigate(ROUTES.PRODUCT_DETAIL_ROUTE);
        const productA = 'Product A';
        const productB = 'Product B';

        // Add Product A
        await inventoryPage.addItemToCart(productA, 1);

        // Add Product B
        await inventoryPage.addItemToCart(productB, 2);

        // View Cart Summary
        await inventoryPage.viewCartSummary();

        // Assertion: Check if the total price calculation is accurate (assuming we know the expected result)
        const expectedTotal = 150.00; // Placeholder assertion value based on assumed product prices
        await inventoryPage.assertCartTotalIs(expectedTotal);
    });

    // --- Scenario 3: Updating the quantity of an existing cart item ---
    test('Updating the quantity of an existing cart item', async () => {
        const initialQuantity = 5;
        const newQuantity = 10;

        // Setup: Ensure an item is in the cart (Simulated setup)
        await inventoryPage.addItemToCart('Item X', initialQuantity);
        await inventoryPage.viewCartSummary(); // Capture initial state for comparison

        // Action: Update quantity
        await inventoryPage.updateCartItemQuantity('Item X', newQuantity);
        await inventoryPage.saveChanges();

        // Assertion: Check if the cart total reflects the new quantity and updated price
        const expectedNewTotal = 150.00 + (5 * 10.00); // Example calculation based on assumed prices
        await inventoryPage.assertCartTotalIs(expectedNewTotal);
    });

    // --- Scenario 4: Attempting to access admin panel as standard user ---
    test('Attempting to access admin panel as standard user', async () => {
        await inventoryPage.navigate(ROUTES.ADMIN_ROUTE);

        // Assertion: Check for redirection or access denied message
        await inventoryPage.assertAccessDeniedOrRedirect();
    });

    // --- Scenario 5: Attempting to add zero quantity to the cart (Boundary) ---
    test('Attempting to add zero quantity to the cart', async () => {
        await inventoryPage.navigate(ROUTES.PRODUCT_DETAIL_ROUTE);
        const product = 'Any Product';

        // Action: Set quantity to 0
        await inventoryPage.setQuantityInput(0);

        // Action: Click Add to Cart
        await inventoryPage.addToCart();

        // Assertion: System should reject the action and display an appropriate message
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.INVALID_QUANTITY_ERROR);
    });

    // --- Scenario 6: Attempting to add minimum quantity (1) (Boundary) ---
    test('Attempting to add minimum quantity (1)', async () => {
        await inventoryPage.navigate(ROUTES.PRODUCT_DETAIL_ROUTE);
        const product = 'Any Product';

        // Action: Set quantity to 1
        await inventoryPage.setQuantityInput(1);

        // Action: Click Add to Cart
        await inventoryPage.addToCart();

        // Assertion: Item should be added successfully
        await inventoryPage.assertItemAddedSuccessfully(product);
    });

    // --- Scenario 7: Attempting to add maximum allowed quantity (Boundary) ---
    test('Attempting to add maximum allowed quantity', async () => {
        const maxStockLimit = 10; // Assuming N=10 for this test context
        const product = 'Product with Stock Limit';

        // Action: Attempt to set quantity to N + 1 (or N, depending on implementation)
        await inventoryPage.setQuantityInput(maxStockLimit + 1);

        // Action: Click Add to Cart
        await inventoryPage.addToCart();

        // Assertion: System should display an appropriate error message regarding stock limits
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.STOCK_LIMIT_EXCEEDED);
    });

    // --- Scenario 8: Verifying the final price calculation includes taxes/fees (Business Rule) ---
    test('Verifying the final price calculation includes taxes/fees', async () => {
        // Setup: Assume cart total is calculated and we proceed to payment stage
        await inventoryPage.viewCartSummary();

        // Action: Proceed to payment stage
        await inventoryPage.proceedToPayment();

        // Assertion: The displayed final amount must strictly match the calculated total plus any mandatory fees
        const calculatedTotalWithFees = 250.00 + 10.00; // Example calculation
        await inventoryPage.assertFinalAmountMatches(calculatedTotalWithFees);
    });

    // --- Scenario 9: Entering an invalid email format (Negative) ---
    test('Entering an invalid email format for account creation', async () => {
        await inventoryPage.navigate(ROUTES.REGISTRATION_ROUTE);

        const invalidEmail = 'invalid-email-format';

        // Action: Enter improperly formatted email address
        await inventoryPage.enterRegistrationData({ email: invalidEmail });

        // Action: Attempt to register
        await inventoryPage.submitRegistration();

        // Assertion: A clear validation error must be displayed for the email field
        await inventoryPage.assertValidationError(ALERT_MESSAGES.INVALID_EMAIL_FORMAT, 'email');
    });

    // --- Scenario 10: Searching for a non-existent product (Negative) ---
    test('Searching for a non-existent product', async () => {
        await inventoryPage.navigate(ROUTES.SEARCH_ROUTE);
        const nonExistentProduct = 'DefinitelyNotARealProductXYZ';

        // Action: Search for a random, non-existent item
        await inventoryPage.searchProduct(nonExistentProduct);
        await inventoryPage.clickSearch();

        // Assertion: A message stating 'No results found' should be displayed
        await inventoryPage.assertResultMessage('No results found');
    });
});