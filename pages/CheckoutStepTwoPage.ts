import { BasePage } from './BasePage';
import { ElementLocators } from '../interface/types';
import { CheckoutStepTwoPageElements } from '../elements/CheckoutStepTwoPageElements';

export class CheckoutStepTwoPage extends BasePage {
  constructor(page: Page, locators: ElementLocators) {
    super(page, locators);
  }

  async loadAndVerify(): Promise<void> {
    await this.navigate(ROUTES.checkoutStepTwo);
    await this.waitForLoad();
  }
}