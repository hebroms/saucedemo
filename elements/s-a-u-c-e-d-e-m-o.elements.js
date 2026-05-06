const selectors = {
    // Login Page Elements (SAUCEDEMO8)
    usernameInput: 'input[name="user"]', // Inferred from login scenarios
    passwordInput: 'input[name="password"]', // Inferred from login scenarios
    loginButton: 'button:has-text("Login")', // Inferred from clicking login button
    errorMessage: 'css=.error-message', // General error message container (inferred)

    // Data Input/Form Elements (General)
    quantityInput: 'input[name="quantity"]', // Used for quantity testing
    submitButton: 'button:has-text("Add to Cart")', // Used for adding items
    dataSubmissionForm: 'form', // General form element

    // Search Functionality (SAUCEDEMO4)
    searchField: 'input[name="search"]', // Inferred from searching scenarios
    searchButton: 'button:has-text("Search")', // Inferred from clicking search

    // Cart/Product Page Elements (SAUCEDEMO4)
    cartTotalDisplay: 'div.cart-total', // Used for price calculation checks
    quantityUpdateInput: 'input[name="quantity"]', // Quantity input on product page
    addToCartButton: 'button:has-text("Add to Cart")', // Add to cart action

    // Navigation/Access Control (SAUCEDEMO3, SAUCEDEMO8)
    dashboardNavigation: 'a[href="/dashboard"]', // Inferred from navigating to dashboard
    inventoryLink: 'a[href="/inventory.html"]', // Specific inventory access check
    adminUrl: '/admin', // Used for access restriction testing

    // Session/Error Handling (General)
    systemErrorMessage: '.system-error', // For generic system messages
};