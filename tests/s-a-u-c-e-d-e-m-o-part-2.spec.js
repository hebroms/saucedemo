import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('SAUCEDEMO Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let dataPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    // Setup common objects and pages
    beforeAll(() => {
        loginPage = new SAUCEDEMOPage(setup); // Assuming setup handles context/browser initialization
        dataPage = new SAUCEDEMOPage(setup);
        genericFactory = new GenericFactory();
    });

    // Setup for login before each test
    beforeEach(async () => {
        await loginPage.login(ENVIRONMENTS.LOGIN_USER, ENVIRONMENTS.LOGIN_PASS);
        // Ensure we start on a known state if necessary, though most tests will navigate explicitly
    });

    // --- Scenario 1: Boundary Test: Edge Case Data Type Handling ---
    test('Boundary Test: Edge Case Data Type Handling', async () => {
        await dataPage.navigate(ROUTES.DATA_ENTRY);
        // Simulate inputting non-numeric characters into a numeric field
        await dataPage.fillNumericField('abc');
        // Assert that the system handles the input gracefully (e.g., displays an error)
        await dataPage.assertInputError(); 
    });

    // --- Scenario 2: Negative Test: Empty Field Submission ---
    test('Negative Test: Empty Field Submission', async () => {
        await dataPage.navigate(ROUTES.SUBMISSION);
        // Attempt to submit without filling required fields
        await dataPage.submitForm();
        // Assert that validation errors appear next to all missing mandatory fields
        await dataPage.assertValidationErrorsExist(); 
    });

    // --- Scenario 3: Access Test: Session Timeout Handling ---
    test('Access Test: Session Timeout Handling', async () => {
        // Given the user has an active session (covered by beforeEach)
        
        // When the user remains inactive for the defined timeout period
        await page.waitForTimeout(ENVIRONMENTS.SESSION_TIMEOUT_MS + 1000); 

        // And attempts to perform a sensitive action
        await dataPage.attemptSensitiveAction();
        
        // Then the system should force a re-login
        await dataPage.assertReauthenticationRequired();
    });

    // --- Scenario 4: Verificar tratamento de entrada negativa (Input Validation) ---
    test('Verificar tratamento de entrada negativa (Input Validation)', async () => {
        await dataPage.navigate(ROUTES.DATA_ENTRY);
        // Tentar executar com campos vazios ou inválidos
        await dataPage.fillAllFields(''); 
        
        // Then O sistema deve retornar uma mensagem de erro válida
        await dataPage.submitForm();
        await dataPage.assertErrorMessage(ALERT_MESSAGES.VALIDATION_ERROR);
    });

    // --- Scenario 5: Verificação de erro em comunicação externa (Regra de Negócio) ---
    test('Verificação de erro em comunicação externa (Regra de Negócio)', async () => {
        // Given O serviço externo está simulando falha de resposta
        await dataPage.simulateExternalServiceFailure();

        // When Executa a funcionalidade que depende desse serviço
        await dataPage.executeDependentFunctionality();

        // Then O sistema deve tratar o erro e exibir uma mensagem de indisponibilidade
        await dataPage.assertErrorMessage(ALERT_MESSAGES.SERVICE_UNAVAILABLE);
    });

    // --- Scenario 6: Fluxo de uso positivo: Execução básica da funcionalidade ---
    test('Fluxo de uso positivo: Execução básica da funcionalidade', async () => {
        await dataPage.navigate(ROUTES.DATA_ENTRY);
        // And Fornece todos os parâmetros exigidos
        await dataPage.fillAllFields(genericFactory.generateValidData()); 
        
        // Then O processo deve ser concluído com sucesso
        await dataPage.submitForm();
        await dataPage.assertSuccessMessage();
    });

    // --- Scenario 7: Verificação de persistência de dados após o uso positivo (Regressão) ---
    test('Verificação de persistência de dados após o uso positivo (Regressão)', async () => {
        const newData = genericFactory.generateNewData();
        
        // Given Usuário padrão logado (covered by beforeEach)
        
        // When Executa o fluxo positivo com novos dados
        await dataPage.navigate(ROUTES.DATA_ENTRY);
        await dataPage.fillAllFields(newData);
        await dataPage.submitForm();

        // And Verifica a visualização dos dados posteriormente
        await dataPage.navigate(ROUTES.VIEW_DATA);
        await dataPage.verifyDataPersistence(newData); 
    });

    // --- Scenario 8: Verificação de estado após falha de transação (Regressão) ---
    test('Verificação de estado após falha de transação (Regressão)', async () => {
        const transactionData = genericFactory.generateValidTransactionData();
        
        // Given Uma transação foi iniciada com dados válidos
        await dataPage.startTransaction(transactionData);

        // When A transação é interrompida por um erro interno
        await dataPage.simulateInternalErrorDuringTransaction();

        // Then O sistema deve reverter o estado para o anterior (rollback)
        await dataPage.assertTransactionRolledBack(); 
    });

    // --- Scenario 9: Teste de acesso de usuário não autenticado (Segurança) ---
    test('Teste de acesso de usuário não autenticado (Segurança)', async () => {
        // Given O usuário não está logado (resetting session state implicitly or explicitly)
        await page.goto(ROUTES.SOME_PROTECTED_ROUTE);

        // When Tenta acessar a URL da feature
        // Then Deve ser redirecionado para a tela de login
        await dataPage.assertRedirectToLogin(); 
    });

    // --- Scenario 10: Verificação de acesso restrito (Segurança/Acesso) ---
    test('Verificação de acesso restrito (Segurança/Acesso)', async () => {
        // Given Usuário padrão logado (assuming successful login via beforeEach)
        
        // When Tenta acessar a URL da feature diretamente (sem passar pelo fluxo correto)
        const restrictedRoute = ROUTES.RESTRICTED_FEATURE;
        await page.goto(restrictedRoute);

        // Then Deve receber um erro de permissão 403
        await dataPage.assertPermissionError403(); 
    });
});