import { BasePage } from './BasePage';
import { ElementLocators } from '../interface/types';
import { CheckoutCompletePageElements } from '../elements/CheckoutCompletePageElements';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page, locators: ElementLocators) {
    super(page, locators);
  }

  async loadAndVerify(): Promise<void> {
    await this.navigate(ROUTES.checkoutComplete);
    await this.waitForLoad();
  }
}