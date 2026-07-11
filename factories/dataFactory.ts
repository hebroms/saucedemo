import { TestUser } from '../interface/types';

/**
 * Fábrica para criar dados de teste de usuário.
 */
export class DataFactory {
  /**
   * Cria um usuário padrão válido.
   */
  static createStandardUser(): TestUser {
    return {
      username: "standard_user",
      password: "secret_sauce",
    };
  }

  /**
   * Cria um usuário com credenciais inválidas (senha errada).
   */
  static createInvalidCredentials(): TestUser {
    return {
      username: "standard_user",
      password: "wrong_password",
    };
  }

  /**
   * Cria um usuário com nome de usuário inválido.
   */
  static createInvalidUsername(): TestUser {
    return {
      username: "invalid_user",
      password: "secret_sauce",
    };
  }
}