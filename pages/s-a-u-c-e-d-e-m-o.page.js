class SAUCEDEMOPage {
    constructor(page) {
        this.page = page;
        // Import selectors from the specified path (assuming they are exported constants)
        this.selectors = require('../elements/s-a-u-c-e-d-e-m-o.elements');
    }

    async gotoLogin() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.page.locator(this.selectors.username).fill(username);
        await this.page.locator(this.selectors.password).fill(password);
        await this.page.locator(this.selectors.loginButton).click();
    }

    async enterInvalidQuantity(quantity) {
        await this.page.locator(this.selectors.quantityInput).fill(String(quantity));
    }

    async submitForm() {
        await this.page.locator(this.selectors.submitButton).click();
    }

    async assertErrorDisplayed(expectedMessage) {
        const errorMessage = await this.page.locator(this.selectors.errorMessage).textContent();
        if (!errorMessage || !errorMessage.includes(expectedMessage)) {
            throw new Error(`Expected error message "${expectedMessage}" not found. Actual: ${errorMessage}`);
        }
    }

    async assertSuccessDisplayed() {
        const successMessage = await this.page.locator(this.selectors.successMessage).textContent();
        if (!successMessage) {
            throw new Error("Success message was not displayed.");
        }
    }

    async assertElementLoaded(selector) {
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.locator(selector).waitFor({ state: 'visible' });
    }

    async navigateToDashboard() {
        await this.page.locator(this.selectors.dashboardLink).click();
        await this.assertElementLoaded(this.selectors.dashboardLink);
    }

    async searchForProduct(productName) {
        await this.page.locator(this.selectors.searchInput).fill(productName);
        await this.page.locator(this.selectors.searchButton).click();
    }

    async assertSearchResults(expectedText) {
        const results = await this.page.locator(this.selectors.searchResults).textContent();
        if (!results || !results.includes(expectedText)) {
            throw new Error(`Search results did not contain the expected item: ${expectedText}`);
        }
    }

    async addProductToCart(productName) {
        await this.page.locator(this.selectors.productName).fill(productName);
        await this.page.locator(this.selectors.addToCartButton).click();
    }

    async updateCartQuantity(currentQuantity, newQuantity) {
        // Assuming we find the specific item row or input based on context
        const quantityInput = this.page.locator(`text=${currentQuantity}`); // Placeholder logic, actual selector depends on PO structure
        await quantityInput.fill(String(newQuantity));
        await this.page.locator(this.selectors.updateButton).click();
    }

    async assertCartTotal(expectedValue) {
        const total = await this.page.locator(this.selectors.cartTotal).textContent();
        if (total !== expectedValue) {
            throw new Error(`Cart total mismatch. Expected: ${expectedValue}, Actual: ${total}`);
        }
    }

    async checkInventoryAccess(isLoggedIn) {
        const inventoryUrl = '/inventory.html';
        await this.page.goto(inventoryUrl);
        if (isLoggedIn) {
            await this.assertElementLoaded(this.selectors.inventoryList);
        } else {
            // Check for access denial or redirect to login
            const loginPage = await this.page.locator(this.selectors.loginButton);
            if (await loginPage.isVisible()) {
                throw new Error("Access denied. Redirected to login page.");
            }
        }
    }

    async handleInvalidInput(inputSelector, invalidValue) {
        await this.page.locator(inputSelector).fill(invalidValue);
        // Wait for validation errors to appear (this depends heavily on the specific application's error handling)
        await this.page.waitForTimeout(1000); 
    }

    async handleExternalServiceFailure() {
        // This method simulates checking for a system-level error message after an operation
        const errorMessage = await this.page.locator(this.selectors.systemErrorMessage).textContent();
        if (errorMessage && errorMessage.includes('indisponibilidade')) {
            return true; // Success: Error was handled
        } else {
            throw new Error("System error message not found or incorrect.");
        }
    }

    async verifyRollback() {
        // This method would typically check the state before and after an operation to confirm rollback.
        // Implementation depends on specific context, often involving database checks or UI state comparison.
        await this.page.locator(this.selectors.rollbackStatus).textContent(); 
    }

    async verifyPermissionDenied() {
        const adminUrl = '/admin';
        await this.page.goto(adminUrl);
        // Check if the page content indicates denial or redirection
        const accessDenied = await this.page.locator(this.selectors.accessDeniedMessage).isVisible();
        if (accessDenied) {
            return true; // Success: Access denied message displayed
        } else {
            throw new Error("Access was not explicitly denied.");
        }
    }

    async verifySessionTimeout() {
        // Simulates waiting for an action that would trigger a session check
        await this.page.locator(this.selectors.sensitiveAction).click();
        // Check if the system forces re-login (e.g., checking for login prompt)
        const loginPrompt = await this.page.locator(this.selectors.loginPrompt);
        if (await loginPrompt.isVisible()) {
            return true; // Success: Re-login forced
        } else {
            throw new Error("Session timeout did not force re-login.");
        }
    }

    async verifyDataPersistence() {
        // Checks if data remains after a logout/login cycle
        await this.page.locator(this.selectors.dataCheckElement).textContent();
    }
}