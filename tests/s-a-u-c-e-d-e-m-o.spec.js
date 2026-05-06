import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let dashboardPage: SAUCEDEMOPage;
    let factory: GenericFactory;

    // Setup environment variables for dynamic testing
    const env = ENVIRONMENTS;
    const routes = ROUTES;
    const alerts = ALERT_MESSAGES;

    beforeAll(() => {
        loginPage = new SAUCEDEMOPage(process.env.BASE_URL);
        inventoryPage = new SAUCEDEMOPage(process.env.BASE_URL);
        dashboardPage = new SAUCEDEMOPage(process.env.BASE_URL);
        factory = new GenericFactory();
    });

    beforeEach(async () => {
        // Setup common login state for most tests
        await loginPage.login(env.testUser, env.testPassword);
    });

    // Scenario: Business Rule Test: Data Constraint Validation (Inferred)
    test('Verifying a business rule related to data quantity constraints', async () => {
        const minimumQuantity = 1; // Assuming minimum required is 1 for this test context
        const invalidQuantity = -1;

        await inventoryPage.navigate();
        
        // When the user attempts to set the quantity below the minimum required amount (e.g., quantity = -1)
        await inventoryPage.setQuantity(invalidQuantity);
        
        // Then the system must reject the transaction and display a constraint error
        await expect(inventoryPage.getErrorMessage()).toBeDisplayed();
        await expect(inventoryPage.getErrorMessage()).toContain('Invalid quantity');
    });

    // Scenario: Negative Test: Invalid Password Attempt
    test('Attempting login with an invalid password', async () => {
        // Given the user is on the login page (Setup handles this)
        
        // When the user enters a valid username and an incorrect password
        await loginPage.fillCredentials(env.testUser, 'wrongPassword');
        
        // And clicks the login button
        await loginPage.submit();
        
        // Then an appropriate error message regarding invalid credentials should be displayed
        await expect(loginPage.getErrorMessage()).toBeDisplayed();
        await expect(loginPage.getErrorMessage()).toContain('Invalid credentials');
    });

    // Scenario: Positive Test: Successful Data Submission
    test('Successfully submitting a form/data entry via the feature', async () => {
        const testData = { name: 'Test Item', quantity: 5 };

        // Given the user is on the data input screen
        await inventoryPage.navigate();

        // When the user enters valid, non-empty data and submits the form
        await inventoryPage.enterItemDetails(testData);
        await inventoryPage.submit();

        // Then a success message should be displayed and data should be saved
        await expect(inventoryPage.getSuccessMessage()).toBeDisplayed();
        await expect(inventoryPage.getSavedData()).toEqual(testData);
    });

    // Scenario: Regression Test: Data Persistence Check
    test('Verifying that submitted data persists across sessions', async () => {
        const sessionAData = { item: 'Session A Item', value: 100 };

        // Given the user successfully saved data in Session A
        await inventoryPage.navigate();
        await inventoryPage.enterItemDetails(sessionAData);
        await inventoryPage.submit();
        await expect(inventoryPage.getSuccessMessage()).toBeDisplayed();

        // When the user logs out and logs back in (or navigates back)
        await loginPage.logout();
        await loginPage.login(env.testUser, env.testPassword); // Log back in

        // Then the previously entered data should still be visible and correct
        await inventoryPage.navigate();
        const retrievedData = await inventoryPage.getSavedData();
        
        await expect(retrievedData).toEqual(sessionAData);
    });

    // Scenario: Regression Test: Verify Existing User Dashboard Access
    test('Verifying access to previously established user dashboard elements', async () => {
        // Given the user is logged in (Setup handles this)
        
        // When the user navigates to the main dashboard
        await dashboardPage.navigate(routes.dashboard);

        // Then all expected UI components (e.g., navigation bar, profile link) should be present and functional
        await expect(dashboardPage.getNavigationBar()).toBeDisplayed();
        await expect(dashboardPage.getProfileLink()).toBeDisplayed();
    });

    // Scenario: Security Test: Access Denial for Unauthorized Role (Inferred)
    test('Attempting to access administrative features without elevated permissions', async () => {
        // Given the user is logged in as a standard user (Setup handles this)
        
        // When the user attempts to navigate to an administrative URL/feature
        await loginPage.logout(); // Ensure we are logged out or use a specific context if necessary, but here we test access denial post-login.
        await loginPage.login(env.testUser, env.testPassword);

        // Attempt navigation (assuming the system checks role on route access)
        const adminRoute = routes.adminDashboard; 
        await loginPage.navigate(adminRoute);

        // Then access should be denied, and an authorization error should be returned
        await expect(loginPage.getErrorMessage()).toBeDisplayed();
        await expect(loginPage.getErrorMessage()).toContain('Access Denied');
    });

    // Scenario: Smoke Test: Login with Valid Credentials
    test('Successful login with valid standard user credentials', async () => {
        // Given the user is on the login page (Setup handles this)
        
        // When the user enters valid username and password
        await loginPage.fillCredentials(env.testUser, env.testPassword);
        
        // And clicks the login button
        await loginPage.submit();

        // Then the user should be redirected to the dashboard
        await expect(dashboardPage.isLoaded()).toBeTrue();
    });

    // Scenario: Teste de navegação com URL inválida (Negativo)
    test('Tentativa de acessar uma URL não mapeada', async () => {
        // Given Usuário está logado (Setup handles this)
        await loginPage.login(env.testUser, env.testPassword);

        // When Usuário tenta navegar para uma URL aleatória (ex: /erro404)
        const invalidRoute = '/erro404';
        await loginPage.navigate(invalidRoute);

        // Then Sistema deve exibir a página de erro 404
        await expect(loginPage.getErrorMessage()).toBeDisplayed();
        await expect(loginPage.getErrorMessage()).toContain('404 Not Found');
    });

    // Scenario: Boundary Test: Minimum Input Value
    test('Testing input field with minimum allowed numerical value', async () => {
        const minValue = 0; // Testing the boundary condition of 0 (often used as a minimum)

        // Given the user is on a numerical input field
        await inventoryPage.navigate();
        
        // When the user enters the minimum allowed value (e.g., 0 or minimum quantity)
        await inventoryPage.setQuantity(minValue);
        
        // And attempts to submit
        await inventoryPage.submit();

        // Assertion: Check if submission was rejected due to boundary rule
        await expect(inventoryPage.getErrorMessage()).toBeDisplayed();
        await expect(inventoryPage.getErrorMessage()).toContain('Minimum value required');
    });

    // Scenario: Boundary Test: Maximum Input Length
    test('Testing input field with maximum allowed character length', async () => {
        const maxLength = 100;
        const longString = 'A'.repeat(maxLength);

        // Given the user is on a text input field
        await inventoryPage.navigate();
        
        // When the user enters the maximum allowed character limit (e.g., 100 characters)
        await inventoryPage.enterText(longString);
        
        // And attempts to submit
        await inventoryPage.submit();

        // Assertion: Check if submission was successful (assuming length constraint is met)
        await expect(inventoryPage.getSuccessMessage()).toBeDisplayed();
    });
});