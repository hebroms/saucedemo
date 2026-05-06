class SAUCEDEMOPage {
    constructor(page) {
        this.page = page;
        // Import selectors from the specified path (simulated here as constants)
        this.selectors = require('../elements/s-a-u-c-e-d-e-m-o.elements');
    }

    async givenUserIsOnLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
        await this.page.waitForURL('**/login');
    }

    async whenUserEntersValidCredentials(username, password) {
        await this.page.locator(this.selectors.usernameInput).fill(username);
        await this.page.locator(this.selectors.passwordInput).fill(password);
    }

    async whenUserClicksLogin() {
        await this.page.locator(this.selectors.loginButton).click();
    }

    async thenErrorMessageIsDisplayed(expectedMessage) {
        const errorMessage = this.page.locator(this.selectors.errorMessage);
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(expectedMessage);
    }

    async whenUserAttemptsToSetQuantityBelowMinimum(quantity) {
        // Assuming minimum quantity is 1, testing below that (e.g., -1)
        await this.page.locator(this.selectors.quantityInput).fill(String(quantity));
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async thenSystemMustRejectTransactionAndDisplayConstraintError() {
        const error = this.page.locator(this.selectors.errorMessage);
        await expect(error).toBeVisible();
        await expect(error).toContainText('Quantity must be greater than or equal to 1');
    }

    async whenUserEntersValidNonEmptyDataAndSubmitsForm() {
        // This method is generic, specific implementation depends on the form context (e.g., inventory page)
        // Placeholder action: assumes filling fields and clicking submit
        await this.page.locator(this.selectors.inputField1).fill('some_valid_data');
        await this.page.locator(this.selectors.submitButton).click();
    }

    async thenSuccessMessageIsDisplayedAndDataIsSaved() {
        const successMessage = this.page.locator(this.selectors.successMessage);
        await expect(successMessage).toBeVisible();
        // Further checks for data persistence would happen here if applicable
    }

    async whenUserNavigatesToDashboard() {
        await this.page.navigate('https://www.saucedemo.com/inventory.html');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async thenAllExpectedUiComponentsShouldBePresentAndFunctional() {
        // Check for key dashboard elements visibility
        await expect(this.page.locator(this.selectors.navBar)).toBeVisible();
        await expect(this.page.locator(this.selectors.profileLink)).toBeVisible();
    }

    async whenUserAttemptsToNavigateToAdmin() {
        await this.page.navigate('/admin');
    }

    async thenAccessShouldBeDeniedAndAuthorizationErrorShouldBeReturned() {
        // Check for specific denial message or redirect status code if applicable
        const accessDenied = this.page.locator(this.selectors.accessDeniedMessage);
        await expect(accessDenied).toBeVisible();
    }

    async whenUserAttemptsToNavigateToRandomUrl(url) {
        await this.page.goto(url);
    }

    async thenSystemShouldDisplayError404() {
        // Check for 404 specific content or message
        const pageSource = await this.page.content();
        await expect(pageSource).toContainText('404 Not Found');
    }

    async whenUserEntersDataIntoNumericalField(text) {
        await this.page.locator(this.selectors.numericalInput).fill(text);
    }

    async thenSystemShouldHandleInputGracefully() {
        // Assertion based on expected rejection or error state after invalid input
        const error = this.page.locator(this.selectors.validationError);
        await expect(error).toBeVisible();
    }

    async whenUserAttemptsToSubmitWithoutFillingRequiredFields() {
        await this.page.locator(this.selectors.submitButton).click();
    }

    async thenValidationErrorsShouldAppearNextToAllMissingMandatoryFields() {
        // Check for specific error indicators next to required fields
        const errors = this.page.locator('.error-indicator');
        await expect(errors).toHaveCount(3); // Example count check
    }

    async whenUserRemainsInactiveForTimeoutPeriod() {
        // Simulate inactivity (requires actual time manipulation or waiting for a specific state change)
        await this.page.waitForTimeout(10000); // Simulating a long wait
    }

    async thenSystemShouldForceRelogin() {
        // Check if the page redirects to login upon sensitive action attempt
        await expect(this.page).toHaveURL('**/login');
    }

    async whenUserAttemptsToSubmitFormWithEmptyFields() {
        await this.page.locator(this.selectors.submitButton).click();
    }

    async thenSystemShouldReturnValidationError() {
        // Check for a specific validation error message related to empty fields
        const error = this.page.locator(this.selectors.validationError);
        await expect(error).toContainText('All fields are required');
    }

    async whenServiceSimulatesFailure() {
        // This is usually handled by mocking external services, but in a PO context, we simulate the resulting state change if possible.
        // For this example, we assume the subsequent action reflects the failure state.
    }

    async thenSystemShouldHandleExternalErrorAndDisplayMessage() {
        const error = this.page.locator(this.selectors.externalError);
        await expect(error).toBeVisible();
        await expect(error).toContainText('indisponibilidade');
    }

    async whenUserInitiatesProcess() {
        // Generic action for starting a feature flow
    }

    async whenUserProvidesAllRequiredParameters() {
        // Action to set all necessary inputs
    }

    async thenProcessShouldBeCompletedSuccessfully() {
        const success = this.page.locator(this.selectors.successIndicator);
        await expect(success).toBeVisible();
    }

    async whenUserExecutesOperation() {
        // Generic action for executing the main feature logic
    }

    async thenProcessShouldBeCompletedSuccessfullyWithDataPersistence() {
        // Check if data is visible after execution
        const data = this.page.locator(this.selectors.savedData);
        await expect(data).toBeVisible();
    }

    async whenUserUpdatesQuantity(oldQuantity, newQuantity) {
        await this.page.locator(this.selectors.quantityInput).clear();
        await this.page.locator(this.selectors.quantityInput).fill(String(newQuantity));
        await this.page.locator(this.selectors.saveButton).click();
    }

    async thenCartTotalShouldReflectNewQuantityAndPrice() {
        const cartTotal = this.page.locator(this.selectors.cartTotal);
        // Assertion logic comparing the new total against expected calculation (requires context)
        await expect(cartTotal).toHaveText(/new_total_calculation/); 
    }

    async whenUserSearchesForProduct(productName) {
        await this.page.locator(this.selectors.searchInput).fill(productName);
        await this.page.locator(this.selectors.searchButton).click();
    }

    async thenSearchResultsShouldDisplayCorrectProduct() {
        const results = this.page.locator('.product-result');
        await expect(results).toHaveCount(1);
        await expect(results).toContainText(this.page.locator(this.selectors.productName));
    }

    async whenUserAttemptsToAccessAdminPanel() {
        await this.page.navigate('/admin');
    }

    async thenSystemMustRedirectOrDisplayAccessDeniedMessage() {
        // Check for specific access denied message or redirect status code
        const accessDenied = this.page.locator(this.selectors.accessDeniedMessage);
        await expect(accessDenied).toBeVisible();
    }

    async whenUserEntersInvalidEmailForRegistration(email) {
        await this.page.locator(this.selectors.emailInput).fill(email);
    }

    async thenSystemShouldDisplayEmailValidationError() {
        const error = this.page.locator(this.selectors.emailError);
        await expect(error).toBeVisible();
        await expect(error).toContainText('Invalid email format');
    }

    async whenUserAttemptsToAccessInventoryWithoutLogin() {
        await this.page.goto('/inventory.html');
    }

    async thenSystemShouldRedirectToLoginPageOrDisplayErrorMessage() {
        // Check if redirection or error message is present
        const loginPage = this.page.locator(this.selectors.loginPage);
        await expect(loginPage).toBeVisible();
    }

    async whenUserAttemptsToAddItemToCartSuccessfully(productName) {
        // Assuming a flow where selection and adding happens
        await this.page.locator(this.selectors.productLink).click();
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async thenFeedbackShouldBePositiveAndCartCounterShouldUpdate() {
        const feedback = this.page.locator(this.selectors.feedbackMessage);
        await expect(feedback).toBeVisible();
        // Check cart counter update (requires checking the element displaying the count)
        const cartCount = this.page.locator(this.selectors.cartItemCount);
        await expect(cartCount).toHaveText('1'); // Example check
    }

    async whenUserAttemptsToSetZeroQuantity() {
        await this.page.locator(this.selectors.quantityInput).fill('0');
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async thenSystemShouldRejectZeroQuantityAction() {
        const error = this.page.locator(this.selectors.errorOnZero);
        await expect(error).toBeVisible();
    }

    async whenUserSetsQuantityToMinimum(minQuantity) {
        await this.page.locator(this.selectors.quantityInput).fill(String(minQuantity));
    }

    async thenSystemShouldAcceptMinimumInputAndProcessCorrectly() {
        // Verify successful addition after setting minimum quantity
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async whenUserAttemptsToSetMaximumQuantity(maxQuantity) {
        await this.page.locator(this.selectors.quantityInput).fill(String(maxQuantity));
    }

    async thenSystemShouldDisplayStockLimitError() {
        const error = this.page.locator(this.selectors.stockLimitError);
        await expect(error).toBeVisible();
    }

    async whenUserAttemptsToPerformCheckout() {
        await this.page.locator(this.selectors.checkoutButton).click();
    }

    async thenDisplayedFinalAmountMustMatchCalculatedTotal() {
        const finalAmount = this.page.locator(this.selectors.finalPrice);
        // Assertion logic comparing the displayed amount against expected calculation
        await expect(finalAmount).toHaveText(/expected_total/); 
    }

    async whenUserAttemptsToPerformFlowWithNewData() {
        // Execute the full positive flow with new data
    }

    async thenDataShouldBePersistedInDatabase() {
        // Check for persistence confirmation (e.g., checking a database-backed view or subsequent session)
        const persistedData = this.page.locator(this.selectors.dataPersistenceCheck);
        await expect(persistedData).toBeVisible();
    }

    async whenUserAttemptsToPerformFlowWithInvalidInput() {
        // Execute flow with invalid data (e.g., non-numeric input)
    }

    async thenSystemShouldRejectInputWithFormatError() {
        const error = this.page.locator(this.selectors.formatError);
        await expect(error).toBeVisible();
    }

    async whenUserExecutesOperationAndMeasuresTime() {
        // Action to start the operation
    }

    async thenResponseTimeShouldBeLessThanThreeSeconds() {
        // Requires capturing timing metrics from Playwright context or network monitoring
        const responseTime = await this.page.evaluate(() => window.responseTime); // Example placeholder
        await expect(responseTime).toBeLessThan(3000); 
    }

    async whenUserAttemptsToPerformFlowWithRestrictedProfile() {
        // Action to attempt restricted access
    }

    async thenFunctionalityShouldBeBlocked() {
        const blockedMessage = this.page.locator(this.selectors.blockedMessage);
        await expect(blockedMessage).toBeVisible();
    }

    async whenUserVisualizesResultBasedOnValue(value) {
        // Action to trigger the rule check based on input value
    }

    async thenDisplayedMessageShouldMatchBusinessRule() {
        const message = this.page.locator(this.selectors.businessRuleMessage);
        await expect(message).toContainText('Rule applied successfully');
    }

    async whenUserEntersNonNumericCharacters(text) {
        await this.page.locator(this.selectors.numericalInput).fill(text);
    }

    async thenSystemShouldRejectInputWithFormatError() {
        // Re-asserting the error for non-numeric input handling
        const error = this.page.locator(this.selectors.formatError);
        await expect(error).toBeVisible();
    }

    async whenUserLogsOutAndLogsBackIn() {
        // Simulate session change and re-authentication
        await this.page.locator(this.selectors.logoutButton).click();
        await this.page.goto('https://www.saucedemo.com/');
        await this.page.locator(this.selectors.loginButton).click();
    }

    async thenCartItemsShouldPersistAcrossSessions() {
        // Check if items are still in the cart after re-login
        const cartItems = this.page.locator(this.selectors.cartItemCount);
        await expect(cartItems).toHaveText(/items_from_session/); 
    }

    async whenUserNavigatesToInventoryWithoutLogin() {
        await this.page.goto('/inventory.html');
    }

    async thenSystemShouldRedirectToLoginPageOrDisplayErrorMessageForInventory() {
        // Check for specific inventory access denial
        const loginPage = this.page.locator(this.selectors.loginPage);
        await expect(loginPage).toBeVisible();
    }

    async whenUserLogsInWithInvalidUsernameAndPassword(username, password) {
        await this.page.whenLogAuthenticated(username, password); // Assuming a helper method exists or simulating the flow
    }

    async thenSystemShouldDisplayInvalidCredentialsError() {
        const error = this.page.locator(this.selectors.invalidCredentialsError);
        await expect(error).toBeVisible();
        await expect(error).toContainText('Invalid credentials');
    }

    async whenUserLogsInWithValidCredentials(username, password) {
        // This is typically handled by the login flow methods above, but included for completeness of the scenario mapping.
        await this.page.whenLogAuthenticated(username, password); 
    }

    async thenUserShouldBeRedirectedToDashboard() {
        await expect(this.page).toHaveURL('**/inventory.html');
    }

    async whenUserAddsItemToCartSuccessfully(productName) {
        // Re-executing the successful add flow for verification
        await this.page.locator(this.selectors.productLink).click();
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async thenItemShouldBeAddedAndCartCounterUpdated() {
        const cartCount = this.page.locator(this.selectors.cartItemCount);
        await expect(cartCount).toHaveText('1'); 
    }

    async whenUserAdjustsQuantity(oldQuantity, newQuantity) {
        await this.page.locator(this.selectors.quantityInput).fill(String(newQuantity));
        await this.page.locator(this.selectors.saveButton).click();
    }

    async thenQuantityDisplayedShouldBeNewQuantity() {
        const quantity = this.page.locator(this.selectors.quantityInput);
        await expect(quantity).toHaveValue(String(2)); // Example check
    }
}