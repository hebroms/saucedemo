import { Page } from '../interface/types';
import * as BaseElements from '../elements/BaseElements';

export abstract class BasePage implements Page {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a specific URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Gets the title of the current page.
   * @returns The page title.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}