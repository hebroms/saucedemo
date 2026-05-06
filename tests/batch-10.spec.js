import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as GenericFactory from '../factories/generic.factory';

describe('SauceDemo Feature Tests', () => {
    let browser;
    let page;

    // Setup for Playwright context
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    // Scenario: Adicionar item ao carrinho com sucesso (Fluxo Positivo)
    test('Adicionar um produto ao carrinho com sucesso', async () => {
        const factory = new GenericFactory();
        const user = await factory.login(page); // Assuming factory handles login setup
        await page.goto('https://www.saucedemo.com/');

        // Given Usuário autenticado e no inventário
        await page.goto(`${user.baseUrl}/inventory.html`);

        // When Seleciona um produto e Clica em 'Adicionar ao Carrinho'
        const item = await page.locator('#add-item');
        await item.click();

        // Then Deve receber feedback positivo de sucesso e o contador do carrinho deve ser atualizado
        await expect(page.locator('.success')).toBeVisible();
        await expect(page.locator('# Add to Cart')).toHaveText('3'); // Assuming initial state is 0, and after adding the first item it shows 3 (or similar based on factory setup)
    });

    // Scenario: Gerenciamento de quantidade no carrinho (Fluxo Positivo)
    test('Ajustar a quantidade de um item no carrinho', async () => {
        const factory = new GenericFactory();
        const user = await factory.login(page); // Assuming factory handles login setup
        await page.goto('https://www.saucedemo.com/');

        // Setup: Add an item first to ensure the cart exists
        await page.goto(`${user.baseUrl}/inventory.html`);
        await page.locator('#add-item').click();

        // Given Um item está no carrinho com quantidade X (X=1 initially)
        const initialQuantityText = await page.locator('.inventory_item').first().locator('.quantity').textContent();
        const initialQuantity = parseInt(initialQuantityText);

        // When Altera a quantidade para Y (onde Y é válido, e.g., 2)
        const newQuantity = 2;
        await page.locator('.quantity').nth(0).fill(String(newQuantity));

        // And Confirma a alteração
        await page.locator('#quantity').click(); // Assuming there is an explicit confirmation button or change event trigger

        // Then A quantidade exibida deve ser Y
        const finalQuantityText = await page.locator('.quantity').nth(0).textContent();
        expect(finalQuantityText).toBe(String(newQuantity));
    });

    // Scenario: Regressão: Fluxo completo de compra (Smoke Test)
    test('Fluxo de compra completo (Adicionar, Carrinho, Checkout simulado)', async () => {
        const factory = new GenericFactory();
        const user = await factory.login(page); // Assuming factory handles login setup
        await page.goto('https://www.saucedemo.com/');

        // Given Usuário autenticado e com itens no carrinho
        await page.goto(`${user.baseUrl}/inventory.html`);
        await page.locator('#add-item').click();
        await page.locator('#add-item').click(); // Add a second item

        // When Inicia o processo de checkout
        await page.locator('#shopping_cart_link').click();

        // Then Deve navegar para a tela de checkout
        await expect(page).toHaveURL(/checkout/);
    });

    // Scenario: Verificar acesso ao inventário sem autenticação (Security)
    test('Tentar acessar /inventory.html sem autenticação', async () => {
        // Given Usuário não autenticado
        await page.goto('https://www.saucedemo.com/inventory.html');

        // Then Deve ser redirecionado para a página de login ou exibir mensagem de erro
        // We check if the user is redirected to the login page or sees specific content (like error messages)
        const loginUrl = 'https://www.saucedemo.com/login';
        
        // Check if we are on the login page instead of inventory
        await expect(page).toHaveURL(loginUrl);
    });
});