const selectors = {
    // Login Page Elements (saucedemo 2, SAUCEDEMO8)
    usernameInput: 'input[name="user"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button:has-text("Login")',
    errorMessage: 'css=.error', // General selector for error messages

    // Data Input/Submission Screen (saucedemo 2, SAUCEDEMO3)
    quantityInput: 'input[name="quantity"]',
    submitButton: 'button:has-text("Submit")',
    successMessage: 'div.success', // For successful submission feedback

    // Product/Cart Page Elements (saucedemo 4, SAUCEDEMO8)
    productNameInput: 'input[name="item_name"]',
    addToCartButton: 'button:has-text("Add to Cart")',
    cartTotalDisplay: 'div.shopping_cart_total_amount',
    quantityUpdateInput: 'input[name="quantity"]', // Used for updating quantity in cart

    // Navigation/Access Denial (SAUCEDEMO8)
    inventoryLink: 'a[href="/inventory.html"]',
    loginPageLink: 'a[href="/login"]'
};