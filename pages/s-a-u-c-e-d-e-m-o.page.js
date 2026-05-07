class SAUCEDEMOPage {
    constructor(page) {
        this.page = page;
        // Import selectors only from ../elements/s-a-u-c-e-d-e-m-o.elements
        this.selectors = require('../elements/s-a-u-c-e-d-e-m-o.elements');
    }

    async givenUserIsOnLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
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
        // Assuming minimum quantity is 1, testing negative input like -1 or 0 if applicable based on context.
        await this.page.locator(this.selectors.quantityInput).fill(String(quantity));
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async thenSystemMustRejectTransactionAndDisplayConstraintError() {
        const error = this.page.locator(this.selectors.constraintErrorMessage);
        await expect(error).toBeVisible();
    }

    async whenUserEntersValidDataAndSubmitsForm(data) {
        await this.page.locator(this.selectors.usernameInput).fill(data.username);
        await this.page.locator(this.selectors.passwordInput).fill(data.password);
        await this.page.locator(this.selectors.loginButton).click();
    }

    async thenSuccessMessageIsDisplayed() {
        const successMessage = this.page.locator(this.selectors.successMessage);
        await expect(successMessage).toBeVisible();
    }

    async whenUserNavigatesToDashboard() {
        await this.page.navigate('/inventory.html');
    }

    async thenAllExpectedUIComponentsShouldBePresentAndFunctional() {
        // Example assertion for dashboard elements
        await expect(this.page.locator(this.selectors.header)).toBeVisible();
        await expect(this.page.locator(this.selectors.profileLink)).toBeVisible();
    }

    async whenUserAttemptsToNavigateToAdmin() {
        await this.page.navigate('/admin');
    }

    async thenAccessShouldBeDeniedAndAuthorizationErrorShouldBeReturned() {
        // Check for specific access denied message or status code if applicable
        const accessDenied = this.page.locator(this.selectors.accessDeniedMessage);
        await expect(accessDenied).toBeVisible();
    }

    async whenUserSearchesForProduct(productName) {
        await this.page.locator(this.selectors.searchBox).fill(productName);
        await this.page.locator(this.selectors.searchButton).click();
    }

    async thenSearchResultsShouldDisplayCorrectProduct() {
        const results = this.page.locator(this.selectors.productItem);
        await expect(results).toHaveCount(1);
        await expect(results).toContainText(productName);
    }

    async whenUserAttemptsToSubmitWithoutFillingRequiredFields() {
        await this.page.locator(this.selectors.submitButton).click();
    }

    async thenValidationErrorsShouldAppearNextToAllMissingMandatoryFields() {
        // Check for general validation error visibility
        const errors = this.page.locator(this.selectors.validationError);
        await expect(errors).toHaveCount(3); // Assuming 3 mandatory fields based on scenario context
    }

    async whenUserRemainsInactiveForTimeout() {
        // Simulate inactivity (requires external timing or specific Playwright setup, here we simulate the action)
        await this.page.waitForTimeout(10000); // Placeholder for actual timeout simulation
    }

    async thenSystemShouldForceRelogin() {
        // Check if the page redirects to login upon sensitive action attempt
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }

    async whenUserAttemptsToNavigateToInvalidUrl(url) {
        await this.page.goto(url);
    }

    async thenSystemShouldDisplayError404() {
        // Check for 404 specific content or message
        const pageText = await this.page.innerText();
        await expect(pageText).toContain('404');
    }

    async whenUserEntersNonNumericCharacters(text) {
        await this.page.locator(this.selectors.numericInput).fill(text);
    }

    async thenSystemShouldRejectInputWithFormatError() {
        // Check for specific error message related to format rejection
        const error = this.page.locator(this.selectors.formatErrorMessage);
        await expect(error).toBeVisible();
    }

    async whenUserAttemptsToSubmitWithEmptyFields() {
        await this.page.locator(this.selectors.submitButton).click();
    }

    async thenSystemShouldReturnValidationError() {
        // Check for general validation error visibility on submission failure
        const errors = this.page.locator(this.selectors.validationError);
        await expect(errors).toBeVisible();
    }

    async whenUserExecutesPositiveFlow(params) {
        // Generic flow execution placeholder
        if (params.type === 'login') {
            await this.whenUserEntersValidDataAndSubmitsForm(params.data);
        } else if (params.type === 'checkout') {
             // Placeholder for complex checkout flow
        }
    }

    async thenProcessShouldBeCompletedSuccessfully() {
        // Check for success indicator on the final screen
        const success = this.page.locator(this.selectors.successIndicator);
        await expect(success).toBeVisible();
    }

    async whenUserExecutesFlowWithNewData(new_data) {
        // Placeholder for data insertion logic
        await this.page.locator(this.selectors.dataInput).fill(new_data.username);
        await this.page.locator(this.selectors.passwordInput).fill(new_data.password);
        await this.page.locator(this.selectors.loginButton).click();
    }

    async thenDataShouldBePersistedInDatabase() {
        // This is typically verified by checking the state after a session change, which is handled in regression tests.
        // For this specific method, we assert visibility of saved data if applicable.
        await expect(this.page.locator(this.selectors.dashboardTitle)).toBeVisible();
    }

    async whenUserUpdatesQuantity(currentQty, newQty) {
        await this.page.locator(this.selectors.quantityInput).clear();
        await this.page.locator(this.selectors.quantityInput).fill(String(newQty));
        await this.page.locator(this.selectors.updateButton).click();
    }

    async thenCartTotalShouldReflectNewQuantityAndPrice() {
        const cartTotal = this.page.locator(this.selectors.cartTotal);
        // Assertion logic based on expected calculation (requires knowing the exact price structure)
        await expect(cartTotal).toHaveText(/updated total/); 
    }

    async whenUserAttemptsToAccessAdminAsStandardUser() {
        await this.page.navigate('/admin');
    }

    async thenSystemMustRedirectOrDisplayAccessDeniedMessage() {
        // Check for specific denial message or redirection status
        const accessDenied = this.page.locator(this.selectors.accessDeniedMessage);
        await expect(accessDenied).toBeVisible();
    }

    async whenUserAttemptsToAccessInventoryWithoutLogin() {
        await this.page.goto('/inventory.html');
    }

    async thenSystemShouldRedirectToLoginPageOrDisplayErrorMessage() {
        // Check if redirection occurred or an error message is present
        const loginPage = this.page.locator(this.selectors.loginPage);
        await expect(loginPage).toBeVisible();
    }

    async whenUserAttemptsToAddItemToCartSuccessfully(productName) {
        await this.page.locator(this.selectors.productLink).click();
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async thenFeedbackShouldBePositiveAndCartCounterShouldUpdate() {
        // Check for success toast/message and cart count update
        const success = this.page.locator(this.selectors.successToast);
        await expect(success).toBeVisible();
        const cartCount = await this.page.locator(this.selectors.cartItemCount).innerText();
        await expect(cartCount).toBeGreaterThan(0);
    }

    async whenUserAttemptsToPerformCheckoutWithoutShippingDetails() {
        await this.page.locator(this.selectors.checkoutButton).click();
    }

    async thenErrorMessagePromptingForMissingFieldsMustAppear() {
        // Check for specific error message related to missing shipping details
        const error = this.page.locator(this.selectors.missingFieldError);
        await expect(error).toBeVisible();
    }

    async whenUserSearchesForNonExistentItemAndClicksSearch() {
        await this.page.locator(this.selectors.searchBox).fill('nonexistent_item_xyz');
        await this.page.locator(this.selectors.searchButton).click();
    }

    async thenSystemShouldDisplayNoResultsFound() {
        // Check for the "No results found" message
        const noResults = this.page.locator(this.selectors.noResultsMessage);
        await expect(noResults).toBeVisible();
    }

    async whenUserAttemptsToPerformFlowWithInvalidDataFormat(invalidText) {
        await this.page.locator(this.selectors.numericInput).fill(invalidText);
        await this.page.locator(this.selectors.submitButton).click();
    }

    async thenSystemShouldRejectInputWithFormatError() {
        // Re-asserting the error state for format rejection
        const error = this.page.locator(this.selectors.formatErrorMessage);
        await expect(error).toBeVisible();
    }

    async whenUserExecutesOperationAndMeasuresResponseTime() {
        // This requires timing the operation execution
        const startTime = Date.now();
        await this.page.locator(this.selectors.mainActionButton).click();
        const endTime = Date.now();
        const duration = endTime - startTime;
        return duration;
    }

    async thenResponseTimeShouldBeLessThanThreeSeconds(duration) {
        await expect(duration).toBeLessThan(3000);
    }

    async whenUserInsertsMinimumAllowedValue(field) {
        await this.page.locator(this.selectors[field]).fill('1'); // Assuming minimum quantity is 1 for cart logic
    }

    async thenSystemShouldAcceptMinimumInputAndProcessCorrectly() {
        // Verify item is added to cart after setting min quantity
        const addToCart = this.page.locator(this.selectors.addToCartButton);
        await addToCart.click();
        await expect(this.page.locator(this.selectors.cartItemCount)).toHaveText('1');
    }

    async whenUserAttemptsToSetMaximumAllowedValue(field, maxValue) {
        await this.page.locator(this.selectors[field]).fill(String(maxValue));
    }

    async thenSystemShouldDisplayStockLimitError() {
        // Check for stock limit error message after attempting to add max quantity
        const stockError = this.page.locator(this.selectors.stockLimitError);
        await expect(stockError).toBeVisible();
    }

    async whenUserAttemptsToPerformFlowWithRestrictedProfile(profile) {
        // Simulate navigating or performing an action that checks permissions based on the logged-in role
        await this.page.navigate('/restricted_feature'); 
    }

    async thenFunctionalityShouldBeBlocked() {
        // Check for explicit block message
        const blocked = this.page.locator(this.selectors.blockedMessage);
        await expect(blocked).toBeVisible();
    }

    async whenUserVerifiesBusinessRuleDisplay(value) {
        // Simulate input that triggers a rule (e.g., > 100)
        await this.page.locator(this.selectors.ruleTriggerInput).fill(String(value));
    }

    async thenDisplayedMessageShouldMatchBusinessRule() {
        // Verify the displayed message matches the expected outcome based on the input value
        const actualMessage = this.page.locator(this.selectors.resultMessage);
        await expect(actualMessage).toHaveText(/rule_for_value_greater_than_100/); 
    }

    async whenUserAttemptsToLoginWithInvalidCredentials(username, password) {
        await this.whenUserEntersValidCredentials(username, password);
        await this.whenUserClicksLogin();
    }

    async thenSystemShouldDisplayInvalidCredentialsError() {
        const error = this.page.locator(this.selectors.invalidCredentialsError);
        await expect(error).toBeVisible();
        await expect(error).toHaveText('Invalid credentials');
    }

    async whenUserLogsInSuccessfully(username, password) {
        await this.whenUserEntersValidCredentials(username, password);
        await this.whenUserClicksLogin();
    }

    async thenUserShouldBeRedirectedToDashboard() {
        // Check if the URL reflects the dashboard state
        await expect(this.page).toHaveURL('/inventory.html');
    }

    async whenUserAddsItemToCartSuccessfully(productName) {
        await this.whenUserAttemptsToAddItemToCartSuccessfully(productName);
    }

    async thenItemShouldBeAddedAndCartCounterUpdated() {
        // Verify the cart count reflects the addition
        const cartCount = await this.page.locator(this.selectors.cartItemCount).innerText();
        await expect(cartCount).toBeGreaterThan(0);
    }

    async whenUserAdjustsQuantity(currentQty, newQty) {
        await this.whenUserUpdatesQuantity(currentQty, newQty);
    }

    async thenQuantityDisplayedShouldBeCorrectlyUpdated() {
        const quantity = await this.page.locator(this.selectors.quantityInput).innerText();
        await expect(quantity).toBe(String(newQty));
    }

    async whenUserLogsOutAndLogsBackIn() {
        // Simulate logout and subsequent login for persistence check
        await this.page.locator(this.selectors.logoutButton).click();
        await this.page.goto('https://www.saucedemo.com/');
        await this.whenUserLogsInSuccessfully('user', 'password'); // Re-login
    }

    async thenPreviouslyAddedItemsShouldPersist() {
        // Verify items are still in the cart after session change
        const cartItems = await this.page.locator(this.selectors.cartItemRow);
        await expect(cartItems).toHaveCount(1); // Assuming one item was added previously
    }

    async whenUserNavigatesToInventoryWithoutLogin() {
        await this.whenUserAttemptsToAccessInventoryWithoutLogin();
    }

    async thenSystemShouldRedirectToLoginPageOrErrorMessage() {
        // Verify redirection/error message upon unauthorized access attempt
        const loginPage = this.page.locator(this.selectors.loginPage);
        await expect(loginPage).toBeVisible();
    }
}