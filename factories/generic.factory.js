const { faker } = require('@faker-js/faker');

/**
 * Factory for generating a unique user name.
 * @returns {string} A unique user name.
 */
function createUserName() {
    // Use faker for realistic names, appended with a unique identifier
    return `${faker.person.firstName()} ${faker.person.lastName()}${Date.now()}`;
}

/**
 * Factory for generating a unique password.
 * @returns {string} A unique password.
 */
function createPassword() {
    // Use faker for strong passwords, appended with a unique identifier
    return `${faker.internet.password()}!${Date.now()}`;
}

/**
 * Factory for generating a unique login action/value.
 * @returns {string} A unique login button value.
 */
function createLoginAction() {
    // Generate a unique action string
    return `login_${faker.word().toUpperCase()}_${Date.now()}`;
}

module.exports = {
    createUserName,
    createPassword,
    createLoginAction
};