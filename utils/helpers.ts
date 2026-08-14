import { Page } from '../interface/types';

/**
 * Waits for network activity to settle, useful after API calls.
 * @param page The Playwright Page object.
 */
export async function waitForNetworkIdle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Retries an action if it fails, useful for flaky tests.
 * @param action The asynchronous function to execute.
 * @param retries The number of times to retry.
 * @param delayMs Delay between retries in milliseconds.
 */
export async function retryAction(action: () => Promise<any>, retries: number = 3, delayMs: number = 1000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await action();
    } catch (error) {
      console.warn(`Action failed on attempt ${i + 1}. Retrying in ${delayMs}ms... Error:`, error);
      if (i === retries - 1) {
        throw error; // Throw the error if all retries fail
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}
