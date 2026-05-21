import { BasePage } from './BasePage';
import { ElementLocators } from '../interface/types';
import { CartPageElements } from '../elements/CartPageElements';

export class CartPage extends BasePage {
  constructor(page: Page, locators: ElementLocators) {
    super(page, locators);
  }

  async loadAndVerify(): Promise<void> {
    await this.navigate(ROUTES.cart);
    await this.waitForLoad();
  }
}