import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

describe('Saucedemo Feature Tests', () => {
    let basePage: BasePage;
    let saucedemoPage: SAUCEDEMOPage;
    let factory: GenericFactory;

    // Setup common objects
    beforeAll(() => {
        basePage = new BasePage();
        saucedemoPage = new SAUCEDEMOPage(basePage);
        factory = new GenericFactory();
    });

    // --- Scenario 1: Smoke Test ---
    test('Verificar o acesso à página principal', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);
        await saucedemoPage.navigate(ROUTES.HOME);
        await saucedemoPage.assertLoaded();
    });

    // --- Scenario 2: Boundary Testing (Minimum) ---
    test('Testar o limite mínimo permitido para um parâmetro', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);

        // Assuming the boundary test targets a specific input field setup within SAUCEDEMOPage methods
        await saucedemoPage.enterMinimumValue('Y', 0); // Placeholder method call based on requirement
        await saucedemoPage.processOperation();
        
        // Assertion: System must accept and process correctly (implied by successful operation)
        await saucedemoPage.assertOperationSuccess(); 
    });

    // --- Scenario 3: Boundary Testing (Maximum) ---
    test('Testar o limite máximo permitido para um parâmetro', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);

        // Assuming the boundary test targets a specific input field setup within SAUCEDEMOPage methods
        await saucedemoPage.enterMaximumValue('X', 99999); // Placeholder method call based on requirement
        await saucedemoPage.processOperation();

        // Assertion: System must accept and process correctly (implied by successful operation)
        await saucedemoPage.assertOperationSuccess();
    });

    // --- Scenario 4: Business Rule (Permission Check) ---
    test('Execução da feature por um perfil de usuário restrito', async () => {
        const restrictedUser = factory.createRestrictedUser('Leitor');
        await saucedemoPage.login(restrictedUser.username, restrictedUser.password);

        // Attempt action requiring 'Editor' permission
        await saucedemoPage.attemptEditorFunctionality(); 

        // Assertion: Functionality must be blocked
        await saucedemoPage.assertFunctionalityBlocked(); 
    });

    // --- Scenario 5: Business Rule (Displaying Rules) ---
    test('Exibir a regra de negócio baseada no valor inserido', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);

        // Setup: Insert value that triggers a specific rule (e.g., > 100)
        await saucedemoPage.enterValueForRule('trigger_high', 101); 
        
        // Action: Visualize the result
        const result = await saucedemoPage.visualizeResult();

        // Assertion: Message displayed must match the associated rule
        await expect(result).toContain(ALERT_MESSAGES.RULE_HIGH_VALUE); 
    });

    // --- Scenario 6: Negative Test (Invalid Data) ---
    test('Inserir caracteres inválidos nos campos numéricos', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);

        // Action: Enter text where numbers are expected
        await saucedemoPage.enterTextInNumericField('field_x', 'abc'); 

        // Assertion: System must reject the entry with format error
        await expect(saucedemoPage.getErrorMessage()).toContain(ALERT_MESSAGES.ERROR_INVALID_FORMAT);
    });

    // --- Scenario 7: Performance Test ---
    test('Medir o tempo de resposta da funcionalidade', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);

        // Action: Execute the main operation
        const responseTime = await saucedemoPage.executeMainOperation();

        // Assertion: Response time must be less than 3 seconds
        await expect(responseTime).toBeLessThan(3000);
    });

    // --- Scenario 8: Negative Test (Invalid Credentials) ---
    test('Login attempt with incorrect password', async () => {
        const user = factory.createStandardUser(); // Valid username, invalid password
        
        // Setup: Start on the login page (assuming login method handles navigation implicitly or explicitly)
        await saucedemoPage.navigateToLoginPage(); 

        // Action: Enter valid username and invalid password
        await saucedemoPage.fillCredentials(user.username, 'wrong_password');
        await saucedemoPage.submit();

        // Assertion: Error message stating 'Invalid credentials' should be displayed
        const errorMessage = await saucedemoPage.getErrorMessage();
        await expect(errorMessage).toContain(ALERT_MESSAGES.ERROR_INVALID_CREDENTIALS);
    });

    // --- Scenario 9: Negative Test (Missing Required Field) ---
    test('Attempting to proceed to checkout without shipping address', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);

        // Setup: Ensure items are in the cart (assuming this is handled by a setup method)
        await saucedemoPage.addItemToCart(1); 

        // Action: Attempt to click Checkout without filling details
        await saucedemoPage.attemptCheckoutWithoutDetails();

        // Assertion: Error message prompting for missing fields must appear
        const errorMessage = await saucedemoPage.getErrorMessage();
        await expect(errorMessage).toContain(ALERT_MESSAGES.ERROR_MISSING_SHIPPING_DETAILS);
    });

    // --- Scenario 10: Positive Test (Error Message Consistency) ---
    test('Verifying consistent error messaging across forms', async () => {
        const user = factory.createStandardUser();
        await saucedemoPage.login(user.username, user.password);

        // Action 1: Wrong password attempt
        await saucedemoPage.fillCredentials(user.username, 'wrong_password');
        await saucedemoPage.submit();
        let error1 = await saucedemoPage.getErrorMessage();
        await expect(error1).toContain(ALERT_MESSAGES.ERROR_INVALID_CREDENTIALS);

        // Action 2: Missing field attempt (assuming we navigate to a form where this is possible)
        await saucedemoPage.navigateToCheckoutForm();
        await saucedemoPage.attemptCheckoutWithoutDetails();
        let error2 = await saucedemoPage.getErrorMessage();
        await expect(error2).toContain(ALERT_MESSAGES.ERROR_MISSING_SHIPPING_DETAILS);

        // Assertion: All resulting error messages must follow the defined system standards (checked by ensuring specific expected messages were returned)
        expect(error1).toMatch(new RegExp(ALERT_MESSAGES.ERROR_INVALID_CREDENTIALS));
        expect(error2).toMatch(new RegExp(ALERT_MESSAGES.ERROR_MISSING_SHIPPING_DETAILS));
    });
});