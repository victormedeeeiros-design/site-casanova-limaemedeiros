import { loadStripe } from '@stripe/stripe-js';

// Substitua pela sua chave pública do Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

export const stripePromise = loadStripe(stripePublishableKey);

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images?: string[];
}

export const createStripeProduct = async (product: StripeProduct) => {
  try {
    // Esta função seria implementada no backend
    // Por enquanto, vamos simular a criação do produto
    const response = await fetch('/api/create-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar produto no Stripe');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

export const createCheckoutSession = async (productId: string, quantity: number = 1) => {
  try {
    // Esta função seria implementada no backend
    // Por enquanto, vamos simular a criação da sessão de checkout
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        quantity,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar sessão de checkout');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw error;
  }
};
