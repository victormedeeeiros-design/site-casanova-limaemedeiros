# Backend Deployment Guide

## Deploy no Vercel

1. Faça push do código para o GitHub
2. No Vercel, crie um novo projeto
3. Selecione a pasta `backend` como root directory
4. Configure as variáveis de ambiente:

### Variáveis de Ambiente Necessárias

```bash
# Admin Token
ADMIN_TOKEN=seu_token_admin_aqui

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_ou_sk_live_sua_chave_aqui

# Supabase Configuration
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
```

## Depois do Deploy

1. Anote a URL do backend implantado (ex: `https://seu-backend.vercel.app`)
2. No frontend, configure a variável de ambiente:
   - `NEXT_PUBLIC_BACKEND_URL=https://seu-backend.vercel.app`
3. Redeploy o frontend com a nova configuração

## Testando

Acesse `https://seu-backend.vercel.app/health` para verificar se está funcionando.