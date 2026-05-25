import { GenericData } from '../interfaces/generic.interface';
import { faker } from '@faker-js/faker';

class TestDataFactory {
  /**
   * Generates standard user credentials based on environment variables or defaults.
   * @returns {GenericData} User credentials data.
   */
  static standardUser(): GenericData {
    return {
      username: process.env.USERNAME || faker.internet.userName(),
      password: process.env.PASSWORD || faker.internet.password(12),
    };
  }

  /**
   * Generates data for a full user registration form, including names and postal code.
   * @returns {GenericData} Form data.
   */
  static createRegistrationForm(): GenericData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    // Generate a plausible postal code format (simplified for testing)
    const postalCode = faker.location.zipCode();

    return {
      username: faker.internet.userName(),
      password: faker.internet.password(12),
      firstName: firstName,
      lastName: lastName,
      postalCode: postalCode,
    };
  }

  /**
   * Generates data specifically for the login form fields.
   * @returns {GenericData} Login credentials data.
   */
  static createLoginCredentials(): GenericData {
    // Credentials must come from process.env if available, otherwise use Faker/fallback.
    const username = process.env.USERNAME || faker.internet.userName();
    const password = process.env.PASSWORD || faker.internet.password(12);

    return {
      username: username,
      password: password,
    };
  }
}

export { TestDataFactory; }