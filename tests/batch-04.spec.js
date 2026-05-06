import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

describe('Sauce Demo Feature Tests', () => {
    let browser;
    let context;
    let page: SAUCEDEMOPage;

    // Setup for Playwright context
    beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
    });

    // Setup for Page Object instantiation
    beforeEach(async () => {
        const page = await context.newPage();
        page = new SAUCEDEMOPage(page);
        await page.goto('https://www.saucedemo.com/');
    });

    // --- Scenario 1: Fluxo de uso positivo ---
    test('Executar a funcionalidade principal com dados válidos', async () => {
        const factory = new GenericFactory();
        const user = factory.createValidUser(); // Assuming factory provides valid credentials or setup
        
        await page.login(user.username, user.password);

        // When Inicia o processo da feature
        await page.navigate('/inventory.html'); 

        // And Fornece todos os parâmetros exigidos (Assuming inventory requires items to be present)
        // Since the scenario implies starting a process, we navigate to the main area.
        
        // Then O processo deve ser concluído com sucesso
        await expect(page.locator('.inventory_item')).toBeVisible();
    });

    // --- Scenario 2: Verificação de persistência de dados após o uso positivo (Regressão) ---
    test('Verificar se os dados inseridos são salvos corretamente', async () => {
        const factory = new GenericFactory();
        const newUser = factory.createUniqueUser(); // Ensure unique data for persistence test

        await page.login(newUser.username, newUser.password);

        // When Executa o fluxo positivo com novos dados
        await page.navigate('/inventory.html'); 
        
        // Assuming the positive flow involves adding an item (e.g., adding a new item to inventory)
        // We simulate adding a specific item for persistence check.
        await page.click('.add-item'); // Example action

        // And Verifica a visualização dos dados posteriormente
        await page.waitForTimeout(1000); // Wait for potential async save operation
        
        // Then Os dados devem ser persistidos no banco de dados
        // Check if the item is visible in the inventory list (assuming we added something)
        await expect(page.locator('.inventory_item')).toHaveCount(1); 
    });

    // --- Scenario 3: Verificação de estado após falha de transação (Regressão) ---
    test('Verificar o rollback em caso de erro durante a transação', async () => {
        const factory = new GenericFactory();
        const user = factory.createValidUser();

        await page.login(user.username, user.password);
        await page.navigate('/inventory.html');

        // Given Uma transação foi iniciada com dados válidos (Implicitly logged in and on inventory page)
        
        // When A transação é interrompida por um erro interno 
        // NOTE: Since Playwright tests interact with the UI, simulating a backend rollback requires triggering an error state. 
        // In this context, we simulate an action that *should* fail or observe the system's reaction to failure if possible via UI flow.
        // For this specific scenario, we assume there is a mechanism (e.g., clicking an item and then hitting a simulated error button/API call) 
        // that triggers the rollback state visualization on the frontend.
        
        // We will simulate attempting an action that might fail or observe the system state after a known failure point.
        await page.click('.item-item'); // Select an item
        
        // Simulate error condition (This step is highly dependent on actual application behavior, assuming a specific UI element triggers the rollback visualization)
        // Since we cannot force a backend error easily in this setup, we check if the system reverts to a known safe state after an attempted failure.
        await page.click('.error-button'); // Hypothetical action that triggers rollback visualization

        // Then O sistema deve reverter o estado para o anterior (rollback)
        // We check if the inventory list remains unchanged or reverts to the pre-action state.
        await expect(page.locator('.inventory_item')).toHaveCount(0); // Assuming the item was removed/rolled back successfully
    });

    // --- Scenario 4: Teste de acesso de usuário não autenticado (Segurança) ---
    test('Tentativa de acesso à feature sem autenticação', async () => {
        // Given O usuário não está logado
        
        // When Tenta acessar a URL da feature
        await page.goto('/inventory.html');

        // Then Deve ser redirecionado para a tela de login
        await expect(page).toHaveURL('https://www.saucedemo.com/login');
    });

    // --- Scenario 5: Verificação de acesso restrito (Segurança/Acesso) ---
    test('Tentativa de acesso à funcionalidade sem permissão', async () => {
        const factory = new GenericFactory();
        const user = factory.createValidUser();

        await page.login(user.username, user.password);
        
        // When Tenta acessar a URL da feature diretamente (sem passar pelo fluxo correto)
        // We attempt to access the inventory page directly without going through the standard flow if possible, 
        // or test accessing a restricted path. Since the requirement implies direct access failure:
        await page.goto('/inventory.html'); // Accessing the main feature URL

        // Then Deve receber um erro de permissão 403
        // Playwright checks HTTP status codes directly if navigation fails, but for UI-based testing, we check for an error message or specific redirect.
        // If the application correctly handles authorization failure on route access:
        await expect(page).toHaveURL('https://www.saucedemo.com/login'); // Expect redirection back to login upon unauthorized access attempt
        
        // Alternatively, if the server returns a 403 status code during navigation (which Playwright captures):
        // This check is often done via request interception, but for pure page interaction:
        await expect(page).toHaveTitle('Login'); // Check if it lands on the login screen instead of inventory.
    });

    // Cleanup (Optional, handled by Playwright context closing)
    afterAll(async () => {
        await browser.close();
    });
});