const selectors = {
    // Login Page Elements (saucedemo 2, SAUCEDEMO8)
    usernameInput: 'input[name="user"]', // Inferred from entering username
    passwordInput: 'input[name="password"]', // Inferred from entering password
    loginButton: 'button:has-text("Login")', // Inferred from clicking login button
    errorMessage: 'css=.error', // General placeholder for error messages (inferred)

    // Data Input/Submission Elements (saucedemo 2, SAUCEDEMO8)
    dataInputFields: 'input[type="text"]', // General reference to data entry fields
    submitButton: 'button:has-text("Submit")', // Inferred from submitting the form
    successMessage: 'css=.success', // Inferred from displaying a success message

    // Product/Quantity Input Elements (saucedemo 3, 4)
    quantityInput: 'input[name="quantity"]', // Used for setting quantity
    productNameInput: 'input[name="item_name"]', // Used for searching/selecting products
    addToCartButton: 'button:has-text("Add to Cart")', // Inferred from adding items
    cartTotalDisplay: 'div.shopping_cart_total_amount', // Inferred from viewing cart summary

    // Navigation and Access Elements (saucedemo 3, SAUCEDEMO8)
    inventoryLink: 'a[href="/inventory.html"]', // Used for accessing inventory
};