import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('Saucedemo 3 Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let factory: GenericFactory;

    beforeEach(async () => {
        // Initialize Page Objects
        loginPage = new SAUCEDEMOPage(await page); // Assuming 'page' is available in scope or passed contextually
        inventoryPage = new SAUCEDEMOPage(await page); 
        factory = new GenericFactory();

        // Setup common login state for scenarios requiring a logged-in user
        await factory.login(loginPage, ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);
    });

    // Scenario: Verificar carregamento inicial da feature saucedemo 3 (Smoke Test) [smoke] [high]
    test('Verificar carregamento inicial da feature saucedemo 3', async () => {
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);
        await inventoryPage.assertLoaded();
    });

    // Scenario: Verificar limite inferior de entrada (Boundary Testing) [boundary] [medium]
    test('Testar o limite mínimo permitido para um parâmetro', async () => {
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);
        await inventoryPage.enterMinValueInField('Y', 0); // Assuming 'Y' is the field and 0 is the minimum
        await inventoryPage.processInput();
        await inventoryPage.assertProcessingSuccess();
    });

    // Scenario: Verificar limite superior de entrada (Boundary Testing) [boundary] [medium]
    test('Testar o limite máximo permitido para um parâmetro', async () => {
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);
        await inventoryPage.enterMaxValueInField('X', 99999); // Assuming 'X' is the field and 99999 is the maximum
        await inventoryPage.processInput();
        await inventoryPage.assertProcessingSuccess();
    });

    // Scenario: Verificar comportamento com perfil de usuário diferente (Regra de Negócio) [business-rule] [medium]
    test('Execução da feature por um perfil de usuário restrito', async () => {
        // Setup user with 'Leitor' profile (This setup must be handled by the factory/loginPage methods)
        await factory.login(loginPage, ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD, 'Leitor'); 

        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);
        
        // Attempt action requiring 'Editor' permission
        await inventoryPage.attemptEditOperation(); 
        
        // Assertion: Functionality should be blocked
        await inventoryPage.assertBlockedMessage(ALERT_MESSAGES.PERMISSION_DENIED);
    });

    // Scenario: Verificação da exibição correta das regras de negócio (Regra de Negócio) [business-rule] [medium]
    test('Exibir a regra de negócio baseada no valor inserido', async () => {
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);

        // Action: Input value that triggers a specific rule (e.g., > 100)
        await inventoryPage.enterValueForRule('X', 150); 
        
        // Action: Visualize the result of the operation
        await inventoryPage.visualizeResult();

        // Assertion: Message must match the associated business rule
        await inventoryPage.assertMessageMatches(ALERT_MESSAGES.RULE_EXCEEDED_LIMIT);
    });

    // Scenario: Verificar tratamento de dados mal formatados (Negativo) [negative] [medium]
    test('Inserir caracteres inválidos nos campos numéricos', async () => {
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);

        // Action: Enter text in a field expecting numbers ('abc')
        await inventoryPage.enterInvalidTextInNumericField('Y', 'abc'); 
        
        // Assertion: System must reject the input with format error
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.INVALID_FORMAT);
    });

    // Scenario: Verificar performance sob carga moderada (Smoke/Performance) [smoke] [medium]
    test('Medir o tempo de resposta da funcionalidade', async () => {
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);

        // Action: Execute the main operation
        const startTime = Date.now();
        await inventoryPage.executeMainOperation();
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000; // Time in seconds

        // Assertion: Response time must be less than 3 seconds
        await inventoryPage.assertResponseTimeLessThan(3);
    });

    // Scenario: Negative Test: Login with Invalid Password (Business Rule Validation) [negative] [high]
    test('Login attempt with incorrect password', async () => {
        // Setup: Start on login page (assuming the Page Object handles navigation or state setup)
        await loginPage.navigateToLoginPage(); 

        // Action: Enter valid username and invalid password
        await loginPage.fillCredentials(ENVIRONMENTS.USERNAME, 'wrongpassword');
        await loginPage.submit();

        // Assertion: Error message stating 'Invalid credentials' should be displayed
        await loginPage.assertErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario: Negative Test: Missing Required Field (Checkout) [negative] [high]
    test('Attempting to proceed to checkout without shipping address', async () => {
        // Setup: Ensure user has items in the cart (handled by factory setup or specific page action)
        await inventoryPage.navigateToCheckout();

        // Action: Attempt to click Checkout without filling mandatory details
        await inventoryPage.clickCheckoutButton(); 
        
        // Assertion: Error message prompting for missing fields must appear
        await inventoryPage.assertErrorMessage(ALERT_MESSAGES.MISSING_REQUIRED_FIELDS);
    });

    // Scenario: Positive Test: Clear Error Message Consistency [positive] [high]
    test('Verifying consistent error messaging across forms', async () => {
        // Action 1: Attempt wrong password
        await loginPage.fillCredentials(ENVIRONMENTS.USERNAME, 'wrongpassword');
        await loginPage.submit();
        await loginPage.assertErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS);

        // Action 2: Attempt missing field during checkout (assuming we navigate to checkout)
        await inventoryPage.navigateToCheckout();
        await inventoryPage.clickCheckoutButton(); // Triggers missing field error

        // Assertion: All resulting error messages must follow the defined system standards
        const actualMessages = await loginPage.getAllDisplayedErrorMessages(); // Assuming a method exists to retrieve all errors
        
        expect(actualMessages).toContain(ALERT_MESSAGES.INVALID_CREDENTIALS);
        expect(actualMessages).toContain(ALERT_MESSAGES.MISSING_REQUIRED_FIELDS);
    });
});