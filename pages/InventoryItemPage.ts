import { Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { InventoryItemElements } from '../elements/InventoryItemElements'

export class InventoryItemPage extends BasePage {
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs6Backtoproducts = this.page.locator(InventoryItemElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs6Backtoproducts)
  readonly openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs6 = this.page.locator(InventoryItemElements.openMenuAllItemsAboutLogoutResetAppStateCloseMenuSwagLabs6)
  readonly openMenu = this.page.locator(InventoryItemElements.openMenu)
  readonly openMenu = this.page.locator(InventoryItemElements.openMenu)
  readonly img = this.page.locator(InventoryItemElements.img)
  readonly 6 = this.page.locator(InventoryItemElements.6)

  constructor(page: Page) {
    super(page)
  }

  async navigateTo(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/inventory-item.html?id=4')
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    return this.page.url().includes('/inventory-item.html')
  }
}
