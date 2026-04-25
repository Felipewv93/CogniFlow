# Documentação do CogniFlow

Bem-vindo à documentação do CogniFlow. Este diretório contém toda a documentação técnica do projeto.

## Documentação de Testes

Aqui você encontra tudo sobre os testes automatizados e CI/CD do projeto:

- **[TESTING.md](./TESTING.md)** - Documentação completa da estratégia de testes, ferramentas e estrutura
- **[TESTING_INSTALL.md](./TESTING_INSTALL.md)** - Guia passo a passo para instalar todas as dependências de teste
- **[TESTING_ARCHITECTURE.md](./TESTING_ARCHITECTURE.md)** - Arquitetura detalhada, organização de pastas e convenções
- **[TESTING_TROUBLESHOOTING.md](./TESTING_TROUBLESHOOTING.md)** - Soluções para erros comuns durante instalação e execução de testes

## Começando

1. Leia [TESTING.md](./TESTING.md) para entender a estrutura geral
2. Siga [TESTING_INSTALL.md](./TESTING_INSTALL.md) para instalar as dependências
3. Use [TESTING_ARCHITECTURE.md](./TESTING_ARCHITECTURE.md) como referência durante desenvolvimento
4. Consulte [TESTING_TROUBLESHOOTING.md](./TESTING_TROUBLESHOOTING.md) se tiver problemas

## Scripts de Teste Disponíveis

```bash
npm test                    # Rodar todos os testes
npm run test:unit          # Testes unitários
npm run test:integration   # Testes de integração
npm run test:e2e          # Testes E2E
npm run test:security     # Testes de segurança
npm run test:coverage     # Com cobertura de código
npm run test:watch        # Modo watch para desenvolvimento
npm run test:all          # Todos os testes com relatórios
```

## Estrutura de Documentação

```
docs/
├── README.md                      # Este arquivo
├── TESTING.md                     # Visão geral de testes e CI/CD
├── TESTING_INSTALL.md             # Guia de instalação
├── TESTING_ARCHITECTURE.md        # Arquitetura e organização
└── TESTING_TROUBLESHOOTING.md     # Troubleshooting e soluções
```

## Contato

Para dúvidas sobre documentação ou testes, abra uma issue no repositório.
