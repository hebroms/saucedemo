const { expect } = require('playwright');
const ENVIRONMENTS = require('../constants/environment.constants');
const elements = require('../elements/base.elements');

class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(route) {
        const fullRoute = `${ENVIRONMENTS.current}${route}`;
        await this.page.goto(fullRoute);
    }

    async assertPageLoaded() {
        await expect(this.page).toBeLoaded();
    }

    async openMenu() {
        await this.page.click(elements.openMenuToggle);
    }

    async openCart() {
        await this.page.click(elements.shoppingCartLink);
    }

    async getHeaderContainer() {
        return this.page.locator(elements.headerContainer);
    }

    async getPrimaryHeader() {
        return this.page.locator(elements.primaryHeader);
    }

    async getOpenMenuToggle() {
        return this.page.locator(elements.openMenuToggle);
    }

    async getShoppingCartLink() {
        return this.page.locator(elements.shoppingCartLink);
    }

    // Placeholder methods for other potential global elements if they existed in base.elements
    // Example: async logout() { /* implementation */ }
}

module.exports = BasePage;