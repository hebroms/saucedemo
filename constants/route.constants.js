export const ROUTES = {
  swagLabs: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutStepOne: '/checkout-step-one.html',
  checkoutStepTwo: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
  cart: '/cart',
  inventoryItem: '/inventory-item.html'
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
