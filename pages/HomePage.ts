import { BasePage } from './BasePage';
import * as Elements from '../elements/HomePageElements';
import { PageObject } from '../interface/types';

/**
 * Page Object para a HomePage.
 */
export class HomePage extends BasePage implements PageObject<BasePage> {
  constructor(page: any) {
    super(page);
  }

  /**
   * Realiza o login do usuário.
   */
  async login(user: { username: string; password: string }): Promise<void> {
    await this.login(user);
  }

  /**
   * Navega para a página de inventário.
   */
  async navigateToInventory(): Promise<void> {
    await this.navigate(ROUTES.INVENTORY);
  }
}