import { GenericData } from '../interfaces/generic.interface';
import { faker } from '@faker-js/faker';

class TestDataFactory {
  /**
   * Generates standard login credentials, prioritizing environment variables.
   * @returns {GenericData} The generated user and password data.
   */
  static loginCredentials(): GenericData {
    const username = process.env.USERNAME || faker.internet.userName();
    const password = process.env.PASSWORD || faker.internet.password(12);

    return {
      username: username,
      password: password,
    };
  }

  /**
   * Generates a unique set of credentials using Faker as the primary source.
   * @returns {GenericData} The generated user and password data.
   */
  static generateUniqueCredentials(): GenericData {
    const username = faker.internet.userName();
    const password = faker.internet.password(16);

    return {
      username: username,
      password: password,
    };
  }
}

export { TestDataFactory; }