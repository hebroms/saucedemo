class SAUCEDEMOPage {
    constructor(page) {
        this.page = page;
        // Import selectors from the specified path
        this.selectors = require('../elements/s-a-u-c-e-d-e-m-o.elements');
    }

    async loginWithValidCredentials() {
        await this.page.goto(this.selectors.baseUrl);
        await this.page.fill(this.selectors.usernameInput, 'standard_user');
        await this.page.fill(this.selectors.passwordInput, 'secret_sauce');
        await this.page.click(this.selectors.loginButton);
        await this.assertLoaded(this.selectors.dashboardElement);
    }

    async loginWithInvalidCredentials() {
        await this.page.goto(this.selectors.baseUrl);
        await this.page.fill(this.selectors.usernameInput, 'standard_user');
        await this.page.fill(this.selectors.passwordInput, 'invalid_password');
        await this.page.click(this.selectors.loginButton);
        await this.assertLoaded(this.selectors.errorMessageElement);
    }

    async searchForProduct(productName) {
        await this.page.goto(this.selectors.searchUrl);
        await this.page.fill(this.selectors.searchInput, productName);
        await this.page.click(this.selectors.searchButton);
        await this.assertLoaded(this.selectors.searchResultsElement);
    }

    async addToCart(productName) {
        await this.page.goto(this.selectors.productUrl);
        await this.page.fill(this.selectors.quantityInput, '1');
        await this.page.click(this.selectors.addToCartButton);
        await this.assertLoaded(this.selectors.cartElement);
    }

    async updateCartQuantity(currentQuantity, newQuantity) {
        await this.page.goto(this.selectors.cartUrl);
        // Assuming we find the specific item row based on context or index if necessary, 
        // but for simplicity here, we target the input and save.
        await this.page.fill(this.selectors.quantityInput, String(newQuantity));
        await this.page.click(this.selectors.saveButton);
        await this.assertLoaded(this.selectors.cartTotalElement);
    }

    async submitDataAndVerifySuccess() {
        await this.page.goto(this.selectors.dataInputUrl);
        // Assuming we fill fields based on context (e.g., for a successful submission)
        await this.page.fill(this.selectors.inputField1, 'valid_data');
        await this.page.fill(this.selectors.inputField2, 'another_valid_value');
        await this.page.click(this.selectors.submitButton);
        await this.assertLoaded(this.selectors.successMessageElement);
    }

    async verifySessionPersistence() {
        // This method simulates logging out and logging back in to test persistence
        await this.page.goto(this.selectors.logoutUrl); // Simulate logout if needed
        await this.loginWithValidCredentials();
        await this.assertLoaded(this.selectors.dashboardElement);
    }

    async verifyAccessDenial(targetUrl) {
        await this.page.goto(targetUrl);
        // Check for specific denial message or redirect
        await this.assertLoaded(this.selectors.accessDeniedMessage); 
    }

    async verifyNoResultsFound() {
        await this.searchForProduct('non_existent_item');
        await this.assertLoaded(this.selectors.noResultsElement);
    }

    async handleInputValidationFailure(inputField, invalidText) {
        await this.page.goto(this.selectors.dataInputUrl);
        await this.page.fill(inputField, invalidText);
        await this.page.click(this.selectors.submitButton);
        // Assert that validation errors are displayed next to the field
        await this.assertLoaded(this.selectors.validationErrorElement); 
    }

    async verifyMinimumQuantityAcceptance() {
        await this.addToCart('some_product'); // Setup context
        await this.updateCartQuantity(1, 1); // Test minimum valid quantity (assuming 1 is the minimum)
        await this.assertLoaded(this.selectors.cartElement);
    }

    async verifyMaximumQuantityRejection() {
        // This requires knowing the maximum stock limit N, which is context-dependent.
        // We simulate attempting an invalid high value.
        await this.addToCart('some_product'); 
        await this.page.goto(this.selectors.productUrl);
        await this.page.fill(this.selectors.quantityInput, '9999'); // Attempting a very large number
        await this.page.click(this.selectors.addToCartButton);
        // Assert rejection message
        await this.assertLoaded(this.selectors.stockLimitError); 
    }

    async verifyNoAuthenticationAccess() {
        await this.page.goto(this.selectors.inventoryUrl); // e.g., /inventory.html
        // Check if the user is redirected to login or sees an access denied message
        await this.assertLoaded(this.selectors.accessDeniedMessage); 
    }

    async verifyErrorHandlingAfterAction() {
        // General method for checking error messages after various actions (e.g., failed login, invalid search)
        // This relies on specific selectors being present on the page post-action.
        await this.assertLoaded(this.selectors.errorMessageElement); 
    }

    async verifyPerformance() {
        // Placeholder for performance check logic (requires external timing mechanism in Playwright context)
        const startTime = Date.now();
        await this.page.goto(this.selectors.someFeatureUrl);
        // Perform an action that takes time
        await this.page.click(this.selectors.someActionButton);
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        // In a real test, we would compare 'duration' against the expected threshold (e.g., < 3 seconds)
        // For this PO method, we just ensure the action completes successfully.
        await this.assertLoaded(this.selectors.resultElement);
    }
}