/**
 * Interfaces e Tipos TypeScript para o framework.
 */

export interface Page {
  url: string;
  navigate(url: string): void;
  getTitle(): string;
  waitForLoad(): Promise<void>;
}

export interface ElementLocators {
  // Locators genéricos (exemplo)
  loginUsername: string;
  loginPassword: string;
  loginButton: string;
  errorSummary: string;
  inventoryMenu: string;
  cartItems: string;
  checkoutInfo: string;
  logoutButton: string;
}

export interface TestUser {
  username: string;
  password: string;
}

export interface PageObject<T extends Page> {
  // Métodos de ação específicos da página
  login(user: TestUser): Promise<void>;
  navigateToInventory(): Promise<void>;
  addToCart(itemId: string): Promise<void>;
  viewCart(): Promise<void>;
  proceedToCheckout(): Promise<void>;
  completeCheckout(): Promise<void>;
}
