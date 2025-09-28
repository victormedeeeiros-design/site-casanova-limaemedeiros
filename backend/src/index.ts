
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import { authController } from './controllers/auth';
import { authMiddleware } from './middleware/auth';
import { productController } from './controllers/product';
import { uploadController } from './controllers/upload';

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
