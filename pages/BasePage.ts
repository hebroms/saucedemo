import { Page } from '../interface/types';
import * as BaseElements from '../elements/BaseElements';

/**
 * Classe base abstrata para todas as páginas do sistema.
 */
export abstract class BasePage implements Page {
  protected page: Page;
  protected elements: BaseElements;

  constructor(page: Page) {
    this.page = page;
    // Inicializa os seletores compartilhados
    this.elements = new BaseElements();
  }

  /**
   * Navega para a URL especificada.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Obtém o título da página.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Espera o carregamento completo da página (incluindo elementos dinâmicos).
   */
  async waitForLoad(): Promise<void> {
    // Espera um tempo razoável para garantir que a UI esteja pronta.
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Método de login genérico (será sobrescrito pelas páginas específicas).
   */
  async login(user: { username: string; password: string }): Promise<void> {
    await this.page.locator(this.elements.loginUsername).fill(user.username);
    await this.page.locator(this.elements.loginPassword).fill(user.password);
    await this.page.locator(this.elements.loginButton).click();
  }
}