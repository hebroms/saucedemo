# playwright Test Suite

Gerado automaticamente pelo QA Pipeline.

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
npm install
npx playwright install
```

## Configuração

Copie `.env` e preencha as variáveis:
```
BASE_URL=https://sua-aplicacao.com
TEST_USERNAME=seu-usuario
TEST_PASSWORD=sua-senha
```

## Executar Testes

```bash
# Todos os testes
npx playwright test

# Modo interativo
npx playwright test --ui

# Report HTML
npx playwright show-report
```

## Estrutura

```
tests/       — Arquivos .spec.ts
pages/       — Page Objects
elements/    — Locators
factories/   — Test data
fixtures/    — Playwright fixtures
utils/       — Helpers
constants/   — Routes e mensagens
```
