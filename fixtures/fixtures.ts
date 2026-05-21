import { test as base, Page } from '@playwright/test'
import { BasePage } from '../pages/BasePage'

type Fixtures = {
  authenticatedPage: Page
  basePage: BasePage
}

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    await use(page)
  },
  basePage: async ({ page }, use) => {
    const bp = new BasePage(page)
    await use(bp)
  },
})

export { expect } from '@playwright/test'
