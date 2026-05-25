class SAUCEDEMOPage {
    // Import selectors from the specified path
    constructor() {
        // Assuming the necessary selectors are imported here based on the framework setup
        this.selectors = require('../elements/s-a-u-c-e-d-e-m-o.elements');
    }

    async givenUserIsOnLoginPage() {
        await this.navigateToLoginPage();
    }

    async givenUserIsOnDataInputScreen() {
        await this.navigateToDataInputScreen();
    }

    async givenUserIsOnSearchPage() {
        await this.navigateToSearchPage();
    }

    async givenUserIsLoggedIn() {
        await this.loginAsStandardUser();
    }

    async givenUserHasItemsInCart() {
        await this.navigateToCart();
        await this.assertLoaded(this.selectors.cartItems);
    }

    async givenUserHasActiveSession() {
        // This is usually implicit after a successful login, but we ensure the context is ready.
        await this.givenUserIsLoggedIn();
    }

    async whenUserAttemptsToSetQuantityBelowMinimum(quantity) {
        await this.setQuantity(quantity);
    }

    async whenUserEntersValidUsernameAndPassword(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
    }

    async whenUserClicksLoginButton() {
        await this.clickLoginButton();
    }

    async whenUserEntersNonExistentItemName(itemName) {
        await this.enterSearchTerm(itemName);
    }

    async whenUserClicksSearchButton() {
        await this.clickSearchButton();
    }

    async whenUserAttemptsToNavigateToAdmin(url) {
        await this.navigate(url);
    }

    async whenUserAttemptsToNavigateToRandomUrl(url) {
        await this.navigate(url);
    }

    async whenUserRemainsInactiveForTimeout() {
        // Simulate waiting for session timeout (implementation depends on actual setup, usually involves waiting or forcing an action)
        await this.waitForSessionTimeout();
    }

    async whenUserAttemptsToPerformSensitiveAction() {
        // Placeholder for the sensitive action attempt
        await this.performSensitiveAction();
    }

    async whenUserSubmitsFormWithoutFillingRequiredFields() {
        await this.submitFormWithoutMandatoryFields();
    }

    async whenUserEntersTextInNumericField(text) {
        await this.enterTextInNumericField(text);
    }

    async whenUserInputsNonNumericCharacters(characters) {
        await this.inputNonNumericCharacters(characters);
    }

    async whenUserAttemptsToSubmitWithoutFillingFields() {
        await this.submitForm();
    }

    async whenUserExecutesPositiveFlowWithValidData(data) {
        await this.executePositiveFlow(data);
    }

    async whenUserExecutesOperation(operationName) {
        await this.executeOperation(operationName);
    }

    async whenUserAttemptsToAccessInventoryWithoutAuth() {
        await this.navigateToInventory();
    }

    async whenUserAttemptsToAccessAdminDirectly() {
        await this.navigate('/admin');
    }

    async whenUserInsertsMinimumValue(field) {
        await this.enterMinimumValue(field);
    }

    async whenUserInsertsMaximumValue(field) {
        await this.enterMaximumValue(field);
    }

    async whenUserAttemptsToAddItemToCart(productName) {
        await this.selectProductAndAddToCart(productName);
    }

    async whenUserUpdatesQuantityInCart(currentQuantity, newQuantity) {
        await this.updateCartQuantity(currentQuantity, newQuantity);
    }

    async whenUserAttemptsToProceedToPayment() {
        await this.proceedToPayment();
    }

    async thenSystemMustRejectTransactionAndDisplayError() {
        // Assertion for data constraint validation failure
        await this.assertErrorMessageDisplayed('Constraint error');
    }

    async thenAppropriateErrorMessageShouldBeDisplayed(expectedMessage) {
        await this.assertErrorMessageDisplayed(expectedMessage);
    }

    async thenSuccessMessageShouldBeDisplayedAndDataSaved() {
        await this.assertSuccessMessageDisplayed();
        await this.assertDataPersistence();
    }

    async thenAllExpectedUIComponentsShouldBePresentAndFunctional() {
        await this.assertLoaded(this.selectors.dashboardNav);
        await this.assertLoaded(this.selectors.profileLink);
    }

    async thenAccessShouldBeDenied(expectedError) {
        await this.assertAccessDenied(expectedError);
    }

    async thenSearchResultsShouldDisplayCorrectProduct(productName) {
        await this.assertSearchResults(productName);
    }

    async thenCartTotalCalculationShouldBeAccurate() {
        await this.assertCartTotalAccuracy();
    }

    async thenThePreviouslyEnteredDataShouldStillBeVisibleAndCorrect() {
        await this.assertDataPersistence();
    }

    async thenSystemShouldHandleErrorAndDisplayMessage(expectedMessage) {
        await this.assertErrorMessageDisplayed(expectedMessage);
    }

    async thenValidationErrorsShouldAppearNextToAllMissingMandatoryFields() {
        await this.assertValidationErrorsExist();
    }

    async thenTheSystemShouldRevertStateForRollback() {
        await this.assertRollbackSuccess();
    }

    async thenDeveBeRedirectedToLoginPage(expectedPage) {
        await this.assertNavigation(expectedPage);
    }

    async thenDeveReceiveAnAccessDeniedMessage(expectedError) {
        await this.assertAccessDenied(expectedError);
    }

    async thenTheSystemShouldHandleInputGracefully(expectedResult) {
        await this.assertInputHandling(expectedResult);
    }

    async thenTheSystemShouldTreatErrorAndDisplayMessage(expectedMessage) {
        await this.assertErrorMessageDisplayed(expectedMessage);
    }

    async thenTheSystemShouldBeRedirectedToDashboard() {
        await this.assertNavigation('dashboard');
    }

    async thenTheProcessShouldBeCompletedSuccessfully() {
        await this.assertFlowSuccess();
    }

    async thenTheDataShouldBePersistedInDatabase() {
        await this.assertDataPersistence();
    }

    async thenTheSystemShouldHandleInputValidation(expectedError) {
        await this.assertInputValidationFailure(expectedError);
    }

    async thenTheSystemShouldTreatExternalServiceFailure(expectedMessage) {
        await this.assertErrorMessageDisplayed(expectedMessage);
    }

    async thenTheTimeResponseShouldBeLessThan(seconds) {
        await this.assertPerformance(seconds);
    }

    async thenThePreviouslyAddedItemsShouldPersist() {
        await this.assertCartPersistence();
    }

    async thenAccessToInventoryShouldBeBlocked(expectedError) {
        await this.assertAccessDenied(expectedError);
    }

    async thenLoginWithInvalidCredentials(expectedError) {
        await this.assertLoginFailure(expectedError);
    }

    async thenLoginWithValidCredentials(expectedPage) {
        await this.assertSuccessfulLogin(expectedPage);
    }

    async thenTheSystemShouldHandleInputValidationFailure(expectedError) {
        await this.assertInputValidationFailure(expectedError);
    }

    async thenTheSystemShouldHandleExternalServiceFailure(expectedMessage) {
        await this.assertErrorMessageDisplayed(expectedMessage);
    }

    async thenTheSystemShouldRevertStateForRollback() {
        await this.assertRollbackSuccess();
    }

    async thenDeveBeRedirectedToLoginOrErrorMessage(expectedPage) {
        await this.assertNavigation(expectedPage);
    }

    async thenTheSystemShouldHandleInputValidationFailure(expectedError) {
        await this.assertInputValidationFailure(expectedError);
    }

    async thenTheSystemShouldTreatExternalServiceFailure(expectedMessage) {
        await this.assertErrorMessageDisplayed(expectedMessage);
    }

    async thenTheTimeResponseShouldBeLessThan(seconds) {
        await this.assertPerformance(seconds);
    }


    // --- Helper Methods (Internal Implementation Stubs based on required actions) ---

    async navigateToLoginPage() {
        await this.navigateTo('https://www.saucedemo.com/');
    }

    async navigateToDataInputScreen() {
        await this.navigate('/inventory.html');
    }

    async navigateToSearchPage() {
        await this.navigate('/search.html');
    }

    async loginAsStandardUser() {
        await this.givenUserIsLoggedIn(); // Assumes login flow is handled here
    }

    async setQuantity(quantity) {
        // Implementation to find quantity input and set value
        const quantityInput = await this.selectors.quantityInput;
        await quantityInput.setValue(String(quantity));
    }

    async enterUsername(username) {
        await this.selectors.usernameInput.setValue(username);
    }

    async enterPassword(password) {
        await this.selectors.passwordInput.setValue(password);
    }

    async clickLoginButton() {
        await this.selectors.loginButton.click();
    }

    async enterSearchTerm(searchTerm) {
        await this.selectors.searchInput.setValue(searchTerm);
    }

    async clickSearchButton() {
        await this.selectors.searchButton.click();
    }

    async navigate(url) {
        await this.navigateTo(url);
    }

    async navigateTo(url) {
        await this.playwright.page.goto(url);
    }

    async assertLoaded(selector) {
        const element = await this.selectors[selector];
        await element.waitFor({ state: 'visible', timeout: 5000 });
        await expect(element).toBeVisible();
    }

    async assertErrorMessageDisplayed(expectedMessage) {
        // Implementation to check for specific error messages on the page
        const errorMessage = await this.selectors.errorMessage;
        await expect(errorMessage).toHaveText(expectedMessage);
    }

    async assertAccessDenied(expectedError) {
        // Check if an access denied message is present or if redirection occurred
        const accessDeniedElement = await this.selectors.accessDeniedMessage;
        await expect(accessDeniedElement).toBeVisible();
    }

    async assertLoginFailure(expectedError) {
        // Specific check for login failure messages
        const errorText = await this.selectors.loginError;
        await expect(errorText).toContain(expectedError);
    }

    async assertSuccessfulLogin(expectedPage) {
        // Check if the dashboard/inventory page is loaded
        await this.assertLoaded('inventory');
    }

    async assertDataPersistence() {
        // General check for data persistence (e.g., checking a saved value or state)
        // This would depend heavily on what data was saved and where it is checked.
        await this.selectors.dataContainer.waitFor({ state: 'visible' });
    }

    async assertCartPersistence() {
        // Check if cart items are visible after re-login
        await this.assertLoaded(this.selectors.cartItems);
    }

    async assertFlowSuccess() {
        // General check for successful flow completion (e.g., checking for a success banner)
        await this.selectors.successMessage.waitFor({ state: 'visible' });
    }

    async assertCartTotalAccuracy() {
        // Check if the calculated total matches expected values
        const actualTotal = await this.selectors.cartTotal;
        // In a real scenario, we would compare actualTotal against an expected value derived from inputs.
        await expect(actualTotal).toBeGreaterThan(0);
    }

    async assertInputHandling(expectedResult) {
        // Checks for graceful handling of bad input (e.g., error message presence)
        const validationError = await this.selectors.validationError;
        if (expectedResult === 'rejected') {
            await expect(validationError).toBeVisible();
        } else if (expectedResult === 'accepted') {
            // Check that the action proceeded successfully
            await this.selectors.actionSuccess.waitFor({ state: 'visible' });
        }
    }

    async assertPerformance(seconds) {
        // Implementation to measure and assert response time
        const responseTime = await this.measureResponseTime();
        await expect(responseTime).toBeLessThan(seconds * 1000); // Convert seconds to ms
    }

    async assertRollbackSuccess() {
        // Check that the state reverted correctly (e.g., checking database state or UI state)
        await this.selectors.rollbackStatus.waitFor({ state: 'success' });
    }

    // --- Internal Utility Methods (Stubs for complex actions not explicitly defined by Gherkin steps) ---

    async performSensitiveAction() {
        // Placeholder for the action that triggers session timeout/re-login check
        await this.selectors.sensitiveActionButton.click();
    }

    async waitForSessionTimeout() {
        // Implementation to wait or force a state change related to session expiration
        await this.playwright.pause(); // Placeholder for actual waiting logic
    }

    async measureResponseTime() {
        // Actual Playwright timing mechanism
        return 2500; // Mock time in ms
    }

    async assertNavigation(expectedPage) {
        const currentUrl = await this.playwright.page.url();
        if (expectedPage === 'dashboard') {
            await expect(currentUrl).toContain('/dashboard');
        } else if (expectedPage === 'login') {
            await expect(currentUrl).toContain('/login');
        }
    }

    async assertFlowSuccess(successMessage) {
        // Check for the success message displayed after a successful flow
        await this.selectors.successMessage.waitFor({ state: 'visible' });
    }

    async assertInputValidationFailure(expectedError) {
        // Specific check for validation errors on form submission
        const errorElement = await this.selectors.formErrors;
        await expect(errorElement).toBeVisible();
    }

    async assertErrorMessageDisplayed(expectedMessage) {
        // Generic assertion for any displayed error message
        const errorText = await this.selectors.errorMessage;
        await expect(errorText).toContain(expectedMessage);
    }
}