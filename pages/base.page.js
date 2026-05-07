const { expect } = require('playwright');
const ENVIRONMENTS = require('../constants/environment.constants');
const elements = require('../elements/base.elements');

class BasePage {
    /**
     * @param {import('playwright').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigates to a specified route using the current environment context.
     * @param {string} route
     * @returns {Promise<void>}
     */
    async navigate(route) {
        const url = `${ENVIRONMENTS.current}${route}`;
        await this.page.goto(url);
    }

    /**
     * Asserts that the page has finished loading. Subclasses must override this.
     * @returns {Promise<void>}
     */
    async assertPageLoaded() {
        // Default implementation does nothing, allowing subclasses to enforce specific checks.
    }

    // --- Global Element Methods based on base.elements ---

    /**
     * Gets the header container element.
     * @returns {import('playwright').Locator}
     */
    async getHeaderContainer() {
        return this.page.locator(elements.headerContainer);
    }

    /**
     * Gets the primary header element.
     * @returns {import('playwright').Locator}
     */
    async getPrimaryHeader() {
        return this.page.locator(elements.primaryHeader);
    }

    /**
     * Toggles the menu (e.g., opens/closes navigation menu).
     * @returns {Promise<void>}
     */
    async openMenu() {
        await this.page.locator(elements.openMenuToggle).click();
    }

    /**
     * Clicks the shopping cart link.
     * @returns {Promise<void>}
     */
    async openCart() {
        await this.page.locator(elements.shoppingCartLink).click();
    }

    /**
     * Gets the secondary header element.
     * @returns {import('playwright').Locator}
     */
    async getSecondaryHeader() {
        return this.page.locator(elements.secondaryHeader);
    }

    /**
     * Logs the user out (Placeholder action).
     * @returns {Promise<void>}
     */
    async logout() {
        // Implementation specific to the application's logout flow
        // Example: await this.page.locator('#logout-button').click();
    }

    /**
     * Opens the main cart view (Placeholder action).
     * @returns {Promise<void>}
     */
    async openCartView() {
        await this.openCart();
    }
}

module.exports = BasePage;