import { TestUser } from '../interface/types';

export class DataFactory {
  /**
   * Generates standard test user data.
   */
  static getStandardUser(): TestUser {
    return {
      username: "standard_user",
      password: "secret_sauce",
    };
  }

  /**
   * Generates invalid credentials for failure testing.
   */
  static getInvalidUser(): TestUser {
    return {
      username: "bad_user",
      password: "wrong_password",
    };
  }
}