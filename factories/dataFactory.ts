import { TestUser } from '../interface/types';

export function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    username: `user_${Date.now()}@test.com`,
    password: 'Test@123456',
    ...overrides,
  };
}

export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}
