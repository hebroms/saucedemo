import { test, expect } from '@playwright/test';
import { createTestUser, createTestUser } from '../factories/dataFactory';
import { ROUTES } from '../constants/routes';
import { PageContext, TestUser } from '../interface/types';
import { HomePage } from '../pages/HomePage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

// --- Test Scenarios ---

// scen_1779308116397_0v4m: Login bem-sucedido com credenciais válidas
test.describe('Login Scenarios', () => {
  test.describe('scen_1779308116397_0v4m', () => {
    test('should successfully log in with valid credentials', async ({ page, testUser }) => {
      const user = createTestUser(testUser);

      await new Promise(resolve => {
        // 1. Login action
        page.goto(ROUTES.home);
        await page.waitForLoadState('networkidle');

        // 2. Fill credentials
        await page.locator('input[name="user-name"]').fill(user.username);
        await page.locator('input[name="password"]').fill(user.password);

        // 3. Click login button
        await page.locator('button:has-text("Login")').click();

        // 4. Verification (Redirection to Inventory)
        await page.waitForURL(ROUTES.inventory);

        // Assertion: Check if we are on the inventory page
        await expect(page).toHaveURL(ROUTES.inventory);
      });
    });
  });

  // scen_1779308116399_yxsv: Login com credenciais inválidas (usuário incorreto)
  test.describe('Invalid Login Scenarios', () => {
    test('should display an error for incorrect username', async ({ page, testUser }) => {
      const user = createTestUser(testUser);

      await new Promise(resolve => {
        // 1. Login action with invalid user
        page.goto(ROUTES.home);
        await page.waitForLoadState('networkidle');

        // 2. Fill credentials (Invalid username)
        await page.locator('input[name="user-name"]').fill('invalid_user');
        await page.locator('input[name="password"]').fill(user.password);

        // 3. Click login button
        await page.locator('button:has-text("Login")').click();

        // 4. Verification (Check for error message)
        // Expecting the specific error message based on system behavior
        await expect(page.locator('.error-message')).toHaveText(/Credenciais inválidas/i);
      });
    });

    test('should display an error for incorrect password', async ({ page, testUser }) => {
      const user = createTestUser(testUser);

      await new Promise(resolve => {
        // 1. Login action with invalid password
        page.goto(ROUTES.home);
        await page.waitForLoadState('networkidle');

        // 2. Fill credentials (Valid username, Invalid password)
        await page.locator('input[name="user-name"]').fill(user.username);
        await page.locator('input[name="password"]').fill('wrong_password');

        // 3. Click login button
        await page.locator('button:has-text("Login")').click();

        // 4. Verification (Check for error message)
        await expect(page.locator('.error-message')).toHaveText(/Credenciais inválidas/i);
      });
    });
  });

  // scen_1779308116399_k8n7: Login com credenciais inválidas (senha incorreta)
  test.describe('Password Validation Scenarios', () => {
    test('should display an error for incorrect password', async ({ page, testUser }) => {
      const user = createTestUser(testUser);

      await new Promise(resolve => {
        // 1. Login action with invalid password
        page.goto(ROUTES.home);
        await page.waitForLoadState('networkidle');

        // 2. Fill credentials (Valid username, Invalid password)
        await page.locator('input[name="user-name"]').fill(user.username);
        await page.locator('input[name="password"]').fill('wrong_password');

        // 3. Click login button
        await page.locator('button:has-text("Login")').click();

        // 4. Verification (Check for error message)
        await expect(page.locator('.error-message')).toHaveText(/Credenciais inválidas/i);
      });
    });
  });

  // scen_1779308116399_gfzm: Validação de formato dos campos de login (campos vazios)
  test.describe('Input Validation Scenarios', () => {
    test('should display required field error when fields are empty', async ({ page, testUser }) => {
      const user = createTestUser(testUser);

      await new Promise(resolve => {
        // 1. Login action with empty fields
        page.goto(ROUTES.home);
        await page.waitForLoadState('networkidle');

        // 2. Fill fields with empty values
        await page.locator('input[name="user-name"]').fill('');
        await page.locator('input[name="password"]').fill('');

        // 3. Click login button
        await page.locator('button:has-text("Login")').click();

        // 4. Verification (Check for required field error)
        // Expecting the specific validation message
        await expect(page.locator('.error-message')).toHaveText(/Campo obrigatório/i);
      });
    });
  });
}