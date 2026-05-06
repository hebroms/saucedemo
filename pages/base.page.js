const { expect } = require('playwright');
const ENVIRONMENTS = require('../constants/environment.constants');
const baseElements = require('../elements/base.elements');

class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(route) {
        const url = `${ENVIRONMENTS.current}${route}`;
        await this.page.goto(url);
    }

    async assertPageLoaded() {
        throw new Error('assertPageLoaded must be implemented by subclass');
    }

    async getHeaderContainer() {
        return this.page.locator(baseElements.headerContainer);
    }

    async getPrimaryHeader() {
        return this.page.locator(baseElements.primaryHeader);
    }

    async getOpenMenu() {
        return this.page.locator(baseElements.openMenu);
    }

    async getShoppingCartLink() {
        return this.page.locator(baseElements.shoppingCartLink);
    }

    // Add other necessary base methods here if required by the framework structure, 
    // but based strictly on the provided elements, these cover the requirements.
}

module.exports = BasePage;