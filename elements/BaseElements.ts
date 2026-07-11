import { Locator } from '@playwright/test';

/**
 * Seletores compartilhados (Locators) usados em todas as páginas.
 */
export class BaseElements {
  // Elementos de Login
  loginUsername: Locator;
  loginPassword: Locator;
  loginButton: Locator;

  // Elementos de Navegação/Header
  inventoryMenu: Locator;
  cartItems: Locator;
  checkoutInfo: Locator;
  logoutButton: Locator;

  constructor(page: any) {
    // Inicializa os seletores baseados no contexto da página.
    // Nota: Os seletores reais serão definidos em elementos/NomePageElements.ts
    this.loginUsername = page.locator("input[name='user-name']");
    this.loginPassword = page.locator("input[name='password']");
    this.loginButton = page.locator("button[type='submit']");
    
    // Seletores de navegação (assumindo que o menu é um elemento comum)
    this.inventoryMenu = page.locator(".menu-item"); // Exemplo, será ajustado
    this.cartItems = page.locator(".cart-items");
    this.checkoutInfo = page.locator(".checkout-info");
    this.logoutButton = page.locator(".logout_button");
  }
}