import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('Saucedemo 3 Feature Tests', () => {
    let basePage: BasePage;
    let saucedemoPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    // Setup before each test
    beforeEach(async () => {
        // Initialize Page Objects
        basePage = new BasePage();
        saucedemoPage = new SAUCEDEMOPage(basePage);
        genericFactory = new GenericFactory();

        // Setup: Logged in as default user (assuming login is handled by a setup method)
        await basePage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
    });

    // Scenario 1: Verificar carregamento inicial da feature saucedemo 3 (Smoke Test)
    test('Verificar o acesso à página principal', async () => {
        await saucedemoPage.navigate(ROUTES.SAUCEDEMO_HOME);
        await saucedemoPage.assertLoaded();
    });

    // Scenario 2: Verificar limite inferior de entrada (Boundary Testing)
    test('Testar o limite mínimo permitido para um parâmetro', async () => {
        const minX = genericFactory.getMinBoundaryValue('X');
        await saucedemoPage.navigate(ROUTES.SAUCEDEMO_INPUT);
        await saucedemoPage.enterValue(minX, 'Y');
        await saucedemoPage.submit();
        await saucedemoPage.assertSuccess(); // Assuming success assertion exists for boundary test
    });

    // Scenario 3: Verificar limite superior de entrada (Boundary Testing)
    test('Testar o limite máximo permitido para um parâmetro', async () => {
        const maxX = genericFactory.getMaxBoundaryValue('X');
        await saucedemoPage.navigate(ROUTES.SAUCEDEMO_INPUT);
        await saucedemoPage.enterValue(maxX, 'X');
        await saucedemoPage.submit();
        await saucedemoPage.assertSuccess(); // Assuming success assertion exists for boundary test
    });

    // Scenario 4: Verificar comportamento com perfil de usuário diferente (Regra de Negócio)
    test('Execução da feature por um perfil de usuário restrito', async () => {
        const restrictedUser = 'Leitor';
        await basePage.login(restrictedUser, ENVIRONMENTS.DEFAULT_PASSWORD);

        // Attempt to execute functionality requiring 'Editor' permission
        await saucedemoPage.navigate(ROUTES.SAUCEDEMO_FEATURE_EDITOR);
        await saucedemoPage.attemptExecution(); // Assuming this method triggers the check
        
        // Expectation based on requirement: Functionality should be blocked
        await expect(saucedemoPage.getErrorMessage()).toBe(ALERT_MESSAGES.PERMISSION_DENIED);
    });

    // Scenario 5: Verificação da exibição correta das regras de negócio (Regra de Negócio)
    test('Exibir a regra de negócio baseada no valor inserido', async () => {
        const threshold = 100;
        const valueToTest = threshold + 1;

        await saucedemoPage.navigate(ROUTES.SAUCEDEMO_RULE_CHECK);
        await saucedemoPage.enterValue(valueToTest, 'InputField');
        await saucedemoPage.visualizeResult();

        // Expectation: Message must match the rule associated with > 100
        await expect(saucedemoPage.getDisplayedMessage()).toBe(ALERT_MESSAGES.VALUE_EXCEEDS_THRESHOLD);
    });

    // Scenario 6: Verificar tratamento de dados mal formatados (Negativo)
    test('Inserir caracteres inválidos nos campos numéricos', async () => {
        await saucedemoPage.navigate(ROUTES.SAUCEDEMO_INPUT);
        const invalidText = 'abc';

        await saucedemoPage.enterValue(invalidText, 'NumericField');
        await saucedemoPage.submit();

        // Expectation: System must reject input with format error
        await expect(saucedemoPage.getErrorMessage()).toContain('Invalid format');
    });

    // Scenario 7: Verificar performance sob carga moderada (Smoke/Performance)
    test('Medir o tempo de resposta da funcionalidade', async () => {
        await saucedemoPage.navigate(ROUTES.SAUCEDEMO_MAIN_OPERATION);
        const startTime = Date.now();

        await saucedemoPage.executeMainOperation();

        const duration = Date.now() - startTime;

        // Expectation: Response time must be less than 3 seconds (3000ms)
        await expect(saucedemoPage.getResponseTime()).toBeLessThan(3000);
    });

    // Scenario 8: Negative Test: Login with Invalid Password (Business Rule Validation)
    test('Login attempt with incorrect password', async () => {
        const invalidPassword = 'wrongpassword123';
        await basePage.navigate(ROUTES.LOGIN_PAGE);

        await basePage.fillCredentials(ENVIRONMENTS.DEFAULT_USER, invalidPassword);
        await basePage.clickLogin();

        // Expectation: Error message stating 'Invalid credentials' should be displayed
        await expect(basePage.getErrorMessage()).toBe(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario 9: Negative Test: Missing Required Field (Checkout)
    test('Attempting to proceed to checkout without shipping address', async () => {
        // Setup: Ensure user has items in cart (assuming setup handles this or we simulate it)
        await saucedemoPage.navigate(ROUTES.CHECKOUT_PAGE);

        // Attempt to click Checkout without filling mandatory details
        await saucedemoPage.clickCheckout();

        // Expectation: Error message prompting for missing fields must appear
        await expect(saucedemoPage.getErrorMessage()).toContain('Missing required shipping details');
    });

    // Scenario 10: Positive Test: Clear Error Message Consistency (Positive)
    test('Verifying consistent error messaging across forms', async () => {
        // Simulate multiple invalid actions sequentially
        await basePage.navigate(ROUTES.LOGIN_PAGE);

        // Action 1: Wrong password
        await basePage.fillCredentials(ENVIRONMENTS.DEFAULT_USER, 'badpassword');
        await basePage.clickLogin();
        const error1 = await basePage.getErrorMessage();
        
        // Assertion 1
        await expect(error1).toBe(ALERT_MESSAGES.INVALID_CREDENTIALS);

        // Action 2: Missing field (simulated on a different form, assuming the page object handles context)
        await saucedemoPage.navigate(ROUTES.CHECKOUT_PAGE);
        await saucedemoPage.clickCheckout();
        const error2 = await saucedemoPage.getErrorMessage();

        // Assertion 2: Check consistency against defined standards
        await expect(error2).toBe(ALERT_MESSAGES.MISSING_FIELD_ERROR);
    });
});