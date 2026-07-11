import { BasePage } from './BasePage';
import * as Elements from '../elements/InventoryPageElements';
import { PageObject } from '../interface/types';

/**
 * Page Object para a InventoryPage.
 */
export class InventoryPage extends BasePage implements PageObject<BasePage> {
  constructor(page: any) {
    super(page);
  }

  /**
   * Navega para a página de inventário.
   */
  async navigateToInventory(): Promise<void> {
    await this.navigate(ROUTES.INVENTORY);
  }

  /**
   * Adiciona um item ao carrinho (usando ID fixo 4).
   */
  async addToCart(itemId: string): Promise<void> {
    const itemLocator = this.elements.inventoryItem.filter({ hasText: itemId });
    if (itemLocator.count() > 0) {
      await itemLocator.locator('.add-to-cart-button').click();
    } else {
      throw new Error(`Item with ID ${itemId} not found on inventory page.`);
    }
  }
}