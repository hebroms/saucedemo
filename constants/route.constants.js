export const ROUTES = {
  inventory: '/inventory.html',
  cart: '/cart.html',
  inventoryItem: '/inventory-item.html',
  swagLabs: '/'
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
