export const ENVIRONMENTS = {
  local: process.env.BASE_URL_LOCAL,
  development: process.env.BASE_URL_DEV,
  homologation: process.env.BASE_URL_HML,
  production: process.env.BASE_URL_PROD,
  current: process.env.BASE_URL || process.env.BASE_URL_HML || 'https://www.saucedemo.com/',
} as const;
