import { BasePage } from './BasePage';
import { ElementLocators } from '../interface/types';
import { InventoryPageElements } from '../elements/InventoryPageElements';

export class InventoryPage extends BasePage {
  constructor(page: Page, locators: ElementLocators) {
    super(page, locators);
  }

  async loadAndVerify(): Promise<void> {
    await this.navigate(ROUTES.inventory);
    await this.waitForLoad();
  }
}