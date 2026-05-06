import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('Saucedemo Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let factory: GenericFactory;

    beforeEach(async () => {
        factory = new GenericFactory();
        loginPage = new SAUCEDEMOPage(factory);
        inventoryPage = new SAUCEDEMOPage(factory);
    });

    // Scenario 1: Verificar carregamento inicial da feature saucedemo 3 (Smoke Test)
    test('Verificar o acesso à página principal', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();
        await inventoryPage.assertLoaded();
    });

    // Scenario 2: Verificar limite inferior de entrada (Boundary Testing - Min)
    test('Testar o limite mínimo permitido para um parâmetro', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();

        // Assuming the page object has methods to interact with specific fields based on context
        await inventoryPage.enterMinBoundary('Y', 0); // Example interaction method
        await inventoryPage.processInput();
        await inventoryPage.assertSuccess();
    });

    // Scenario 3: Verificar limite superior de entrada (Boundary Testing - Max)
    test('Testar o limite máximo permitido para um parâmetro', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();

        // Assuming the page object has methods to interact with specific fields based on context
        await inventoryPage.enterMaxBoundary('X', 99999); // Example interaction method
        await inventoryPage.processInput();
        await inventoryPage.assertSuccess();
    });

    // Scenario 4: Verificar comportamento com perfil de usuário diferente (Regra de Negócio - Restriction)
    test('Execução da feature por um perfil de usuário restrito', async () => {
        const restrictedUser = 'Leitor';
        await loginPage.login(restrictedUser, ENVIRONMENTS.DEFAULT_PASSWORD);

        // Attempting an action requiring 'Editor' permission
        await inventoryPage.attemptEditorAction(); 
        
        // Expectation based on business rule
        await inventoryPage.assertBlocked('Permission Denied');
    });

    // Scenario 5: Verificação da exibição correta das regras de negócio (Regra de Negócio - Display)
    test('Exibir a regra de negócio baseada no valor inserido', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();

        // Simulate input that triggers the rule (e.g., value > 100)
        await inventoryPage.enterValueForRule('X', 150); 
        await inventoryPage.viewResult();

        // Assertion based on expected message
        await inventoryPage.assertMessageMatches(ALERT_MESSAGES.RULE_HIGH_VALUE);
    });

    // Scenario 6: Verificar tratamento de dados mal formatados (Negativo - Invalid Input)
    test('Inserir caracteres inválidos nos campos numéricos', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();

        // Simulate inputting non-numeric text into a numeric field
        await inventoryPage.enterInvalidText('Y', 'abc'); 
        await inventoryPage.processInput();

        // Expectation based on error handling
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.FORMAT_ERROR);
    });

    // Scenario 7: Verificar performance sob carga moderada (Smoke/Performance)
    test('Medir o tempo de resposta da funcionalidade', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();

        // Execute the main operation
        const startTime = Date.now();
        await inventoryPage.executeMainOperation();
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        // Assertion based on performance requirement
        await inventoryPage.assertResponseTimeLessThan(3); // Assert time < 3 seconds
    });

    // Scenario 8: Negative Test: Login with Invalid Password (Business Rule Validation)
    test('Login attempt with incorrect password', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, 'wrongpassword');

        // Expectation based on error message
        await loginPage.assertErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario 9: Negative Test: Missing Required Field (Checkout)
    test('Attempting to proceed to checkout without shipping address', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();

        // Simulate attempting checkout without filling mandatory fields
        await inventoryPage.attemptCheckoutWithoutDetails();

        // Expectation based on required field prompt
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.MISSING_SHIPPING_DETAILS);
    });

    // Scenario 10: Positive Test: Clear Error Message Consistency (Positive - Consistency)
    test('Verifying consistent error messaging across forms', async () => {
        await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASSWORD);
        await inventoryPage.navigate();

        // Perform multiple invalid actions sequentially
        await inventoryPage.attemptInvalidAction('wrong_password'); // Test 1: Wrong password
        await inventoryPage.attemptCheckoutWithoutDetails();       // Test 2: Missing field

        // Assert that all resulting messages adhere to system standards
        await inventoryPage.assertErrorConsistency(ALERT_MESSAGES);
    });
});