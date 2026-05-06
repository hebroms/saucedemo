import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

describe('SauceDemo Feature Tests', () => {
    let browser;
    let page;
    let loginPage;
    let dashboardPage;

    // Setup environment before each test
    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    beforeEach(async () => {
        const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';
        await page.goto(BASE_URL);
        loginPage = PageObjects.loginPage;
        dashboardPage = PageObjects.dashboardPage;
    });

    afterAll(async () => {
        await browser.close();
    });

    // Scenario: Negative Test: Invalid Password Attempt
    test('Attempting login with an invalid password should display an appropriate error message', async () => {
        await loginPage.gotoLoginPage();
        await loginPage.enterUsername('user');
        await loginPage.enterPassword('wrongpassword');
        await loginPage.clickLogin();

        await expect(loginPage.getErrorMessage()).toHaveText('Invalid credentials');
    });

    // Scenario: Positive Test: Successful Data Submission
    test('Successfully submitting a form/data entry via the feature should display a success message and save data', async () => {
        await loginPage.gotoLoginPage();
        await loginPage.enterUsername('user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.clickLogin();

        await dashboardPage.navigateToDataInputScreen();
        await dashboardPage.enterData('Sauce Labs Backpack', '10');
        await dashboardPage.submitForm();

        await expect(dashboardPage.getSuccessMessage()).toBeVisible();
        await expect(dashboardPage.getDataDisplayed()).toHaveText('Sauce Labs Backpack');
    });

    // Scenario: Business Rule Test: Data Constraint Validation (Inferred)
    test('The system must reject the transaction and display a constraint error when quantity is below minimum', async () => {
        await loginPage.gotoLoginPage();
        await loginPage.enterUsername('user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.clickLogin();

        await dashboardPage.navigateToInventoryScreen();
        // Attempt to set quantity below minimum (e.g., -1)
        await dashboardPage.setQuantity(-1);
        await dashboardPage.clickAddToCart(); // Assuming adding to cart triggers validation or we check the error state immediately after setting it.

        await expect(dashboardPage.getConstraintErrorMessage()).toBeVisible();
        await expect(dashboardPage.getConstraintErrorMessage()).toHaveText('Quantity must be greater than or equal to 1');
    });

    // Scenario: Regression Test: Data Persistence Check
    test('The previously entered data should still be visible and correct after logging out and logging back in', async () => {
        // Session A: Save data
        await loginPage.gotoLoginPage();
        await loginPage.enterUsername('user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.clickLogin();

        await dashboardPage.navigateToDataInputScreen();
        await dashboardPage.enterData('Session A Item', '5');
        await dashboardPage.submitForm();
        await expect(dashboardPage.getSuccessMessage()).toBeVisible();

        // Logout and Log back in (Simulating session change)
        await loginPage.clickLogout();
        await loginPage.gotoLoginPage();
        await loginPage.enterUsername('user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.clickLogin();

        // Verify persistence
        await dashboardPage.navigateToDataInputScreen();
        const savedData = await dashboardPage.getDataDisplayed();

        await expect(savedData).toHaveText('Session A Item');
        await expect(dashboardPage.getSavedQuantity()).toHaveText('5');
    });

    // Scenario: Regression Test: Verify Existing User Dashboard Access
    test('All expected UI components should be present and functional on the main dashboard', async () => {
        await loginPage.gotoLoginPage();
        await loginPage.enterUsername('user');
        await loginPage.enterPassword('secret_sauce');
        await loginPage.clickLogin();

        await dashboardPage.navigateToDashboard();

        // Verify presence of expected UI components
        await expect(dashboardPage.getNavigationBar()).toBeVisible();
        await expect(dashboardPage.getProfileLink()).toBeVisible();
        await expect(dashboardPage.getInventorySection()).toBeVisible();
    });
});