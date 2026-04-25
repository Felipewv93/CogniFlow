# Resolvendo Erros de Testes - Guia Rápido

## Problema

Os arquivos de teste têm erros porque as dependências não estão instaladas:

```
Cannot find module 'vitest'
Cannot find module '@testing-library/react'
Cannot find module '@playwright/test'
```

## Solução Rápida (3 passos)

### 1. Instale as Dependências

```bash
# Opção A: Script automático (recomendado)
bash tests/install-dependencies.sh

# Opção B: Comando manual
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @vitejs/plugin-react jsdom axe-core jest-axe --legacy-peer-deps

# Opção C: Um por um
npm install --save-dev vitest
npm install --save-dev @testing-library/react
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Verifique a Instalação

```bash
npm run test:unit -- --version
npx playwright --version
```

### 3. Execute os Testes

```bash
# Testes unitários
npm run test:unit

# Testes com UI
npm run test:watch

# Testes E2E
npm run test:e2e:ui
```

## Erros Comuns e Soluções

### Erro: "Cannot find module 'vitest'"

Solução:

```bash
npm install --save-dev vitest @vitest/ui
```

### Erro: "Cannot find module '@testing-library/react'"

Solução:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Erro: "Cannot find module '@playwright/test'"

Solução:

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Erro: "jsdom is not defined"

Solução:

```bash
npm install --save-dev jsdom
```

### Erro: "Type errors in test files"

Solução:

```bash
npm install --save-dev @types/jest @types/node typescript
```

## O que Fazer Agora

### Passo 1: Instalar Dependências

```bash
# Recomendado: usar o script
bash tests/install-dependencies.sh

# Espere completar (pode levar 2-5 minutos)
```

### Passo 2: Verificar Instalação

```bash
npm run test:unit 2>&1 | head -20
```

### Passo 3: Explorar os Testes

```bash
# Ver testes disponíveis
ls -la tests/unit/
ls -la tests/e2e/
ls -la tests/security/

# Rodar tipos específicos
npm run test:unit         # Testes unitários
npm run test:security     # Testes de segurança
npm run test:e2e:ui       # E2E com interface visual
```

## Arquivos de Teste Criados

```
tests/
├── config/
│   ├── vitest.config.ts       Configuração Vitest
│   ├── playwright.config.ts   Configuração Playwright
│   └── setup.ts               Setup de testes
│
├── unit/
│   ├── lib/
│   │   └── utils.test.ts      Testes da função cn()
│   │
│   ├── components/
│   │   └── button.test.tsx    Testes do Button
│   │
│   └── pages/
│       └── auth-signup.test.ts Testes do Signup
│
├── e2e/
│   └── auth.spec.ts            Testes E2E de auth
│
├── security/
│   └── vulnerabilities.test.ts Checklist de segurança
│
└── README.md                    Documentação
```

## Scripts Disponíveis

```bash
npm test                    # Rodar todos os testes
npm run test:unit          # Testes unitários
npm run test:integration   # Testes de integração
npm run test:e2e          # Testes E2E
npm run test:e2e:ui       # E2E com UI visual
npm run test:security     # Testes de segurança
npm run test:coverage     # Com cobertura
npm run test:watch        # Modo watch/desenvolvimento
```

## Verificar Status

Após instalar, execute para verificar:

```bash
# 1. TypeScript está OK?
npm run type-check

# 2. Vitest está OK?
npm run test:unit -- --run

# 3. Playwright está OK?
npx playwright --version

# 4. Tudo junto
npm run test:all
```

## Debugging

Se algo der errado:

```bash
# Limpar cache
rm -rf node_modules/.vitest
rm -rf dist/

# Reinstalar
npm install

# Tente novamente
npm run test:unit
```

## Se Ainda Tiver Problemas

1. Verifique Node.js versão:

   ```bash
   node --version  # Deve ser 18+
   npm --version   # Deve ser 8+
   ```

2. Limpe tudo:

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Verifique se está no diretório correto:

   ```bash
   pwd  # Deve terminar em /CogniFlow
   ```

4. Veja os logs:
   ```bash
   npm install --save-dev vitest --verbose
   ```

---

Depois de seguir esses passos, os erros devem desaparecer!

Para mais detalhes, veja:

- `docs/TESTING.md` - Documentação completa
- `docs/TESTING_INSTALL.md` - Guia de instalação detalhado
- `docs/TESTING_ARCHITECTURE.md` - Arquitetura dos testes
