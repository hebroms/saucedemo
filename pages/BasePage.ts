import { Page } from '@playwright/test'
import { BaseElements } from '../elements/BaseElements'

export class BasePage {
  readonly page: Page
  readonly base: BaseElements

  constructor(page: Page) {
    this.page = page
    this.base = new BaseElements(page)
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' })
  }

  async getTitle(): Promise<string> {
    return this.page.title()
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle').catch(() => {})
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url()
  }
}
