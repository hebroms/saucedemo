export interface Page {
  navigate(url: string): void;
  getTitle(): string;
}

export interface ElementLocators {
  // Base elements shared across pages
  menu: string;
  allItems: string;
  about: string;
  logout: string;
  resetAppState: string;
  closeMenu: string;
  swagLabs: string;
  usernameInput: string;
  passwordInput: string;
  loginButton: string;
  cartItems: string;
  checkoutInfo: string;
  checkoutOverview: string;
  checkoutComplete: string;
  inventoryItems: string;
  itemBackToProducts: string;
}

export interface TestUser {
  username: string;
  password: string;
}

export interface PageElementLocators extends ElementLocators {
  // Specific locators for a page
}
