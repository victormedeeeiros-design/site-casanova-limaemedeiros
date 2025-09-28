# Deploy Instructions

## 🚀 Deploy do Backend no Vercel

### Opção 1: Deploy Automático (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvictormedeeeiros-design%2Fsite-casanova-limaemedeiros&root-directory=backend)

### Opção 2: Deploy Manual

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New..." → "Project"
3. Importe o repositório: `victormedeeeiros-design/site-casanova-limaemedeiros`
4. **Configure o Root Directory como:** `backend`
5. **Configure as variáveis de ambiente:**

```env
ADMIN_TOKEN=admin123
STRIPE_SECRET_KEY=sk_test_seu_stripe_key_aqui
NODE_ENV=production
```

6. Deploy!

### Depois do Deploy

1. Copie a URL do backend (ex: `https://seu-backend-123.vercel.app`)
2. No frontend, configure:
   - No Vercel (projeto frontend) → Settings → Environment Variables
   - Adicionar: `NEXT_PUBLIC_BACKEND_URL=https://seu-backend-123.vercel.app`
3. Redeploy o frontend

### Testando

Acesse `https://seu-backend-123.vercel.app/health` para verificar se está funcionando.

---

## 🔧 Próximo Passo

**Após o deploy do backend**, você deve:

1. Anotar a URL do backend
2. Configurar `NEXT_PUBLIC_BACKEND_URL` no frontend 
3. Redeploy do frontend
4. Testar o painel admin em `https://site-casanova-limaemedeiros.vercel.app/admin`