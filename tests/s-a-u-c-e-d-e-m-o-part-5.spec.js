import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let cartPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    // Setup environment variables for testing
    const TEST_ENV = ENVIRONMENTS.testEnvironment || 'staging';

    beforeAll(() => {
        // Initialize Page Objects (Assuming they are instantiated within the setup)
        // In a real scenario, these would be initialized via a fixture or setup function.
        // For this exercise, we instantiate them based on the provided imports.
        loginPage = new SAUCEDEMOPage(TEST_ENV);
        inventoryPage = new SAUCEDEMOPage(TEST_ENV);
        cartPage = new SAUCEDEMOPage(TEST_ENV);
        genericFactory = new GenericFactory();
    });

    beforeEach(async () => {
        // Setup for login/authentication state before each test, if required by the scenario.
        // We will handle specific logins within the tests themselves to isolate flow testing.
    });

    // --- Scenario: Regression Test: Data Consistency Across Sessions ---
    test('Verifying cart persistence across sessions', async () => {
        const user = genericFactory.createUser('testuser', 'password123');
        
        // 1. Given the user has items in their cart
        await loginPage.login(user.username, user.password);
        await cartPage.addItem(user.id, 'productA', 1); // Simulate adding an item

        // 2. When the user logs out and logs back in
        await loginPage.logout();
        await loginPage.login(user.username, user.password);

        // 3. And navigates to the cart page
        await cartPage.navigate();

        // 4. Then the previously added items should persist
        const persistedItems = await cartPage.getCartContents();
        expect(persistedItems).toHaveLength(1);
        expect(persistedItems[0].name).toBe('productA');
    });

    // --- Scenario: Acesso ao inventário sem autenticação (Access Restriction) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        // Given Usuário não autenticado
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);

        // When Tenta acessar /inventory.html
        // Then Deve ser bloqueado e receber erro de acesso
        await expect(inventoryPage).toHaveError('Access Denied'); // Assuming the PO handles this specific error state
    });

    // --- Scenario: Login falho com Username inválido ---
    test('Login com Username inexistente', async () => {
        // Given Usuário sem registro
        const invalidUser = 'nonexistentuser';
        
        // When Insere Username e Password
        await loginPage.login(invalidUser, 'anypassword');

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await expect(loginPage).toDisplayErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login falho com senha incorreta ---
    test('Login com senha inválida', async () => {
        // Given Usuário com Username válido
        const validUser = genericFactory.createUser('validuser', 'wrongpassword');
        
        // When Insere Username e Password incorretos
        await loginPage.login(validUser.username, 'wrongpassword');

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await expect(loginPage).toDisplayErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // --- Scenario: Login bem-sucedido com credenciais válidas (Usuário Padrão) ---
    test('Login de um usuário padrão', async () => {
        // Given Usuário com credenciais válidas
        const validUser = genericFactory.createUser('standarduser', 'correctpassword');

        // When Insere Username e Password corretamente
        await loginPage.login(validUser.username, validUser.password);

        // Then Deve ser redirecionado para a página principal/inventário
        await inventoryPage.assertLoaded(); // Check if the target page is loaded successfully
    });

    // --- Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo) ---
    test('Adicionar um produto ao carrinho', async () => {
        const user = genericFactory.createUser('positiveuser', 'password123');
        await loginPage.login(user.username, user.password);

        // Given Usuário autenticado e no inventário (Implicitly handled by successful login)

        // When Seleciona um produto e Clica em 'Adicionar ao Carrinho'
        await cartPage.addItem(user.id, 'productB', 2); // Add item with quantity 2

        // Then Deve receber feedback positivo de sucesso e o contador do carrinho deve ser atualizado
        const currentCount = await cartPage.getCartItemCount();
        expect(currentCount).toBeGreaterThan(0);
        await expect(cartPage).toDisplaySuccessMessage('Item added successfully');
    });

    // --- Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo) ---
    test('Ajustar a quantidade de um item no carrinho', async () => {
        const user = genericFactory.createUser('quantityuser', 'password123');
        await loginPage.login(user.username, user.password);

        // Given Um item está no carrinho com quantidade X
        await cartPage.addItem(user.id, 'productC', 5); // Start with quantity 5

        // When Altera a quantidade para Y (onde Y é válido)
        const newQuantity = 3;
        await cartPage.updateItemQuantity(user.id, 'productC', newQuantity);

        // And Confirma a alteração
        const updatedQuantity = await cartPage.getItemQuantity(user.id, 'productC');

        // Then A quantidade exibida deve ser Y
        expect(updatedQuantity).toBe(newQuantity);
    });

    // --- Scenario: Regressão: Fluxo completo de compra (Smoke Test) ---
    test('Fluxo de compra completo (Adicionar, Carrinho, Checkout simulado)', async () => {
        const user = genericFactory.createUser('smokeuser', 'password123');
        await loginPage.login(user.username, user.password);

        // Given Usuário autenticado e com itens no carrinho
        await cartPage.addItem(user.id, 'productD', 1);

        // When Inicia o processo de checkout
        await cartPage.initiateCheckout();

        // Then Deve navegar para a tela de checkout
        await expect(cartPage).toHaveURL(ROUTES.CHECKOUT_ROUTE);
    });

    // --- Scenario: Verificar acesso ao inventário sem autenticação (Security) ---
    test('Tentar acessar /inventory.html sem login', async () => {
        // Given Usuário não autenticado
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);

        // When Navega para /inventory.html
        // Then Deve ser redirecionado para a página de login ou exibir mensagem de erro
        await expect(inventoryPage).toHaveError('Access Denied'); 
    });
});