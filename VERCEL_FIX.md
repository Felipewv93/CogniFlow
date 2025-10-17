# 🚨 Como Adicionar Environment Variables na Vercel

## Problema Encontrado:
```
Error: supabaseUrl is required.
```

Isso acontece porque as variáveis de ambiente do `.env.local` **NÃO sobem** para a Vercel automaticamente (e nem devem, por segurança!).

## ✅ Solução Passo a Passo:

### 1. Acesse o Dashboard da Vercel
👉 https://vercel.com/dashboard

### 2. Selecione o projeto "Cogniflow"

### 3. Vá em "Settings"
- No menu lateral esquerdo
- Clique em **"Settings"**

### 4. Clique em "Environment Variables"
- No menu lateral dentro de Settings
- Ou acesse direto: https://vercel.com/[seu-usuario]/cogniflow/settings/environment-variables

### 5. Adicione cada variável:

#### Variável 1: Supabase URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://izyweedhnqztzbjidzbb.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```
Clique em **"Save"**

#### Variável 2: Supabase Anon Key
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eXdlZWRobnF6dHpiamlkemJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NzM0OTksImV4cCI6MjA3NjE0OTQ5OX0.PhcJdfBdyvHdqKsMQFZfbrtwM6vwumPvJRTtz1xwtV0
Environment: ✅ Production ✅ Preview ✅ Development
```
Clique em **"Save"**

#### Variável 3: OpenAI Key (opcional por enquanto)
```
Key: OPENAI_API_KEY
Value: sk-52c71beafabd4ec8a6c7cfc030747631
Environment: ✅ Production ✅ Preview ✅ Development
```
Clique em **"Save"**

### 6. Redeploy do Projeto

**Opção A - Pela Interface:**
1. Vá em **"Deployments"**
2. Clique nos **3 pontinhos (...)** do deploy que falhou
3. Clique em **"Redeploy"**
4. ✅ Aguarde 2-3 minutos

**Opção B - Forçar novo commit:**
```bash
git commit --allow-empty -m "redeploy: add environment variables"
git push origin master
```
A Vercel detecta automaticamente e faz novo deploy

### 7. Verificar se funcionou
Após o redeploy:
1. Vá em **"Deployments"**
2. O último deploy deve ter ✅ (checkmark verde)
3. Clique na URL do deploy
4. Teste se o site carrega corretamente

---

## 📸 Screenshot do que você deve ver:

```
Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key                            Value              Environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_SUPABASE_URL      https://iz...       Prod, Prev, Dev
NEXT_PUBLIC_SUPABASE_ANON_KEY eyJhbGc...          Prod, Prev, Dev
OPENAI_API_KEY                sk-52c7...          Prod, Prev, Dev
```

---

## ⚠️ Dicas Importantes:

1. **Não esqueça de marcar todos os ambientes:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

2. **As variáveis devem começar com `NEXT_PUBLIC_`** para funcionarem no client-side

3. **Não precisa aspas** nos valores

4. **OpenAI_API_KEY** não precisa de `NEXT_PUBLIC_` (é server-side only)

---

## 🐛 Se ainda der erro:

1. Verifique se o nome das variáveis está EXATAMENTE igual:
   - `NEXT_PUBLIC_SUPABASE_URL` (não pode ter espaço, letra maiúscula, etc)
   
2. Verifique se não tem espaço no final dos valores

3. Tente remover todas as variáveis e adicionar novamente

4. Certifique-se de clicar em "Save" após cada variável

---

## ✅ Depois do Redeploy:

O deploy deve funcionar! Você verá:
```
✓ Generating static pages (11/11)
✓ Build completed
✓ Deployment ready
```

E terá um link do tipo:
`https://cogniflow-xxx.vercel.app`

🎉 **Pronto! Projeto no ar!**
