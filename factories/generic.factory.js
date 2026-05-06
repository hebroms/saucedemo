const { faker } = require('@faker-js/faker');

/**
 * Factory for generating user form data.
 */
const createLoginForm = () => {
    const username = faker.person.fullName();
    // Credentials must come from process.env as per instructions
    const usernameFromEnv = process.env.TEST_USERNAME || 'default_user';
    const passwordFromEnv = process.env.TEST_PASSWORD || 'default_password';

    return {
        'user-name': username,
        'password': passwordFromEnv,
        'login-button': `submit_${username.replace(/\s/g, '_')}`
    };
};

module.exports = {
    createLoginForm
};