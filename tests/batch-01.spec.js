import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

test('Verifying a business rule related to data quantity constraints', async ({ page, SAUCEDEMOPage }) => {
  const data = GenericFactory.getValidUserCredentials();
  await page.goto('https://www.saucedemo.com/');
  await SAUCEDEMOPage.login(page, data.username, data.password);

  // Given the user is attempting to purchase an item
  await page.goto('/inventory.html');

  // When the user attempts to set the quantity below the minimum required amount (e.g., quantity = -1)
  await page.locator('#quantity').fill('-1');
  await page.locator('button:has-text("Add to cart")').click();

  // Then the system must reject the transaction and display a constraint error
  const errorMessage = await page.locator('.error').innerText();
  expect(errorMessage).toContain('Quantity must be greater than or equal to 1');
});

test('Attempting login with an invalid password', async ({ page, SAUCEDEMOPage }) => {
  await page.goto('https://www.saucedemo.com/');

  // Given the user is on the login page
  await page.goto('/login');

  // When the user enters a valid username and an incorrect password
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('wrong_password');
  await page.locator('button:has-text("Login")').click();

  // Then an appropriate error message regarding invalid credentials should be displayed
  const errorMessage = await page.locator('.error').innerText();
  expect(errorMessage).toContain('Invalid credentials');
});

test('Successfully submitting a form/data entry via the feature', async ({ page, SAUCEDEMOPage }) => {
  const data = GenericFactory.getValidUserCredentials();
  await page.goto('https://www.saucedemo.com/');
  await SAUCEDEMOPage.login(page, data.username, data.password);

  // Given the user is on the data input screen (Inventory page)
  await page.goto('/inventory.html');

  // When the user enters valid, non-empty data and submits the form
  const itemName = 'Sauce Labs Backpack';
  await page.locator('#item_name').fill(itemName);
  await page.locator('#quantity').fill('2');
  await page.locator('button:has-text("Add to cart")').click();

  // Then a success message should be displayed and data should be saved
  const cartItemText = await page.locator('.inventory_item').first().innerText();
  expect(cartItemText).toContain(itemName);
  await expect(page.locator('.success')).toBeVisible();
});

test('Verifying that submitted data persists across sessions', async ({ page, SAUCEDEMOPage }) => {
  const data = GenericFactory.getValidUserCredentials();

  // Given the user successfully saved data in Session A
  await page.goto('https://www.saucedemo.com/');
  await SAUCEDEMOPage.login(page, data.username, data.password);
  await page.goto('/inventory.html');

  const itemToSave = 'Sauce Labs Backpack';
  await page.locator('#item_name').fill(itemToSave);
  await page.locator('#quantity').fill('5');
  await page.locator('button:has-text("Add to cart")').click();
  await expect(page.locator('.success')).toBeVisible();

  // When the user logs out and logs back in (or navigates back)
  await page.locator('#logout_button').click();
  await page.goto('https://www.saucedemo.com/');
  await SAUCEDEMOPage.login(page, data.username, data.password);

  // Then the previously entered data should still be visible and correct
  await page.goto('/inventory.html');
  const savedItemText = await page.locator('#item_name').inputValue();
  const savedQuantity = await page.locator('#quantity').inputValue();

  expect(savedItemText).toBe(itemToSave);
  expect(savedQuantity).toBe('5');
});

test('Verifying access to previously established user dashboard elements', async ({ page, SAUCEDEMOPage }) => {
  const data = GenericFactory.getValidUserCredentials();
  await page.goto('https://www.saucedemo.com/');
  await SAUCEDEMOPage.login(page, data.username, data.password);

  // Given the user is logged in
  await page.goto('/inventory.html'); // Navigating to a key dashboard area

  // When the user navigates to the main dashboard (implicitly checked by being logged in)
  // We check for core elements that confirm successful session establishment
  
  // Then all expected UI components (e.g., navigation bar, profile link) should be present and functional
  const navBar = page.locator('nav');
  const profileLink = page.locator('#user-name');

  expect(navBar).toBeVisible();
  expect(profileLink).toBeVisible();
  expect(profileLink).toHaveText(data.username);
});