# 🚀 Guia de Deploy - Configurar Open Graph no Vercel

## Problema Identificado
A imagem Open Graph não aparece porque a variável `NEXT_PUBLIC_SITE_URL` está como `undefined` no Vercel.

URL atual (incorreta): `https://cogniflow.app/undefined/images/og-image.png`
URL correta: `https://cogniflow-beta.vercel.app/images/og-image.png`

## ✅ Solução: Configurar Variável de Ambiente no Vercel

### Passo 1: Acessar o Dashboard do Vercel
1. Acesse: https://vercel.com/
2. Login com sua conta do GitHub (Felipewv93)
3. Selecione o projeto **cogniflow-beta**

### Passo 2: Configurar Variável de Ambiente
1. Clique em **Settings** (Configurações)
2. Clique em **Environment Variables** (Variáveis de Ambiente)
3. Adicione a seguinte variável:

   **Name (Nome):**
   ```
   NEXT_PUBLIC_SITE_URL
   ```

   **Value (Valor):**
   ```
   https://cogniflow-beta.vercel.app
   ```

   **Environment (Ambiente):**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Clique em **Save** (Salvar)

### Passo 3: Fazer Redeploy
Após salvar a variável, você precisa fazer um novo deploy:

**Opção 1 - Pelo Dashboard:**
1. Vá em **Deployments** (Implantações)
2. Clique nos 3 pontinhos do último deployment
3. Clique em **Redeploy** (Reimplantar)

**Opção 2 - Pelo Git (Recomendado):**
```bash
git add .
git commit -m "Add production environment variables"
git push origin master
```

### Passo 4: Verificar
Após o deploy terminar (aguarde 1-2 minutos):

1. **Teste as meta tags:**
   ```bash
   node scripts/check-og-tags.js https://cogniflow-beta.vercel.app/
   ```

2. **Teste no validador Open Graph:**
   - Acesse: https://www.opengraph.xyz/
   - Cole: `https://cogniflow-beta.vercel.app`
   - Verifique se a imagem aparece

3. **Limpe cache do WhatsApp/Facebook:**
   - Acesse: https://developers.facebook.com/tools/debug/
   - Cole: `https://cogniflow-beta.vercel.app`
   - Clique em "Scrape Again" (Raspar Novamente)

### Passo 5: Testar no WhatsApp
Agora quando você colar o link no WhatsApp, a imagem do logo deverá aparecer! 🎉

## 📝 Arquivos Atualizados
- ✅ `app/layout.tsx` - Meta tags Open Graph corrigidas
- ✅ `public/images/og-image.png` - Imagem gerada com logo
- ✅ `.env.production` - Variável de produção configurada
- ✅ `scripts/check-og-tags.js` - Script para verificar meta tags

## 🔍 Troubleshooting

### A imagem ainda não aparece?
1. Verifique se a variável foi salva corretamente no Vercel
2. Confirme que o redeploy foi feito
3. Limpe o cache do WhatsApp/Facebook
4. Aguarde 5-10 minutos (WhatsApp faz cache agressivo)

### Erro "undefined" continua?
- A variável `NEXT_PUBLIC_SITE_URL` precisa estar EXATAMENTE como:
  ```
  NEXT_PUBLIC_SITE_URL=https://cogniflow-beta.vercel.app
  ```
- **SEM barra** no final
- **SEM espaços** antes ou depois

### Precisa de ajuda?
Execute o diagnóstico:
```bash
node scripts/check-og-tags.js https://cogniflow-beta.vercel.app/
```

A saída deve mostrar:
```
og:image: https://cogniflow-beta.vercel.app/images/og-image.png
```

Se mostrar `/undefined/`, a variável não foi configurada corretamente.
