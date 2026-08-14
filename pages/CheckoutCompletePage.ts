import { BasePage } from './BasePage';
import * as Elements from '../elements/CheckoutCompletePageElements';
import { PageElementLocators, ElementLocators } from '../interface/types';

export class CheckoutCompletePage extends BasePage {
  public locators: PageElementLocators;

  constructor(page: Page) {
    super(page);
    this.locators = Elements.CheckoutCompletePageElements;
  }
}