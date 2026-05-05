const { faker } = require('@faker-js/faker');

/**
 * Factory for generating unique generic user login data.
 * @returns {object} Test data for a generic login form.
 */
function createGenericLoginData() {
    const uniqueId = faker.string.uuid();
    return {
        username: faker.person.fullName(),
        password: faker.internet.password(12),
        submitButton: `login_${uniqueId}`,
        // Optionally, if the system requires specific formats based on the input example:
        // username: faker.person.fullName(), // e.g., João QA Silva style
        // password: faker.internet.password(12), // e.g., QortexTest@2024! style
    };
}

/**
 * Factory for generating a single unique user credential set.
 * @returns {object} Unique username and password.
 */
function createUniqueCredentials() {
    const uniqueId = faker.string.uuid();
    return {
        username: `testuser_${uniqueId}`,
        password: faker.internet.password(16),
    };
}

module.exports = {
    createGenericLoginData,
    createUniqueCredentials
};