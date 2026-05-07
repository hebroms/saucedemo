import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SauceDemo Feature Tests', () => {
    let browser;
    let page: BasePage;
    let saucedemoPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    // Setup before all tests
    beforeAll(async () => {
        browser = await this.launch();
        page = await browser.newPage();
        saucedemoPage = new SAUCEDEMOPage(page);
        genericFactory = new GenericFactory(page);
    });

    // Setup before each test: Ensure a clean state or login for most tests
    beforeEach(async () => {
        // Assuming setup involves logging in via the factory/page object methods
        await this.setupUserLogin();
    });

    // Helper function to handle common login logic (assuming it exists within Page Objects or Factory)
    async setupUserLogin() {
        // This method simulates the necessary steps for a standard user login, 
        // which will be called by specific tests if needed, or handled by beforeEach.
        // For simplicity and adherence to rules, we assume the page object handles navigation/login flow.
        await saucedemoPage.login(ENVIRONMENTS.username, ENVIRONMENTS.password);
    }

    // --- Scenario 1: Business Rule Test: Data Constraint Validation ---
    test('Verifying a business rule related to data quantity constraints', async () => {
        // Given the user is attempting to purchase an item
        await saucedemoPage.navigateToDataInput();

        // When the user attempts to set the quantity below the minimum required amount (e.g., quantity = -1)
        await saucedemoPage.setQuantity(-1);

        // Then the system must reject the transaction and display a constraint error
        await expect(saucedemoPage.getErrorMessage()).toBeDisplayed();
    });

    // --- Scenario 2: Negative Test: Invalid Password Attempt ---
    test('Attempting login with an invalid password', async () => {
        // Given the user is on the login page (handled by beforeEach setup)
        
        // When the user enters a valid username and an incorrect password
        await saucedemoPage.fillCredentials(ENVIRONMENTS.username, 'wrong_password');

        // And clicks the login button
        await saucedemoPage.submit();

        // Then an appropriate error message regarding invalid credentials should be displayed
        await expect(saucedemoPage.getErrorMessage()).toContain('Invalid credentials');
    });

    // --- Scenario 3: Positive Test: Successful Data Submission ---
    test('Successfully submitting a form/data entry via the feature', async () => {
        // Given the user is on the data input screen
        await saucedemoPage.navigateToDataInput();

        // When the user enters valid, non-empty data and submits the form
        const testData = { item: 'Test Item', quantity: 5 };
        await saucedemoPage.enterItemDetails(testData);
        await saucedemoPage.submitForm();

        // Then a success message should be displayed and data should be saved
        await expect(saucedemoPage.getSuccessMessage()).toBeDisplayed();
        await saucedemoPage.verifyDataSaved(testData);
    });

    // --- Scenario 4: Regression Test: Data Persistence Check ---
    test('Verifying that submitted data persists across sessions', async () => {
        const sessionAData = { item: 'Persistent Item', quantity: 10 };

        // Given the user successfully saved data in Session A
        await saucedemoPage.navigateToDataInput();
        await saucedemoPage.enterItemDetails(sessionAData);
        await saucedemoPage.submitForm();
        await expect(saucedemoPage.getSuccessMessage()).toBeDisplayed();

        // When the user logs out and logs back in (or navigates back)
        await saucedemoPage.logout();
        await saucedemoPage.login(ENVIRONMENTS.username, ENVIRONMENTS.password); // Log back in

        // Then the previously entered data should still be visible and correct
        await expect(saucedemoPage.getSavedData()).toEqual(sessionAData);
    });

    // --- Scenario 5: Regression Test: Verify Existing User Dashboard Access ---
    test('Verifying access to previously established user dashboard elements', async () => {
        // Given the user is logged in (handled by beforeEach setup)
        await saucedemoPage.navigateToDashboard();

        // When the user navigates to the main dashboard
        // Then all expected UI components (e.g., navigation bar, profile link) should be present and functional
        await expect(saucedemoPage.getNavigationBar()).toBeVisible();
        await expect(saucedemoPage.getProfileLink()).toBeVisible();
    });

    // --- Scenario 6: Security Test: Access Denial for Unauthorized Role ---
    test('Attempting to access administrative features without elevated permissions', async () => {
        // Given the user is logged in as a standard user (handled by beforeEach setup)
        const adminRoute = ROUTES.ADMIN_URL;

        // When the user attempts to navigate to an administrative URL/feature
        await saucedemoPage.navigate(adminRoute);

        // Then access should be denied, and an authorization error should be returned
        await expect(saucedemoPage.getErrorMessage()).toContain('Access Denied');
    });

    // --- Scenario 7: Smoke Test: Login with Valid Credentials ---
    test('Successful login with valid standard user credentials', async () => {
        // Given the user is on the login page (handled by beforeEach setup)
        const validUser = ENVIRONMENTS.username;
        const validPass = ENVIRONMENTS.password;

        // When the user enters valid username and password
        await saucedemoPage.fillCredentials(validUser, validPass);

        // And clicks the login button
        await saucedemoPage.submit();

        // Then the user should be redirected to the dashboard
        await expect(saucedemoPage.isLoggedIn()).toBeTrue();
        await expect(saucedemoPage.isDashboardVisible()).toBeTrue();
    });

    // --- Scenario 8: Teste de navegação com URL inválida (Negativo) ---
    test('Tentativa de acessar uma URL não mapeada', async () => {
        // Given Usuário está logado (handled by beforeEach setup)
        const invalidUrl = '/erro404';

        // When Usuário tenta navegar para uma URL aleatória (ex: /erro404)
        await saucedemoPage.navigate(invalidUrl);

        // Then Sistema deve exibir a página de erro 404
        await expect(saucedemoPage.getPageTitle()).toContain('404');
    });

    // --- Scenario 9: Boundary Test: Minimum Input Value ---
    test('Testing input field with minimum allowed numerical value', async () => {
        // Given the user is on a numerical input field
        await saucedemoPage.navigateToDataInput();

        // When the user enters the minimum allowed value (e.g., 0 or minimum quantity)
        const minValue = 0; // Assuming 0 is the minimum valid entry for testing boundaries
        await saucedemoPage.setQuantity(minValue);

        // And attempts to submit
        await saucedemoPage.submitForm();

        // Assertion: Check if the system handles the boundary correctly (e.g., accepts 0 or rejects based on specific rule)
        // We assert that it does not throw an error, implying the minimum value is accepted.
        await expect(saucedemoPage.getSuccessMessage()).toBeDisplayed();
    });

    // --- Scenario 10: Boundary Test: Maximum Input Length ---
    test('Testing input field with maximum allowed character length', async () => {
        // Given the user is on a text input field
        await saucedemoPage.navigateToDataInput();

        // When the user enters the maximum allowed character limit (e.g., 100 characters)
        const maxLength = 100;
        const longString = 'A'.repeat(maxLength);
        await saucedemoPage.enterItemName(longString);

        // And attempts to submit
        await saucedemoPage.submitForm();

        // Assertion: Check if the submission succeeds, implying the length constraint was handled correctly.
        await expect(saucedemoPage.getSuccessMessage()).toBeDisplayed();
    });
});