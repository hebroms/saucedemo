import { GenericData } from '../interfaces/generic.interface';

class TestDataFactory {
    /**
     * Generates test data for a standard user login scenario.
     * @returns {GenericData} The generated test data.
     */
    static standardLoginCredentials(): GenericData {
        // Data derived directly from the provided form field values
        return {
            username: "João QA Silva",
            password: "QortexTest@2024!",
            submitValue: "qortex_qa_user"
        };
    }

    /**
     * Generates a generic user data structure, potentially using environment variables for dynamic fields.
     * @returns {GenericData} A generic set of test credentials.
     */
    static createGenericUser(): GenericData {
        // Example of incorporating environment variables if needed for dynamic testing
        const username = process.env.TEST_USERNAME || 'default_user';
        const password = process.env.TEST_PASSWORD || 'default_password';

        return {
            username: username,
            password: password,
            email: `${username}@test.com`, // Example of deriving related data
        };
    }
}

export { TestDataFactory };