import { BasePage } from './BasePage';
import { ElementLocators } from '../interface/types';
import { InventoryItemPageElements } from '../elements/InventoryItemPageElements';

export class InventoryItemPage extends BasePage {
  constructor(page: Page, locators: ElementLocators) {
    super(page, locators);
  }

  async loadAndVerify(): Promise<void> {
    // Assuming the URL already contains the ID parameter (e.g., /inventory-item.html?id=4)
    await this.navigate(ROUTES.inventoryItem);
    await this.waitForLoad();
  }
}