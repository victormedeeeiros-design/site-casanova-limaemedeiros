# Lar Feliz Presente - Lista de Presentes com Stripe

Um site moderno para lista de presentes de chá de casa nova, integrado com Stripe para pagamentos seguros.

## 🚀 Funcionalidades

- ✅ Lista de presentes organizada por categorias
- ✅ Imagens otimizadas para cada produto
- ✅ Integração completa com Stripe
- ✅ Criação automática de produtos no Stripe
- ✅ Geração de links de pagamento
- ✅ Interface responsiva e moderna
- ✅ Gerenciador de produtos Stripe integrado

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/UI** para componentes
- **Stripe** para pagamentos
- **Lucide React** para ícones

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd lar-feliz-presente-main
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas chaves do Stripe:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
```

## 🔧 Configuração do Stripe

### 1. Criar conta no Stripe

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Ative o modo de teste para desenvolvimento
3. Obtenha suas chaves de API em **Developers > API keys**

### 2. Configurar chaves

Adicione sua chave pública do Stripe no arquivo `.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
```

### 3. Backend (Opcional)

Para funcionalidade completa, você precisará de um backend para:
- Criar produtos no Stripe
- Gerar sessões de checkout
- Processar webhooks

Exemplo de endpoints necessários:
- `POST /api/create-product` - Criar produto no Stripe
- `POST /api/create-checkout-session` - Criar sessão de checkout
- `POST /api/create-payment-link` - Gerar link de pagamento

## 🚀 Desenvolvimento

Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O site estará disponível em `http://localhost:5173`

## 📱 Como usar

### Para visitantes:
1. Navegue pelas categorias de presentes
2. Clique em "Presentear" no item desejado
3. Complete o pagamento através do Stripe

### Para administradores:
1. Clique em "Gerenciar Produtos Stripe"
2. Crie produtos no Stripe diretamente da interface
3. Gere links de pagamento para compartilhar
4. Configure descrições personalizadas

## 🎨 Personalização

### Adicionar novos produtos:
1. Adicione a imagem em `src/assets/gifts_optimized/`
2. Importe a imagem no `GiftList.tsx`
3. Adicione o produto no array `initialGifts`

### Modificar categorias:
Edite o array `categories` em `GiftList.tsx`

### Personalizar cores:
Modifique o objeto `categoryColors` em `GiftList.tsx`

## 📁 Estrutura do projeto

```
src/
├── assets/
│   ├── gifts/              # Imagens originais
│   └── gifts_optimized/    # Imagens otimizadas
├── components/
│   ├── ui/                 # Componentes base (Shadcn/UI)
│   ├── GiftList.tsx        # Lista principal de presentes
│   └── StripeProductManager.tsx # Gerenciador Stripe
├── hooks/
│   └── useGifts.ts         # Hook para gerenciar presentes
├── lib/
│   └── stripe.ts           # Configuração do Stripe
└── pages/
    └── Index.tsx           # Página principal
```

## 🔒 Segurança

- Nunca exponha chaves secretas do Stripe no frontend
- Use HTTPS em produção
- Configure webhooks para validar pagamentos
- Implemente validação no backend

## 📦 Build para produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para dúvidas sobre:
- **Stripe**: Consulte a [documentação oficial](https://stripe.com/docs)
- **React**: Consulte a [documentação do React](https://react.dev)
- **Tailwind**: Consulte a [documentação do Tailwind](https://tailwindcss.com)

---

## Informações do Projeto Original

**URL**: https://lovable.dev/projects/a37ffd7d-b34d-4bd0-8fb5-7eb095da3687

### Como editar este código?

**Use Lovable**
Visite o [Projeto Lovable](https://lovable.dev/projects/a37ffd7d-b34d-4bd0-8fb5-7eb095da3687) e comece a fazer prompts.

**Use seu IDE preferido**
Clone este repo e faça push das mudanças. As mudanças enviadas também serão refletidas no Lovable.

### Como fazer deploy?

Simplesmente abra [Lovable](https://lovable.dev/projects/a37ffd7d-b34d-4bd0-8fb5-7eb095da3687) e clique em Share -> Publish.

---

Feito com ❤️ para casais que estão começando uma nova vida juntos! 🏠💕
