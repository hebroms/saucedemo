import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('Saucedemo 3 Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    beforeEach(async () => {
        // Initialize Page Objects and Factory
        loginPage = new SAUCEDEMOPage();
        inventoryPage = new SAUCEDEMOPage();
        genericFactory = new GenericFactory();

        // Setup common environment variables if needed for setup (assuming login is required)
        const env = ENVIRONMENTS;
    });

    // Scenario: Verificar carregamento inicial da feature saucedemo 3 (Smoke Test) [smoke] [high]
    test('Verificar carregamento inicial da feature saucedemo 3', async () => {
        await loginPage.login(env.username, env.password);
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);
        await inventoryPage.assertLoaded();
    });

    // Scenario: Verificar limite inferior de entrada (Boundary Testing) [boundary] [medium]
    test('Testar o limite mínimo permitido para um parâmetro', async () => {
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);
        await inventoryPage.setParamY(1); // Assuming setParamY is a Page Object method
        await inventoryPage.submit();
        await inventoryPage.assertSuccess();
    });

    // Scenario: Verificar limite superior de entrada (Boundary Testing) [boundary] [medium]
    test('Testar o limite máximo permitido para um parâmetro', async () => {
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);
        await inventoryPage.setParamX(99999); // Assuming setParamX is a Page Object method
        await inventoryPage.submit();
        await inventoryPage.assertSuccess();
    });

    // Scenario: Verificar comportamento com perfil de usuário diferente (Regra de Negócio) [business-rule] [medium]
    test('Execução da feature por um perfil de usuário restrito', async () => {
        const restrictedUser = 'Leitor';
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD); // Assuming login handles profile selection or we switch context
        
        // Simulate switching to a restricted user context (implementation detail hidden in PO)
        await loginPage.switchUser(restrictedUser); 

        // Attempt action requiring 'Editor' permission
        await inventoryPage.attemptEditAction(); 

        // Assert blockage based on expected alert message
        await inventoryPage.assertBlockedWithMessage(ALERT_MESSAGES.PERMISSION_DENIED);
    });

    // Scenario: Verificação da exibição correta das regras de negócio (Regra de Negócio) [business-rule] [medium]
    test('Exibir a regra de negócio baseada no valor inserido', async () => {
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);

        // Action: Insert value that triggers a specific rule (e.g., > 100)
        await inventoryPage.setParamValue(150); 
        
        // Action: Visualize the result
        const result = await inventoryPage.viewResult();

        // Assert: Message must match the associated business rule
        await expect(result).toContain('Valor acima do limite permitido');
    });

    // Scenario: Verificar tratamento de dados mal formatados (Negativo) [negative] [medium]
    test('Inserir caracteres inválidos nos campos numéricos', async () => {
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);

        // Action: Insert text into a field expecting numbers
        await inventoryPage.setParamY('abc'); 
        await inventoryPage.submit();

        // Assert: System must reject the entry with format error
        await expect(inventoryPage.getErrorMessage()).toContain('Erro de formato');
    });

    // Scenario: Verificar performance sob carga moderada (Smoke/Performance) [smoke] [medium]
    test('Medir o tempo de resposta da funcionalidade', async () => {
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);

        // Action: Execute the main operation
        const startTime = Date.now();
        await inventoryPage.executeMainOperation();
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        // Assert: Response time must be less than 3 seconds
        await expect(inventoryPage.getResponseTime()).toBeLessThan(3);
    });

    // Scenario: Negative Test: Login with Invalid Password (Business Rule Validation) [negative] [high]
    test('Login attempt with incorrect password', async () => {
        const invalidPassword = 'wrongpassword123';
        await loginPage.login(ENVIRONMENTS.USERNAME, invalidPassword);

        // Assert: Error message stating 'Invalid credentials' should be displayed
        await expect(loginPage.getErrorMessage()).toContain(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    // Scenario: Negative Test: Missing Required Field (Checkout) [negative] [high]
    test('Attempting to proceed to checkout without shipping address', async () => {
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);
        
        // Setup: Have items in the cart (assuming a method exists for this setup)
        await inventoryPage.addItemToCart(); 

        // Action: Attempt to click Checkout without filling details
        await inventoryPage.attemptCheckoutWithoutDetails();

        // Assert: Error message prompting for missing fields must appear
        await expect(inventoryPage.getErrorMessage()).toContain('Campos obrigatórios não preenchidos');
    });

    // Scenario: Positive Test: Clear Error Message Consistency [positive] [high]
    test('Verifying consistent error messaging across forms', async () => {
        await loginPage.login(ENVIRONMENTS.USERNAME, ENVIRONMENTS.PASSWORD);

        // Action 1: Wrong password
        await inventoryPage.submitWithError('password', 'invalid');
        const error1 = await inventoryPage.getErrorMessage();
        await expect(error1).toContain(ALERT_MESSAGES.INVALID_CREDENTIALS);

        // Action 2: Missing field (e.g., during checkout attempt)
        await inventoryPage.attemptCheckoutWithoutDetails();
        const error2 = await inventoryPage.getErrorMessage();
        await expect(error2).toContain('Campos obrigatórios não preenchidos');

        // Assert: All resulting error messages must follow the defined system standards (implicitly checked by asserting specific expected strings)
        expect(error1).toMatch(/Invalid credentials/);
        expect(error2).toMatch(/Campos obrigatórios não preenchidos/);
    });
});