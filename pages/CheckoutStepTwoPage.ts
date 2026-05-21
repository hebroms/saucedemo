import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { CheckoutStepTwoElements } from '../elements/CheckoutStepTwoElements'

export class CheckoutStepTwoPage extends BasePage {
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsCheckoutOverview = this.page.locator(CheckoutStepTwoElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsCheckoutOverview)
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs = this.page.locator(CheckoutStepTwoElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs)
  readonly openMenu = this.page.locator(CheckoutStepTwoElements.openMenu)
  readonly openMenu = this.page.locator(CheckoutStepTwoElements.openMenu)
  readonly img = this.page.locator(CheckoutStepTwoElements.img)
  readonly a = this.page.locator(CheckoutStepTwoElements.a)

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/checkout-step-two.html')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/checkout-step-two.html')
  }
}
