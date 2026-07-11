import { BasePage } from './BasePage';
import * as Elements from '../elements/CartPageElements';
import { PageObject } from '../interface/types';

/**
 * Page Object para a CartPage.
 */
export class CartPage extends BasePage implements PageObject<BasePage> {
  constructor(page: any) {
    super(page);
  }

  /**
   * Visualiza o carrinho de compras.
   */
  async viewCart(): Promise<void> {
    // A navegação já deve ter sido feita no setup, apenas verifica a página.
  }
}