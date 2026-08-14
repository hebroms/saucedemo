import { BasePage } from './BasePage';
import * as Elements from '../elements/CartPageElements';
import { PageElementLocators, ElementLocators } from '../interface/types';

export class CartPage extends BasePage {
  public locators: PageElementLocators;

  constructor(page: Page) {
    super(page);
    this.locators = Elements.CartPageElements;
  }
}