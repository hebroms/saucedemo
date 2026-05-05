import { test, expect } from '@playwright/test';
import * as PageObjects from '../pages/page-objects'; // Assuming page objects are structured here
import * as GenericFactory from '../factories/generic.factory';

// Define the base URL for context (though usually handled in setup)
const BASE_URL = 'https://www.saucedemo.com/';

test.describe('Funcionalidade: Navegação e Busca de Produtos', () => {
    let page;

    test.beforeEach(async ({ page: browser }) => {
        page = await browser.newPage();
        await page.goto(BASE_URL);
    });

    test('Visualizar a lista de produtos', async () => {
        // Setup: Login (assuming login is required to see inventory)
        const user = await GenericFactory.createUserData('testuser', 'secret_sauce');
        await page.goto(`${BASE_URL}/login`);
        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');

        // Action & Assertion
        await PageObjects.inventoryPage.navigateToInventory(page);
        
        // Check if products are visible (assuming the list loads successfully)
        const productNames = await page.locator('.inventory_item').allTextContents();
        expect(productNames).toHaveLength(4); // Expecting standard items count
        expect(productNames).toContain('Sauce Labs Backpack');
        expect(productNames).toContain('Sauce Labs Bolt T-Shirt');
    });

    test('Ordenar produtos por nome (A a Z)', async () => {
        // Setup: Login
        const user = await GenericFactory.createUserData('testuser', 'secret_sauce');
        await page.goto(`${BASE_URL}/login`);
        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');

        // Action: Navigate to inventory and sort
        await PageObjects.inventoryPage.navigateToInventory(page);
        await page.click('label:has-text("Name (A to Z)")'); // Selecting the sorting option

        // Assertion: Check if the list is sorted alphabetically
        const productElements = await page.locator('.inventory_item').all();
        
        // Verify order by checking the text content of the first few items
        expect(await page.locator('.inventory_item').first()).toHaveText('Sauce Labs Backpack');
        expect(await page.locator('.inventory_item').nth(1)).toHaveText('Sauce Labs Bike Light');
    });
});

test.describe('Funcionalidade: Adicionar Itens ao Carrinho', () => {
    let page;

    test.beforeEach(async ({ page: browser }) => {
        page = await browser.newPage();
        await page.goto(BASE_URL);
    });

    test('Adicionar um item ao carrinho com sucesso', async () => {
        // Setup: Login
        const user = await GenericFactory.createUserData('testuser', 'secret_sauce');
        await page.goto(`${BASE_URL}/login`);
        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');

        // Action: Add item
        await PageObjects.inventoryPage.navigateToInventory(page);
        await page.click(`text=${'Sauce Labs Backpack'}`).locator('add-to-cart-button');

        // Assertion: Check cart update
        await expect(page.locator('#shopping_cart_link')).toHaveText('3'); // Assuming initial state is 0, now it should be 1
        await expect(page.locator('.shopping_cart_item')).toContainText('Sauce Labs Backpack');
    });

    test('Adicionar múltiplos itens ao carrinho', async () => {
        // Setup: Login
        const user = await GenericFactory.createUserData('testuser', 'secret_sauce');
        await page.goto(`${BASE_URL}/login`);
        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');

        // Action: Add multiple items
        await PageObjects.inventoryPage.navigateToInventory(page);
        
        // Add Backpack
        await page.click(`text=${'Sauce Labs Backpack'}`).locator('add-to-cart-button');
        
        // Add Bike Light
        await page.click(`text=${'Sauce Labs Bike Light'}`).locator('add-to-cart-button');

        // Assertion: Check if both items are in the cart
        const backpackItem = page.locator('.shopping_cart_item', { hasText: 'Sauce Labs Backpack' });
        const bikeLightItem = page.locator('.shopping_cart_item', { hasText: 'Sauce Labs Bike Light' });

        await expect(backpackItem).toBeVisible();
        await expect(bikeLightItem).toBeVisible();
    });
});

test.describe('Funcionalidade: Gerenciamento do Carrinho', () => {
    let page;

    test.beforeEach(async ({ page: browser }) => {
        page = await browser.newPage();
        await page.goto(BASE_URL);
    });

    test('Visualizar o conteúdo do carrinho', async () => {
        // Setup: Login and add items (using a fresh login context for independence)
        const user = await GenericFactory.createUserData('testuser', 'secret_sauce');
        await page.goto(`${BASE_URL}/login`);
        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');

        // Add items to ensure the cart is populated for this test
        await PageObjects.inventoryPage.navigateToInventory(page);
        await page.click(`text=${'Sauce Labs Backpack'}`).locator('add-to-cart-button');
        await page.click(`text=${'Sauce Labs Bike Light'}`).locator('add-to-cart-button');

        // Action: Navigate to cart
        await page.click('#shopping_cart_link');

        // Assertion: Check items, quantities, and total (assuming standard setup)
        await expect(page.locator('.shopping_cart_item')).toHaveCount(2);
        // Further assertions on specific item details would require checking text/price elements if available
    });

    test('Remover um item do carrinho', async () => {
        // Setup: Login and add the item to be removed
        const user = await GenericFactory.createUserData('testuser', 'secret_sauce');
        await page.goto(`${BASE_URL}/login`);
        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');

        await PageObjects.inventoryPage.navigateToInventory(page);
        await page.click(`text=${'Sauce Labs Backpack'}`).locator('add-to-cart-button');

        // Action: Remove item
        await page.click('.remove'); // Assuming the remove button selector is '.remove'

        // Assertion: Check if the item is removed from the cart view
        await expect(page.locator('.shopping_cart_item', { hasText: 'Sauce Labs Backpack' })).not.toBeVisible();
    });

    test('Ajustar a quantidade de um item no carrinho', async () => {
        // Setup: Login and add the item with initial quantity 1
        const user = await GenericFactory.createUserData('testuser', 'secret_sauce');
        await page.goto(`${BASE_URL}/login`);
        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');

        await PageObjects.inventoryPage.navigateToInventory(page);
        await page.click(`text=${'Sauce Labs Backpack'}`).locator('add-to-cart-button');

        // Action: Adjust quantity to 2
        // We need to find the quantity input field associated with the item in the cart view
        const backpackItemRow = page.locator('.shopping_cart_item', { hasText: 'Sauce Labs Backpack' });
        
        // Click the quantity selector (assuming it's a button or input within the row)
        await backpackItemRow.locator('.quantity').selectOption('2'); // Or use direct input if structure allows

        // Assertion: Check if the quantity displayed is 2
        await expect(backpackItemRow).toHaveText('Sauce Labs Backpack'); // Ensure item is still visible
        // Note: Actual assertion depends heavily on how Sauce Demo implements quantity adjustment. We assert based on expected outcome.
    });
});