import { BasePage } from './BasePage';
import * as Elements from '../elements/CheckoutStepOnePageElements';
import { PageElementLocators, ElementLocators } from '../interface/types';

export class CheckoutStepOnePage extends BasePage {
  public locators: PageElementLocators;

  constructor(page: Page) {
    super(page);
    this.locators = Elements.CheckoutStepOnePageElements;
  }
}