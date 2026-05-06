import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let authUser;
    let factory;

    // Setup common objects and environment variables
    beforeAll(() => {
        authUser = new GenericFactory();
        factory = authUser;
    });

    // Setup for login/session management
    beforeEach(async () => {
        // Initialize the page object instance
        const inventoryPage = new SAUCEDEMOPage(await this.page); // Assuming 'this.page' is available from Playwright context setup

        // This beforeEach will be customized per test if necessary, but for login tests, we handle it inside or rely on specific factory calls.
    });

    // --- Scenario: Regression Test: Data Consistency Across Sessions ---
    test('Verifying cart persistence across sessions', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given the user has items in their cart (Setup assumed via factory/initial state)
        await factory.setupCartItems(); 

        // When the user logs out and logs back in
        await inventoryPage.logout();
        await inventoryPage.login(authUser.username, authUser.password);

        // And navigates to the cart page
        await inventoryPage.navigateToCart();

        // Then the previously added items should persist
        await inventoryPage.assertCartPersistence(); 
    });

    // --- Scenario: Acesso ao inventário sem autenticação (Access Restriction) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Usuário não autenticado
        await inventoryPage.ensureUnauthenticated();

        // When Tenta acessar /inventory.html
        await inventoryPage.navigateToRoute(ROUTES.INVENTORY_ROUTE);

        // Then Deve ser bloqueado e receber erro de acesso
        await inventoryPage.assertAccessDenied(); 
    });

    // --- Scenario: Login falho com Username inválido ---
    test('Login com Username inexistente', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Usuário sem registro
        await inventoryPage.ensureNoUser();

        // When Insere Username e Password
        await inventoryPage.fillCredentials(authUser.nonExistentUsername, authUser.password);
        // And Clica em Login
        await inventoryPage.submitLogin();

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS); 
    });

    // --- Scenario: Login falho com senha incorreta ---
    test('Login com senha inválida', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Usuário com Username válido
        await inventoryPage.ensureValidUser();

        // When Insere Username e Password incorretos
        await inventoryPage.fillCredentials(authUser.validUsername, authUser.wrongPassword);
        // And Clica em Login
        await inventoryPage.submitLogin();

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS); 
    });

    // --- Scenario: Login bem-sucedido com credenciais válidas (Usuário Padrão) ---
    test('Login de um usuário padrão', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Usuário com credenciais válidas
        await inventoryPage.ensureValidUser();

        // When Insere Username e Password corretamente
        await inventoryPage.fillCredentials(authUser.validUsername, authUser.validPassword);
        // And Clica em Login
        await inventoryPage.submitLogin();

        // Then Deve ser redirecionado para a página principal/inventário
        await inventoryPage.assertRedirectToInventory(); 
    });

    // --- Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo) ---
    test('Adicionar um produto ao carrinho', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Usuário autenticado e no inventário
        await inventoryPage.ensureAuthenticated();

        // When Seleciona um produto e Clica em 'Adicionar ao Carrinho'
        await inventoryPage.addItemToCart(authUser.productId);

        // Then Deve receber feedback positivo de sucesso e o contador do carrinho deve ser atualizado
        await inventoryPage.assertSuccessFeedback();
        await inventoryPage.assertCartCountUpdated(); 
    });

    // --- Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo) ---
    test('Ajustar a quantidade de um item no carrinho', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Um item está no carrinho com quantidade X
        const initialQuantity = 5;
        await inventoryPage.setCartItemQuantity(authUser.productId, initialQuantity);

        // When Altera a quantidade para Y (onde Y é válido)
        const newQuantity = 10;
        await inventoryPage.updateCartItemQuantity(authUser.productId, newQuantity);

        // And Confirma a alteração
        await inventoryPage.confirmUpdate();

        // Then A quantidade exibida deve ser Y
        await inventoryPage.assertQuantityIs(authUser.productId, newQuantity); 
    });

    // --- Scenario: Regressão: Fluxo completo de compra (Smoke Test) ---
    test('Fluxo de compra completo (Adicionar, Carrinho, Checkout simulado)', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Usuário autenticado e com itens no carrinho
        await inventoryPage.ensureAuthenticatedAndCart();

        // When Inicia o processo de checkout
        await inventoryPage.startCheckoutProcess();

        // Then Deve navegar para a tela de checkout
        await inventoryPage.assertRedirectToCheckout(); 
    });

    // --- Scenario: Verificar acesso ao inventário sem autenticação (Security) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        const inventoryPage = new SAUCEDEMOPage(await this.page);

        // Given Usuário não autenticado
        await inventoryPage.ensureUnauthenticated();

        // When Navega para /inventory.html
        await inventoryPage.navigateToRoute(ROUTES.INVENTORY_ROUTE);

        // Then Deve ser redirecionado para a página de login ou exibir mensagem de erro
        await inventoryPage.assertRedirectToLoginPageOrError(); 
    });
});