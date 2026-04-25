# Estrutura de Testes do CogniFlow

## Organização das Pastas

```
tests/
├── README.md                          # Documentação principal
├── INSTALL.md                         # Guia de instalação
│
├── config/                            # Configurações de testes
│   ├── vitest.config.ts              # Configuração Vitest
│   ├── playwright.config.ts          # Configuração Playwright
│   ├── setup.ts                      # Setup de testes
│   └── lighthouse.config.json        # Config Lighthouse
│
├── unit/                              # Testes Unitários
│   ├── lib/
│   │   ├── utils.test.ts             # Testes de utilitários
│   │   └── auth-context.test.ts      # Testes de contexto de auth
│   │
│   ├── components/
│   │   ├── button.test.tsx           # Testes do Button
│   │   ├── card.test.tsx             # Testes do Card
│   │   └── input.test.tsx            # Testes do Input
│   │
│   ├── hooks/
│   │   └── use-ideas.test.ts         # Testes de hooks customizados
│   │
│   └── pages/
│       ├── auth-signup.test.ts       # Testes da página de signup
│       └── dashboard.test.ts         # Testes do dashboard
│
├── integration/                       # Testes de Integração
│   ├── api/
│   │   ├── auth-api.test.ts          # Testes de auth API
│   │   └── templates-api.test.ts     # Testes de templates API
│   │
│   ├── auth/
│   │   ├── signup-flow.test.ts       # Fluxo completo de signup
│   │   └── login-flow.test.ts        # Fluxo completo de login
│   │
│   └── database/
│       ├── supabase.test.ts          # Testes com Supabase
│       └── migrations.test.ts        # Testes de migrações
│
├── e2e/                               # Testes End-to-End
│   ├── auth.spec.ts                  # Fluxos de autenticação
│   ├── dashboard.spec.ts             # Funcionalidades do dashboard
│   ├── templates.spec.ts             # Sistema de templates
│   └── generator.spec.ts             # Página do gerador
│
├── security/                          # Testes de Segurança
│   ├── vulnerabilities.test.ts       # Checklist OWASP
│   ├── auth-security.test.ts         # Segurança de autenticação
│   ├── api-security.test.ts          # Segurança de APIs
│   └── xss-prevention.test.ts        # Prevenção de XSS
│
├── performance/                       # Testes de Performance
│   ├── lighthouse.config.ts          # Configuração Lighthouse
│   ├── bundle-size.test.ts           # Testes de tamanho
│   └── render-performance.test.ts    # Performance de renderização
│
└── accessibility/                     # Testes de Acessibilidade
    ├── a11y.test.ts                  # Testes com axe-core
    └── wcag-compliance.test.ts       # Compliance WCAG
```

## Como Usar

### Instalação

1. Instale as dependências:
```bash
npm install --save-dev \
  vitest \
  @testing-library/react \
  @playwright/test \
  axe-core
```

2. Ou siga o guia completo em `docs/TESTING_INSTALL.md`

### Executar Testes

```bash
# Todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Com UI
npm run test:e2e:ui

# Segurança
npm run test:security

# Acessibilidade
npm run test:a11y

# Performance
npm run test:performance

# Cobertura
npm run test:coverage

# Modo watch
npm run test:watch

# Todos de uma vez
npm run test:all
```

## Estrutura de Testes por Arquitetura

### Frontend (React/Next.js)
- Testes unitários de componentes
- Testes de hooks customizados
- Testes de páginas
- Testes E2E com Playwright

### Backend (API Routes)
- Testes de routes
- Testes de middleware
- Testes de validação
- Testes de erro handling

### Database (Supabase)
- Testes de queries
- Testes de transações
- Testes de constraints
- Testes de migrações

### Segurança
- Auditoria de dependências (npm audit)
- Scanning de vulnerabilidades
- Testes OWASP Top 10
- Validação de inputs

### Performance
- Lighthouse CI
- Bundle size analysis
- Render performance
- Network waterfalls

### Acessibilidade
- WCAG 2.1 Level AA
- axe-core automated tests
- Keyboard navigation
- Screen reader tests

## CI/CD Pipeline

O arquivo `.github/workflows/ci-cd.yml` configura automaticamente:

1. Lint & Type Checking - ESLint, Prettier, TypeScript
2. Unit Tests - Vitest com cobertura mínima de 80%
3. Integration Tests - API e database tests
4. Security Scan - npm audit, Snyk, OWASP
5. Build - Next.js production build
6. E2E Tests - Playwright (Chrome, Firefox, Safari)
7. Performance - Lighthouse scores
8. Quality Gate - Verifica todos os checks passaram

## Convenções de Nomenclatura

### Testes Unitários
```
src/components/Button/Button.test.tsx
src/lib/utils/cn.test.ts
src/hooks/useIdeas.test.ts
```

### Testes de Integração
```
tests/integration/api/auth.integration.test.ts
tests/integration/database/templates.integration.test.ts
```

### Testes E2E
```
tests/e2e/auth.spec.ts
tests/e2e/dashboard.spec.ts
```

## Metas de Cobertura

| Camada | Meta | Atual |
|--------|------|-------|
| Components | 80% | - |
| Hooks | 90% | - |
| Utils | 95% | - |
| API Routes | 85% | - |
| lib | 90% | - |
