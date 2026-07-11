import { Page } from '../interface/types';

/**
 * Função utilitária para esperar o fim da atividade de rede.
 * @param page O objeto Playwright Page.
 */
export async function waitForNetworkIdle(page: Page): Promise<void> {
  console.log("Waiting for network idle...");
  await page.waitForLoadState('networkidle');
}

/**
 * Função utilitária para retentar uma ação.
 * @param action A função a ser executada.
 * @param maxRetries Número máximo de tentativas.
 * @param delay Tempo de espera entre as tentativas em ms.
 * @returns O resultado da ação.
 */
export async function retryAction<T>(action: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      if (attempt === maxRetries) {
        throw error; // Lança o erro na última tentativa
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  // Este ponto não deve ser alcançado se a lógica de throw estiver correta
  throw new Error("Action failed after all retries.");
}
