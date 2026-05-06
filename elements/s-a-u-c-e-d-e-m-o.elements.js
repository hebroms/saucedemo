const selectors = {
    // Login Page Elements (SAUCEDEMO8)
    loginPage: 'page', // Base context for login interactions
    usernameInput: 'input[name="user"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button:has-text("Login")',
    errorMessage: 'css=.error-message', // General error message container

    // Data Input/Form Elements (SAUCEDEMO)
    quantityInput: 'input[name="quantity"]',
    dataSubmissionButton: 'button:has-text("Submit")',
    successMessage: 'div.success',

    // Search Functionality (SAUCEDEMO4)
    searchField: 'input[name="search"]',
    searchButton: 'button:has-text("Search")',
    searchResults: 'div.search-results',
    noResultsMessage: 'div.no-results',

    // Cart Management Elements (SAUCEDEMO4)
    cartItemQuantityInput: 'input[name="quantity"]', // Specific to cart item quantity
    addToCartButton: 'button:has-text("Add to Cart")',
    cartTotalDisplay: 'div.cart-total',

    // Navigation and Access (SAUCEDEMO3, SAUCEDEMO8)
    dashboardNavigation: 'a[href="/dashboard"]',
    adminLink: 'a[href="/admin"]',
    inventoryLink: 'a[href="/inventory.html"]',
    loginRedirectUrl: '/login' // Implied target for redirection

    // Boundary/Validation related (Inferred from various boundary tests)
    inputFieldForMinMax: 'input[type="number"]' // General selector for numerical inputs tested
};