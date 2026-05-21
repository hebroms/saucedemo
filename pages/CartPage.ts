import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { CartElements } from '../elements/CartElements'

export class CartPage extends BasePage {
  readonly root = this.page.locator('body')

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/cart')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/cart')
  }
}
