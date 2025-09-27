import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createStripeProduct, createCheckoutSession, StripeProduct } from '@/lib/stripe';

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  stripeProductId?: string;
}

export const useGifts = () => {
  const [loading, setLoading] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState<string | null>(null);
  const { toast } = useToast();

  const createProductInStripe = useCallback(async (gift: GiftItem): Promise<string> => {
    setCreatingProduct(gift.id);
    
    try {
      const stripeProduct: StripeProduct = {
        id: gift.id,
        name: gift.name,
        description: gift.description || `${gift.name} para o chá de casa nova`,
        price: gift.price * 100, // Stripe usa centavos
        currency: 'brl',
        images: gift.image ? [gift.image] : [],
      };

      const result = await createStripeProduct(stripeProduct);
      
      toast({
        title: "Produto criado! ✅",
        description: `${gift.name} foi adicionado ao Stripe com sucesso.`,
      });

      return result.productId;
    } catch (error) {
      console.error('Erro ao criar produto no Stripe:', error);
      
      toast({
        title: "Erro ao criar produto",
        description: "Não foi possível criar o produto no Stripe. Tente novamente.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setCreatingProduct(null);
    }
  }, [toast]);

  const handlePurchase = useCallback(async (gift: GiftItem) => {
    setLoading(true);
    
    try {
      let productId = gift.stripeProductId;
      
      // Se o produto ainda não foi criado no Stripe, cria agora
      if (!productId) {
        productId = await createProductInStripe(gift);
      }

      // Cria a sessão de checkout
      const session = await createCheckoutSession(productId);
      
      // Redireciona para o checkout do Stripe
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('URL de checkout não encontrada');
      }
      
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [createProductInStripe, toast]);

  const generatePaymentLink = useCallback(async (gift: GiftItem): Promise<string> => {
    try {
      let productId = gift.stripeProductId;
      
      // Se o produto ainda não foi criado no Stripe, cria agora
      if (!productId) {
        productId = await createProductInStripe(gift);
      }

      // Gera um link de pagamento direto
      const response = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar link de pagamento');
      }

      const result = await response.json();
      return result.url;
      
    } catch (error) {
      console.error('Erro ao gerar link de pagamento:', error);
      
      toast({
        title: "Erro ao gerar link",
        description: "Não foi possível gerar o link de pagamento.",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [createProductInStripe, toast]);

  return {
    loading,
    creatingProduct,
    handlePurchase,
    createProductInStripe,
    generatePaymentLink,
  };
};
