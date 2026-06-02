import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { CheckoutCompleteElements } from '../elements/CheckoutCompleteElements'

export class CheckoutCompletePage extends BasePage {
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsCheckoutComplete = this.page.locator(CheckoutCompleteElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsCheckoutComplete)
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs = this.page.locator(CheckoutCompleteElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs)
  readonly openMenu = this.page.locator(CheckoutCompleteElements.openMenu)
  readonly openMenu = this.page.locator(CheckoutCompleteElements.openMenu)
  readonly img = this.page.locator(CheckoutCompleteElements.img)
  readonly a = this.page.locator(CheckoutCompleteElements.a)

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/checkout-complete.html')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/checkout-complete.html')
  }
}
