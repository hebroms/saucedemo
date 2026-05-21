import { BasePage } from './BasePage';
import { ElementLocators } from '../interface/types';
import { CheckoutStepOnePageElements } from '../elements/CheckoutStepOnePageElements';

export class CheckoutStepOnePage extends BasePage {
  constructor(page: Page, locators: ElementLocators) {
    super(page, locators);
  }

  async loadAndVerify(): Promise<void> {
    await this.navigate(ROUTES.checkoutStepOne);
    await this.waitForLoad();
  }
}