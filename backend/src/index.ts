
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

// Middleware para proteger rotas admin por token
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123';
function adminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// Exemplo de rota protegida para gerenciar produtos do Stripe
app.get('/admin/stripe-products', adminAuth, async (_req, res) => {
  try {
    const products = await stripe.products.list({ limit: 20 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error });
  }
});

app.post('/create-checkout-session', async (req, res) => {
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

app.get('/', (_req, res) => {
  res.send('Backend Stripe API is running');
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
