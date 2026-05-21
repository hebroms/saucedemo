import { BasePage } from './BasePage';
import { ElementLocators } from '../interface/types';
import { HomePageElements } from '../elements/HomePageElements';

export class HomePage extends BasePage {
  constructor(page: Page, locators: ElementLocators) {
    super(page, locators);
  }

  async loadAndVerify(): Promise<void> {
    await this.navigate(ROUTES.home);
    await this.waitForLoad();
    // Add specific home page assertions if needed
  }
}