# Guia de Instalação - Dependências de Teste

Este documento descreve como instalar e configurar todas as dependências necessárias para executar os testes.

## Instalação Rápida

```bash
# Instalar todas as dependências de desenvolvimento
npm install --save-dev \
  vitest@latest \
  @vitest/ui@latest \
  @testing-library/react@latest \
  @testing-library/jest-dom@latest \
  @testing-library/user-event@latest \
  @playwright/test@latest \
  @vitejs/plugin-react@latest \
  jsdom@latest \
  axe-core@latest \
  jest-axe@latest \
  @types/jest@latest \
  ts-node@latest
```

## Instalação Individual por Categoria

### Testes Unitários & Integração

```bash
npm install --save-dev \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom
```

### Testes E2E

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Segurança

```bash
npm install --save-dev \
  eslint-plugin-security \
  npm-audit-report
```

### Performance

```bash
npm install --save-dev \
  lighthouse \
  @lighthouse/ci \
  webpack-bundle-analyzer
```

### Acessibilidade

```bash
npm install --save-dev \
  axe-core \
  jest-axe \
  @axe-core/playwright
```

### Build Tools

```bash
npm install --save-dev \
  @vitejs/plugin-react \
  vite \
  ts-node \
  typescript
```

## Verificar Instalação

```bash
# Verificar se tudo foi instalado
npm run test --version 2>/dev/null && echo "Vitest instalado"
npx playwright --version 2>/dev/null && echo "Playwright instalado"

# Executar um teste simples
npm run test:unit
```

## Pós-Instalação

Após instalar as dependências, você pode:

1. Executar os testes:

   ```bash
   npm test
   ```

2. Ver cobertura de código:

   ```bash
   npm run test:coverage
   ```

3. Rodar testes E2E com UI:

   ```bash
   npm run test:e2e:ui
   ```

4. Executar todos os testes:
   ```bash
   npm run test:all
   ```

## Configuração do Git Hooks

Adicione scripts de teste ao `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test:unit
```

## Troubleshooting

### Vitest não encontrado

```bash
npm install --save-dev vitest
```

### Playwright browsers não instalados

```bash
npx playwright install
npx playwright install-deps
```

### Problemas de TypeScript

```bash
npm install --save-dev typescript ts-node
npx tsc --init
```

### Limpar cache

```bash
rm -rf node_modules/.vitest
rm -rf .next
npm install
```

## Próximos Passos

1. Instalar as dependências com o comando acima
2. Rodar `npm test` para verificar que está funcionando
3. Criar os primeiros testes na pasta `tests/`
4. Configurar o GitHub Actions (já está em `.github/workflows/ci-cd.yml`)
5. Configurar Codecov para rastrear cobertura

## Links de Referência

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [GitHub Actions](https://docs.github.com/en/actions)
