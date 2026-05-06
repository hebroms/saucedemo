const selectors = {
    // Login Page Elements (saucedemo 2, SAUCEDEMO8)
    usernameInput: 'input[name="user"]', // Inferred from login attempts
    passwordInput: 'input[name="password"]', // Inferred from login attempts
    loginButton: 'button:has-text("Login")', // Standard login action
    errorMessage: 'css=.error-message', // General error display inferred from negative tests
    dashboardLink: 'a[href="/inventory.html"]', // Navigation to inventory

    // Data Input/Submission Elements (saucedemo 2, SAUCEDEMO8)
    quantityInput: 'input[name="quantity"]', // Used for quantity constraints and boundary testing
    submitButton: 'button:has-text("Add to Cart")', // Action to add items
    successMessage: 'div.success', // Message displayed upon successful submission

    // Search Functionality (saucedemo 4)
    searchField: 'input[name="search"]', // Used for searching products
    searchResults: 'div.search-results', // Area where search results are displayed

    // Cart Management Elements (saucedemo 4)
    cartTotal: 'div.cart-total', // Element displaying the calculated total price
    cartItemQuantity: 'div.cart-item-quantity', // Element showing quantity of an item in the cart

    // Access Restriction/Error Handling (saucedemo 3, SAUCEDEMO8)
    accessDeniedMessage: 'div.access-denied', // Message for unauthorized access (403)
    loginPage: 'div[role="dialog"]', // Assuming login is handled via a modal or specific page

    // Inventory Access (SAUCEDEMO8)
    inventoryPage: 'div#inventory', // Target URL /inventory.html context
};

module.exports = selectors;