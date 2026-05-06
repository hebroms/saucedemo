import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('Saucedemo 3 & 4 Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let inventoryPage: SAUCEDEMOPage;
    let genericFactory: GenericFactory;

    // Setup before each test
    beforeEach(async () => {
        // Initialize Page Objects
        loginPage = new SAUCEDEMOPage();
        inventoryPage = new SAUCEDEMOPage();
        genericFactory = new GenericFactory();

        // Assume login setup is handled by a specific method or factory call if needed, 
        // but for these tests, we rely on the page object methods to handle navigation/login state.
    });

    // --- Feature: saucedemo 3 Tests ---

    test('Verificar carregamento inicial da feature saucedemo 3 (Smoke Test)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        await inventoryPage.navigate(ROUTES.INVENTORY_ROUTE);
        await inventoryPage.assertLoaded();
    });

    test('Testar o limite mínimo permitido para um parâmetro (Boundary Testing)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        // Assuming the page object has methods to interact with specific fields based on context
        await inventoryPage.enterMinBoundaryValue('Y', 0); 
        await inventoryPage.processOperation();
        await inventoryPage.assertSuccess();
    });

    test('Testar o limite máximo permitido para um parâmetro (Boundary Testing)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        // Assuming the page object has methods to interact with specific fields based on context
        await inventoryPage.enterMaxBoundaryValue('X', 9999); 
        await inventoryPage.processOperation();
        await inventoryPage.assertSuccess();
    });

    test('Execução da feature por um perfil de usuário restrito (Regra de Negócio)', async () => {
        // Setup user with restricted profile
        await loginPage.loginWithProfile('Leitor'); 
        
        // Attempt action requiring higher permission
        await inventoryPage.attemptEditorAction(); 
        
        // Assert blockage based on business rule
        await inventoryPage.assertActionBlocked();
    });

    test('Exibir a regra de negócio baseada no valor inserido (Regra de Negócio)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        
        // Set value that triggers the rule (e.g., > 100)
        await inventoryPage.setParameterValue('ValueField', 150); 
        
        // Visualize result
        await inventoryPage.visualizeResult();
        
        // Assert message matches the expected rule
        await inventoryPage.assertMessageMatchesRule('ValueGreaterThan100');
    });

    test('Verificar tratamento de dados mal formatados (Negativo)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        
        // Attempt to input non-numeric text into a numeric field
        await inventoryPage.enterInvalidFormat('NumericField', 'abc'); 
        
        // Assert system rejection with expected error format
        await inventoryPage.assertErrorDisplayed(ALERT_MESSAGES.FORMAT_ERROR);
    });

    test('Medir o tempo de resposta da funcionalidade (Smoke/Performance)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        
        // Execute the main operation
        const startTime = Date.now();
        await inventoryPage.executeMainOperation();
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        // Assert performance requirement
        await inventoryPage.assertResponseTimeLessThan(3);
    });

    // --- Feature: saucedemo 4 Tests ---

    test('Login attempt with incorrect password (Negative)', async () => {
        // Setup initial state on login page
        await loginPage.navigateToLoginPage(); 
        
        // Action
        await loginPage.enterCredentials('valid_user', 'invalid_password');
        await loginPage.clickLogin();
        
        // Assertion
        await loginPage.assertErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS);
    });

    test('Attempting to proceed to checkout without shipping address (Negative)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        
        // Setup cart items (assumed via factory or page method)
        await inventoryPage.addItemToCart(1); 

        // Action: Attempt checkout without filling mandatory fields
        await inventoryPage.clickCheckout();
        
        // Assertion: Check for required field prompt
        await inventoryPage.assertErrorDisplayed(ALERT_MESSAGES.MISSING_SHIPPING_DETAILS);
    });

    test('Verifying consistent error messaging across forms (Positive)', async () => {
        await loginPage.loginWithDefaultUser(); // Setup logged in state
        
        // 1. Attempt wrong password
        await loginPage.enterCredentials('user', 'wrong_pass');
        await loginPage.clickLogin();
        await loginPage.assertErrorMessage(ALERT_MESSAGES.INVALID_CREDENTIALS);

        // 2. Attempt missing field (simulated checkout failure)
        await inventoryPage.attemptCheckoutWithoutAddress();
        await inventoryPage.assertErrorDisplayed(ALERT_MESSAGES.MISSING_SHIPPING_DETAILS);

        // Assertion: Verify that all resulting error messages follow defined standards
        await inventoryPage.verifyConsistentMessaging();
    });
});