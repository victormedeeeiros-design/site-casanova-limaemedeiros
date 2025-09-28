
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import { authController } from './controllers/auth';
import { authMiddleware } from './middleware/auth';
import { productController } from './controllers/product';
import { uploadController } from './controllers/upload';
import { supabase } from './config/supabase';

dotenv.config();

const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL || ''];

const app = express();
const port = process.env.PORT || 3334;

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

// Middleware para proteger rotas admin por token
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123';
function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  console.log('Authorization header:', req.headers.authorization);
  console.log('Token recebido:', token);
  console.log('Token esperado:', ADMIN_TOKEN);
  
  if (token !== ADMIN_TOKEN) {
    console.log('Token inválido');
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  console.log('Token válido, autorizando...');
  next();
}

// Exemplo de rota protegida para gerenciar produtos do Stripe
// Rota para verificar token de admin
app.get('/admin/verify', adminAuth, (_req: Request, res: Response) => {
  res.json({ valid: true });
});

app.get('/admin/stripe-products', adminAuth, async (_req: Request, res: Response) => {
  try {
    const products = await stripe.products.list({ limit: 20 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error });
  }
});

app.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { line_items, success_url, cancel_url } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Stripe session creation failed', details: error });
  }
});

// Rotas de configuração do Stripe
app.post('/admin/stripe-config', adminAuth, async (req: Request, res: Response) => {
  try {
    const { stripe_secret_key } = req.body;
    
    if (!stripe_secret_key) {
      return res.status(400).json({ error: 'Chave secreta do Stripe é obrigatória' });
    }

    // Salvar configuração no Supabase
    const { error } = await supabase
      .from('settings')
      .upsert({ 
        id: 'stripe_config', 
        stripe_secret_key,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    res.json({ message: 'Configuração salva com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    res.status(500).json({ error: 'Erro ao salvar configuração' });
  }
});

// Rota para sincronizar todos os produtos
app.post('/admin/sync-products', adminAuth, async (req: Request, res: Response) => {
  try {
    // Buscar configuração do Stripe
    const { data: settings } = await supabase
      .from('settings')
      .select('stripe_secret_key')
      .eq('id', 'stripe_config')
      .single();

    if (!settings?.stripe_secret_key) {
      return res.status(400).json({ error: 'Chave do Stripe não configurada' });
    }

    // Inicializar Stripe com a chave configurada
    const stripeWithKey = new Stripe(settings.stripe_secret_key, {
      apiVersion: '2022-11-15',
    });

    // Lista de produtos para sincronizar (em produção, buscar do banco)
    const giftsToSync = [
      { id: "1", name: "Micro-ondas", price: 450, description: "Micro-ondas moderno" },
      { id: "2", name: "Coifa", price: 350, description: "Coifa para cozinha" },
      // Adicionar mais produtos conforme necessário
    ];

    let syncedCount = 0;

    for (const gift of giftsToSync) {
      try {
        // Criar produto no Stripe
        const stripeProduct = await stripeWithKey.products.create({
          name: gift.name,
          description: gift.description,
        });

        // Criar preço no Stripe
        const stripePrice = await stripeWithKey.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(gift.price * 100),
          currency: 'brl',
        });

        // Salvar no Supabase
        await supabase.from('products').upsert({
          id: gift.id,
          name: gift.name,
          description: gift.description,
          price: gift.price,
          stripe_product_id: stripeProduct.id,
          stripe_price_id: stripePrice.id,
          status: 'active'
        });

        syncedCount++;
      } catch (error) {
        console.error(`Erro ao sincronizar produto ${gift.name}:`, error);
      }
    }

    res.json({ 
      message: 'Sincronização concluída',
      syncedCount 
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro na sincronização de produtos' });
  }
});

// Rotas de upload
app.post('/admin/upload', adminAuth, uploadController.uploadImage);
app.delete('/admin/upload/:fileName', adminAuth, uploadController.deleteImage);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Casanova Lima e Medeiros Backend API' });
});


// Adicionar handler de erros para o Express
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Adicionar tratamento de erros no servidor
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}).on('error', (err: any) => {
  console.error('Server error:', err);
});
