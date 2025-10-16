# 📖 DOCUMENTAÇÃO TÉCNICA - COGNIFLOW

## 🏗️ Arquitetura do Projeto

### Stack Tecnológica

```
Frontend:
├── Next.js 14 (App Router)
├── React 18
├── TypeScript (strict mode)
└── Tailwind CSS + Shadcn/ui

Backend:
├── Next.js API Routes
├── Supabase (PostgreSQL)
└── Supabase Auth

Bibliotecas:
├── Framer Motion (animações)
├── React Query (state management)
├── React Hook Form + Zod (forms)
├── Lucide React (ícones)
└── next-seo + next-sitemap (SEO)
```

---

## 📁 Estrutura de Diretórios

```
CogniFlow/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Grupo de rotas de autenticação
│   │   ├── login/           
│   │   ├── signup/          
│   │   └── reset-password/  
│   ├── (main)/              # Grupo de rotas principais
│   │   ├── dashboard/       # Dashboard do usuário
│   │   ├── templates/       # Biblioteca de templates
│   │   ├── generator/       # Gerador de ideias
│   │   └── assistant/       # Assistente IA
│   ├── api/                 # API Routes
│   │   ├── ideas/           # CRUD de ideias
│   │   ├── templates/       # CRUD de templates
│   │   ├── ai/              # Endpoints de IA
│   │   └── export/          # Exportação para outras ferramentas
│   ├── layout.tsx           # Layout raiz
│   └── page.tsx             # Homepage
│
├── components/              # Componentes React
│   ├── ui/                  # Componentes Shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── sonner.tsx
│   ├── layout/              # Componentes de layout
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   ├── sections/            # Seções da homepage
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── how-it-works.tsx
│   │   ├── templates.tsx
│   │   └── cta.tsx
│   ├── providers.tsx        # Providers (Theme, Query, etc)
│   └── theme-toggle.tsx     # Toggle dark/light mode
│
├── lib/                     # Bibliotecas e configurações
│   ├── helpers/             
│   │   └── utils.ts         # Funções utilitárias
│   └── hooks/               # Custom React Hooks
│       └── use-toast.ts
│
├── supabase/                # Configuração Supabase
│   ├── client.ts            # Cliente Supabase
│   └── schema.sql           # Schema do banco de dados
│
├── utils/                   # Utilitários
│   ├── constants.ts         # Constantes da aplicação
│   ├── seo.ts              # Configuração SEO
│   └── formatters.ts        # Formatadores de dados
│
├── types/                   # TypeScript types
│   └── index.d.ts           # Definições de tipos
│
├── styles/                  # Estilos globais
│   └── globals.css          # CSS global com Tailwind
│
├── public/                  # Arquivos estáticos
│   ├── images/              
│   │   ├── logo.svg
│   │   └── og-image.png
│   ├── favicon.ico
│   └── site.webmanifest
│
├── .husky/                  # Git hooks
├── package.json             # Dependências
├── tsconfig.json            # Config TypeScript
├── tailwind.config.js       # Config Tailwind
├── next.config.js           # Config Next.js
├── next-sitemap.config.js   # Config sitemap
├── .eslintrc.json           # Config ESLint
├── .prettierrc              # Config Prettier
├── .env.example             # Exemplo de variáveis de ambiente
├── README.md                # Documentação principal
└── INSTALL.md               # Guia de instalação
```

---

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

