import { test as base, Page } from '@playwright/test';

export type AppFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AppFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', process.env.USERNAME || '');
    await page.fill('[data-test="password"]', process.env.PASSWORD || '');
    await page.click('[data-test="login-button"]');
    await page.waitForLoadState('networkidle');
    await use(page);
  },
});

export { expect } from '@playwright/test';
