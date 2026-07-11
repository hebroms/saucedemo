import { BasePage } from './BasePage';
import * as Elements from '../elements/CheckoutStepOnePageElements';
import { PageObject } from '../interface/types';

/**
 * Page Object para o CheckoutStepOnePage.
 */
export class CheckoutStepOnePage extends BasePage implements PageObject<BasePage> {
  constructor(page: any) {
    super(page);
  }

  /**
   * Realiza a navegação para a primeira etapa do checkout.
   */
  async navigateToCheckoutStepOne(): Promise<void> {
    await this.navigate(ROUTES.CHECKOUT_STEP_ONE);
  }
}