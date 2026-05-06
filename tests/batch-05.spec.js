import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

describe('SauceDemo 3 Feature Tests', () => {
    let browser;
    let page;
    let saucedemoPage;

    // Setup: Instantiate the browser and page before each test
    beforeEach(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        saucedemoPage = new SAUCEDEMOPage(page);
        await page.goto('https://www.saucedemo.com/');
    });

    // Test 1: Smoke Test - Verificar carregamento inicial
    test('Verificar carregamento inicial da feature saucedemo 3 (Smoke Test)', async () => {
        // Given Usuário padrão está logado (Assumed setup via factory/login flow)
        await GenericFactory.loginAs('standard_user');

        // When Navega para a página de entrada da feature
        await saucedemoPage.navigateToFeatureEntry();

        // Then A página deve carregar sem erros
        await expect(page).toHaveURL(/.*saucedemo/); // Basic check for navigation success
        expect(page.status()).toBe(200);
    });

    // Test 2: Boundary Testing - Limite inferior de entrada (Mínimo)
    test('Testar o limite mínimo permitido para um parâmetro', async () => {
        // Given Usuário padrão logado
        await GenericFactory.loginAs('standard_user');

        const minX = 0; // Assuming minimum allowed value is 0 or a very small number based on context, using 0 for boundary test simplicity if applicable.
        const minY = 1; // Setting a minimal positive integer for demonstration

        // When Insere o valor mínimo permitido no campo Y
        await saucedemoPage.enterValue(minX, minY);

        // Then O sistema deve aceitar a entrada e processar corretamente
        await expect(page.locator('#login-error')).toBeHidden(); // Check if processing succeeded (assuming success hides errors)
        await expect(page.locator('.error-message')).toHaveText(/Entrada válida/i); // Assuming success message is displayed
    });

    // Test 3: Boundary Testing - Limite superior de entrada (Máximo)
    test('Testar o limite máximo permitido para um parâmetro', async () => {
        // Given Usuário padrão logado
        await GenericFactory.loginAs('standard_user');

        const maxX = 999; // Assuming a high boundary value for demonstration
        const maxY = 100;

        // When Insere o valor máximo permitido no campo X
        await saucedemoPage.enterValue(maxX, maxY);

        // Then O sistema deve aceitar a entrada e processar corretamente
        await expect(page).toHaveURL(/.*saucedemo/); // Check if navigation/processing succeeded
        await expect(page.locator('.error-message')).toBeHidden();
    });

    // Test 4: Business Rule - Perfil restrito
    test('Execução da feature por um perfil de usuário restrito', async () => {
        // Given Usuário com perfil 'Leitor' logado
        await GenericFactory.loginAs('reporter_user'); // Assuming 'reporter_user' maps to 'Leitor' role

        // When Tenta executar a funcionalidade que exige permissão de 'Editor'
        await saucedemoPage.attemptRestrictedAction('editor_permission');

        // Then A funcionalidade deve ser bloqueada
        await expect(page.locator('.permission-denied')).toBeVisible();
        await expect(page.locator('.success-message')).toBeHidden();
    });

    // Test 5: Business Rule - Regra de negócio baseada no valor
    test('Exibir a regra de negócio baseada no valor inserido', async () => {
        // Given O usuário insere um valor que aciona uma regra específica (Ex: Valor > 100)
        await GenericFactory.loginAs('standard_user');

        const triggeringValue = 150; // Value > 100

        // When Visualiza o resultado da operação
        await saucedemoPage.performOperationWithValue(triggeringValue);

        // Then A mensagem exibida deve corresponder à regra de negócio associada
        await expect(page.locator('.rule-message')).toHaveText(/Valor acima do limite permitido/i);
    });
});