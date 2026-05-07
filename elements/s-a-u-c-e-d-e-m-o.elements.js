const selectors = {
    // Login Page Elements (SAUCEDEMO8)
    usernameInput: 'input[name="user"]', // Inferred from login attempts
    passwordInput: 'input[name="password"]', // Inferred from login attempts
    loginButton: 'button:has-text("Login")', // Inferred from clicking login button
    errorMessage: 'text:has-text("Invalid credentials")', // Inferred from failed logins
    dashboardLink: 'a[href="/dashboard"]', // Inferred from navigating to dashboard

    // Data Input/Form Elements (General)
    quantityInput: 'input[name="quantity"]', // Used for quantity boundary tests
    productNameInput: 'input[name="first-name"]', // Assumed for data entry
    passwordField: 'input[name="password"]',

    // Data Submission/Error Handling
    submitButton: 'button:has-text("Add to Cart")', // General submission action
    successMessage: 'div.success', // Inferred from successful submission feedback
    validationErrorMessage: 'div.error', // Inferred for validation errors (e.g., missing fields, invalid format)

    // Product/Search Elements (SAUCEDEMO4)
    searchField: 'input[name="search"]', // For searching products
    searchResults: 'div.results', // Where search results are displayed
    productCard: 'div.item', // Represents an individual product listing
    addToCartButton: 'button:has-text("Add to Cart")', // Action on a product card

    // Cart Elements (SAUCEDEMO4)
    cartTotal: 'div.cart-total', // For verifying total price calculation
    cartItemQuantity: 'input[name="quantity"]', // Quantity input within the cart context

    // Navigation/Access Control
    adminLink: 'a[href="/admin"]', // Target for access denial tests
    inventoryLink: 'a[href="/inventory.html"]', // Target for unauthenticated access tests
};

export default selectors;