#### `profiles`
Estende `auth.users` do Supabase
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- name (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `ideas`
Armazena ideias dos usuários
```sql
- id (UUID, PK)
- user_id (UUID, FK -> profiles)
- title (TEXT)
- description (TEXT)
- category (TEXT)
- tags (TEXT[])
- content (TEXT)
- is_favorite (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `templates`
Templates públicos e privados
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- category (TEXT)
- content (TEXT)
- variables (JSONB)
- is_public (BOOLEAN)
- user_id (UUID, FK -> profiles, NULL)
- usage_count (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `export_configs`
Configurações de exportação
```sql
- id (UUID, PK)
- user_id (UUID, FK -> profiles)
- platform (TEXT)
- credentials (JSONB)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### `ai_conversations`
Histórico de conversas com IA
```sql
- id (UUID, PK)
- user_id (UUID, FK -> profiles)
- title (TEXT)
- messages (JSONB)
- idea_id (UUID, FK -> ideas, NULL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🔐 Autenticação e Segurança

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado:

```sql
-- Exemplo para ideas
CREATE POLICY "Users can view their own ideas"
  ON public.ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ideas"
  ON public.ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Autenticação

- **Email/Password**: Gerenciado pelo Supabase Auth
- **OAuth**: Google, GitHub (configurável)
- **Magic Link**: Suportado via Supabase
- **Session**: Gerenciado automaticamente

---

## 🎨 Sistema de Design

### Cores

```css
/* Light Mode */
--primary: 221.2 83.2% 53.3%        /* Blue */
--secondary: 210 40% 96.1%          /* Light Gray */
--cyber-blue: #0ea5e9               /* Cyan-Blue */
--cyber-cyan: #06b6d4               /* Cyan */
--cyber-neon: #10b981               /* Green */

/* Dark Mode */
--background: 222.2 84% 4.9%        /* Dark Blue */
--foreground: 210 40% 98%           /* Almost White */
```

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Tamanhos**: 
  - H1: 4xl-7xl (responsivo)
  - H2: 3xl-4xl
  - H3: 2xl-3xl
  - Body: base-lg

### Componentes

Baseados no **Shadcn/ui**:
- Button (com variante "cyber")
- Card
- Input
- Badge
- Dialog
- Toast (Sonner)
- Form (React Hook Form + Zod)

---

## 🚀 Performance e SEO

### Otimizações Implementadas

1. **Imagens**: Uso de `next/image` com otimização automática
2. **Lazy Loading**: Componentes carregam sob demanda
3. **Code Splitting**: Automático via Next.js
4. **Fonts**: Otimização de fontes com `next/font`
5. **Sitemap**: Gerado automaticamente com `next-sitemap`
6. **Meta Tags**: Dinâmicas com `next-seo`
7. **JSON-LD**: Schema.org para SEO

### Meta Lighthouse

- Performance: ≥95
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

---

## 🔌 Integrações Planejadas

### Exportação

- **Lovable**: Via API webhook
- **Notion**: Via API oficial
- **Figma**: Via Plugin API
- **Base44**: Via webhook customizado
- **Markdown**: Download direto

### IA

- **OpenAI GPT-4**: Para geração e refinamento de ideias
- **Embedding**: Para busca semântica (futuro)
- **Fine-tuning**: Templates customizados (futuro)

---

## 📊 Estado da Aplicação

### React Query

Gerenciamento de estado servidor:

```typescript
// Exemplo de query
const { data, isLoading } = useQuery({
  queryKey: ['ideas'],
  queryFn: fetchIdeas,
  staleTime: 60 * 1000, // 1 minuto
});

// Exemplo de mutation
const { mutate } = useMutation({
  mutationFn: createIdea,
  onSuccess: () => {
    queryClient.invalidateQueries(['ideas']);
  },
});
```

### Context API

- **Theme**: next-themes para dark/light mode
- **Auth**: Supabase Auth context

---

## 🧪 Testing (Futuro)

### Stack Sugerida

```
Unit Tests:
├── Jest
└── React Testing Library

E2E Tests:
├── Playwright
└── Cypress

Component Tests:
└── Storybook
```

---

## 📈 Analytics

### Suportados

- **Vercel Analytics**: Built-in
- **Google Analytics 4**: Via gtag
- **Plausible**: Privacy-friendly (futuro)

---

## 🔄 CI/CD

### GitHub Actions (Sugerido)

```yaml
# .github/workflows/ci.yml
- Lint
- Type Check
- Build
- Deploy (Vercel)
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Convenções de Código

- **Componentes**: PascalCase (`Button.tsx`)
- **Utils**: camelCase (`formatDate.ts`)
- **Tipos**: PascalCase (`User`, `IdeaCategory`)
- **Constantes**: UPPER_SNAKE_CASE (`SITE_CONFIG`)
- **Hooks**: camelCase com `use` prefix (`useIdeas`)