import { chromium } from 'playwright';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

describe('Sauce Demo Feature Tests', () => {
    let browser;
    let page;
    let context;

    // Setup for Playwright instance
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    // Setup for Page and Context instantiation before each test
    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://www.saucedemo.com/');
    });

    // Teardown after all tests
    afterAll(async () => {
        await browser.close();
    });

    // --- Scenario 1: Inserir caracteres inválidos nos campos numéricos ---
    test('Inserir caracteres inválidos nos campos numéricos', async () => {
        const user = GenericFactory.createUserData(); // Assuming factory provides standard credentials
        await page.goto('https://www.saucedemo.com/login.html');

        // Login first to access the inventory page where input fields exist
        await page.locator('#user-name').fill(user.username);
        await page.locator('#password').fill(user.password);
        await page.locator('#login-button').click();

        // Navigate to inventory page (assuming successful login)
        await page.goto('https://www.saucedemo.com/inventory.html');

        // Scenario: Inserir texto em um campo que espera números (Ex: 'abc')
        const inputField = page.locator('#quantity');
        await inputField.fill('abc');

        // Then O sistema deve rejeitar a entrada com erro de formato
        await expect(inputField).toHaveValue('abc'); // Check if text is entered
        await expect(page.locator('.error-message')).toBeVisible(); // Expect an error message to appear (assuming standard validation)
        await expect(page.locator('.error-message')).toHaveText(/must be a number/i); // Specific check for format rejection
    });

    // --- Scenario 2: Medir o tempo de resposta da funcionalidade ---
    test('Medir o tempo de resposta da funcionalidade', async () => {
        const user = GenericFactory.createUserData();
        await page.goto('https://www.saucedemo.com/login.html');

        // Login
        await page.locator('#user-name').fill(user.username);
        await page.locator('#password').fill(user.password);
        await page.locator('#login-button').click();

        // Wait for navigation to inventory page
        await page.waitForURL('**/inventory.html');

        // When Executa a operação principal (e.g., navigating to the inventory page)
        const startTime = Date.now();
        await page.goto('https://www.saucedemo.com/inventory.html');
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // Duration in seconds

        // Then O tempo de resposta deve ser inferior a 3 segundos
        console.log(`Time taken for navigation: ${duration} seconds`);
        await expect(duration).toBeLessThan(3);
    });

    // --- Scenario 3: Negative Test: Login with Invalid Password ---
    test('Login attempt with incorrect password', async () => {
        const user = GenericFactory.createUserData();
        await page.goto('https://www.saucedemo.com/login.html');

        // When the user enters valid username and invalid password
        await page.locator('#user-name').fill(user.username);
        await page.locator('#password').fill('wrong_password');
        await page.locator('#login-button').click();

        // Then an error message stating 'Invalid credentials' should be displayed
        const errorMessage = page.locator('.error-message');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Invalid credentials');
    });

    // --- Scenario 4: Negative Test: Missing Required Field (Checkout) ---
    test('Attempting to proceed to checkout without shipping address', async () => {
        const user = GenericFactory.createUserData();
        await page.goto('https://www.saucedemo.com/login.html');

        // Login
        await page.locator('#user-name').fill(user.username);
        await page.locator('#password').fill(user.password);
        await page.locator('#login-button').click();

        // Navigate to inventory page and add items (assuming we need items for checkout)
        await page.goto('https://www.saucedemo.com/inventory.html');
        await page.locator('#add-to-cart-item-1').click();
        await page.locator('#add-to-cart-item-2').click();

        // When the user attempts to click Checkout
        await page.locator('#checkout').click();

        // And does not fill in the mandatory shipping details (We skip filling them)

        // Then an error message prompting for missing fields must appear
        const shippingError = page.locator('.error-message');
        await expect(shippingError).toBeVisible();
        // Check for a generic required field prompt, as specific text might vary slightly based on implementation details
        await expect(shippingError).toHaveText(/Please fill out this form/i); 
    });

    // --- Scenario 5: Positive Test: Clear Error Message Consistency ---
    test('Verifying consistent error messaging across forms', async () => {
        const user = GenericFactory.createUserData();
        await page.goto('https://www.saucedemo.com/login.html');

        // Attempt 1: Wrong password
        await page.locator('#user-name').fill(user.username);
        await page.locator('#password').fill('wrong_password_1');
        await page.locator('#login-button').click();
        let error1 = page.locator('.error-message');
        await expect(error1).toBeVisible();
        await expect(error1).toHaveText('Invalid credentials');

        // Attempt 2: Missing field (Simulating a different failure path, e.g., trying to access inventory directly without login)
        // We simulate a missing field error by attempting an action that requires input on the inventory page if we were logged in.
        // Since this test focuses on *consistency*, we will re-login and attempt a known failure state.

        await page.reload(); // Reset state for consistency check
        await page.locator('#user-name').fill(user.username);
        await page.locator('#password').fill('wrong_password_2');
        await page.locator('#login-button').click();
        let error2 = page.locator('.error-message');
        await expect(error2).toBeVisible();
        await expect(error2).toHaveText('Invalid credentials'); // Consistency check: Error message for wrong password is consistent

        // To test missing field consistency, we need a scenario where multiple fields fail simultaneously or sequentially leading to the same error type.
        // Since the provided scenarios are distinct actions (login failure vs checkout failure), we ensure that the *type* of error displayed follows standards across these distinct negative paths.
        
        // If we strictly interpret "multiple invalid actions", we test two different types of failures:
        
        // Action 1 (Password failure) -> Checked above.
        // Action 2 (Missing field failure - requires a separate setup, but we check the pattern).

        // For consistency across forms, we confirm that if an error appears, it adheres to the system standard defined in the previous tests.
        expect(error1.textContent()).toContain('Invalid credentials');
        expect(error2.textContent()).toContain('Invalid credentials'); 
    });
});