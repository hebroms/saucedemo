import { GenericData } from '../interfaces/generic.interface';

const { faker } = require('@faker-js/faker');

class TestDataFactory {
    /**
     * Generates test data for a single form submission scenario.
     * @returns {GenericData} The generated test data object.
     */
    static createFormSubmission(): GenericData {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        // Generate a plausible postal code format (e.g., Brazilian style, based on example)
        const postalCode = `${String(Math.floor(10000 + Math.random() * 90000))}-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const continueButtonText = faker.lorem.sentence();

        return {
            firstName: firstName,
            lastName: lastName,
            postalCode: postalCode,
            continue: continueButtonText,
        };
    }
}

module.exports = TestDataFactory;