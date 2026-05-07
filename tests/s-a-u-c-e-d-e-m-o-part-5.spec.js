import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let user;
    let factory: GenericFactory;

    // Setup before each test
    beforeEach(async () => {
        factory = new GenericFactory();
        user = factory.createTestUser(); // Assumes factory handles creating valid/invalid users based on context

        // Initialize the main page object
        // Assuming SAUCEDEMOPage constructor handles initialization with base URL from ENVIRONMENTS
    });

    // Scenario: Regression Test: Data Consistency Across Sessions
    test('Verifying cart persistence across sessions', async () => {
        // Given the user has items in their cart
        await SAUCEDEMOPage.addItemToCart(user.username, 'product_id_1');
        await SAUCEDEMOPage.assertCartContainsItem(user.username, 'product_id_1');

        // When the user logs out and logs back in
        await SAUCEDEMOPage.logout();
        await SAUCEDEMOPage.login(user.username, user.password);

        // And navigates to the cart page
        await SAUCEDEMOPage.navigate(ROUTES.CART_ROUTE);

        // Then the previously added items should persist
        await SAUCEDEMOPage.assertCartContainsItem(user.username, 'product_id_1');
    });

    // Scenario: Acesso ao inventário sem autenticação (Verificação de Restrição)
    test('Acesso ao inventário sem autenticação deve ser bloqueado', async () => {
        // Given Usuário não autenticado
        await SAUCEDEMOPage.clearSession(); // Ensure no session exists

        // When Tenta acessar /inventory.html
        const result = await SAUCEDEMOPage.navigateTo(ROUTES.INVENTORY_ROUTE);

        // Then Deve ser bloqueado e receber erro de acesso
        await expect(result).toHaveError(ALERT_MESSAGES.ACCESS_DENIED);
    });

    // Scenario: Login falho com Username inválido
    test('Login com Username inexistente deve exibir erro de credenciais inválidas', async () => {
        // Given Usuário sem registro
        const invalidUser = 'nonexistent_user';
        const password = user.password;

        // When Insere Username e Password
        const result = await SAUCEDEMOPage.login(invalidUser, password);

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await expect(result).toHaveError(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario: Login falho com senha incorreta
    test('Login com senha inválida deve exibir erro de credenciais inválidas', async () => {
        // Given Usuário com Username válido
        const validUser = user.username;
        const wrongPassword = 'wrong_password';

        // When Insere Username e Password incorretos
        const result = await SAUCEDEMOPage.login(validUser, wrongPassword);

        // Then Deve exibir mensagem de erro de credenciais inválidas
        await expect(result).toHaveError(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario: Login bem-sucedido com credenciais válidas (Usuário Padrão)
    test('Login de um usuário padrão deve redirecionar para a página principal/inventário', async () => {
        // Given Usuário com credenciais válidas
        const validUser = user.username;
        const validPassword = user.password;

        // When Insere Username e Password corretamente
        const result = await SAUCEDEMOPage.login(validUser, validPassword);

        // Then Deve ser redirecionado para a página principal/inventário
        await expect(result).toHaveURL(ROUTES.INVENTORY_ROUTE);
    });

    // Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo)
    test('Adicionar um produto ao carrinho deve atualizar o contador', async () => {
        // Given Usuário autenticado e no inventário
        await SAUCEDEMOPage.login(user.username, user.password);
        await SAUCEDEMOPage.navigateTo(ROUTES.INVENTORY_ROUTE);

        // When Seleciona um produto e Clica em 'Adicionar ao Carrinho'
        const success = await SAUCEDEMOPage.addToCart('product_id_2');

        // Then Deve receber feedback positivo de sucesso e o contador do carrinho deve ser atualizado
        await expect(success).toBe(true);
        await SAUCEDEMOPage.assertCartItemCount(); // Assumes a method to check cart count
    });

    // Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo)
    test('Ajustar a quantidade de um item no carrinho deve refletir o novo valor', async () => {
        // Given Um item está no carrinho com quantidade X
        const initialQuantity = 1;
        await SAUCEDEMOPage.addItemToCart(user.username, 'product_id_3'); // Add item first

        // When Altera a quantidade para Y (onde Y é válido)
        const newQuantity = 5;
        await SAUCEDEMOPage.updateCartQuantity('product_id_3', newQuantity);

        // And Confirma a alteração
        await SAUCEDEMOPage.confirmUpdate();

        // Then A quantidade exibida deve ser Y
        const currentQuantity = await SAUCEDEMOPage.getCartItemQuantity('product_id_3');
        await expect(currentQuantity).toBe(newQuantity);
    });

    // Scenario: Regressão: Fluxo completo de compra (Smoke Test)
    test('Fluxo de compra completo deve navegar para a tela de checkout', async () => {
        // Given Usuário autenticado e com itens no carrinho
        await SAUCEDEMOPage.login(user.username, user.password);
        await SAUCEDEMOPage.addItemToCart(user.username, 'product_id_1');

        // When Inicia o processo de checkout
        const checkoutResult = await SAUCEDEMOPage.startCheckout();

        // Then Deve navegar para a tela de checkout
        await expect(checkoutResult).toHaveURL(ROUTES.CHECKOUT_ROUTE);
    });

    // Scenario: Verificar acesso ao inventário sem autenticação (Security)
    test('Tentar acessar /inventory.html sem login deve redirecionar ou exibir erro', async () => {
        // Given Usuário não autenticado
        await SAUCEDEMOPage.clearSession(); // Ensure no session exists

        // When Navega para /inventory.html
        const result = await SAUCEDEMOPage.navigateTo(ROUTES.INVENTORY_ROUTE);

        // Then Deve ser redirecionado para a página de login ou exibir mensagem de erro
        if (result.url().includes(ROUTES.LOGIN_ROUTE)) {
            // Success: Redirected to login page
            await expect(result).toHaveURL(ROUTES.LOGIN_ROUTE);
        } else if (result.text().includes(ALERT_MESSAGES.ACCESS_DENIED)) {
            // Success: Displayed error message on the inventory page
            await expect(result).toContainText(ALERT_MESSAGES.ACCESS_DENIED);
        } else {
            // Fallback assertion if behavior is unexpected (e.g., direct block)
            await expect(result).not.toHaveURL(ROUTES.INVENTORY_ROUTE);
        }
    });
});