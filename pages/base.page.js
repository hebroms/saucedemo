const { chromium } = require('playwright');
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

    async getOpenMenuToggle() {
        return this.page.locator(baseElements.openMenuToggle);
    }

    async getShoppingCartLink() {
        return this.page.locator(baseElements.shoppingCartLink);
    }
}

module.exports = BasePage;