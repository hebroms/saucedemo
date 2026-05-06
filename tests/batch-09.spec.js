import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as GenericFactory from '../factories/generic.factory';

describe('SAUCEDEMO Feature Tests', () => {
    let browser;
    let page;
    let saucedoPage;

    // Setup for Playwright context
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        saucedoPage = new SAUCEDEMOPage(page);
        await page.goto('https://www.saucedemo.com/');
    });

    afterAll(async () => {
        await browser.close();
    });

    // Scenario: Regression Test: Data Consistency Across Sessions
    test('Verifying cart persistence across sessions', async () => {
        const factory = new GenericFactory();
        const user = factory.createValidUser(); // Assuming a valid user exists for setup

        // Given the user has items in their cart
        await saucedoPage.login(user.username, user.password);
        await saucedoPage.addItemToCart('Sauce Labs Backpack');
        await saucedoPage.addItemToCart('Sauce Labs Bike Light');

        // When the user logs out and logs back in
        await saucedoPage.logout();
        await saucedoPage.login(user.username, user.password);

        // And navigates to the cart page
        await saucedoPage.navigate('/cart');

        // Then the previously added items should persist
        const cartItems = await saucedoPage.getCartItems();
        expect(cartItems).toHaveLength(2);
        expect(cartItems.includes('Sauce Labs Backpack')).toBe(true);
        expect(cartItems.includes('Sauce Labs Bike Light')).toBe(true);
    });

    // Scenario: Acesso ao inventário sem autenticação (Verificação de Restrição)
    test('Acesso ao inventário sem autenticação (Verificação de Restrição)', async () => {
        // Given Usuário não autenticado
        // Already logged out by default setup, or explicitly ensure no session exists.

        // When Tenta acessar /inventory.html
        await page.goto('https://www.saucedemo.com/inventory.html');

        // Then Deve ser bloqueado e receber erro de acesso
        // Expecting a redirect or an error message indicating access denial (e.g., seeing the login page again)
        await expect(page).toHaveURL(/login/); // Or check for specific error text if available on inventory page
        
        // A more robust check might be checking if the content is blocked, but based on standard SAUCEDEMO behavior, accessing /inventory directly usually redirects to login.
    });

    // Scenario: Login falho com Username inexistente
    test('Login com Username inexistente', async () => {
        const factory = new GenericFactory();
        const nonExistentUser = factory.createNonExistentUser();

        // Given Usuário sem registro
        // When Insere Username e Password
        await saucedoPage.login(nonExistentUser.username, nonExistentUser.password);
        await saucedoPage.click('Login');

        // Then Deve exibir mensagem de erro de credenciais inválidas
        // Expecting the standard error message displayed on the login page for invalid credentials
        const errorMessage = await page.locator('.error').innerText();
        expect(errorMessage).toContain('Username and password do not match the entered password'); 
        // Note: SAUCEDEMO usually shows a generic mismatch error, but we assert based on expected failure state.
    });

    // Scenario: Login falho com senha incorreta
    test('Login com senha inválida', async () => {
        const factory = new GenericFactory();
        const validUser = factory.createValidUser();

        // Given Usuário com Username válido
        // When Insere Username e Password incorretos
        await saucedoPage.login(validUser.username, 'wrong_password');
        await saucedoPage.click('Login');

        // Then Deve exibir mensagem de erro de credenciais inválidas
        const errorMessage = await page.locator('.error').innerText();
        expect(errorMessage).toContain('Username and password do not match the entered password');
    });

    // Scenario: Login bem-sucedido com credenciais válidas (Usuário Padrão)
    test('Login de um usuário padrão', async () => {
        const factory = new GenericFactory();
        const validUser = factory.createValidUser();

        // Given Usuário com credenciais válidas
        // When Insere Username e Password corretamente
        await saucedoPage.login(validUser.username, validUser.password);
        await saucedoPage.click('Login');

        // Then Deve ser redirecionado para a página principal/inventário
        await expect(page).toHaveURL(/inventory.html?login=false&logout=false/); // Check for successful redirection to inventory page
        await expect(page.locator('.inventory_item')).toBeVisible();
    });
});