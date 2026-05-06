const selectors = {
    // Login Page Elements (SAUCEDEMO8, SAUCEDEMO4)
    loginPage: {
        usernameInput: 'input[name="user"]', // Inferred from entering username
        passwordInput: 'input[name="password"]', // Inferred from entering password
        loginButton: 'button:has-text("Login")', // Inferred from clicking login button
        errorMessage: 'css=.error-message' // General error message placeholder
    },

    // Data Input / Form Elements (SAUCEDEMO2, SAUCEDEMO3)
    dataEntryScreen: {
        quantityInput: 'input[name="quantity"]', // Used for quantity constraints and boundary tests
        submitButton: 'button:has-text("Add to Cart")' // General submission action
    },

    // Product/Search Elements (SAUCEDEMO4)
    searchPage: {
        searchBar: 'input[name="search"]', // Inferred from searching for a product name
        searchButton: 'button:has-text("Search")'
    },

    // Cart Management Elements (SAUCEDEMO4)
    cartManagement: {
        cartTotalDisplay: 'div.cart-total', // Used for price calculation verification
        itemQuantityInput: 'input[name="quantity"]', // Quantity input within the cart context
        addToCartButton: 'button:has-text("Add to Cart")' // Action to add items
    },

    // Navigation and Access Control (SAUCEDEMO3, SAUCEDEMO4)
    navigation: {
        adminLink: 'a[href="/admin"]', // Used for access denial tests
        inventoryLink: 'a[href="/inventory.html"]' // Used for unauthorized access tests
    },

    // Error and Success Messages (General)
    systemError: {
        validationError: 'div.validation-error', // For validation errors (e.g., invalid credentials, missing fields)
        notFoundMessage: 'div.not-found' // For 404 scenarios
    }
};