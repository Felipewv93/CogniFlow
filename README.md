# Cogniflow

Plataforma SaaS de inteligência criativa para transformar ideias em entregáveis práticos com apoio de IA.

O Cogniflow foi projetado para equipes e profissionais que precisam estruturar conceitos rapidamente e converter brainstorm em prompts, templates e ativos reutilizáveis para ferramentas como Lovable, Base44, Notion e Figma.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?style=for-the-badge&logo=supabase)

</div>

---

## Principais Funcionalidades

- **Gerador de ideias**: criação e refinamento de ideias e prompts com suporte de IA.
- **Biblioteca de templates**: coleção de estruturas prontas para produto, design, apps e conteúdo.
- **Exportação de conteúdo**: envio de ideias e artefatos para ferramentas externas.
- **Painel do usuário**: histórico, organização e gestão de ideias salvas.
- **Assistente conversacional**: fluxo em formato de chat para evolução de conceitos.
- **Autenticação segura**: login por email e OAuth (Google/GitHub) via Supabase.
- **Interface responsiva**: experiência consistente em desktop e mobile.
- **Base otimizada para SEO e performance**: arquitetura com foco em escalabilidade.

---

## Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS + Shadcn/ui
- **Animações:** Framer Motion
- **Ícones:** Lucide React
- **Backend:** Supabase (Auth + Database)
- **State Management:** React Query
- **Forms:** React Hook Form + Zod
- **SEO:** next-seo + next-sitemap
- **Package Manager:** pnpm

---

## Instalação Rápida

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 3. Executar em desenvolvimento
pnpm dev
```

Para instruções detalhadas, consulte [INSTALL.md](./INSTALL.md).

---

## Estrutura do Projeto

```
CogniFlow/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Rotas de autenticação
│   ├── (main)/            # Rotas principais (dashboard, etc)
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
│   ├── ui/               # Componentes Shadcn/ui
│   ├── layout/           # Componentes de layout
│   └── sections/         # Seções da homepage
├── lib/                  # Bibliotecas e configurações
├── supabase/             # Configuração Supabase
├── utils/                # Utilidades
├── types/                # TypeScript types
└── public/               # Arquivos estáticos
```

Documentação técnica completa em [DOCS.md](./DOCS.md).

---

## Quick Start

### Pré-Requisitos

- Node.js 18+
- pnpm
- Conta Supabase (gratuita)

### Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o SQL em `supabase/schema.sql` no SQL Editor
3. Copie as credenciais (URL + anon key) para `.env.local`

### Executar o Projeto

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build produção
pnpm start        # Servidor produção
pnpm lint         # Linter
pnpm format       # Formatar código
pnpm type-check   # Verificar tipos
```

---

## Scripts Disponíveis

| Script            | Descrição                          |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Inicia servidor de desenvolvimento |
| `pnpm build`      | Build para produção                |
| `pnpm start`      | Inicia servidor de produção        |
| `pnpm lint`       | Executa ESLint                     |
| `pnpm format`     | Formata código com Prettier        |
| `pnpm type-check` | Verifica tipos TypeScript          |

---

## Deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Execute o deploy

### Outras Plataformas

- **Netlify**: suportado
- **Railway**: suportado
- **Docker**: disponível em evolução

---

## Personalização

### Cores do Tema

Edite `tailwind.config.js` e `styles/globals.css`:

```js
cyber: {
  blue: '#0ea5e9',
  cyan: '#06b6d4',   // Ciano
  neon: '#10b981',
}
```

### Componentes

Todos os componentes de interface estão em `/components/ui` e podem ser customizados individualmente.

---

## Recursos e Documentação

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

---

## Roadmap de Produto

### Fase 1 - MVP (Atual)

- [x] Setup do projeto
- [x] Autenticação
- [x] Homepage
- [x] Componentes UI base
- [x] Dashboard do usuário
- [x] Sistema de ideias
- [x] Templates básicos
- [x] Área de times e colaboração inicial
- [x] Convites de membros por link

### Fase 2 - Funcionalidades Core

- [x] Gerador de ideias com IA
- [x] Biblioteca de templates (v1)
- [x] Exportação de conteúdo (v1)
- [x] Assistente IA (v1)
- [x] APIs server-side para times, membros, convites e ideias
- [ ] Gestão avançada de permissões e papéis de time
- [ ] Histórico e versionamento de conteúdo

### Fase 3 - Expansão

- [ ] Integração com Figma
- [ ] Colaboração em tempo real
- [ ] Marketplace de templates
- [ ] API pública

---

## Posicionamento

O Cogniflow atua como um workspace de inteligência criativa para acelerar descoberta, estruturação e execução de ideias. O foco do produto é reduzir tempo entre conceito e entrega, com colaboração, padronização e escala.
