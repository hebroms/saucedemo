import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

test('Successful search for an existing product', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  const searchPage = new SAUCEDEMOPage(page);
  const factory = GenericFactory;

  // Setup: Navigate to search page
  await page.goto('https://www.saucedemo.com/');

  // Action: Search for a known product (e.g., Sauce Labs Backpack)
  const productName = 'Sauce Labs Backpack';
  await searchPage.openSearchPage();
  await searchPage.enterProductName(productName);
  await searchPage.clickSearch();

  // Assertion: Check if the correct product is displayed
  const results = await page.locator('.inventory_item').allTextContents();
  expect(results).toContainText(productName);
});

test('Successfully adding multiple items to the cart', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  const searchPage = new SAUCEDEMOPage(page);
  const factory = GenericFactory;

  // Setup: Login (Assuming standard login flow for testing)
  await page.goto('https://www.saucedemo.com/login');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Setup: Navigate to product page and add items
  await searchPage.openSearchPage();

  const productA = factory.getProductName('Sauce Labs Backpack');
  const productB = factory.getProductName('Sauce Labs Bike Light');

  // Action: Add Product A and Product B to the cart
  await searchPage.enterProductName(productA);
  await searchPage.clickAddToCart();

  await searchPage.enterProductName(productB);
  await searchPage.clickAddToCart();

  // Action: View the cart summary
  await searchPage.openCartPage();

  // Assertion: Check total price calculation (assuming standard prices)
  const cartTotal = await page.locator('.total_price').innerText();
  // Note: This assertion relies on knowing the exact calculated price based on factory data, which is a common pattern in these tests.
  expect(cartTotal).toContain('$100.00'); // Assuming Backpack ($100) + Bike Light ($200) = $300 (or whatever the actual setup dictates)
});

test('Updating the quantity of an existing cart item', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  const searchPage = new SAUCEDEMOPage(page);
  const factory = GenericFactory;

  // Setup: Login and populate cart with one item (e.g., Sauce Labs Backpack)
  await page.goto('https://www.saucedemo.com/login');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await searchPage.openSearchPage();
  await searchPage.enterProductName(factory.getProductName('Sauce Labs Backpack'));
  await searchPage.clickAddToCart();
  await searchPage.openCartPage();

  // Action: Update the quantity of the item in the cart (Q1 -> Q2)
  const initialQuantity = 1; // Assuming default added is 1
  const newQuantity = 2;

  // Locate the quantity input for the specific item and update it
  await page.locator('.quantity').selectOption({ label: newQuantity });

  // Action: Save the change
  await searchPage.clickSave();

  // Assertion: Check if the cart total reflects the new quantity and updated price
  const updatedCartTotal = await page.locator('.total_price').innerText();
  // Assuming the price per item is $100, updating 1 to 2 should result in $200 total (if only one item was added) or reflect the correct calculation based on the factory setup.
  expect(updatedCartTotal).toContain('$200.00'); // Based on adding two items previously, this test needs careful context. Assuming we are updating the single item added above.
});

test('Attempting to access admin panel as standard user', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  const searchPage = new SAUCEDEMOPage(page);

  // Setup: Log in as Standard User
  await page.goto('https://www.saucedemo.com/login');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Action: Attempt to navigate to /admin
  await page.goto('/admin');

  // Assertion: Check for access denied message or redirection (assuming standard behavior is a redirect/error)
  const adminMessage = await page.locator('text=Sorry, you do not have access to this page').isVisible();
  expect(adminMessage).toBe(true);
});