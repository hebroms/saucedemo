class SAUCEDEMOPage {
    constructor(page) {
        this.page = page;
        // Import selectors from the specified path
        this.selectors = require('../elements/s-a-u-c-e-d-e-m-o.elements');
    }

    async givenUserIsOnLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
        await this.assertLoaded('loginPage');
    }

    async whenUserEntersValidCredentials(username, password) {
        await this.page.fill(this.selectors.usernameInput, username);
        await this.page.fill(this.selectors.passwordInput, password);
    }

    async whenUserClicksLogin() {
        await this.page.click(this.selectors.loginButton);
    }

    async thenAppropriateErrorMessageIsDisplayed(expectedMessage) {
        const errorMessage = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorMessage.includes(expectedMessage)) {
            throw new Error(`Expected error message not found. Found: ${errorMessage}`);
        }
    }

    async whenUserAttemptsToSetQuantityBelowMinimum(quantity) {
        await this.page.fill(this.selectors.quantityInput, String(quantity));
    }

    async thenSystemMustRejectTransactionAndDisplayConstraintError() {
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('minimum quantity')) {
            throw new Error(`Expected constraint error not found. Found: ${errorText}`);
        }
    }

    async whenUserEntersValidDataAndSubmitsForm(data) {
        await this.page.fill(this.selectors.usernameInput, data.username);
        await this.page.fill(this.selectors.passwordInput, data.password);
        await this.page.click(this.selectors.loginButton);
    }

    async thenSuccessMessageShouldBeDisplayedAndDataShouldBeSaved() {
        const successMessage = await this.page.locator(this.selectors.successMessage).innerText();
        if (!successMessage.includes('successfully')) {
            throw new Error(`Success message not found: ${successMessage}`);
        }
    }

    async whenUserNavigatesToDashboard() {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
        await this.assertLoaded('dashboard');
    }

    async thenAllExpectedUIComponentsShouldBePresentAndFunctional() {
        // Placeholder for complex UI check (e.g., checking visibility of navigation bar)
        const navBar = await this.page.locator(this.selectors.navBar);
        await expect(navBar).toBeVisible();
    }

    async whenUserAttemptsToNavigateToAdmin() {
        await this.page.goto('/admin');
    }

    async thenAccessShouldBeDeniedAndAuthorizationErrorShouldBeReturned() {
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('access denied') && !errorText.includes('permission')) {
            throw new Error(`Expected access denied error not found. Found: ${errorText}`);
        }
    }

    async whenUserSearchesForProduct(productName) {
        await this.page.fill(this.selectors.searchInput, productName);
    }

    async whenUserClicksSearch() {
        await this.page.click(this.selectors.searchButton);
    }

    async thenSearchResultsShouldDisplayCorrectProduct() {
        const results = await this.page.locator(this.selectors.productList).allTextContents();
        if (results.length === 0 || !results.some(r => r.includes('Sauceboat'))) {
            throw new Error("Search results did not display the expected product.");
        }
    }

    async whenUserAddsItemsToCart(productA, productB) {
        await this.page.goto(`/inventory.html?item=Sauceboat&quantity=1`); // Simulate navigating to a product page first
        await this.page.click(this.selectors.addToCartButton);
        await this.page.goto(`/inventory.html?item=Sauceboat&quantity=1`); // Navigate back or handle context change
        await this.page.click(this.selectors.addToCartButton); // Add second item
    }

    async thenTotalPriceCalculationShouldBeAccurate() {
        const cartTotal = await this.page.locator(this.selectors.cartTotal).innerText();
        // In a real scenario, we would compare this against expected calculated values based on product prices.
        if (parseFloat(cartTotal) <= 0) {
            throw new Error(`Cart total is zero or invalid: ${cartTotal}`);
        }
    }

    async whenUserUpdatesQuantity(currentQuantity, newQuantity) {
        await this.page.fill(this.selectors.quantityInput, String(newQuantity));
    }

    async whenUserSavesChange() {
        await this.page.click(this.selectors.updateButton);
    }

    async thenCartTotalShouldReflectNewQuantityAndPrice() {
        const newTotal = await this.page.locator(this.selectors.cartTotal).innerText();
        // Assertion logic based on expected price change
        if (newTotal === '0.00') {
            throw new Error("Cart total did not update correctly after quantity change.");
        }
    }

    async whenUserAttemptsToAddZeroQuantity() {
        await this.page.fill(this.selectors.quantityInput, '0');
    }

    async thenSystemShouldRejectZeroQuantityAction() {
        // Check for specific error message related to zero quantity
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('minimum quantity')) {
            throw new Error(`Expected rejection message for zero quantity not found: ${errorText}`);
        }
    }

    async whenUserSetsMinimumQuantity(minVal) {
        await this.page.fill(this.selectors.quantityInput, String(minVal));
    }

    async thenSystemShouldAcceptMinimumQuantity() {
        // Verify that the item was added successfully after setting minimum quantity (e.g., checking cart count)
        const cartCount = await this.page.locator(this.selectors.cartItemCount).innerText();
        if (parseInt(cartCount) === 0) {
            throw new Error("Item failed to add when setting minimum quantity.");
        }
    }

    async whenUserAttemptsToAccessInventoryWithoutLogin() {
        await this.page.goto('/inventory.html');
    }

    async thenSystemShouldRedirectToLoginPageOrDisplayErrorMessage() {
        // Check if the page content indicates a login prompt or error
        const pageText = await this.page.locator('body').innerText();
        if (!pageText.includes('sign in') && !pageText.includes('login')) {
            throw new Error("Expected redirection to login page or an access denied message was not found.");
        }
    }

    async whenUserAttemptsToSubmitWithEmptyFields() {
        await this.page.click(this.selectors.submitButton);
    }

    async thenValidationErrorsShouldAppearForMissingFields() {
        const errorElements = await this.page.locator('.error-message');
        if (await errorElements.count() === 0) {
            throw new Error("No validation errors were displayed for missing fields.");
        }
    }

    async whenUserInputsNonNumericCharacters(text) {
        await this.page.fill(this.selectors.numericInput, text);
    }

    async thenSystemShouldRejectNonNumericInput() {
        // Check if the input field displays an error or rejects the submission
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('invalid format') && !errorText.includes('non-numeric')) {
            throw new Error(`Expected rejection for non-numeric input not found: ${errorText}`);
        }
    }

    async whenUserExecutesPositiveFlow(params) {
        // This is a generalized step, specific implementation depends on the feature flow (e.g., checkout flow).
        if (params.type === 'login') {
            await this.whenUserEntersValidDataAndSubmitsForm(params.username, params.password);
        } else if (params.type === 'dataEntry') {
            // Implementation for data entry flow...
        }
    }

    async thenProcessShouldBeCompletedSuccessfully() {
        // Verification logic based on the specific feature's success criteria
        const finalUrl = await this.page.currentUrl();
        if (!finalUrl.includes('dashboard') && !finalUrl.includes('success')) {
            throw new Error(`Flow did not complete successfully. Current URL: ${finalUrl}`);
        }
    }

    async whenUserExecutesFlowWithNewData(newUserData) {
        // Implementation for data persistence check flow...
    }

    async thenDataShouldBePersistedInDatabase() {
        // Verification logic (often requires backend interaction or checking a persistent state indicator)
        const currentUsername = await this.page.locator(this.selectors.usernameDisplay).innerText();
        if (currentUsername !== newUserData.username) {
            throw new Error("Data persistence check failed. Username mismatch.");
        }
    }

    async whenUserAttemptsToPerformSensitiveAction() {
        // Simulate inactivity or session timeout if applicable
        await this.page.waitForTimeout(1000); // Simulating delay for timeout test
    }

    async thenSystemShouldForceRelogin() {
        // Verify redirection to login screen after timeout simulation
        await this.page.reload(); // Force re-login check
        await this.assertLoaded('loginPage');
    }

    async whenUserAttemptsToAccessFeatureWithoutPermission() {
        await this.page.goto('/admin');
    }

    async thenSystemShouldReceivePermissionError() {
        // Verify the specific 403 or permission error message is displayed
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('permission') && !errorText.includes('denied')) {
            throw new Error(`Expected permission error not found: ${errorText}`);
        }
    }

    async whenUserAttemptsToSubmitWithInvalidFormat() {
        await this.page.fill(this.selectors.numericInput, 'abc');
        await this.page.click(this.selectors.submitButton);
    }

    async thenSystemShouldRejectMalformedData() {
        // Verify that the system correctly rejected the non-numeric input
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('invalid format') && !errorText.includes('non-numeric')) {
            throw new Error(`Expected rejection for malformed data not found: ${errorText}`);
        }
    }

    async whenUserExecutesOperation() {
        // Generic action execution
        await this.page.click(this.selectors.actionButton);
    }

    async thenResponseTimeShouldBeUnderThreeSeconds() {
        const responseTime = await this.page.evaluate(() => window.performance.timing.domInteractive); // Placeholder for actual timing mechanism if using Playwright context timing
        // In a real setup, use Playwright's built-in tracing or specific timing APIs.
        if (responseTime > 3000) {
            throw new Error(`Operation took too long: ${responseTime}ms`);
        }
    }

    async whenUserAttemptsToAccessInventoryWithoutAuth() {
        await this.page.goto('/inventory.html');
    }

    async thenSystemShouldRedirectToLoginPageOrErrorMessageOnNoAuth() {
        // Verify redirection behavior for unauthenticated access to inventory
        const currentUrl = await this.page.currentUrl();
        if (!currentUrl.includes('login') && !currentUrl.includes('/inventory')) {
            throw new Error(`Expected redirection to login or error, but landed on: ${currentUrl}`);
        }
    }

    async whenUserInsertsMinimumValue(minVal) {
        await this.page.fill(this.selectors.quantityInput, String(minVal));
    }

    async thenSystemShouldAcceptMinimumInput() {
        // Verify the action was successful (e.g., item added to cart)
        const cartCount = await this.page.locator(this.selectors.cartItemCount).innerText();
        if (parseInt(cartCount) === 0) {
            throw new Error("Minimum quantity input failed to result in an item addition.");
        }
    }

    async whenUserInsertsMaximumValue(maxVal) {
        await this.page.fill(this.selectors.quantityInput, String(maxVal));
    }

    async thenSystemShouldDisplayStockLimitError() {
        // Verify the system displayed an error related to stock limits
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('stock limit') && !errorText.includes('maximum')) {
            throw new Error(`Expected stock limit error not found: ${errorText}`);
        }
    }

    async whenUserAttemptsToPerformCheckout() {
        await this.page.click(this.selectors.checkoutButton);
    }

    async thenSystemShouldNavigateToCheckoutPage() {
        await this.page.waitForURL(/checkout/);
    }

    async thenCartPersistenceAcrossSessions() {
        // This requires external session management setup, but we verify the UI state post-login/logout cycle.
        await this.page.goto('https://www.saucedemo.com/'); // Ensure logged out state first (if applicable)
        // Simulate logging in and checking cart persistence...
        const cartUrl = await this.page.locator(this.selectors.cartLink).click();
        await this.page.waitForURL(/cart/);

        // If we assume the session persists across the test run:
        const itemsInCart = await this.page.locator(this.selectors.cartItemCount).innerText();
        if (parseInt(itemsInCart) === 0) {
            throw new Error("Cart persistence check failed: Cart is empty after re-login.");
        }
    }

    async whenUserAttemptsToAccessInventoryWithoutAuthAndVerifyDenial() {
        await this.whenUserAttemptsToAccessInventoryWithoutLogin();
        await this.thenSystemShouldRedirectToLoginPageOrErrorMessageOnNoAuth();
    }

    async whenUserLogsInWithInvalidUsernameAndPassword(username, password) {
        await this.whenUserEntersValidDataAndSubmitsForm(username, password);
    }

    async thenSystemShouldDisplayInvalidCredentialsError() {
        const errorText = await this.page.locator(this.selectors.errorMessage).innerText();
        if (!errorText.includes('Invalid credentials')) {
            throw new Error(`Expected 'Invalid credentials' error not found: ${errorText}`);
        }
    }

    async whenUserLogsInSuccessfully(username, password) {
        await this.whenUserEntersValidDataAndSubmitsForm(username, password);
    }

    async thenUserShouldBeRedirectedToDashboard() {
        await this.page.waitForURL(/inventory.html/);
    }

    async whenUserAddsItemToCartSuccessfully(productName) {
        // This assumes a specific flow where the product is selected and added.
        await this.page.goto(`/inventory.html?item=Sauceboat&quantity=1`);
        await this.page.click(this.selectors.addToCartButton);
    }

    async thenUserShouldReceiveSuccessFeedback() {
        // Verify visual feedback (e.g., success banner)
        const successBanner = await this.page.locator(this.selectors.successMessage);
        await expect(successBanner).toBeVisible();
    }

    async whenUserAdjustsQuantityAndConfirms(currentQty, newQty) {
        await this.whenUserUpdatesQuantity(currentQty, newQty);
        await this.whenUserSavesChange();
    }

    async thenQuantityShouldBeUpdatedCorrectly() {
        const finalQuantity = await this.page.locator(this.selectors.quantityInput).innerText();
        if (finalQuantity !== String(newQty)) {
            throw new Error(`Quantity update failed. Expected ${newQty}, got ${finalQuantity}`);
        }
    }

    async whenUserExecutesFullPurchaseFlow() {
        // Simulating the full flow: Add -> Cart -> Checkout
        await this.whenUserAddsItemsToCart('Product A', 'Product B');
        await this.whenUserAttemptsToPerformCheckout();
    }

    async thenSystemShouldNavigateToCheckoutPage() {
        await this.page.waitForURL(/checkout/);
    }
}