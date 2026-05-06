import { GenericData } from '../interfaces/generic.interface';

class TestDataFactory {
    /**
     * Generates data based on the discovered form fields.
     * @returns {GenericData} The generated test data.
     */
    static createLoginData(): GenericData {
        // Data derived directly from the input description
        const userData = {
            username: "João QA Silva",
            password: "QortexTest@2024!",
            submitButton: "qortex_qa_user"
        };

        return userData;
    }
}

export { TestDataFactory };