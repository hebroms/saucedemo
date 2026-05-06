import { BasePage } from '../pages/base.page';
import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import { GenericFactory } from '../factories/generic.factory';
import { ENVIRONMENTS } from '../constants/environment.constants';
import { ROUTES } from '../constants/route.constants';
import { ALERT_MESSAGES } from '../constants/alert.constants';

import { test, expect, before, after } from '@playwright/test';

// Setup for Page Objects and Factories
let loginPage: SAUCEDEMOPage;
let inventoryPage: SAUCEDEMOPage; // Assuming this page handles the main feature flow

// Setup Factory (if needed for data generation)
let factory: GenericFactory;

// Define environment variables for context
const APP_URL = ROUTES.BASE_URL;
const LOGIN_ROUTE = ROUTES.LOGIN_ROUTE;
const INVENTORY_ROUTE = ROUTES.INVENTORY_ROUTE;


before(async ({ page }) => {
  // Initialize Page Objects
  loginPage = new SAUCEDEMOPage(page);
  inventoryPage = new SAUCEDEMOPage(page);

  // Setup Factory
  factory = new GenericFactory();

  // Global setup: Ensure we start at the base URL if necessary, though page object methods should handle navigation.
});

test.describe('SAUCEDEMO Feature Tests', () => {

  // --- Scenario 1: Boundary Test: Edge Case Data Type Handling ---
  test('Boundary Test: Testing input with non-numeric or mixed data types in a numeric field', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Assuming the page object has methods to interact with specific fields and handle validation results
    await inventoryPage.enterNumericInput('someField', 'abc'); 
    
    // Assertion based on expected error handling (assuming the system rejects invalid input)
    await expect(inventoryPage.getErrorMessage('someField')).toContain(ALERT_MESSAGES.INVALID_INPUT);
  });

  // --- Scenario 2: Negative Test: Empty Field Submission ---
  test('Negative Test: Attempting to submit a form with mandatory fields empty', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Navigate to the submission screen (assuming this is handled by the page object)
    await inventoryPage.navigate(); 

    // Attempt submission without filling required fields
    await inventoryPage.submitFormWithoutData();

    // Assertion: Check for validation errors next to all missing mandatory fields
    const errors = await inventoryPage.getValidationErrors();
    expect(errors).toHaveLength(3); // Assuming 3 mandatory fields exist
    expect(errors).toEqual(expect.arrayContaining([
      ALERT_MESSAGES.MISSING_FIELD_1,
      ALERT_MESSAGES.MISSING_FIELD_2,
      ALERT_MESSAGES.MISSING_FIELD_3,
    ]));
  });

  // --- Scenario 3: Access Test: Session Timeout Handling ---
  test('Access Test: Verifying session expiration and re-authentication requirement', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Simulate inactivity (This requires interaction with the application state or waiting mechanism)
    await inventoryPage.simulateInactivity(300000); // Wait for 5 minutes timeout simulation

    // Attempt to perform a sensitive action
    await inventoryPage.attemptSensitiveAction();

    // Assertion: System should force a re-login
    await expect(inventoryPage.isLoggedIn()).toBe(false);
    await expect(inventoryPage.getErrorMessage('session_expired')).toBeVisible();
  });

  // --- Scenario 4: Verificar tratamento de entrada negativa (Input Validation) ---
  test('Verificar tratamento de entrada negativa (Input Validation)', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Attempt to submit with empty fields
    await inventoryPage.submitFormWithEmptyFields();

    // Assertion: System should return a valid error message
    const errorMessage = await inventoryPage.getSubmissionError();
    expect(errorMessage).toContain(ALERT_MESSAGES.VALIDATION_FAILED);
  });

  // --- Scenario 5: Verificação de erro em comunicação externa (Regra de Negócio) ---
  test('Verificação de erro em comunicação externa (Regra de Negócio)', async ({ page }) => {
    // Setup: Simulate external service failure (This requires mocking or setting up a specific environment state within the Page Object context)
    await inventoryPage.simulateExternalServiceFailure();

    // Action: Execute the functionality that depends on this service
    await inventoryPage.executeDependentFunction();

    // Assertion: System should treat the error and display an unavailability message
    const error = await inventoryPage.getSystemError();
    expect(error).toContain(ALERT_MESSAGES.SERVICE_UNAVAILABLE);
  });

  // --- Scenario 6: Fluxo de uso positivo: Execução básica da funcionalidade ---
  test('Fluxo de uso positivo: Execução básica da funcionalidade', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Action: Start the process
    await inventoryPage.startProcess();

    // Action: Provide all required parameters (using factory data)
    const validData = await factory.generateValidInventoryData();
    await inventoryPage.provideParameters(validData);

    // Assertion: The process should be completed successfully
    await inventoryPage.verifySuccess();
    await expect(inventoryPage.isProcessSuccessful()).toBe(true);
  });

  // --- Scenario 7: Verificação de persistência de dados após o uso positivo (Regressão) ---
  test('Verificação de persistência de dados após o uso positivo (Regressão)', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Action: Execute the positive flow with new data
    const newData = await factory.generateNewInventoryData();
    await inventoryPage.executePositiveFlow(newData);

    // Action: Verify the visualization of the data later
    await inventoryPage.verifyDataPersistence(newData);

    // Assertion: The data must be persisted in the database
    await expect(inventoryPage.isDataPersisted(newData)).toBe(true);
  });

  // --- Scenario 8: Verificação de estado após falha de transação (Regressão) ---
  test('Verificação de estado após falha de transação (Regressão)', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Setup: Start a transaction with valid data
    const initialData = await factory.generateTransactionData();
    await inventoryPage.startTransaction(initialData);

    // Action: Interrupt the transaction by causing an internal error (simulated)
    await inventoryPage.simulateInternalErrorDuringTransaction();

    // Assertion: The system should revert the state to the previous one (rollback)
    await expect(inventoryPage.isTransactionRolledBack()).toBe(true);
    await expect(inventoryPage.getCurrentState()).toEqual(initialData);
  });

  // --- Scenario 9: Teste de acesso de usuário não autenticado (Segurança) ---
  test('Teste de acesso de usuário não autenticado (Segurança)', async ({ page }) => {
    // Setup: User is not logged in (Implicitly handled by not calling loginPage.login)

    // Action: Attempt to access the feature URL directly
    await inventoryPage.attemptDirectAccess();

    // Assertion: Should be redirected to the login screen
    await expect(inventoryPage.isLoginPageVisible()).toBe(true);
  });

  // --- Scenario 10: Verificação de acesso restrito (Segurança/Acesso) ---
  test('Verificação de acesso restrito (Segurança/Acesso)', async ({ page }) => {
    await loginPage.login(ENVIRONMENTS.DEFAULT_USER, ENVIRONMENTS.DEFAULT_PASS);

    // Action: Attempt to access the feature directly (without going through the correct flow)
    await inventoryPage.attemptDirectAccess();

    // Assertion: Should receive a permission error 403
    await expect(inventoryPage.isPermissionDenied()).toBe(true);
    await expect(inventoryPage.getHttpStatus()).toBe(403);
  });
});