const baseElements = require('../elements/base.elements');
const ENVIRONMENTS = require('../constants/environment.constants');

class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(route) {
        const fullRoute = `${ENVIRONMENTS.current}${route}`;
        await this.page.goto(fullRoute);
    }

    async assertPageLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getHeaderContainer() {
        return this.page.locator(baseElements.headerContainer);
    }

    async getPrimaryHeader() {
        return this.page.locator(baseElements.primaryHeader);
    }

    async getShoppingCartLink() {
        return this.page.locator(baseElements.shoppingCartLink);
    }

    async getProductSortContainer() {
        return this.page.locator(baseElements.productSortContainer);
    }

    // Placeholder methods for other global elements if they existed (e.g., logout, openCart)
    async logout() {
        // Implementation depends on actual selector logic, assumed to be handled by subclass or specific implementation
    }

    async openCart() {
        // Implementation depends on actual selector logic
    }
}

module.exports = BasePage;