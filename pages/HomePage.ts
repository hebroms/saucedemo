import { BasePage } from './BasePage';
import * as Elements from '../elements/HomePageElements';
import { PageElementLocators, ElementLocators } from '../interface/types';

export class HomePage extends BasePage {
  public locators: PageElementLocators;

  constructor(page: Page) {
    super(page);
    // Initialize locators using the specific element file
    this.locators = Elements.HomePageElements;
  }

  async login(username: string, password: string): Promise<void> {
    await this.navigate(ROUTES.login);
    await this.page.fill(this.locators.usernameInput, username);
    await this.page.fill(this.locators.passwordInput, password);
    await this.page.click(this.locators.loginButton);
  }
}