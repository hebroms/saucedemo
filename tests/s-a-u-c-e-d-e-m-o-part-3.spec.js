import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('Saucedemo Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    beforeEach(async () => {
        // Initialize Page Objects and Factory
        loginPage = new SAUCEDEMOPage();
        inventoryPage = new SAUCEDEMOPage();
        genericFactory = new GenericFactory();
    });

    // Scenario: Verificar carregamento inicial da feature saucedemo 3 (Smoke Test) [smoke] [high]
    test('Verificar o acesso à página principal', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);
        await inventoryPage.navigate();
        await inventoryPage.assertLoaded();
    });

    // Scenario: Verificar limite inferior de entrada (Boundary Testing) [boundary] [medium]
    test('Testar o limite mínimo permitido para um parâmetro', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);
        await inventoryPage.enterMinBoundaryValue('Y', 0); // Assuming the PO method handles input logic
        await inventoryPage.processInput();
        await inventoryPage.assertProcessedSuccessfully();
    });

    // Scenario: Verificar limite superior de entrada (Boundary Testing) [boundary] [medium]
    test('Testar o limite máximo permitido para um parâmetro', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);
        await inventoryPage.enterMaxBoundaryValue('X', 99999); // Assuming the PO method handles input logic
        await inventoryPage.processInput();
        await inventoryPage.assertProcessedSuccessfully();
    });

    // Scenario: Verificar comportamento com perfil de usuário diferente (Regra de Negócio) [business-rule] [medium]
    test('Execução da feature por um perfil de usuário restrito', async () => {
        const restrictedUser = genericFactory.createUser('Leitor');
        await loginPage.login(restrictedUser.username, restrictedUser.password);

        // Attempt to execute a function requiring 'Editor' permission
        await inventoryPage.attemptRestrictedAction('Editor_Permission'); 
        
        // Assertion: The functionality should be blocked
        await inventoryPage.assertActionBlocked();
    });

    // Scenario: Verificação da exibição correta das regras de negócio (Regra de Negócio) [business-rule] [medium]
    test('Exibir a regra de negócio baseada no valor inserido', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);

        // Simulate input that triggers the rule (e.g., Value > 100)
        await inventoryPage.enterValueForRule('X', 150); 
        
        // Visualize the result of the operation
        const result = await inventoryPage.visualizeResult();
        
        // Assertion: Check if the displayed message matches the expected rule
        await expect(result).toContain('Valor acima do limite permitido');
    });

    // Scenario: Verificar tratamento de dados mal formatados (Negativo) [negative] [medium]
    test('Inserir caracteres inválidos nos campos numéricos', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);

        // Attempt to input text into a field expecting numbers
        await inventoryPage.enterNonNumericData('Y', 'abc'); 
        
        // Assertion: The system should reject the entry with a format error
        await inventoryPage.assertInputRejectedWithError('Y', ALERT_MESSAGES.FORMAT_ERROR);
    });

    // Scenario: Verificar performance sob carga moderada (Smoke/Performance) [smoke] [medium]
    test('Medir o tempo de resposta da funcionalidade', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);

        const startTime = Date.now();
        // Execute the main operation
        await inventoryPage.executeMainOperation();
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Assertion: The response time should be less than 3 seconds
        await expect(duration).toBeLessThan(3000);
    });

    // Scenario: Negative Test: Login with Invalid Password (Business Rule Validation) [negative] [high]
    test('Login attempt with incorrect password', async () => {
        // Given the user is on the login page (handled by initial state or explicit navigation if needed)
        await loginPage.navigateToLoginPage(); 

        // When the user enters valid username and invalid password
        await loginPage.fillCredentials(ENVIRONMENTS.STANDARD_USER, 'wrongpassword');
        
        // And clicks Login
        await loginPage.submit();
        
        // Then an error message stating 'Invalid credentials' should be displayed
        await expect(loginPage.getErrorMessage()).toBe(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario: Negative Test: Missing Required Field (Checkout) [negative] [high]
    test('Attempting to proceed to checkout without shipping address', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);
        
        // Given the user has items in the cart (Assume setup handles adding items)
        await inventoryPage.addItemToCart(); 

        // When the user attempts to click Checkout
        await inventoryPage.clickCheckout();
        
        // And does not fill in the mandatory shipping details
        await inventoryPage.skipShippingDetails();
        
        // Then an error message prompting for missing fields must appear
        await expect(inventoryPage.getErrorMessage()).toContain('Campos de endereço de envio são obrigatórios');
    });

    // Scenario: Positive Test: Clear Error Message Consistency [positive] [high]
    test('Verifying consistent error messaging across forms', async () => {
        await loginPage.login(ENVIRONMENTS.STANDARD_USER, ENVIRONMENTS.STANDARD_PASSWORD);

        // When the user attempts multiple invalid actions sequentially
        await inventoryPage.attemptMultipleInvalidActions(); 

        // Then all resulting error messages must follow the defined system standards
        const errors = await inventoryPage.getAllErrorMessages();
        
        // Assertion: Check if all messages are valid alerts (assuming ALERT_MESSAGES defines the standard)
        for (const message of errors) {
            await expect(message).toBeDefined();
            // Further assertion could check against a predefined list of allowed error types
        }
    });
});