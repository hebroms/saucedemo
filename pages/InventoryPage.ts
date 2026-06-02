import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { InventoryElements } from '../elements/InventoryElements'

export class InventoryPage extends BasePage {
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsProductsNameAtoZNameAtoZNam = this.page.locator(InventoryElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabsProductsNameAtoZNameAtoZNam)
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs = this.page.locator(InventoryElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs)
  readonly openMenu = this.page.locator(InventoryElements.openMenu)
  readonly openMenu = this.page.locator(InventoryElements.openMenu)
  readonly img = this.page.locator(InventoryElements.img)
  readonly a = this.page.locator(InventoryElements.a)

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/inventory.html')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/inventory.html')
  }
}
