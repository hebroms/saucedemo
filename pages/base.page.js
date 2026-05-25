import { expect } from 'playwright';
import { ENVIRONMENTS } from '../constants/environment.constants';
import * as baseElements from '../elements/base.elements';

class BasePage {
    /**
     * @param {import('playwright').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigates to a specific route using the current environment setting.
     * @param {string} route
     * @returns {Promise<void>}
     */
    async navigate(route) {
        const fullRoute = `${ENVIRONMENTS.current}${route}`;
        await this.page.goto(fullRoute);
    }

    /**
     * Asserts that the page has finished loading. Subclasses must override this.
     * @returns {Promise<void>}
     */
    async assertPageLoaded() {
        // Default implementation does nothing, forcing subclasses to implement specific checks.
    }

    // --- Methods for Global Elements (Assuming these map directly to baseElements) ---

    /**
     * Logs the user out.
     * @returns {Promise<void>}
     */
    async logout() {
        // Placeholder implementation based on assumed selector structure
        await this.page.click(baseElements.logoutButton);
    }

    /**
     * Opens the shopping cart.
     * @returns {Promise<void>}
     */
    async openCart() {
        // Placeholder implementation based on assumed selector structure
        await this.page.click(baseElements.openCartLink);
    }

    // Add other global methods as defined in base.elements here...
}

export default BasePage;