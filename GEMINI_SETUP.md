# 🚀 Como Configurar Google Gemini (100% Gratuito)

## ✅ Por que Gemini?

- ✅ **Totalmente gratuito** - Não precisa de cartão de crédito
- ✅ **Generoso** - 1 milhão de tokens/mês
- ✅ **Rápido** - 15 requisições por minuto
- ✅ **Qualidade** - Melhor que GPT-3.5, similar ao GPT-4
- ✅ **Fácil** - Setup em 2 minutos

## 📝 Passo a Passo

### 1. Obter API Key (2 minutos)

1. Acesse: **https://ai.google.dev/**
2. Clique em **"Get API Key"** ou **"Get Started"**
3. Faça login com sua conta Google
4. Clique em **"Create API Key"**
5. Copie a chave gerada

### 2. Configurar no Projeto

Abra o arquivo `.env.local` e adicione sua chave:

```env
GEMINI_API_KEY=sua_chave_aqui
```

### 3. Testar

1. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:3000/dashboard

3. Teste:
   - **Gerar Ideia**: Clique no botão "+" e preencha o prompt
   - **Chat Assistente**: Abra o chat e faça uma pergunta

## 🎯 O que foi mudado

### ✅ Arquivos Atualizados

- `app/api/generate-idea/route.ts` - Usa Gemini em vez de OpenAI/DeepSeek
- `app/api/chat/route.ts` - Usa Gemini em vez de OpenAI/DeepSeek
- `.env.local` - Variável `GEMINI_API_KEY` adicionada
- `package.json` - SDK `@google/generative-ai` instalado

### 🎭 Modo DEMO

Se você **não configurar** a API key, o sistema continua funcionando em **modo DEMO**:

- ✅ Ideias personalizadas baseadas no prompt
- ✅ Chat contextual inteligente
- ✅ Sem erros, sem problemas

### 🚀 Com API Key

Com a chave do Gemini configurada:

- ✅ **Respostas reais** geradas por IA
- ✅ **Ilimitado** (dentro do tier gratuito)
- ✅ **Qualidade superior**
- ✅ **Personalização total**

## 📊 Limites do Tier Gratuito

| Métrica            | Limite    |
| ------------------ | --------- |
| Requisições/minuto | 15        |
| Requisições/dia    | 1.500     |
| Tokens/mês         | 1.000.000 |
| Custo              | R$ 0,00   |

Ideal para projetos pessoais e MVPs!

## 🔐 Segurança

⚠️ **IMPORTANTE:**

- Nunca commite o arquivo `.env.local` no Git
- A chave já está no `.gitignore`
- No Vercel, adicione em **Settings → Environment Variables**

## 🌐 Deploy no Vercel

1. Vá em: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: sua_chave_aqui
   - **Environment**: Production
3. Clique em **Save**
4. Faça um novo deploy

## ❓ Problemas Comuns

### Erro: "API key not valid"

- Verifique se copiou a chave completa
- Certifique-se que não tem espaços extras
- Tente gerar uma nova chave

### Erro: "Resource exhausted"

- Você atingiu o limite de 15 req/min
- Aguarde 1 minuto e tente novamente
- Considere implementar rate limiting

### Modo DEMO não desativa

- Certifique-se que a variável está no `.env.local`
- Reinicie o servidor (`npm run dev`)
- Verifique se o nome está correto: `GEMINI_API_KEY`

## 📚 Documentação Oficial

- API Reference: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing
- Quickstart: https://ai.google.dev/tutorials/get_started_web

---

**✅ Pronto!** Seu Cogniflow agora usa IA de ponta, 100% gratuita! 🎉
