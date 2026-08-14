import { Page } from '../interface/types';

/**
 * Shared locators for common elements (Header, Menu, Nav).
 */
export class BaseElements {
  // Header and Navigation
  public menu: string = 'a[data-testid="menu-item"]'; // Example selector for menu items
  public allItems: string = 'a[data-testid="all-items"]';
  public about: string = 'a[data-testid="about"]';
  public logout: string = 'a[data-testid="logout_button"]';
  public resetAppState: string = 'button[data-testid="reset_app_state"]';
  public closeMenu: string = 'button[data-testid="close_menu"]';
  public swagLabs: string = 'a[data-testid="swag_labs"]';

  // Login Form
  public usernameInput: string = 'input[name="user"]';
  public passwordInput: string = 'input[name="password"]';
  public loginButton: string = 'button[data-testid="login_button"]';

  // Cart/Checkout
  public cartItems: string = 'a[data-testid="cart_items"]';
  public checkoutInfo: string = 'a[data-testid="checkout"]';
  public checkoutOverview: string = 'a[data-testid="checkout_overview"]';
  public checkoutComplete: string = 'a[data-testid="checkout_complete"]';

  // Inventory/Item Page
  public inventoryItems: string = 'div[data-testid="inventory_items"]';
  public itemBackToProducts: string = 'a[data-testid="back_to_products"]';
}
