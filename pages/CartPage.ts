import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { CartElements } from '../elements/CartElements'

export class CartPage extends BasePage {
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsYourCart = this.page.locator(CartElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsYourCart)
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs = this.page.locator(CartElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs)
  readonly openMenu = this.page.locator(CartElements.openMenu)
  readonly openMenu = this.page.locator(CartElements.openMenu)
  readonly img = this.page.locator(CartElements.img)
  readonly a = this.page.locator(CartElements.a)

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/cart.html')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/cart.html')
  }
}
