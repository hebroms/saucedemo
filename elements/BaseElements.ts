// Base elements shared across all pages (e.g., header, menu)

export interface BaseSelectors {
  // Header/Navigation Selectors
  header: string;
  menuButton: string;
  itemsMenu: string;
  logoutButton: string;
  appName: string;
}

// Shared selectors for the SauceDemo application
export const BASE_SELECTORS: BaseSelectors = {
  header: 'header',
  menuButton: 'menu-button',
  itemsMenu: 'all-items',
  logoutButton: 'logout',
  appName: 'sauce-demo'
};
