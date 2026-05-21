import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { CheckoutStepOneElements } from '../elements/CheckoutStepOneElements'

export class CheckoutStepOnePage extends BasePage {
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsCheckoutYourInformation = this.page.locator(CheckoutStepOneElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsCheckoutYourInformation)
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs = this.page.locator(CheckoutStepOneElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs)
  readonly openMenu = this.page.locator(CheckoutStepOneElements.openMenu)
  readonly openMenu = this.page.locator(CheckoutStepOneElements.openMenu)
  readonly img = this.page.locator(CheckoutStepOneElements.img)
  readonly a = this.page.locator(CheckoutStepOneElements.a)

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/checkout-step-one.html')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/checkout-step-one.html')
  }
}
