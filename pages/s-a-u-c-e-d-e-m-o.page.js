import {
    // Assuming these selectors are imported from the specified path
    loginPage,
    usernameInput,
    passwordInput,
    loginButton,
    errorMessage,
    productNameInput,
    quantityInput,
    addToCartButton,
    cartTotal,
    checkoutButton,
    inventoryLink,
    searchBar,
    searchResults,
    // ... other necessary selectors from the imported file
} from '../elements/s-a-u-c-e-d-e-m-o.elements';

class SAUCEDEMOPage {
    constructor(page) {
        this.page = page;
    }

    async givenUserIsOnLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
        await this.assertLoaded(loginPage);
    }

    async whenUserEntersValidCredentials(username, password) {
        await this.page.fill(usernameInput, username);
        await this.page.fill(passwordInput, password);
    }

    async whenUserClicksLogin() {
        await this.page.click(loginButton);
    }

    async thenErrorMessageIsDisplayed(expectedMessage) {
        await this.assertLoaded(errorMessage);
        const actualText = await this.page.textContent(errorMessage);
        if (!actualText.includes(expectedMessage)) {
            throw new Error(`Expected error message "${expectedMessage}" not found. Found: ${actualText}`);
        }
    }

    async whenUserEntersValidDataAndSubmitsForm(data) {
        // Placeholder for general data submission logic, assuming context is set
        await this.page.fill(productNameInput, data.name);
        await this.page.fill(quantityInput, data.quantity);
        await this.page.click(addToCartButton);
    }

    async thenSuccessMessageIsDisplayed() {
        // Placeholder for checking success message visibility
        await this.assertLoaded(errorMessage); // Reusing error message element to check for success state if applicable
        const successText = await this.page.textContent('h1'); // Example assertion
        if (!successText.includes('Success')) {
            throw new Error("Success message was not displayed.");
        }
    }

    async whenUserNavigatesToDashboard() {
        await this.page.click('dashboard'); // Assuming a navigation element exists
    }

    async thenAllExpectedUIComponentsArePresentAndFunctional() {
        await this.assertLoaded(inventoryLink);
        // Add checks for other dashboard elements here
    }

    async whenUserSearchesForProduct(productName) {
        await this.page.fill(searchBar, productName);
    }

    async whenUserClicksSearch() {
        await this.page.click(searchResults);
    }

    async thenSearchResultsDisplayCorrectProduct(expectedName) {
        await this.assertLoaded(searchResults);
        const results = await this.page.locator('.inventory-item').allTextContents();
        if (!results.some(r => r.includes(expectedName))) {
            throw new Error(`Search results did not display the expected product: ${expectedName}`);
        }
    }

    async whenUserAddsItemsToCart(productA, productB) {
        // This method would typically involve navigating to product pages and adding items sequentially.
        await this.page.goto(`/product/${productA}`);
        await this.page.click(addToCartButton);
        await this.page.goto(`/product/${productB}`);
        await this.page.click(addToCartButton);
    }

    async whenUserUpdatesQuantity(currentQuantity, newQuantity) {
        // This requires finding the specific item row and updating its quantity input
        const itemRow = await this.page.locator(`[data-testid="item-${currentQuantity}"]`);
        await this.page.fill(quantityInput, newQuantity);
    }

    async whenUserSavesChange() {
        // Assuming there is a save button associated with the cart update
        await this.page.click('save'); 
    }

    async thenCartTotalReflectsNewQuantityAndPrice(expectedTotal) {
        await this.assertLoaded(cartTotal);
        const actualTotal = await this.page.locator(cartTotal).innerText();
        if (actualTotal !== expectedTotal) {
            throw new Error(`Cart total mismatch. Expected: ${expectedTotal}, Actual: ${actualTotal}`);
        }
    }

    async whenUserAttemptsToNavigateToAdmin() {
        await this.page.goto('/admin');
    }

    async thenAccessIsDenied(expectedError) {
        // Check for specific denial messages or redirection status codes if possible via Playwright context
        const content = await this.page.content();
        if (!content.includes('Access Denied') && !content.includes('403')) {
            throw new Error(`Expected access denial, but received unexpected content: ${content}`);
        }
    }

    async whenUserAttemptsToSubmitWithEmptyFields() {
        // This method would target a form submission where fields are intentionally left blank
        await this.page.click('submit'); 
    }

    async thenValidationErrorsAppear(expectedErrorCount) {
        // Check for the presence of specific error indicators next to required fields
        const errors = await this.page.locator('.error-message').all();
        if (errors.length < expectedErrorCount) {
            throw new Error(`Expected ${expectedErrorCount} validation errors, but found only ${errors.length}.`);
        }
    }

    async whenUserAttemptsToPerformSensitiveAction() {
        // Placeholder for actions that might trigger session timeouts
        await this.page.click('some_sensitive_button'); 
    }

    async thenSystemForcesRelogin() {
        // Check if the page redirects to the login screen
        if (await this.page.url().includes('/login')) {
            console.log("Successfully forced re-login.");
        } else {
            throw new Error("Session timeout did not result in a redirect to the login page.");
        }
    }

    async whenUserAttemptsToAccessInventoryWithoutLogin() {
        await this.page.goto('/inventory.html');
    }

    async thenAccessIsBlocked(expectedError) {
        // Check if the inventory page displays an access denial message instead of content
        const content = await this.page.content();
        if (content.includes('Access Denied')) {
            console.log("Inventory access successfully blocked.");
        } else {
            throw new Error(`Expected access to be blocked, but found unexpected content: ${content}`);
        }
    }

    async whenUserEntersNonNumericData(text) {
        await this.page.fill(quantityInput, text);
    }

    async thenSystemRejectsInputWithFormatError() {
        // Check if an error message related to format rejection is visible
        const error = await this.page.locator('.error-message');
        if (!await error.isVisible()) {
            throw new Error("Expected a format error message after entering non-numeric data.");
        }
    }

    async whenUserExecutesOperation(operationName) {
        // Generic action execution placeholder
        console.log(`Executing operation: ${operationName}`);
        await this.page.click('execute_action'); 
    }

    async thenSystemHandlesExternalError(expectedMessage) {
        // Check for specific error messages related to external service failure
        const error = await this.page.locator('.error-message');
        if (!await error.isVisible() || !await error.textContent().includes(expectedMessage)) {
            throw new Error(`Expected system to handle external error with message: ${expectedMessage}`);
        }
    }

    async whenUserPerformsFlowWithNewData(newUserData) {
        // General flow execution method
        await this.page.fill('username_field', newUserData.username);
        await this.fill('password_field', newUserData.password);
        await this.click('login_button');
    }

    async thenDataIsPersisted(expectedData) {
        // Verification step for data persistence (requires checking the state after a session change)
        const currentData = await this.page.locator('body').innerText();
        if (!currentData.includes(expectedData.name)) {
            throw new Error(`Data was not persisted correctly. Expected to find: ${expectedData.name}`);
        }
    }

    async whenUserExecutesPositiveFlow(parameters) {
        // Executes the main positive flow (e.g., Add to Cart -> Checkout simulation)
        await this.page.fill('product_name', parameters.productName);
        await this.fill('quantity', parameters.quantity);
        await this.click('add_to_cart');
    }

    async thenProcessIsSuccessful(expectedOutcome) {
        // Verifies the final outcome of a successful process
        const result = await this.page.locator('.success-message').innerText();
        if (!result.includes(expectedOutcome)) {
            throw new Error(`Process failed. Expected success message, but got: ${result}`);
        }
    }

    async whenUserVerifiesDataSubsequently(data) {
        // Verifies data persistence after an action
        await this.page.reload(); // Simulate session change or navigation back
        await this.thenDataIsPersisted(data);
    }

    async thenTransactionRollback() {
        // Verification for rollback scenario (requires checking state before and after the error)
        const currentState = await this.page.locator('cart_summary').innerText();
        if (!currentState.includes('transaction_failed')) {
            throw new Error("Transaction did not roll back correctly.");
        }
    }

    async whenUserAttemptsToLoginWithInvalidCredentials(username, password) {
        await this.whenUserPerformsFlowWithNewData({ username, password });
    }

    async thenLoginFailsWithInvalidCredentials() {
        // Asserts the specific error message for invalid credentials
        await this.thenErrorMessageIsDisplayed('Invalid credentials');
    }

    async whenUserLogsInSuccessfully(username, password) {
        await this.whenUserPerformsFlowWithNewData({ username, password });
    }

    async thenUserIsRedirectedToDashboard() {
        // Checks if the URL or main content reflects the dashboard state
        if (!await this.page.url().includes('/dashboard')) {
            throw new Error("Login was successful, but user was not redirected to the dashboard.");
        }
    }

    async whenUserAttemptsToAccessFeatureWithoutAuth() {
        // Action leading to unauthorized access attempt
        await this.whenUserAttemptsToNavigateToAdmin(); 
    }

    async thenAccessIsDeniedAsStandardUser() {
        // Verifies the denial message for standard user attempting admin access
        await this.thenAccessIsDenied('Access Denied');
    }

    async whenUserInsertsMinimumValue(field) {
        await this.page.fill(field, 0); // Assuming minimum is 1 or 0 based on context
    }

    async thenSystemAcceptsMinimumInput(field) {
        // Verifies that the system accepts the minimum valid input (e.g., quantity=1)
        const result = await this.page.locator('add_to_cart').click();
        if (!await result.isSuccess()) {
            throw new Error(`Minimum value acceptance failed for field: ${field}`);
        }
    }

    async whenUserInsertsMaximumValue(field) {
        // Assuming maximum stock limit N is known contextually
        await this.page.fill(field, 9999); // Test a high value
    }

    async thenSystemHandlesMaximumInput(field) {
        // Verifies that the system correctly rejects or limits the maximum input
        const result = await this.page.locator('add_to_cart').click();
        if (!await result.isFailure()) {
            throw new Error(`Maximum value handling failed for field: ${field}`);
        }
    }

    async whenUserEntersInvalidFormat(text) {
        // Action to test data type handling (e.g., entering 'abc' into a number field)
        await this.whenUserEntersNonNumericData(text);
    }

    async thenSystemRejectsInputWithFormatError() {
        // Verifies the rejection of non-numeric input
        const error = await this.page.locator('.error-message');
        if (!await error.isVisible()) {
            throw new Error("Expected a format error message after entering non-numeric data.");
        }
    }

    async whenUserExecutesPerformanceTest(operationName) {
        // Executes the operation to measure time
        const startTime = Date.now();
        await this.whenUserExecutesOperation(operationName);
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        console.log(`Execution time for ${operationName}: ${duration.toFixed(2)} seconds`);
    }

    async thenResponseTimeIsWithinLimit(limitSeconds) {
        // Asserts the measured time against the limit
        const duration = (Date.now() - this._startTime) / 1000; // Assuming _startTime is set in whenUserExecutesPerformanceTest
        if (duration > limitSeconds) {
            throw new Error(`Response time (${duration.toFixed(2)}s) exceeded the limit of ${limitSeconds} seconds.`);
        }
    }

    async whenUserAttemptsToAccessInventoryWithoutAuth() {
        // Specific navigation test for inventory access denial
        await this.whenUserAttemptsToAccessInventoryWithoutLogin();
    }

    async thenInventoryAccessIsDenied() {
        // Verifies the specific error message for unauthorized inventory access
        await this.thenAccessIsDenied('Access Denied');
    }

    async whenUserLogsInWithInvalidUsername(username, password) {
        await this.whenUserPerformsFlowWithNewData({ username: username, password: password });
    }

    async thenLoginFailsWithInvalidUsername() {
        // Asserts the specific error message for invalid username
        await this.thenErrorMessageIsDisplayed('Invalid credentials');
    }

    async whenUserLogsInWithInvalidPassword(username, password) {
        await this.whenUserPerformsFlowWithNewData({ username, password });
    }

    async thenLoginFailsWithInvalidPassword() {
        // Asserts the specific error message for invalid password
        await this.thenErrorMessageIsDisplayed('Invalid credentials');
    }

    async whenUserLogsInSuccessfully(username, password) {
        // Successful login flow
        await this.whenUserPerformsFlowWithNewData({ username, password });
    }

    async thenUserIsRedirectedToLoginPage() {
        // Verifies redirection upon failed login attempt
        if (await this.page.url().includes('/login')) {
            console.log("Successfully redirected to login page after failed login.");
        } else {
            throw new Error("Login failure did not redirect to the login page.");
        }
    }

    async whenUserAddsProductToCartSuccessfully(productName) {
        // Positive flow for adding an item
        await this.whenUserExecutesPositiveFlow({ productName: productName, quantity: 1 });
    }

    async thenCartCounterIsUpdated() {
        // Verifies the cart count updated after adding items
        const cartCount = await this.page.locator('.cart-item').count();
        if (cartCount === 0) {
            throw new Error("Cart counter was not updated after adding items.");
        }
    }

    async whenUserAdjustsQuantityAndConfirms(currentQ, newQ) {
        await this.whenUserUpdatesQuantity(currentQ, newQ);
        await this.whenUserSavesChange();
    }

    async thenQuantityIsUpdatedCorrectly(expectedQuantity) {
        // Verifies the displayed quantity reflects the change
        const actualQuantity = await this.page.locator(`[data-testid="item-${expectedQuantity}"]`).locator('input').inputValue();
        if (actualQuantity !== String(expectedQuantity)) {
            throw new Error(`Quantity update failed. Expected ${expectedQuantity}, got ${actualQuantity}`);
        }
    }

    async whenUserPerformsFullPurchaseFlow() {
        // Simulates the full checkout process
        await this.whenUserExecutesPositiveFlow({ productName: 'Sauce Labs Backpack', quantity: 1 });
        await this.page.click('checkout');
    }

    async thenUserNavigatesToCheckoutPage() {
        if (!await this.page.url().includes('/checkout')) {
            throw new Error("Full purchase flow did not lead to the checkout page.");
        }
    }

    async thenCartPersistenceIsVerified(expectedItems) {
        // Verifies that items remain in the cart after logout/login cycle
        await this.page.goto('/logout'); // Simulate logout
        await this.whenUserLogsInSuccessfully('standard_user', 'secret_sauce');
        await this.page.goto('/cart');

        const cartItems = await this.page.locator('.inventory-item').allTextContents();
        if (cartItems.length !== expectedItems.length) {
            throw new Error(`Cart persistence failed. Expected ${expectedItems.length} items, found ${cartItems.length}.`);
        }
    }

    async thenDataIsPersistedAcrossSessions(expectedData) {
        // Specific check for data persistence (re-using the general check logic)
        await this.whenUserVerifiesDataSubsequently(expectedData);
    }

    async whenUserAttemptsToSubmitWithMissingMandatoryFields() {
        // Action to test mandatory field validation failure
        await this.whenUserAttemptsToSubmitWithEmptyFields();
    }

    async thenValidationErrorsAreDisplayedForMissingFields() {
        // Verifies that errors appear next to all missing fields
        await this.thenValidationErrorsAppear(3); // Assuming 3 required fields are missing in the test context
    }

    async whenUserSimulatesExternalServiceFailure() {
        // Action simulating external service failure
        await this.whenUserExecutesOperation('dependent_service');
    }

    async thenSystemHandlesExternalError() {
        // Verifies error handling for external failures
        await this.thenSystemHandlesExternalError('indisponibilidade');
    }

    async whenUserVerifiesTransactionRollback() {
        // Verification of rollback state after an internal error
        await this.thenTransactionRollback();
    }

    async thenSystemRevertsStateToPrevious(expectedState) {
        // Verifies the system reverted to the previous state
        const currentState = await this.page.locator('body').innerText();
        if (!currentState.includes(expectedState)) {
            throw new Error(`State rollback failed. Expected state: ${expectedState}`);
        }
    }

    async whenUserAttemptsToAccessFeatureWithRestrictedRole() {
        // Action attempting to bypass role restrictions
        await this.whenUserAttemptsToAccessFeatureWithoutAuth(); 
    }

    async thenAccessIsBlockedByRole() {
        // Verifies the denial message based on role restriction
        await this.thenAccessIsDenied('Permission Denied');
    }

    async whenUserExhibitsBusinessRule(value) {
        // Action setting a value that triggers a business rule check (e.g., > 100)
        await this.page.fill('some_field', value);
    }

    async thenBusinessRuleMessageIsDisplayed(expectedRule) {
        // Verifies the displayed message based on the inserted value
        const message = await this.page.locator('.rule-message').innerText();
        if (!message.includes(expectedRule)) {
            throw new Error(`Business rule check failed. Expected rule: ${expectedRule}, got: ${message}`);
        }
    }

    async whenUserEntersInvalidCharacters(text) {
        // Action testing input with non-numeric characters
        await this.whenUserEntersInvalidFormat(text);
    }

    async thenSystemRejectsInputWithNonNumericCharacters() {
        // Verifies rejection of mixed data types
        await this.thenSystemRejectsInputWithFormatError();
    }

    async whenUserVerifiesDataConsistencyAcrossSessions() {
        // Regression check for cart persistence across sessions
        await this.thenCartPersistenceIsVerified([{ name: 'Product A', quantity: 1 }]);
    }

    async thenCartItemsPersist() {
        // Final assertion on data consistency
        const items = await this.page.locator('.inventory-item').allTextContents();
        if (items.length === 0) {
            throw new Error("No cart items were found after session change.");
        }
    }

    async whenUserAttemptsToAccessInventory() {
        // Navigation test for inventory access
        await this.whenUserAttemptsToAccessInventoryWithoutAuth();
    }

    async thenInventoryIsBlocked() {
        // Verifies the denial message for unauthorized inventory access
        await this.thenAccessIsDenied('Access Denied');
    }
}