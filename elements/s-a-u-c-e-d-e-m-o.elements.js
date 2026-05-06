const selectors = {
    // Login Page Elements
    usernameInput: "input[type='text'][name='user']", // Inferring based on standard form structure for username
    passwordInput: "input[type='password'][name='password']", // Inferring based on standard form structure for password
    loginButton: "button:has-text('Login')",
    errorMessage: "text:has-text('Invalid credentials')",

    // Product Listing/Search Elements
    productNameInput: "input[type='text'][placeholder='Enter product name']", // Assuming a search input exists
    searchButton: "button:has-text('Search')",
    searchResultsTable: "table", // General reference to the results table
    noResultsMessage: "text:has-text('No results found')",

    // Cart and Checkout Elements
    cartItemQuantityInput: "input[type='number']", // Generic input for quantity adjustment
    addToCartButton: "button:has-text('Add to Cart')",
    cartSummaryTotal: "div:has-text('Total:')", // Targeting the total display
    checkoutButton: "button:has-text('Checkout')",

    // Inventory Access (SAUCEDEMO8)
    inventoryLink: "a:has-text('Inventory')",
    inventoryPage: "page", // Reference to the inventory page itself

    // General Form/Input Validation Elements (Boundary/Negative Testing)
    numericalInputField: "input[type='number']", // For quantity fields
    textInputField: "input[type='text']", // For general text inputs
};