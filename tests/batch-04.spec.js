import { SAUCEDEMOPage } from '../pages/s-a-u-c-e-d-e-m-o.page';
import * as PageObjects from '../pages/page-objects';
import * as GenericFactory from '../factories/generic.factory';

describe('SauceDemo Feature Tests', () => {
    let loginPage: SAUCEDEMOPage;
    let dashboardPage: PageObjects.DashboardPage; // Assuming a DashboardPage exists in page-objects
    let genericFactory: GenericFactory;

    beforeEach(async () => {
        // Initialize Page Objects and Factory
        loginPage = new SAUCEDEMOPage();
        dashboardPage = new PageObjects.DashboardPage();
        genericFactory = new GenericFactory();

        // Setup: User padrão logado (Login)
        await loginPage.login(genericFactory.getCredentials());
    });

    describe('Feature Execution and Persistence', () => {

        // Scenario: Executar a funcionalidade principal com dados válidos
        test('Executar o fluxo positivo com dados válidos', async () => {
            // Given Usuário padrão logado (Handled by beforeEach)
            // When Inicia o processo da feature & And Fornece todos os parâmetros exigidos
            await dashboardPage.executePositiveFlow();

            // Then O processo deve ser concluído com sucesso
            await dashboardPage.assertProcessSuccess();
        });

        // Scenario: Verificação de persistência de dados após o uso positivo (Regressão)
        test('Verificar se os dados inseridos são salvos corretamente', async () => {
            // Given Usuário padrão logado (Handled by beforeEach)
            // When Executa o fluxo positivo com novos dados
            await dashboardPage.executePositiveFlowWithNewData();

            // And Verifica a visualização dos dados posteriormente
            await dashboardPage.verifyDataPersistence();

            // Then Os dados devem ser persistidos no banco de dados
            await dashboardPage.assertDataPersisted();
        });

        // Scenario: Verificação de estado após falha de transação (Regressão)
        test('Verificar o rollback em caso de erro durante a transação', async () => {
            // Given Uma transação foi iniciada com dados válidos
            await genericFactory.startTransactionWithValidData();

            // When A transação é interrompida por um erro interno
            await genericFactory.simulateInternalError();

            // Then O sistema deve reverter o estado para o anterior (rollback)
            await genericFactory.verifyStateRollback();
        });
    });

    describe('Security and Access Tests', () => {

        // Scenario: Teste de acesso de usuário não autenticado (Segurança)
        test('Tentativa de acesso à feature sem autenticação', async () => {
            // Given O usuário não está logado (Setup: Skip login in beforeEach)
            // We need a specific setup for this test, bypassing the default login.
            await loginPage.clearSession(); 

            // When Tenta acessar a URL da feature
            await loginPage.navigateToFeatureURL();

            // Then Deve ser redirecionado para a tela de login
            await loginPage.assertRedirectToLoginPage();
        });

        // Scenario: Verificação de acesso restrito (Segurança/Acesso)
        test('Tentativa de acesso à funcionalidade sem permissão', async () => {
            // Given Usuário padrão logado (Setup: Ensure user is logged in)
            // This relies on the default login from beforeEach.

            // When Tenta acessar a URL da feature diretamente (sem passar pelo fluxo correto)
            await loginPage.attemptDirectAccessToRestrictedFeature();

            // Then Deve receber um erro de permissão 403
            await loginPage.assertReceivePermissionError(403);
        });
    });
});