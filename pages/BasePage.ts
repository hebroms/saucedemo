import { Page } from '@playwright/test';
import { BaseElements } from '../elements/BaseElements';
import { PageContext } from '../interface/types';

export abstract class BasePage {
  protected page: Page;
  protected locators: ElementLocators;

  constructor(page: Page, locators: ElementLocators) {
    this.page = page;
    this.locators = locators;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForLoad(): Promise<void> {
    // Wait for network idle to ensure dynamic content is loaded
    await this.page.waitForLoadState('networkidle', { timeout: this.locators.timeout || 30000 });
  }
}