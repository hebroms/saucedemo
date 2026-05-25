import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let user;
    let standardUser;
    let genericFactory;

    // Setup before each test: Login and setup context
    beforeEach(async () => {
        genericFactory = new GenericFactory();
        user = await genericFactory.createTestUser('test@example.com', 'password123');
        standardUser = await genericFactory.createTestUser('admin@example.com', 'securepass');

        // Assuming the base page handles navigation and setup based on environment
        await SAUCEDEMOPage.initialize(ENVIRONMENTS);
        await SAUCEDEMOPage.login(user.username, user.password);
    });

    // --- Scenario: Successful search for an existing product ---
    test('Successful search for an existing product', async () => {
        await SAUCEDEMOPage.navigateTo(ROUTES.SEARCH_PAGE);
        await SAUCEDEMOPage.searchForProduct(user.knownProductName); // Assumes page object handles finding the input field and typing
        await SAUCEDEMOPage.clickSearch();
        await SAUCEDEMOPage.assertSearchResultsDisplay(user.knownProductName);
    });

    // --- Scenario: Successfully adding multiple items to the cart ---
    test('Successfully adding multiple items to the cart', async () => {
        await SAUCEDEMOPage.navigateTo(ROUTES.PRODUCT_PAGE);
        
        // Add Product A
        await SAUCEDEMOPage.selectProductAndAddToCart(user.productAId);
        
        // Add Product B
        await SAUCEDEMOPage.selectProductAndAddToCart(user.productBId);

        await SAUCEDEMOPage.viewCartSummary();
        
        // Assertion: Check if the total calculation is accurate (assuming we know the expected result based on setup)
        await expect(SAUCEDEMOPage.getCartTotal()).toBeGreaterThan(0); 
    });

    // --- Scenario: Updating the quantity of an existing cart item ---
    test('Updating the quantity of an existing cart item', async () => {
        // Setup: Ensure an item is in the cart (Simulated setup)
        await SAUCEDEMOPage.addItemToCart(user.productAId, 1);

        const initialQuantity = 1;
        const newQuantity = 5;

        // Action: Update quantity and save
        await SAUCEDEMOPage.updateCartItemQuantity(user.productAId, newQuantity);
        await SAUCEDEMOPage.saveChanges();

        // Assertion: Check if the cart total reflects the new quantity and updated price
        const updatedTotal = await SAUCEDEMOPage.getCartTotal();
        await expect(updatedTotal).toBeGreaterThan(SAUCEDEMOPage.calculatePriceForQuantity(user.productAId, newQuantity));
    });

    // --- Scenario: Attempting to access admin panel as standard user ---
    test('Attempting to access admin panel as standard user', async () => {
        await SAUCEDEMOPage.navigateTo(ROUTES.ADMIN_PANEL);
        
        // Action: Attempt navigation
        await SAUCEDEMOPage.navigate();

        // Assertion: Check for redirection or access denied message (assuming the page object handles this check)
        await expect(SAUCEDEMOPage.getErrorMessage()).toContain('Access Denied'); 
    });

    // --- Scenario: Attempting to add zero quantity to the cart ---
    test('Attempting to add zero quantity to the cart', async () => {
        await SAUCEDEMOPage.navigateTo(ROUTES.PRODUCT_PAGE);
        
        const zeroQuantity = 0;

        // Action: Set quantity to 0 and click Add to Cart
        await SAUCEDEMOPage.setQuantity(zeroQuantity);
        await SAUCEDEMOPage.addToCart();

        // Assertion: System should reject the action and display an appropriate message
        await expect(SAUCEDEMOPage.getErrorMessage()).toContain('Quantity must be greater than zero');
    });

    // --- Scenario: Attempting to add minimum quantity (1) ---
    test('Attempting to add minimum quantity (1)', async () => {
        await SAUCEDEMOPage.navigateTo(ROUTES.PRODUCT_PAGE);
        
        const minQuantity = 1;

        // Action: Set quantity to 1 and click Add to Cart
        await SAUCEDEMOPage.setQuantity(minQuantity);
        await SAUCEDEMOPage.addToCart();

        // Assertion: Item should be added successfully (checking cart state)
        await expect(SAUCEDEMOPage.isInCart(user.productAId)).toBe(true);
    });

    // --- Scenario: Attempting to add maximum allowed quantity ---
    test('Attempting to add maximum allowed quantity', async () => {
        const maxStock = 10; // Assuming N=10 for this test context
        
        await SAUCEDEMOPage.navigateTo(ROUTES.PRODUCT_PAGE);

        // Action: Attempt to set quantity to N (or slightly above)
        await SAUCEDEMOPage.setQuantity(maxStock + 1);
        await SAUCEDEMOPage.addToCart();

        // Assertion: System should display an appropriate error message regarding stock limits
        await expect(SAUCEDEMOPage.getErrorMessage()).toContain('Exceeds maximum stock limit');
    });

    // --- Scenario: Verifying the final price calculation includes taxes/fees ---
    test('Verifying the final price calculation includes taxes/fees', async () => {
        // Setup: Ensure cart total is calculated (Simulated setup)
        await SAUCEDEMOPage.addItemToCart(user.productAId, 1);

        const calculatedTotal = await SAUCEDEMOPage.getCartTotal();
        
        // Action: Proceed to payment stage
        await SAUCEDEMOPage.proceedToPayment();

        // Assertion: The displayed final amount must strictly match the calculated total plus any mandatory fees
        const expectedFinalAmount = calculatedTotal + await SAUCEDEMOPage.getMandatoryFees();
        
        await expect(SAUCEDEMOPage.getFinalAmount()).toBeCloseTo(expectedFinalAmount, 2);
    });

    // --- Scenario: Entering an invalid email format for account creation ---
    test('Entering an invalid email format for account creation', async () => {
        await SAUCEDEMOPage.navigateTo(ROUTES.REGISTRATION_FORM);
        
        const invalidEmail = 'invalid-email-format';

        // Action: Enter improperly formatted email address and attempt to register
        await SAUCEDEMOPage.enterEmail(invalidEmail);
        await SAUCEDEMOPage.submitRegistration();

        // Assertion: A clear validation error must be displayed for the email field
        await expect(SAUCEDEMOPage.getErrorMessageForField('email')).toContain('Please enter a valid email address');
    });

    // --- Scenario: Searching for a non-existent product ---
    test('Searching for a non-existent product', async () => {
        await SAUCEDEMOPage.navigateTo(ROUTES.SEARCH_PAGE);
        
        const nonExistentItem = 'this-product-does-not-exist-12345';

        // Action: Search for a random, non-existent item and click Search
        await SAUCEDEMOPage.searchForProduct(nonExistentItem);
        await SAUCEDEMOPage.clickSearch();

        // Assertion: A message stating 'No results found' should be displayed
        await expect(SAUCEDEMOPage.getErrorMessage()).toContain('No results found');
    });
});