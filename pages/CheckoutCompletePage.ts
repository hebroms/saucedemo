import { BasePage } from './BasePage';
import * as Elements from '../elements/CheckoutCompletePageElements';
import { PageObject } from '../interface/types';

/**
 * Page Object para o CheckoutCompletePage.
 */
export class CheckoutCompletePage extends BasePage implements PageObject<BasePage> {
  constructor(page: any) {
    super(page);
  }

  /**
   * Realiza a navegação para a página de conclusão do checkout.
   */
  async navigateToCheckoutComplete(): Promise<void> {
    await this.navigate(ROUTES.CHECKOUT_COMPLETE);
  }
}