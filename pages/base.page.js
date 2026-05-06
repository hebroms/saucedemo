import page from 'playwright';
import ENVIRONMENTS from '../constants/environment.constants';
import selectors from '../elements/base.elements';

class BasePage {
  /**
   * @param {page} page The Playwright Page object.
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigates to a specified route using the current environment context.
   * @param {string} route The path to navigate to.
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
    throw new Error('assertPageLoaded method must be implemented by subclasses.');
  }

  // --- Global Element Methods based on selectors ---

  async getHeaderContainer() {
    return await this.page.locator(selectors.headerContainer).waitFor();
  }

  async getPrimaryHeader() {
    return await this.page.locator(selectors.primaryHeader).waitFor();
  }

  async getOpenMenuToggle() {
    return await this.page.locator(selectors.openMenuToggle).waitFor();
  }

  async getShoppingCartLink() {
    return await this.page.locator(selectors.shoppingCartLink).waitFor();
  }

  async getSecondaryHeader() {
    return await this.page.locator(selectors.secondaryHeader).waitFor();
  }

  async getProductSortContainer() {
    return await this.page.locator(selectors.productSortContainer).waitFor();
  }
}

export default BasePage;