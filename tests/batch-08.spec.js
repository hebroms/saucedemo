import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

test('Attempting to add minimum quantity (1)', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  // Setup: Navigate to the product page context
  await page.goto('https://www.saucedemo.com/');
  const productPage = new SAUCEDEMOPage(page);

  // Arrange: Use factory to set up a standard scenario (assuming default stock is available)
  const productData = GenericFactory.getStandardProductData(); 

  // Act: Set quantity to minimum (1) and add to cart
  await productPage.setQuantity(productData.id, 1);
  await productPage.clickAddToCart();

  // Assert
  await expect(productPage.getCartSummary()).toHaveText(/Item added successfully/i);
});

test('Attempting to add maximum allowed quantity', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  // Setup: Set up a product with a specific stock limit (N)
  const maxStockLimit = 2; // Example N
  await page.goto('https://www.saucedemo.com/');
  const productPage = new SAUCEDEMOPage(page);

  // Arrange: Simulate setting the maximum quantity and attempting to exceed it
  await productPage.setQuantity(GenericFactory.getTestProductId(), maxStockLimit);
  
  // Act: Attempt to set quantity slightly above N (N+1) and click Add to Cart
  await productPage.setQuantity(GenericFactory.getTestProductId(), maxStockLimit + 1);
  await productPage.clickAddToCart();

  // Assert
  // Expect an error message related to stock limits
  await expect(productPage.getErrorMessage()).toContainText('stock limit');
});

test('Verifying the final price calculation includes taxes/fees (if applicable)', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  // Setup: Assume a scenario where we can calculate expected totals based on setup data
  await page.goto('https://www.saucedemo.com/');
  const productPage = new SAUCEDEMOPage(page);

  // Arrange: Set up items and proceed to payment
  await productPage.setQuantity(GenericFactory.getTestProductId(), 1);
  await productPage.clickAddToCart();
  
  // Simulate proceeding to payment (assuming the system calculates totals)
  await productPage.goToPayment();

  // Act & Assert: Verify the final amount matches the expected calculated total + fees
  const expectedTotalWithFees = GenericFactory.calculateExpectedFinalAmount(1); // Hypothetical calculation based on factory logic

  await expect(productPage.getFinalAmount()).toBeCloseTo(expectedTotalWithFees, 2);
});

test('Entering an invalid email format for account creation', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  // Setup: Navigate to registration form context
  await page.goto('https://www.saucedemo.com/login'); // Start at login to simulate navigation flow if needed, or directly navigate to registration if available. Assuming we need a registration path.
  const registrationPage = new SAUCEDEMOPage(page);

  // Arrange: Use an invalid email format
  const invalidEmail = 'invalid-email-format';

  // Act: Enter the invalid email and attempt registration
  await registrationPage.enterEmail(invalidEmail);
  await registrationPage.enterPassword('somepassword'); // Need to fill other fields for submission context
  await registrationPage.clickRegister();

  // Assert: Check for validation error message
  await expect(registrationPage.getErrorMessage()).toContainText('Please enter a valid email address');
});

test('Searching for a non-existent product', async ({ page, SAUCEDEMOPage, GenericFactory }) => {
  // Setup: Navigate to the search page context
  await page.goto('https://www.saucedemo.com/');
  const productPage = new SAUCEDEMOPage(page);

  // Arrange: Use a clearly non-existent item name
  const nonExistentItem = 'nonexistent_product_xyz123';

  // Act: Search for the item and click search
  await productPage.searchForProduct(nonExistentItem);
  await productPage.clickSearch();

  // Assert: Check if the expected 'No results found' message is displayed
  await expect(productPage.getSearchResults()).toContainText('No results found');
});