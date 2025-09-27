import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

export const productController = {
  // Listar todos os produtos
  async list(req: Request, res: Response) {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      res.json(products);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos' });
    }
  },

  // Criar novo produto
  async create(req: Request, res: Response) {
    try {
      const { name, description, price, image_url } = req.body;

      // Criar produto no Stripe
      const stripeProduct = await stripe.products.create({
        name,
        description,
        images: image_url ? [image_url] : undefined,
      });

      // Criar preço no Stripe
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(price * 100), // Converter para centavos
        currency: 'brl',
      });

      // Salvar no Supabase
      const { data: product, error } = await supabase
        .from('products')
        .insert([{
          name,
          description,
          price,
          image_url,
          stripe_product_id: stripeProduct.id,
          stripe_price_id: stripePrice.id,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      res.json(product);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ error: 'Erro ao criar produto' });
    }
  },

  // Atualizar produto
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, image_url, status } = req.body;

      // Buscar produto existente
      const { data: existingProduct } = await supabase
        .from('products')
        .select('stripe_product_id, stripe_price_id')
        .eq('id', id)
        .single();

      if (!existingProduct) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Atualizar no Stripe
      if (existingProduct.stripe_product_id) {
        await stripe.products.update(existingProduct.stripe_product_id, {
          name,
          description,
          images: image_url ? [image_url] : undefined,
        });

        // Se o preço mudou, criar novo preço no Stripe
        if (price) {
          const stripePrice = await stripe.prices.create({
            product: existingProduct.stripe_product_id,
            unit_amount: Math.round(price * 100),
            currency: 'brl',
          });

          // Atualizar preço_id no produto
          existingProduct.stripe_price_id = stripePrice.id;
        }
      }

      // Atualizar no Supabase
      const { data: product, error } = await supabase
        .from('products')
        .update({
          name,
          description,
          price,
          image_url,
          status,
          stripe_price_id: existingProduct.stripe_price_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json(product);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  },

  // Deletar produto
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Buscar produto
      const { data: product } = await supabase
        .from('products')
        .select('stripe_product_id')
        .eq('id', id)
        .single();

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Desativar no Stripe
      if (product.stripe_product_id) {
        await stripe.products.update(product.stripe_product_id, {
          active: false
        });
      }

      // Deletar do Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }
};