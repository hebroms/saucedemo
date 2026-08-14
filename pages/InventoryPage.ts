import { BasePage } from './BasePage';
import * as Elements from '../elements/InventoryPageElements';
import { PageElementLocators, ElementLocators } from '../interface/types';

export class InventoryPage extends BasePage {
  public locators: PageElementLocators;

  constructor(page: Page) {
    super(page);
    this.locators = Elements.InventoryPageElements;
  }

  async viewItem(itemId: string): Promise<void> {
    await this.navigate(ROUTES.inventoryItem(itemId));
  }
}