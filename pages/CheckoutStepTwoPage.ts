import { BasePage } from './BasePage';
import * as Elements from '../elements/CheckoutStepTwoPageElements';
import { PageElementLocators, ElementLocators } from '../interface/types';

export class CheckoutStepTwoPage extends BasePage {
  public locators: PageElementLocators;

  constructor(page: Page) {
    super(page);
    this.locators = Elements.CheckoutStepTwoPageElements;
  }
}