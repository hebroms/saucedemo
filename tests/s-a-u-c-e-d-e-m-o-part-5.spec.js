import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let browser;
    let page;
    let factory;
    let saucedoPage: SAUCEDEMOPage;

    // Setup environment variables for testing
    const TEST_ENV = ENVIRONMENTS.TEST_ENVIRONMENT || 'staging';

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    beforeEach(async () => {
        factory = new GenericFactory(page);
        saucedoPage = new SAUCEDEMOPage(page);
        // Setup default environment if needed, though page object methods should handle routing based on context
    });

    afterAll(async () => {
        await browser.close();
    });

    // --- Scenario: Regression Test: Data Consistency Across Sessions ---
    test('Verifying cart persistence across sessions', async () => {
        const user = await factory.createTestUser('persistence_user');
        
        // 1. Given the user has items in their cart
        await saucedoPage.addItemToCart(user.productId, 1);

        // 2. When the user logs out and logs back in
        await saucedoPage.logout();
        await saucedoPage.login(user.username, user.password);

        // 3. And navigates to the cart page
        await saucedoPage.navigateToCart();

        // 4. Then the previously added items should persist
        const cartItems = await saucedoPage.getCartItems();
        expect(cartItems).toBeGreaterThan(0);
        expect(cartItems).toContain(user.productId);
    });

    // --- Scenario: Acesso ao inventário sem autenticação (Verificação de Restrição) ---
    test('Acesso ao inventário sem autenticação deve ser bloqueado', async () => {
        // Given Usuário não autenticado
        await saucedoPage.clearSession(); // Ensure no session exists

        // When Tenta acessar /inventory.html
        const result = await saucedoPage.accessInventoryRoute(ROUTES.INVENTORY_ROUTE);

        // Then Deve ser bloqueado e receber erro de acesso
        expect(result.status).toBe('error');
        expect(result.message).toContain(ALERT_MESSAGES.ACCESS_DENIED);
    });

    // --- Scenario: Login falho com Username inválido ---
    test('Login com Username inexistente deve exibir mensagem de erro', async () => {
        // Given Usuário sem registro
        const invalidUsername = 'nonexistentuser123';
        const password = 'anypassword';

        // When Insere Username e Password
        await saucedoPage.attemptLogin(invalidUsername, password);
        
        // And Clica em Login
        await saucedoPage.submitLogin();

        // Then Deve exibir mensagem de erro de credenciais inválidas
        const result = await saucedoPage.getLastLoginResult();
        expect(result.status).toBe('error');
        expect(result.message).toContain(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login falho com senha incorreta ---
    test('Login com senha inválida deve exibir mensagem de erro', async () => {
        // Given Usuário com Username válido
        const validUsername = 'validuser';
        const wrongPassword = 'wrongpassword';

        // When Insere Username e Password incorretos
        await saucedoPage.attemptLogin(validUsername, wrongPassword);
        
        // And Clica em Login
        await saucedoPage.submitLogin();

        // Then Deve exibir mensagem de erro de credenciais inválidas
        const result = await saucedoPage.getLastLoginResult();
        expect(result.status).toBe('error');
        expect(result.message).toContain(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login bem-sucedido com credenciais válidas (Usuário Padrão) ---
    test('Login de um usuário padrão deve redirecionar para a página principal/inventário', async () => {
        // Given Usuário com credenciais válidas
        const validUsername = 'admin';
        const validPassword = 'SecurePass123!';

        // When Insere Username e Password corretamente
        await saucedoPage.attemptLogin(validUsername, validPassword);
        
        // And Clica em Login
        await saucedoPage.submitLogin();

        // Then Deve ser redirecionado para a página principal/inventário
        const currentRoute = await saucedoPage.getCurrentRoute();
        expect(currentRoute).toContain(ROUTES.INVENTORY_ROUTE);
    });

    // --- Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo) ---
    test('Adicionar um produto ao carrinho deve resultar em feedback positivo e atualização do contador', async () => {
        const user = await factory.createTestUser('cart_user');
        await saucedoPage.login(user.username, user.password);

        // Given Usuário autenticado e no inventário (Implicitly handled by login)
        
        // When Seleciona um produto e Clica em 'Adicionar ao Carrinho'
        const additionResult = await saucedoPage.addToCart(user.productId, 1);

        // Then Deve receber feedback positivo de sucesso e o contador do carrinho deve ser atualizado
        expect(additionResult.success).toBe(true);
        expect(additionResult.message).toContain('Item added successfully');
        
        const cartCount = await saucedoPage.getCartItemCount();
        expect(cartCount).toBe(1);
    });

    // --- Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo) ---
    test('Ajustar a quantidade de um item no carrinho deve refletir o novo valor', async () => {
        const user = await factory.createTestUser('quantity_user');
        await saucedoPage.login(user.username, user.password);

        // Setup: Ensure an item is in the cart (e.g., quantity 5)
        await saucedoPage.addItemToCart(user.productId, 5);
        const initialQuantity = await saucedoPage.getCartItemQuantity(user.productId);
        expect(initialQuantity).toBe(5);

        // When Altera a quantidade para Y (onde Y é válido)
        const newQuantity = 3;
        await saucedoPage.updateCartQuantity(user.productId, newQuantity);

        // And Confirma a alteração
        const finalQuantity = await saucedoPage.getCartItemQuantity(user.productId);

        // Then A quantidade exibida deve ser Y
        expect(finalQuantity).toBe(newQuantity);
    });

    // --- Scenario: Regressão: Fluxo completo de compra (Smoke Test) ---
    test('Fluxo de compra completo deve navegar para a tela de checkout', async () => {
        const user = await factory.createTestUser('checkout_user');
        await saucedoPage.login(user.username, user.password);

        // Given Usuário autenticado e com itens no carrinho
        await saucedoPage.addItemToCart(user.productId, 1);

        // When Inicia o processo de checkout
        const checkoutResult = await saucedoPage.initiateCheckout();

        // Then Deve navegar para a tela de checkout
        expect(checkoutResult.success).toBe(true);
        expect(checkoutResult.redirectedUrl).toContain(ROUTES.CHECKOUT_ROUTE);
    });

    // --- Scenario: Verificar acesso ao inventário sem autenticação (Security) ---
    test('Tentar acessar /inventory.html sem login deve resultar em redirecionamento ou erro', async () => {
        // Given Usuário não autenticado
        await saucedoPage.clearSession(); // Ensure no session exists

        // When Navega para /inventory.html
        const result = await saucedoPage.accessInventoryRoute(ROUTES.INVENTORY_ROUTE);

        // Then Deve ser redirecionado para a página de login ou exibir mensagem de erro
        if (result.status === 'error') {
            expect(result.message).toContain(ALERT_MESSAGES.ACCESS_DENIED);
        } else if (result.redirectedUrl) {
             // If redirection happens, check if it leads to login or error page structure
             expect(result.redirectedUrl).toContain('/login'); 
        } else {
            // If the page loads but shows an access denial message on the inventory view itself
            expect(await saucedoPage.isAccessDenied()).toBe(true);
        }
    });
});