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

    // Setup environment variables and page objects before each test
    beforeEach(async () => {
        // Initialize Page Objects (Assuming they handle setup based on ENVIRONMENTS)
        basePage = new BasePage();
        saucedemoPage = new SAUCEDEMOPage(basePage);
        genericFactory = new GenericFactory();

        // Setup login/user context if required by the feature flow
        await basePage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);
    });

    // Scenario: Successful search for an existing product
    test('Successful search for an existing product', async () => {
        const knownProduct = 'Existing Product Name'; // Assume this is a known product name based on setup
        await saucedemoPage.navigateToSearchPage();
        await saucedemoPage.searchForProduct(knownProduct);
        await saucedemoPage.clickSearchButton();

        // Assertion: Check if the correct product is displayed in the results
        await expect(saucedemoPage.searchResults()).toHaveDisplayedProduct(knownProduct);
    });

    // Scenario: Successfully adding multiple items to the cart
    test('Successfully adding multiple items to the cart', async () => {
        const productA = 'Product A';
        const productB = 'Product B';

        await saucedemoPage.navigateToProductPage(productA);
        await saucedemoPage.addToCart();

        await saucedemoPage.navigateToProductPage(productB);
        await saucedemoPage.addToCart();

        await saucedemoPage.viewCartSummary();

        // Assertion: Check if the total price calculation is accurate (assuming known prices)
        await expect(saucedemoPage.cartTotal()).toBeGreaterThan(0); // Basic check
        await expect(saucedemoPage.cartTotal()).toBeCloseTo(150.00, 2); // Placeholder assertion based on expected outcome
    });

    // Scenario: Updating the quantity of an existing cart item
    test('Updating the quantity of an existing cart item', async () => {
        const initialQuantity = 5;
        const newQuantity = 10;

        // Setup: Ensure an item is in the cart (simulated setup)
        await saucedemoPage.addItemToCart(initialQuantity);

        await saucedemoPage.navigateToCart();
        const initialTotal = await saucedemoPage.getCartTotal();

        // Action: Update quantity
        await saucedemoPage.updateCartItemQuantity(initialQuantity, newQuantity);
        await saucedemoPage.saveChanges();

        // Assertion: Check if the cart total reflects the new quantity and updated price
        const newTotal = await saucedemoPage.getCartTotal();
        await expect(newTotal).toBeGreaterThan(initialTotal);
    });

    // Scenario: Attempting to access admin panel as standard user
    test('Attempting to access admin panel as standard user', async () => {
        const adminRoute = ROUTES.ADMIN_ROUTE; // Assuming this constant holds the admin path

        await saucedemoPage.navigateToAdminPanel(adminRoute);

        // Assertion: Check for redirection or access denied message
        await expect(saucedemoPage.accessDeniedMessage()).toBeVisible();
    });

    // Scenario: Attempting to add zero quantity to the cart
    test('Attempting to add zero quantity to the cart', async () => {
        const product = 'Any Product';

        await saucedemoPage.navigateToProductPage(product);
        await saucedemoPage.setQuantity(0);

        // Action: Attempt to add to cart
        await saucedemoPage.addToCart();

        // Assertion: Check if the system rejects the action and displays an appropriate message
        await expect(saucedemoPage.getErrorMessage()).toContain('Quantity must be greater than zero');
    });

    // Scenario: Attempting to add minimum quantity (1)
    test('Attempting to add minimum quantity (1)', async () => {
        const product = 'Any Product';

        await saucedemoPage.navigateToProductPage(product);
        await saucedemoPage.setQuantity(1);

        // Action: Add to Cart
        await saucedemoPage.addToCart();

        // Assertion: Check if the item is added successfully
        await expect(saucedemoPage.isInCart(product)).toBe(true);
    });

    // Scenario: Attempting to add maximum allowed quantity
    test('Attempting to add maximum allowed quantity', async () => {
        const maxStockLimit = 10; // Assuming N=10 for this test context
        const product = 'Product with Stock Limit';

        await saucedemoPage.navigateToProductPage(product);
        await saucedemoPage.setQuantity(maxStockLimit + 1); // Attempt to set quantity above max stock

        // Action: Attempt to add to cart
        await saucedemoPage.addToCart();

        // Assertion: Check if the system displays an appropriate error message regarding stock limits
        await expect(saucedemoPage.getErrorMessage()).toContain('Exceeds maximum available stock');
    });

    // Scenario: Verifying the final price calculation includes taxes/fees
    test('Verifying the final price calculation includes taxes/fees', async () => {
        const calculatedBaseTotal = 100.00; // Simulated base total before fees
        const mandatoryFees = 5.00;         // Simulated tax/fees

        // Setup: Assume cart total is calculated (simulated)
        await saucedemoPage.setCartValue(calculatedBaseTotal);

        // Action: Proceed to payment stage
        await saucedemoPage.proceedToPayment();

        // Assertion: Check if the displayed final amount strictly matches the calculated total plus mandatory fees
        const expectedFinalAmount = calculatedBaseTotal + mandatoryFees;
        const actualFinalAmount = await saucedemoPage.getFinalAmount();

        await expect(actualFinalAmount).toBeCloseTo(expectedFinalAmount, 2);
    });

    // Scenario: Entering an invalid email format for account creation
    test('Entering an invalid email format for account creation', async () => {
        const invalidEmail = 'invalid-email-format'; // Invalid format

        await saucedemoPage.navigateToRegistrationForm();
        await saucedemoPage.enterEmail(invalidEmail);

        // Action: Attempt to register
        await saucedemoPage.submitRegistration();

        // Assertion: Check if a clear validation error must be displayed for the email field
        await expect(saucedemoPage.getValidationError('email')).toBeVisible();
        await expect(saucedemoPage.getErrorMessage('email')).toContain('Please enter a valid email address');
    });

    // Scenario: Searching for a non-existent product
    test('Searching for a non-existent product', async () => {
        const nonExistentProduct = 'DefinitelyNotARealProduct123';

        await saucedemoPage.navigateToSearchPage();
        await saucedemoPage.searchForProduct(nonExistentProduct);
        await saucedemoPage.clickSearchButton();

        // Assertion: Check if a message stating 'No results found' should be displayed
        await expect(saucedemoPage.getSearchResults()).toHaveMessage('No results found');
    });
});