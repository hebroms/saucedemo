import { Page } from '@playwright/test'

export class BaseElements {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Shared header/navigation elements present on all pages
  get cartIcon() { return this.page.locator('[data-test="shopping-cart-link"], .shopping_cart_link') }
  get menuButton() { return this.page.locator('#react-burger-menu-btn, [aria-label="Open Menu"]') }
  get pageTitle() { return this.page.locator('.title, h1') }
}
