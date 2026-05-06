import { chromium } from 'playwright';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let browser;
    let context;
    let page;
    let inventoryPage;
    let genericFactory;

    // Setup for Playwright context
    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        context = await browser.newContext();
        page = await context.newPage();
    });

    // Setup Page Objects and Factory
    beforeEach(async () => {
        // Initialize page objects based on the context
        inventoryPage = new SAUCEDEMOPage(page);
        genericFactory = new GenericFactory(context);

        // Standard login setup (assuming this is required for most tests)
        await genericFactory.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);
        await inventoryPage.navigate(); // Navigate to the main feature page
    });

    afterAll(async () => {
        await browser.close();
    });

    // --- Scenario 1: Boundary Test: Edge Case Data Type Handling ---
    test('Boundary Test: Edge Case Data Type Handling', async () => {
        // Given the user is entering data into a numerical field
        // When the user inputs non-numeric characters (e.g., 'abc')
        await inventoryPage.enterNonNumericData('some_numeric_field', 'abc');

        // Then the system should handle the input gracefully, either rejecting it or coercing it to an error state
        await inventoryPage.assertInputHandlingGracefully();
    });

    // --- Scenario 2: Negative Test: Empty Field Submission ---
    test('Negative Test: Empty Field Submission', async () => {
        // Given the user is on the data submission screen
        // When the user attempts to submit without filling required fields
        await inventoryPage.attemptSubmissionWithoutFields();

        // Then validation errors should appear next to all missing mandatory fields
        await inventoryPage.assertValidationErrorsAreVisible();
    });

    // --- Scenario 3: Access Test: Session Timeout Handling ---
    test('Access Test: Session Timeout Handling', async () => {
        // Given the user has an active session (Setup handled by beforeEach)
        // When the user remains inactive for the defined timeout period
        await inventoryPage.simulateInactivity(ENVIRONMENTS.SESSION_TIMEOUT);

        // And attempts to perform a sensitive action
        await inventoryPage.attemptSensitiveAction();

        // Then the system should force a re-login
        await inventoryPage.assertReauthenticationRequired();
    });

    // --- Scenario 4: Verificar tratamento de entrada negativa (Input Validation) ---
    test('Verificar tratamento de entrada negativa (Input Validation)', async () => {
        // Given Usuário padrão logado (Setup handled by beforeEach)
        // When Tenta submeter o formulário com campos obrigatórios vazios
        await inventoryPage.attemptSubmissionWithEmptyFields();

        // Then O sistema deve retornar uma mensagem de erro válida
        await inventoryPage.assertErrorMessageDisplayed(ALERT_MESSAGES.VALIDATION_ERROR);
    });

    // --- Scenario 5: Verificação de erro em comunicação externa (Regra de Negócio) ---
    test('Verificação de erro em comunicação externa (Regra de Negócio)', async () => {
        // Given O serviço externo está simulando falha de resposta
        await inventoryPage.simulateExternalServiceFailure();

        // When Executa a funcionalidade que depende desse serviço
        await inventoryPage.executeDependentFunctionality();

        // Then O sistema deve tratar o erro e exibir uma mensagem de indisponibilidade
        await inventoryPage.assertServiceUnavailableMessage();
    });

    // --- Scenario 6: Fluxo de uso positivo: Execução básica da funcionalidade ---
    test('Fluxo de uso positivo: Execução básica da funcionalidade', async () => {
        // Given Usuário padrão logado (Setup handled by beforeEach)
        // When Inicia o processo da feature
        await inventoryPage.startProcess();

        // And Fornece todos os parâmetros exigidos
        await inventoryPage.provideAllRequiredParameters();

        // Then O processo deve ser concluído com sucesso
        await inventoryPage.assertProcessCompletedSuccessfully();
    });

    // --- Scenario 7: Verificação de persistência de dados após o uso positivo (Regressão) ---
    test('Verificação de persistência de dados após o uso positivo (Regressão)', async () => {
        const newTestData = { item: 'TestItem', quantity: 10 };

        // Given Usuário padrão logado (Setup handled by beforeEach)
        // When Executa o fluxo positivo com novos dados
        await inventoryPage.executePositiveFlowWithNewData(newTestData);

        // And Verifica a visualização dos dados posteriormente
        await inventoryPage.verifyDataVisualization(newTestData);

        // Then Os dados devem ser persistidos no banco de dados
        await inventoryPage.assertDataPersistedInDatabase();
    });

    // --- Scenario 8: Verificação de estado após falha de transação (Regressão) ---
    test('Verificação de estado após falha de transação (Regressão)', async () => {
        const initialData = { item: 'InitialItem', quantity: 5 };
        const failedTransactionData = { item: 'FailedItem', quantity: 1 };

        // Given Uma transação foi iniciada com dados válidos
        await inventoryPage.initiateTransaction(initialData);

        // When A transação é interrompida por um erro interno
        await inventoryPage.interruptTransactionWithError();

        // Then O sistema deve reverter o estado para o anterior (rollback)
        await inventoryPage.assertStateRolledBackToInitial(initialData);
    });

    // --- Scenario 9: Teste de acesso de usuário não autenticado (Segurança) ---
    test('Teste de acesso de usuário não autenticado (Segurança)', async () => {
        // Given O usuário não está logado
        await page.goto(ROUTES.INVENTORY_ROUTE); // Direct navigation without login

        // When Tenta acessar a URL da feature
        // Then Deve ser redirecionado para a tela de login
        await page.waitForURL(ROUTES.LOGIN_ROUTE);

        // Assertion: Check if the login screen elements are visible
        await page.getByRole('heading', { name: 'Login' }).waitFor({ state: 'visible' });
    });

    // --- Scenario 10: Verificação de acesso restrito (Segurança/Acesso) ---
    test('Verificação de acesso restrito (Segurança/Acesso)', async () => {
        // Given Usuário padrão logado (Setup handled by beforeEach)
        // When Tenta acessar a URL da feature diretamente (sem passar pelo fluxo correto)
        await page.goto(ROUTES.INVENTORY_ROUTE);

        // Then Deve receber um erro de permissão 403
        await page.waitForResponse(response => response.status() === 403);

        // Assertion: Check the status code of the final request
        const response = await page.waitForResponse();
        await response.exposeFunction('getStatusCode', () => response.status());
        
        await expect(response.exposeFunction('getStatusCode')).toBe(403);
    });
});