# 🚀 GUIA DE INSTALAÇÃO - COGNIFLOW

## ✅ Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Conta no Supabase (gratuita em supabase.com)
- (Opcional) Conta OpenAI para assistente IA

---

## 📦 Instalação

### 1. Instalar Dependências

```powershell
pnpm install
```

Este comando instalará todas as dependências listadas no `package.json`, incluindo:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- Framer Motion
- Lucide Icons
- Shadcn/ui components
- E muito mais!

---

### 2. Configurar Supabase

#### 2.1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta (se não tiver)
3. Clique em "New Project"
4. Preencha:
   - **Project name**: cogniflow
   - **Database Password**: crie uma senha segura
   - **Region**: escolha a mais próxima
5. Aguarde a criação (2-3 minutos)

#### 2.2. Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie TODO o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor e clique em **Run**
5. Aguarde a execução (deve mostrar "Success")

#### 2.3. Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Ative **Email** (já deve estar ativo por padrão)
3. Para OAuth (Google/GitHub):
   - Clique em **Google** ou **GitHub**
   - Siga as instruções para configurar
   - Cole as credenciais (Client ID e Secret)

#### 2.4. Obter Credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

### 3. Configurar Variáveis de Ambiente

```powershell
# Copiar arquivo de exemplo
cp .env.example .env.local
```

Edite `.env.local` e preencha:

```env
# Supabase (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# OpenAI (OPCIONAL - para assistente IA)
OPENAI_API_KEY=sk-...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (OPCIONAL)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### 4. Iniciar Projeto

```powershell
# Modo desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador! 🎉

---

## 🏗️ Build para Produção

```powershell
# Build
pnpm build

# Testar build localmente
pnpm start
```

---

## 🧪 Comandos Úteis

```powershell
# Verificar tipos TypeScript
pnpm type-check

# Rodar linter
pnpm lint

# Formatar código
pnpm format

# Gerar sitemap (após build)
pnpm postbuild
```

---

## 🚢 Deploy na Vercel

### Opção 1: Via GitHub (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Importe seu repositório
5. Configure as variáveis de ambiente
6. Clique em "Deploy"

### Opção 2: Via CLI

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📝 Próximos Passos

### Implementações Adicionais Sugeridas:

1. **Páginas de Autenticação**
   - `/app/(auth)/login/page.tsx`
   - `/app/(auth)/signup/page.tsx`
   - `/app/(auth)/reset-password/page.tsx`

2. **Dashboard do Usuário**
   - `/app/(main)/dashboard/page.tsx`
   - `/app/(main)/dashboard/ideas/page.tsx`
   - `/app/(main)/dashboard/settings/page.tsx`

3. **Páginas de Templates**
   - `/app/templates/page.tsx`
   - `/app/templates/[id]/page.tsx`

4. **Gerador de Ideias**
   - `/app/generator/page.tsx`

5. **Assistente IA**
   - `/app/assistant/page.tsx`

6. **API Routes**
   - `/app/api/ideas/route.ts`
   - `/app/api/templates/route.ts`
   - `/app/api/ai/chat/route.ts`
   - `/app/api/export/route.ts`

---

## 🐛 Troubleshooting

### Erro: "Module not found"
```powershell
# Limpar cache e reinstalar
rm -rf node_modules .next
pnpm install
```

### Erro: "Supabase connection failed"
- Verifique se as credenciais em `.env.local` estão corretas
- Certifique-se de que o schema SQL foi executado
- Verifique se o projeto Supabase está ativo

### Erro: TypeScript
```powershell
# Reinstalar types
pnpm add -D @types/node @types/react @types/react-dom
```

---

## 📚 Recursos

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

---

## 🤝 Suporte

Se encontrar problemas:
1. Verifique se todas as dependências foram instaladas
2. Confirme que as variáveis de ambiente estão corretas
3. Limpe o cache (`.next` folder)
4. Verifique os logs no terminal

---

## 🎨 Personalização

### Cores do Tema

Edite `tailwind.config.js` e `styles/globals.css` para customizar:
- Cores primárias
- Cores cyber (azul, cyan, neon)
- Bordas e raios
- Fontes

### Componentes

Todos os componentes estão em:
- `/components/ui` - Componentes base (Shadcn)
- `/components/layout` - Layout (Header, Footer)
- `/components/sections` - Seções da página inicial