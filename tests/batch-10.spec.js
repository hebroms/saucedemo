import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

describe('SAUCEDEMO8 Feature Tests', () => {
    let authPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;

    // Setup for authenticated tests
    beforeEach(async () => {
        authPage = new SAUCEDEMOPage();
        inventoryPage = new SAUCEDEMOPage();
        
        // Login setup (assuming generic factory handles credentials loading)
        await authPage.login(GenericFactory.getCredentials());
    });

    describe('Adicionar item ao carrinho com sucesso', () => {
        test('Deve adicionar um produto ao carrinho e atualizar o contador', async () => {
            const product = 'Sauce Labs Backpack';
            
            // 1. Selecionar um produto (Simulated by navigating or selecting from inventory)
            await inventoryPage.navigateToProduct(product);

            // 2. Clicar em 'Adicionar ao Carrinho'
            await authPage.addToCart();

            // 3. Assert: Feedback positivo e contador atualizado
            await expect(authPage.getCartItemCount()).toBeGreaterThan(0);
            await expect(authPage.getCartItemName()).toContain(product);
        });
    });

    describe('Gerenciamento de quantidade no carrinho', () => {
        test('Deve permitir alterar a quantidade de um item no carrinho com sucesso', async () => {
            const initialQuantity = 1;
            const newQuantity = 2;

            // Setup: Ensure an item is in the cart (assuming previous steps added one)
            await authPage.addToCart(); // Add first item
            
            // Get the item ID or name to target it for quantity change
            const itemName = await authPage.getCartItemName();

            // 1. Altera a quantidade para Y
            await authPage.changeQuantity(itemName, newQuantity);

            // 2. Confirma a alteração
            const updatedQuantity = await authPage.getCartItemQuantity(itemName);

            // 3. Assert: A quantidade exibida deve ser Y
            await expect(updatedQuantity).toBe(newQuantity);
        });
    });

    describe('Regressão: Fluxo completo de compra (Smoke Test)', () => {
        test('Deve navegar para a tela de checkout após adicionar itens', async () => {
            // Setup: Ensure items are in the cart
            await authPage.addToCart(); // Add first item
            
            // 1. Inicia o processo de checkout
            await authPage.initiateCheckout();

            // 2. Assert: Deve navegar para a tela de checkout
            await expect(authPage.isAtCheckoutPage()).toBe(true);
        });
    });

    describe('Verificação de segurança', () => {
        test('Deve redirecionar o usuário ao login ao tentar acessar /inventory.html sem autenticação', async () => {
            // Given: Usuário não autenticado (Setup handled by not logging in via beforeEach)
            
            // When: Navega para /inventory.html
            await inventoryPage.navigateTo('/inventory.html');

            // Then: Deve ser redirecionado para a página de login ou exibir mensagem de erro
            await expect(inventoryPage.isLoginPageDisplayed()).toBe(true);
        });
    });
});