import { GenericData } from '../interfaces/generic.interface';
import { faker } from '@faker-js/faker';

class TestDataFactory {
  /**
   * Generates standard test user credentials.
   * Prioritizes environment variables for sensitive data, falling back to Faker or random generation.
   * @returns {GenericData} The generated user credentials.
   */
  static standardUser(): GenericData {
    const username = process.env.USERNAME || faker.person.fullName();
    const password = process.env.PASSWORD || faker.internet.password(12);

    return {
      username: username,
      password: password,
    };
  }

  /**
   * Generates a unique set of credentials using Faker for more realistic data.
   * @returns {GenericData} A randomly generated user and password.
   */
  static randomUser(): GenericData {
    const username = faker.internet.userName();
    const password = faker.internet.password(16);

    return {
      username: username,
      password: password,
    };
  }
}

export { TestDataFactory; }