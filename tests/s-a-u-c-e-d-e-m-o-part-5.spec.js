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

    // Setup environment variables for testing
    const TEST_ENV = ENVIRONMENTS.testEnvironment || 'staging';

    beforeAll(() => {
        // Initialize Page Objects
        loginPage = new SAUCEDEMOPage(TEST_ENV);
        inventoryPage = new SAUCEDEMOPage(TEST_ENV);
        genericFactory = new GenericFactory();
    });

    beforeEach(async () => {
        // Setup for login/logout cycle, ensuring a clean state for most tests
        await loginPage.clearSession(); // Assuming a method exists to clear session data if needed
    });

    // --- Scenario: Login falho com Username inválido (Negative) ---
    test('Login falho com Username inexistente', async () => {
        const invalidUsername = 'nonexistent_user_123';
        const validPassword = 'password123';

        await loginPage.fillCredentials(invalidUsername, validPassword);
        await loginPage.submit();

        // Assertion based on expected error message structure
        await expect(loginPage.getErrorMessage()).toBe(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login falho com senha incorreta (Negative) ---
    test('Login com senha inválida', async () => {
        const validUsername = 'valid_user';
        const invalidPassword = 'wrong_password';

        await loginPage.fillCredentials(validUsername, invalidPassword);
        await loginPage.submit();

        // Assertion based on expected error message structure
        await expect(loginPage.getErrorMessage()).toBe(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login bem-sucedido com credenciais válidas (Positive) ---
    test('Login de um usuário padrão', async () => {
        const validUsername = 'standard_user';
        const validPassword = 'secure_password';

        await loginPage.fillCredentials(validUsername, validPassword);
        await loginPage.submit();

        // Assertion: Check redirection to the expected route
        await inventoryPage.assertLoaded(); // Ensure the page loads after successful login
        await inventoryPage.assertRoute(ROUTES.INVENTORY_ROUTE);
    });

    // --- Scenario: Verificar acesso ao inventário sem autenticação (Security) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        const inventoryUrl = ROUTES.INVENTORY_ROUTE; // Assuming this is the route path

        await inventoryPage.goto(inventoryUrl);

        // Assertion: Check if access is restricted (e.g., redirected to login or shows an error)
        await expect(inventoryPage.getErrorMessage()).toContain('Acesso Negado'); 
    });


    // --- Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo) ---
    test('Adicionar um produto ao carrinho', async () => {
        const factory = genericFactory;
        const product = await factory.createProduct(); // Assume factory creates a valid product ID

        // 1. Login (Setup prerequisite)
        await loginPage.login(factory.getValidCredentials());

        // 2. Navigate to inventory and select product
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);
        await inventoryPage.selectProduct(product.id);

        // 3. Add to Cart
        await inventoryPage.addToCart();

        // Assertion: Check for success feedback and cart update
        await expect(inventoryPage.getSuccessMessage()).toBe(ALERT_MESSAGES.ITEM_ADDED_SUCCESS);
        await expect(inventoryPage.getCartCount()).toBeGreaterThan(0); // Assuming a method to get cart count
    });

    // --- Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo) ---
    test('Ajustar a quantidade de um item no carrinho', async () => {
        const factory = genericFactory;
        const initialProduct = await factory.createProduct();
        await loginPage.login(factory.getValidCredentials());

        // 1. Add item to cart first (Setup prerequisite)
        await inventoryPage.selectProduct(initialProduct.id);
        await inventoryPage.addToCart();

        // 2. Adjust quantity
        const newQuantity = 5; // Valid quantity
        await inventoryPage.adjustCartQuantity(initialProduct.id, newQuantity);

        // 3. Confirm change and assert
        await inventoryPage.confirmUpdate();

        // Assertion: Check if the displayed quantity is correct
        await expect(inventoryPage.getCartItemQuantity(initialProduct.id)).toBe(newQuantity);
    });


    // --- Scenario: Gerenciamento de quantidade no carrinho (Regression Test) ---
    test('Verificar persistência do carrinho entre sessões', async () => {
        const factory = genericFactory;
        const product1 = await factory.createProduct();

        // Session 1: Add item and log out
        await loginPage.login(factory.getValidCredentials());
        await inventoryPage.selectProduct(product1.id);
        await inventoryPage.addToCart();
        await loginPage.logout();

        // Session 2: Log back in and check cart persistence
        await loginPage.login(factory.getValidCredentials());
        await inventoryPage.assertLoaded(); // Ensure page is ready
        
        // Assertion: Check if the item is still present in the cart
        await expect(inventoryPage.getCartItemCount(product1.id)).toBe(1); 
    });


    // --- Scenario: Adicionar item ao carrinho com sucesso (Regression Test) ---
    test('Verificar persistência do carrinho após login/logout', async () => {
        const factory = genericFactory;
        const product = await factory.createProduct();

        // Session 1: Add item and log out
        await loginPage.login(factory.getValidCredentials());
        await inventoryPage.selectProduct(product.id);
        await inventoryPage.addToCart();
        await loginPage.logout();

        // Session 2: Log back in and check cart persistence
        await loginPage.login(factory.getValidCredentials());
        await inventoryPage.assertLoaded();
        
        // Assertion: Check if the item is still present in the cart
        await expect(inventoryPage.getCartItemCount(product.id)).toBe(1); 
    });


    // --- Scenario: Gerenciamento de quantidade no carrinho (Regression Test) ---
    test('Verificar ajuste de quantidade persistente', async () => {
        const factory = genericFactory;
        const product = await factory.createProduct();

        // Setup: Add item and adjust quantity in one session
        await loginPage.login(factory.getValidCredentials());
        await inventoryPage.selectProduct(product.id);
        await inventoryPage.addToCart();
        await inventoryPage.adjustCartQuantity(product.id, 2);
        await inventoryPage.confirmUpdate();

        // Session 2: Log back in and check quantity persistence
        await loginPage.logout();
        await loginPage.login(factory.getValidCredentials());
        await inventoryPage.assertLoaded();

        // Assertion: Check if the quantity is still 2
        await expect(inventoryPage.getCartItemQuantity(product.id)).toBe(2);
    });


    // --- Scenario: Fluxo de compra completo (Smoke Test) ---
    test('Fluxo de compra completo (Adicionar, Carrinho, Checkout simulado)', async () => {
        const factory = genericFactory;
        const product = await factory.createProduct();

        // Setup: Login and Add item
        await loginPage.login(factory.getValidCredentials());
        await inventoryPage.selectProduct(product.id);
        await inventoryPage.addToCart();

        // Action: Initiate checkout process
        await inventoryPage.initiateCheckout();

        // Assertion: Check navigation to the checkout screen
        await expect(inventoryPage.isCheckoutScreenVisible()).toBe(true);
    });
});