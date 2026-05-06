import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let basePage: BasePage;
    let saucedoPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    beforeAll(() => {
        // Initialize page objects and factory once
        basePage = new BasePage();
        saucedoPage = new SAUCEDEMOPage(basePage);
        genericFactory = new GenericFactory(basePage);
    });

    // --- Scenario: Regression Test: Data Consistency Across Sessions ---
    test('Verifying cart persistence across sessions', async () => {
        const user = await genericFactory.createTestUser(); // Assumes factory handles setup/login context
        
        // 1. Given the user has items in their cart
        await saucedoPage.addItemToCart(user.productId);

        // 2. When the user logs out and logs back in
        await saucedoPage.logout();
        await saucedoPage.login(user.username, user.password);

        // 3. And navigates to the cart page
        await saucedoPage.navigateToCart();

        // 4. Then the previously added items should persist
        const cartItems = await saucedoPage.getCartItems();
        expect(cartItems).toBeGreaterThan(0);
    });

    // --- Scenario: Acesso ao inventário sem autenticação (Security) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        // Given Usuário não autenticado
        await saucedoPage.clearSession(); // Ensure no session exists
        
        // When Navega para /inventory.html
        const result = await saucedoPage.navigateToRoute(ROUTES.INVENTORY_ROUTE);

        // Then Deve ser redirecionado para a página de login ou exibir mensagem de erro
        expect(result.status).toBe('error');
        expect(result.message).toContain(ALERT_MESSAGES.ACCESS_DENIED);
    });

    // --- Scenario: Login falho com Username inválido (Negative) ---
    test('Login com Username inexistente', async () => {
        // Given Usuário sem registro
        const invalidUsername = 'nonexistentuser123';
        
        // When Insere Username e Password
        await saucedoPage.fillCredentials(invalidUsername, 'anypassword');
        
        // And Clica em Login
        await saucedoPage.submitLogin();

        // Then Deve exibir mensagem de erro de credenciais inválidas
        const result = await saucedoPage.getLastLoginResult();
        expect(result.status).toBe('error');
        expect(result.message).toContain(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login falho com senha incorreta (Negative) ---
    test('Login com senha inválida', async () => {
        // Given Usuário com Username válido
        const validUsername = 'validuser';
        await saucedoPage.login(validUsername, 'wrongpassword');

        // When Insere Username e Password incorretos
        // And Clica em Login (handled by login method)
        
        // Then Deve exibir mensagem de erro de credenciais inválidas
        const result = await saucedoPage.getLastLoginResult();
        expect(result.status).toBe('error');
        expect(result.message).toContain(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login bem-sucedido com credenciais válidas (Positive) ---
    test('Login de um usuário padrão', async () => {
        // Given Usuário com credenciais válidas
        const validUser = await genericFactory.createValidUser();
        
        // When Insere Username e Password corretamente
        await saucedoPage.login(validUser.username, validUser.password);
        
        // And Clica em Login (handled by login method)

        // Then Deve ser redirecionado para a página principal/inventário
        const navigationResult = await saucedoPage.getLastNavigation();
        expect(navigationResult.status).toBe('success');
        expect(navigationResult.path).toContain(ROUTES.INVENTORY_ROUTE);
    });

    // --- Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo) ---
    test('Adicionar um produto ao carrinho', async () => {
        // Given Usuário autenticado e no inventário
        const user = await genericFactory.createValidUser();
        await saucedoPage.login(user.username, user.password);

        // When Seleciona um produto e Clica em 'Adicionar ao Carrinho'
        const product = await saucedoPage.selectProduct(101); // Assuming 101 is a valid product ID
        await saucedoPage.addToCart(product.id);

        // Then Deve receber feedback positivo de sucesso e o contador do carrinho deve ser atualizado
        const feedback = await saucedoPage.getLastActionFeedback();
        expect(feedback.type).toBe('success');
        expect(feedback.message).toContain('Item added successfully');
        
        const cartCount = await saucedoPage.getCartItemCount();
        expect(cartCount).toBeGreaterThan(0);
    });

    // --- Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo) ---
    test('Ajustar a quantidade de um item no carrinho', async () => {
        // Given Um item está no carrinho com quantidade X
        const user = await genericFactory.createValidUser();
        await saucedoPage.login(user.username, user.password);
        
        // Setup: Add an item first (assuming product ID 101 exists)
        await saucedoPage.addToCart(101);

        const initialQuantity = await saucedoPage.getItemQuantity(101);
        expect(initialQuantity).toBeGreaterThanOrEqual(1);

        // When Altera a quantidade para Y (onde Y é válido)
        const newQuantity = 5; // Assuming 5 is a valid quantity
        await saucedoPage.updateItemQuantity(101, newQuantity);

        // And Confirma a alteração
        const updatedQuantity = await saucedoPage.getItemQuantity(101);

        // Then A quantidade exibida deve ser Y
        expect(updatedQuantity).toBe(newQuantity);
    });

    // --- Scenario: Regressão: Fluxo completo de compra (Smoke Test) ---
    test('Fluxo de compra completo (Adicionar, Carrinho, Checkout simulado)', async () => {
        // Given Usuário autenticado e com itens no carrinho
        const user = await genericFactory.createValidUser();
        await saucedoPage.login(user.username, user.password);

        // Setup: Add items
        await saucedoPage.addToCart(101);
        await saucedoPage.addToCart(102);

        // When Inicia o processo de checkout
        const checkoutResult = await saucedoPage.initiateCheckout();

        // Then Deve navegar para a tela de checkout
        expect(checkoutResult.status).toBe('success');
        expect(checkoutResult.path).toContain(ROUTES.CHECKOUT_ROUTE);
    });
});