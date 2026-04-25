# Testes e CI/CD do CogniFlow

Documentação completa da estratégia de testes automatizados do projeto.

## Estrutura de Testes

```
tests/
├── unit/                      # Testes unitários
│   ├── lib/                   # Testes de funções utilitárias
│   ├── utils/                 # Testes de helpers e constantes
│   └── hooks/                 # Testes de React hooks customizados
├── integration/               # Testes de integração
│   ├── api/                   # Testes de rotas API
│   ├── auth/                  # Testes de fluxo de autenticação
│   └── database/              # Testes com Supabase
├── e2e/                       # Testes end-to-end (Playwright)
│   ├── auth.spec.ts           # Fluxos de autenticação
│   ├── dashboard.spec.ts      # Funcionalidades do dashboard
│   └── templates.spec.ts      # Páginas de templates
├── security/                  # Testes de segurança
│   ├── vulnerability-scan.ts  # Scanning de vulnerabilidades
│   ├── auth-security.test.ts  # Testes de segurança de auth
│   └── api-security.test.ts   # Testes de segurança de API
├── performance/               # Testes de performance
│   ├── lighthouse.config.ts   # Configuração Lighthouse
│   └── bundle-size.test.ts    # Testes de tamanho de bundle
├── accessibility/             # Testes de acessibilidade
│   └── a11y.test.ts           # Testes com axe-core
└── config/                    # Configurações de testes
    ├── jest.config.js         # Configuração Jest
    ├── playwright.config.ts   # Configuração Playwright
    └── vitest.config.ts       # Configuração Vitest
```

## Ferramentas de Testes

### Testes Unitários & Integração

- Vitest: Framework de testes rápido (compatível com Jest)
- @testing-library/react: Testes de componentes React
- @testing-library/jest-dom: Matchers customizados

### Testes E2E

- Playwright: Automação de navegador
- @playwright/test: Framework de testes

### Segurança

- npm audit: Auditoria de dependências
- snyk: Scanning de vulnerabilidades
- OWASP ZAP: Testes de segurança web

### Performance

- Lighthouse CI: Auditoria de performance
- Bundle Analyzer: Análise de tamanho de bundle

### Acessibilidade

- axe-core: Testes de acessibilidade
- jest-axe: Integração com Jest

## Scripts de Teste

```bash
# Executar todos os testes
npm run test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Testes de segurança
npm run test:security

# Testes de performance
npm run test:performance

# Testes de acessibilidade
npm run test:a11y

# Cobertura de código
npm run test:coverage

# Executar em modo watch
npm run test:watch
```

## CI/CD Pipeline

### GitHub Actions Workflow

O pipeline automatizado executa:

1. Lint & Format
   - ESLint para qualidade de código
   - Prettier para formatação
   - TypeScript type checking

2. Testes Unitários
   - Todos os testes com Vitest
   - Coverage mínimo: 80%

3. Testes de Integração
   - Testes com banco de dados mock
   - Testes de API routes

4. Testes E2E
   - Fluxos críticos no Playwright
   - Múltiplos navegadores (Chrome, Firefox, Safari)

5. Segurança
   - npm audit
   - Scanning de dependências com Snyk
   - SAST com CodeQL

6. Performance
   - Bundle size checks
   - Lighthouse scores

7. Build
   - Build Next.js production
   - Validação de bundle

## Cobertura de Código

Metas de cobertura por camada:

- Components: 80%+
- Hooks: 90%+
- Utils: 95%+
- API Routes: 85%+
- lib: 90%+

## Checklist de Segurança

- [ ] Validação de inputs em formulários
- [ ] CSRF protection em POST/PUT/DELETE
- [ ] Rate limiting em API routes
- [ ] SQL injection prevention (Supabase)
- [ ] XSS prevention (React sanitization)
- [ ] Auth token segurança
- [ ] Secrets management (env vars)
- [ ] HTTPS em produção
- [ ] Headers de segurança (CSP, etc)

## Convenções de Teste

### Nomenclatura

```
[unidade].test.ts
[unidade].spec.ts
[unidade].integration.test.ts
[unidade].e2e.spec.ts
```

### Estrutura

```typescript
describe('[Unidade sendo testada]', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('[Comportamento específico]', () => {
    it('deve [resultado esperado]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Links Úteis

- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)

## Contato

Para dúvidas sobre testes, abra uma issue com a tag `tests`.
