import { test, expect } from '../fixtures/fixtures'
import { ROUTES } from '../constants/routes'

test.describe('QA Pipeline', () => {
  test('should load application', async ({ page }) => {
    await page.goto(process.env.BASE_URL || '/')
    await expect(page).toHaveTitle(/.+/)
  })
})
