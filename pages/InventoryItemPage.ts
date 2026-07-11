import { BasePage } from './BasePage';
import * as Elements from '../elements/InventoryItemPageElements';
import { PageObject } from '../interface/types';

/**
 * Page Object para a InventoryItemPage.
 */
export class InventoryItemPage extends BasePage implements PageObject<BasePage> {
  constructor(page: any) {
    super(page);
  }

  /**
   * Visualiza o item específico com ID 4.
   */
  async viewSpecificItem(): Promise<void> {
    // Exemplo de ação específica para o item com ID=4
    const itemLocator = this.elements.inventoryItem.filter({ hasText: '4' });
    if (itemLocator.count() > 0) {
        await itemLocator.locator('.back-to-products').click();
    } else {
        throw new Error("Item with ID 4 not found.");
    }
  }
}