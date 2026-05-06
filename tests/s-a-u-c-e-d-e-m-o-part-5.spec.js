import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let basePage: BasePage;
    let saucedemoPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    // Define test credentials based on environment setup (assuming these are available via constants/factory)
    const USERNAME = ENVIRONMENTS.testUser; // Placeholder assumption, actual values depend on context
    const PASSWORD = ENVIRONMENTS.testPassword; // Placeholder assumption

    beforeAll(async () => {
        // Initialize Page Objects and Factory
        basePage = new BasePage();
        saucedemoPage = new SAUCEDEMOPage(basePage);
        genericFactory = new GenericFactory(basePage);
    });

    beforeEach(async () => {
        // Setup common state before each test (e.g., ensuring a clean slate or initial setup)
        await basePage.goto(ROUTES.LOGIN_URL); // Assuming LOGIN_URL is defined in ROUTES
    });

    // --- Scenario: Regression Test: Data Consistency Across Sessions ---
    test('Verifying cart persistence across sessions', async () => {
        // Given the user has items in their cart
        await genericFactory.addItemToCart(saucedemoPage, 'productA');
        await saucedemoPage.login(USERNAME, PASSWORD);

        // When the user logs out and logs back in
        await saucedemoPage.logout();
        await saucedemoPage.login(USERNAME, PASSWORD);

        // And navigates to the cart page
        await saucedemoPage.navigateToCart();

        // Then the previously added items should persist
        await saucedemoPage.assertCartContains('productA');
    });

    // --- Scenario: Acesso ao inventário sem autenticação (Access Restriction) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        // Given Usuário não autenticado
        await saucedemoPage.ensureUserIsNotAuthenticated();

        // When Tenta acessar /inventory.html
        const inventoryRoute = ROUTES.INVENTORY_ROUTE; // Assuming this route exists
        await basePage.goto(inventoryRoute);

        // Then Deve ser bloqueado e receber erro de acesso
        await expect(basePage.getErrorMessage()).toBeDisplayed();
        await expect(basePage.getErrorMessage()).toContain('Acesso Negado'); // Asserting specific error message content
    });

    // --- Scenario: Login falho com Username inválido (Negative) ---
    test('Login com Username inexistente', async () => {
        // Given Usuário sem registro
        const invalidUsername = 'nonexistentuser123';
        const validPassword = PASSWORD;

        // When Insere Username e Password
        await saucedemoPage.fillCredentials(invalidUsername, validPassword);
        await saucedemoPage.submit();

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await expect(basePage.getErrorMessage()).toBeDisplayed();
        await expect(basePage.getErrorMessage()).toContain('Credenciais inválidas');
    });

    // --- Scenario: Login falho com senha incorreta (Negative) ---
    test('Login com senha inválida', async () => {
        // Given Usuário com Username válido
        const validUsername = USERNAME;
        const invalidPassword = 'wrongpassword';

        // When Insere Username e Password incorretos
        await saucedemoPage.fillCredentials(validUsername, invalidPassword);
        await saucedemoPage.submit();

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await expect(basePage.getErrorMessage()).toBeDisplayed();
        await expect(basePage.getErrorMessage()).toContain('Credenciais inválidas');
    });

    // --- Scenario: Login bem-sucedido com credenciais válidas (Positive) ---
    test('Login de um usuário padrão', async () => {
        // Given Usuário com credenciais válidas
        const validUsername = USERNAME;
        const validPassword = PASSWORD;

        // When Insere Username e Password corretamente
        await saucedemoPage.fillCredentials(validUsername, validPassword);
        await saucedemoPage.submit();

        // Then Deve ser redirecionado para a página principal/inventário
        await expect(saucedemoPage.isLoggedIn()).toBeTrue();
        await expect(basePage.getCurrentUrl()).toContain(ROUTES.INVENTORY_ROUTE); // Asserting redirection to inventory path
    });

    // --- Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo) ---
    test('Adicionar um produto ao carrinho', async () => {
        // Given Usuário autenticado e no inventário
        await saucedemoPage.login(USERNAME, PASSWORD);
        await saucedemoPage.navigateToInventory();

        // When Seleciona um produto e Clica em 'Adicionar ao Carrinho'
        const productToAdd = 'productB'; // Assuming this product exists in the inventory context
        await genericFactory.selectAndAddToCart(saucedemoPage, productToAdd);

        // Then Deve receber feedback positivo de sucesso e o contador do carrinho deve ser atualizado
        await expect(basePage.getSuccessMessage()).toBeDisplayed();
        await expect(saucedemoPage.getCartItemCount()).toBeGreaterThan(0); // Asserting cart count update
    });

    // --- Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo) ---
    test('Ajustar a quantidade de um item no carrinho', async () => {
        // Given Um item está no carrinho com quantidade X
        const initialQuantity = 1;
        await genericFactory.addItemToCart(saucedemoPage, 'productC'); // Setup item in cart

        // When Altera a quantidade para Y (onde Y é válido)
        const newQuantity = 5;
        await saucedemoPage.adjustCartQuantity('productC', newQuantity);

        // And Confirma a alteração
        await saucedemoPage.confirmUpdate();

        // Then A quantidade exibida deve ser Y
        const finalQuantity = await saucedemoPage.getCartItemQuantity('productC');
        await expect(finalQuantity).toBe(newQuantity);
    });

    // --- Scenario: Regressão: Fluxo completo de compra (Smoke Test) ---
    test('Fluxo de compra completo (Adicionar, Carrinho, Checkout simulado)', async () => {
        // Given Usuário autenticado e com itens no carrinho
        await saucedemoPage.login(USERNAME, PASSWORD);
        await genericFactory.addItemToCart(saucedemoPage, 'productA');

        // When Inicia o processo de checkout
        await saucedemoPage.initiateCheckout();

        // Then Deve navegar para a tela de checkout
        await expect(basePage.getCurrentUrl()).toContain('/checkout'); // Assuming /checkout is the target route
    });

    // --- Scenario: Verificar acesso ao inventário sem autenticação (Security) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        // Given Usuário não autenticado
        await saucedemoPage.ensureUserIsNotAuthenticated();

        // When Navega para /inventory.html
        const inventoryRoute = ROUTES.INVENTORY_ROUTE;
        await basePage.goto(inventoryRoute);

        // Then Deve ser redirecionado para a página de login ou exibir mensagem de erro
        await expect(basePage.getErrorMessage()).toBeDisplayed();
        await expect(basePage.getErrorMessage()).toContain('Acesso Negado');
    });
});