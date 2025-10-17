# 🚀 Deploy do Cogniflow na Vercel

## 📋 Guia Completo de Deploy

### ✅ Pré-requisitos
- [x] Projeto no GitHub (✅ Você já tem: `Ryanditko/Cogniflow`)
- [x] Código funcionando localmente (✅ Confirmado)
- [x] `.env.local` configurado (✅ Com Supabase e OpenAI)

---

## 🎯 Passo a Passo

### 1️⃣ Criar Conta na Vercel

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize a Vercel a acessar seus repositórios
4. ✅ Pronto! Conta criada

### 2️⃣ Importar o Projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Procure por **"Cogniflow"** na lista de repositórios
3. Clique em **"Import"**

### 3️⃣ Configurar o Projeto

Na tela de configuração:

#### Framework Preset
- ✅ Vercel detecta automaticamente: **Next.js**

#### Root Directory
- ✅ Deixe como está: `./` (raiz do projeto)

#### Build and Output Settings
- ✅ Já vem configurado automaticamente:
  - Build Command: `next build`
  - Output Directory: `.next`
  - Install Command: `pnpm install` (se detectar pnpm)

#### Environment Variables ⚠️ IMPORTANTE!

Adicione as 3 variáveis:

**1. NEXT_PUBLIC_SITE_URL**
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://seu-projeto.vercel.app
```
*(A Vercel mostra a URL antes do deploy - use ela)*

**2. NEXT_PUBLIC_SUPABASE_URL**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://izyweedhnqztzbjidzbb.supabase.co
```

**3. NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eXdlZWRobnF6dHpiamlkemJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NzM0OTksImV4cCI6MjA3NjE0OTQ5OX0.PhcJdfBdyvHdqKsMQFZfbrtwM6vwumPvJRTtz1xwtV0
```

**4. OPENAI_API_KEY** (SE você já tiver)
```
Key: OPENAI_API_KEY
Value: sk-52c71beafabd4ec8a6c7cfc030747631
```

### 4️⃣ Deploy!

1. Clique em **"Deploy"**
2. ⏳ Aguarde ~2-3 minutos (a Vercel vai:
   - Instalar dependências
   - Rodar `next build`
   - Fazer deploy
3. 🎉 **Projeto no ar!**

### 5️⃣ Configurar URL no Supabase

Depois do deploy, você recebe uma URL tipo: `https://cogniflow-xxx.vercel.app`

⚠️ **IMPORTANTE:** Adicione essa URL no Supabase:

1. Acesse: https://supabase.com/dashboard/project/izyweedhnqztzbjidzbb
2. Vá em **Authentication** → **URL Configuration**
3. Em **Site URL**, adicione: `https://sua-url.vercel.app`
4. Em **Redirect URLs**, adicione:
   ```
   https://sua-url.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

---

## 🔄 Deploys Automáticos

Depois do primeiro deploy, **TODA VEZ** que você fizer push no GitHub:
- ✅ Vercel detecta automaticamente
- ✅ Faz novo build
- ✅ Atualiza o site em 2-3 minutos

**Comandos úteis:**
```bash
git add .
git commit -m "nova feature"
git push origin master
```
→ Deploy automático! 🚀

---

## 🎨 Customizações (Opcional)

### Domínio Customizado

Se quiser usar seu próprio domínio (ex: `cogniflow.com.br`):

1. No dashboard da Vercel → **Settings** → **Domains**
2. Clique em **"Add Domain"**
3. Digite seu domínio
4. Siga as instruções para configurar DNS

---

## 🐛 Problemas Comuns

### ❌ Build falhou com erro de TypeScript
**Solução:** 
```bash
pnpm type-check
```
Se tiver erros, corrija antes de fazer push

### ❌ Página em branco após deploy
**Solução:** Verifique se as environment variables foram adicionadas corretamente

### ❌ Erro de autenticação
**Solução:** Adicione a URL da Vercel no Supabase (passo 5)

### ❌ Vercel não detecta pnpm
**Solução:** A Vercel detecta automaticamente pelo `pnpm-lock.yaml`

---

## 📊 Monitoramento

Após deploy, você pode ver:

- **Analytics:** Visualizações, países, devices
- **Logs:** Erros em tempo real
- **Speed Insights:** Performance do site

Acesse: https://vercel.com/dashboard

---

## 💰 Custos

### Plano Hobby (Grátis) ✅
- ✅ Deploy ilimitados
- ✅ 100 GB de bandwidth/mês
- ✅ HTTPS automático
- ✅ Preview deploys
- ✅ Analytics básicos

**Suficiente para:** Projetos pessoais, portfolios, MVPs

### Quando pagar?
Apenas se passar de 100 GB/mês ou precisar de:
- Teams
- Proteção de senha
- Analytics avançados

---

## 🎯 Checklist Final

Antes de clicar em Deploy:

- [ ] Projeto commitado e pushed no GitHub
- [ ] `.env.local` NÃO está no GitHub (verificar `.gitignore`)
- [ ] As 3 environment variables foram adicionadas na Vercel
- [ ] TypeScript sem erros (`pnpm type-check`)
- [ ] Build local funciona (`pnpm build`)

---

## 🆘 Precisa de Ajuda?

Se encontrar algum erro:
1. Copie a mensagem de erro
2. Me envie aqui
3. Vou te ajudar a resolver!

---

**Pronto para fazer o deploy?** 

Acesse: https://vercel.com/new

🚀 **Seu Cogniflow estará online em 5 minutos!**
