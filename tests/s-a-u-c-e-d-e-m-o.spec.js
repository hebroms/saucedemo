import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let basePage: BasePage;
    let saucedemoPage: SAUCEDEMOPage;
    let factory: GenericFactory;

    // Setup before each test
    beforeAll(async () => {
        basePage = new BasePage();
        saucedemoPage = new SAUCEDEMOPage(basePage);
        factory = new GenericFactory();
    });

    beforeEach(async () => {
        // Assuming a standard setup where login is required for most tests
        await saucedemoPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASS);
    });

    // Scenario: Smoke Test: Login with Valid Credentials
    test('Smoke Test: Successful login with valid standard user credentials', async () => {
        await saucedemoPage.verifySuccessfulLogin();
    });

    // Scenario: Negative Test: Invalid Password Attempt
    test('Attempting login with an invalid password should display an error', async () => {
        // Setup: Start on the login page (handled by beforeEach, but we re-simulate the failure path)
        await saucedemoPage.clearSession(); // Ensure a clean state if necessary

        // Action: Attempt login with valid username and incorrect password
        await saucedemoPage.enterCredentials(ENVIRONMENTS.STANDARD_USER, 'wrong_password');
        await saucedemoPage.submitLogin();

        // Assertion: Check for the expected error message
        await expect(saucedemoPage.getErrorMessage()).toBe(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario: Business Rule Test: Data Constraint Validation (Inferred)
    test('System must reject transaction when quantity is below the minimum required amount', async () => {
        // Setup: Navigate to the purchase screen
        await saucedemoPage.navigateToPurchaseScreen();

        // Action: Attempt to set quantity below the minimum (e.g., -1)
        const invalidQuantity = -1;
        await saucedemoPage.setQuantity(invalidQuantity);
        await saucedemoPage.submitTransaction();

        // Assertion: Check if the system rejected the transaction and displayed a constraint error
        await expect(saucedemoPage.getErrorMessage()).toContain('Quantity must be greater than or equal to 0');
    });

    // Scenario: Positive Test: Successful Data Submission
    test('Successfully submitting a form/data entry should result in a success message', async () => {
        const testData = factory.generateValidData(); // Assume factory generates valid data
        
        // Setup: Navigate to the data input screen
        await saucedemoPage.navigateToDataInputScreen();

        // Action: Enter valid, non-empty data and submit the form
        await saucedemoPage.enterData(testData);
        await saucedemoPage.submitForm();

        // Assertion: Check for a success message and verify data persistence (implicitly via success)
        const successMessage = await saucedemoPage.getSuccessMessage();
        await expect(successMessage).toBe(ALERT_MESSAGES.DATA_SAVED_SUCCESSFULLY);
    });

    // Scenario: Regression Test: Data Persistence Check
    test('Previously entered data should persist across sessions', async () => {
        const sessionAData = factory.generateSessionData();

        // Step 1: Save data in Session A (Simulated)
        await saucedemoPage.saveData(sessionAData);
        await expect(saucedemoPage.getSuccessMessage()).toBe(ALERT_MESSAGES.DATA_SAVED_SUCCESSFULLY);

        // Step 2: Log out and log back in (Simulating session change)
        await saucedemoPage.logout();
        await saucedemoPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASS);

        // Step 3: Verify the previously entered data is still visible and correct
        await saucedemoPage.verifyDataPersistence(sessionAData);
    });

    // Scenario: Regression Test: Verify Existing User Dashboard Access
    test('All expected UI components should be present on the main dashboard', async () => {
        // Setup: Ensure user is logged in (handled by beforeEach)
        await saucedemoPage.navigateToDashboard();

        // Assertion: Check for presence of key elements
        await expect(saucedemoPage.getNavigationBar()).toBeVisible();
        await expect(saucedemoPage.getProfileLink()).toBeVisible();
        await expect(saucedemoPage.getDashboardTitle()).toHaveText('User Dashboard');
    });

    // Scenario: Security Test: Access Denial for Unauthorized Role (Inferred)
    test('Access to administrative features should be denied for standard users', async () => {
        // Setup: Ensure user is logged in as a standard user (handled by beforeEach)
        await saucedemoPage.navigateToAdminFeature();

        // Assertion: Check if access is denied and an authorization error is returned
        await expect(saucedemoPage.getErrorMessage()).toContain('Access Denied');
    });

    // Scenario: Teste de navegação com URL inválida (Negativo) [404]
    test('Attempting to navigate to an invalid URL should display the 404 error page', async () => {
        // Setup: Ensure user is logged in
        await saucedemoPage.navigateToAnyRoute(); // Assume this ensures login state

        const invalidRoute = '/erro404';

        // Action: Attempt to navigate to an invalid URL
        await saucedemoPage.navigate(invalidRoute);

        // Assertion: Check if the 404 page is displayed
        await expect(saucedemoPage.getPageTitle()).toContain('404 Not Found');
    });

    // Scenario: Boundary Test: Minimum Input Value
    test('Input field should handle the minimum allowed numerical value correctly', async () => {
        // Setup: Navigate to a numerical input field (e.g., quantity)
        await saucedemoPage.navigateToQuantityInput();

        const minValue = 0; // Assuming minimum is 0 for quantity/price
        
        // Action: Enter the minimum allowed value and attempt submission
        await saucedemoPage.enterValue(minValue);
        await saucedemoPage.submit();

        // Assertion: Verify successful submission with the minimum value
        await expect(saucedemoPage.getSuccessMessage()).toBe(ALERT_MESSAGES.DATA_SAVED_SUCCESSFULLY);
    });

    // Scenario: Boundary Test: Maximum Input Length
    test('Input field should handle the maximum allowed character length', async () => {
        const maxLength = 100; // Assuming a max length of 100 characters for a text field
        const longString = 'A'.repeat(maxLength);

        // Setup: Navigate to a text input field (e.g., description)
        await saucedemoPage.navigateToDescriptionInput();

        // Action: Enter the maximum allowed character limit and attempt submission
        await saucedemoPage.enterText(longString);
        await saucedemoPage.submit();

        // Assertion: Verify successful submission without truncation or error
        await expect(saucedemoPage.getSuccessMessage()).toBe(ALERT_MESSAGES.DATA_SAVED_SUCCESSFULLY);
    });
});