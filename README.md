# Cogniflow 🧠✨

**Plataforma SaaS de Inteligência Criativa**

Desbloqueie, estruture e conecte suas ideias em prompts e templates para ferramentas como Lovable, Base44, Notion, Figma e muito mais.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?style=for-the-badge&logo=supabase)

</div>

---

## 🚀 Features

- ✅ **Gerador de Ideias** - Navegue ou gere automaticamente ideias e prompts criativos
- 📚 **Biblioteca de Templates** - Templates prontos para startups, design, apps e conteúdo
- 🔄 **Sistema de Exportação** - Exporte ideias para ferramentas externas
- 📊 **Dashboard do Usuário** - Gerencie ideias salvas e histórico
- 🤖 **Assistente de IA** - Interface tipo chat para refinar suas ideias
- 🔐 **Autenticação Segura** - Email + OAuth (Google/GitHub) via Supabase
- 🌓 **Dark Mode** - Tema claro/escuro com estética cyber/IA
- ⚡ **Performance Otimizada** - Lighthouse ≥95 em Performance, SEO e Acessibilidade

---

## 🛠️ Tech Stack

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

## 📦 Instalação Rápida

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 3. Executar em desenvolvimento
pnpm dev
```

**🔗 Para instruções detalhadas, veja [INSTALL.md](./INSTALL.md)**

---

## 🏗️ Estrutura do Projeto

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

**📖 Documentação técnica completa em [DOCS.md](./DOCS.md)**

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- pnpm
- Conta Supabase (gratuita)

### Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o SQL em `supabase/schema.sql` no SQL Editor
3. Copie as credenciais (URL + anon key) para `.env.local`

### Rodar o Projeto

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build produção
pnpm start        # Servidor produção
pnpm lint         # Linter
pnpm format       # Formatar código
pnpm type-check   # Verificar tipos
```

---

## 🧪 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento |
| `pnpm build` | Build para produção |
| `pnpm start` | Inicia servidor de produção |
| `pnpm lint` | Executa ESLint |
| `pnpm format` | Formata código com Prettier |
| `pnpm type-check` | Verifica tipos TypeScript |

---

## 🚢 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy!

### Outras Plataformas

- **Netlify**: Suportado
- **Railway**: Suportado
- **Docker**: Dockerfile disponível (em breve)

---

## 🎨 Personalização

### Cores do Tema

Edite `tailwind.config.js` e `styles/globals.css`:

```js
cyber: {
  blue: '#0ea5e9',   // Azul cibernético
  cyan: '#06b6d4',   // Ciano
  neon: '#10b981',   // Verde neon
}
```

### Componentes

Todos os componentes UI estão em `/components/ui` e podem ser customizados individualmente.

---

## 📚 Recursos e Documentação

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

---

## 🗺️ Roadmap

### Fase 1 - MVP (Atual)
- [x] Setup do projeto
- [x] Autenticação
- [x] Homepage
- [x] Componentes UI base
- [x] Dashboard do usuário
- [ ] Sistema de ideias
- [ ] Templates básicos

### Fase 2 - Features Core
- [ ] Gerador de ideias com IA
- [ ] Biblioteca completa de templates
- [ ] Exportação para Lovable/Notion
- [ ] Assistente IA completo

### Fase 3 - Expansão
- [ ] Integração com Figma
- [ ] Colaboração em tempo real
- [ ] Marketplace de templates
- [ ] API pública

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

<div align="center">

**⭐ Se este projeto te ajudou, dê uma estrela!**

</div>