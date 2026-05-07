export const ROUTES = {
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutStepOne: '/checkout-step-one.html',
  inventoryItem: '/inventory-item.html'
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
