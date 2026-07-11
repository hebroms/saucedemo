import { test, expect } from '@playwright/test';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';
import { DataFactory } from '../factories/dataFactory';
import { ROUTES } from '../constants/routes';
import { MESSAGES } from '../constants/messages';
import { TestUser, PageObject } from '../interface/types';

// Configuração de fixtures para injetar as páginas e o login
const test = test;

// Setup do ambiente (usando a fábrica para dados)
let user: TestUser;
let homePage: PageObject<any>;

test.describe('SauceDemo Feature Tests', () => {
  // @suite:suite_kai_477dc5833476

  // Setup de dados e páginas antes de cada teste
  test.beforeAll(async ({ page }) => {
    user = GenericFactory.createStandardUser(); // Usuário padrão para testes
    homePage = new PageObjects.HomePage(page);
  });

  // --- Cenário 1: Login bem-sucedido com credenciais válidas ---
  test.describe('Login Scenarios', () => {
    // @scenario:scen_1780411208294_gti5 @type:e2e @priority:critical @suite:suite_kai_477dc5833476
    test('Login with valid credentials', async ({ page }) => {
      const factory = GenericFactory;
      const loginData = factory.createStandardUser();

      await homePage.login(loginData);

      // Verificação de sucesso (assumindo que o redirecionamento para dashboard é a página inicial)
      await expect(page).toHaveURL(ROUTES.INVENTORY);
      expect(page.locator('h1')).toHaveText('Sauce Demo');
    });

    // @scenario:scen_1780411208295_s61l @type:e2e @priority:high @suite:suite_kai_477dc5833476
    test('Login with invalid password', async ({ page }) => {
      const factory = GenericFactory;
      const invalidData = factory.createInvalidCredentials();

      await homePage.login(invalidData);

      // Verificação de erro (esperando a mensagem de erro)
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('.error-message')).toHaveText(MESSAGES.INVALID_CREDENTIALS);
    });

    // @scenario:scen_1780411208295_9uuc @type:e2e @priority:high @suite:suite_kai_477dc5833476
    test('Login with invalid username', async ({ page }) => {
      const factory = GenericFactory;
      const invalidData = factory.createInvalidUsername();

      await homePage.login(invalidData);

      // Verificação de erro (esperando a mensagem de erro)
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('.error-message')).toHaveText(MESSAGES.INVALID_CREDENTIALS);
    });
  });

  // Exemplo de teste adicional (opcional, para cobrir o fluxo completo)
  test('Full Checkout Flow Test', async ({ page }) => {
      const factory = GenericFactory;
      const loginData = factory.createStandardUser();

      await homePage.login(loginData);
      await homePage.navigateToInventory();

      // Adicionar item (ID 4)
      await homePage.addToCart('4');

      // Ir para o carrinho
      await homePage.viewCart();

      // Iniciar Checkout Step One
      await homePage.navigateToCheckoutStepOne();

      // Iniciar Checkout Step Two
      await homePage.navigateToCheckoutStepTwo();

      // Concluir Checkout
      await homePage.navigateToCheckoutComplete();

      // Verificação final
      await expect(page).toHaveURL(ROUTES.CHECKOUT_COMPLETE);
      expect(page.locator('h1')).toHaveText(MESSAGES.CHECKOUT_COMPLETE_TITLE);
  });
});