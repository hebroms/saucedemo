// Locators específicos para a HomePage
import { Locator } from '@playwright/test';

/**
 * Seletores específicos para a HomePage.
 */
export class HomePageElements {
  // Login
  loginUsername: Locator;
  loginPassword: Locator;
  loginButton: Locator;

  // Navegação
  inventoryMenu: Locator;
}
