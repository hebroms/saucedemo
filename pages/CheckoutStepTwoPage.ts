import { BasePage } from './BasePage';
import * as Elements from '../elements/CheckoutStepTwoPageElements';
import { PageObject } from '../interface/types';

/**
 * Page Object para o CheckoutStepTwoPage.
 */
export class CheckoutStepTwoPage extends BasePage implements PageObject<BasePage> {
  constructor(page: any) {
    super(page);
  }

  /**
   * Realiza a navegação para a segunda etapa do checkout.
   */
  async navigateToCheckoutStepTwo(): Promise<void> {
    await this.navigate(ROUTES.CHECKOUT_STEP_TWO);
  }
}