const selectors = {
    // Login Page Elements (saucedemo 2, SAUCEDEMO8)
    usernameInput: 'input[name="user"]', // Inferred from "enters valid username"
    passwordInput: 'input[name="password"]', // Inferred from "enters incorrect password"
    loginButton: 'button:has-text("Login")', // Inferred from "clicks the login button"
    errorMessage: 'css=.error-message', // General placeholder for error messages

    // Data Input/Submission Elements (saucedemo 2, saucedemo 3)
    dataInputFields: 'input[type="text"]', // General reference for data entry fields
    submitButton: 'button:has-text("Submit")', // Inferred from "submits the form"
    successMessage: 'css=.success-message', // Inferred from "a success message should be displayed"

    // Search Functionality (saucedemo 4)
    searchField: 'input[name="search"]', // Inferred from "searches for a known product name"
    searchButton: 'button:has-text("Search")', // Inferred from "clicks Search"
    searchResults: 'div.search-results', // Placeholder for results display

    // Cart Management Elements (saucedemo 4)
    cartItemQuantityInput: 'input[name="quantity"]', // Inferred from "updates the quantity"
    addToCartButton: 'button:has-text("Add to Cart")', // Inferred from "adds Product A and Product B to the cart"
    cartTotalDisplay: 'div.cart-total', // Inferred from "views the cart summary"

    // Inventory Access (SAUCEDEMO8)
    inventoryUrl: '/inventory.html', // Explicitly mentioned URL access
    accessDeniedMessage: 'css=.access-denied', // Placeholder for access denial messages
};

module.exports = selectors;