import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Settings, Key, RefreshCw, Eye, EyeOff } from "lucide-react";
import { BACKEND_URL, ADMIN_TOKEN } from '@/config';
import { useToast } from '@/hooks/use-toast';
import StripeProductManager from "../StripeProductManager";
import { GiftItem } from '@/hooks/useGifts';

// Mock data dos presentes (em produção isso viria de uma API ou estado global)
const mockGifts: GiftItem[] = [
  { id: "1", name: "Micro-ondas", price: 450, category: "Eletrodomésticos", image: "/api/placeholder/300/200", description: "Micro-ondas moderno" },
  { id: "2", name: "Coifa", price: 350, category: "Eletrodomésticos", image: "/api/placeholder/300/200", description: "Coifa para cozinha" },
];

interface Product {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  default_price?: string;
}

export function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [savingApiKey, setSavingApiKey] = useState(false);
  const [syncingProducts, setSyncingProducts] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = async () => {
    if (!stripeApiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave API válida.",
        variant: "destructive",
      });
      return;
    }

    setSavingApiKey(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/stripe-config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stripe_secret_key: stripeApiKey })
      });

      if (!response.ok) throw new Error('Falha ao salvar chave API');

      toast({
        title: "Chave API salva! ✅",
        description: "A chave do Stripe foi configurada com sucesso.",
      });

      // Após salvar a chave, sincronizar produtos automaticamente
      await handleSyncProducts();
      
    } catch (error) {
      console.error('Erro ao salvar chave API:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a chave API. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSavingApiKey(false);
    }
  };

  const handleSyncProducts = async () => {
    setSyncingProducts(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/sync-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Falha ao sincronizar produtos');

      const result = await response.json();
      
      toast({
        title: "Produtos sincronizados! ✅",
        description: `${result.syncedCount || 0} produtos foram sincronizados com o Stripe.`,
      });

      // Recarregar lista de produtos
      await fetchProducts();
      
    } catch (error) {
      console.error('Erro ao sincronizar produtos:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os produtos. Verifique se a chave API está correta.",
        variant: "destructive",
      });
    } finally {
      setSyncingProducts(false);
    }
  };

  const updateGift = (giftId: string, updates: Partial<GiftItem>) => {
    // Esta função seria usada para atualizar os presentes
    console.log('Atualizando presente:', giftId, updates);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/admin/stripe-products`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        }
      });
      
      if (!response.ok) throw new Error('Falha ao carregar produtos');
      
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Erro ao conectar com backend:', err);
      const isNetworkError = err instanceof Error && (
        err.message.includes('fetch') || 
        err.message.includes('Network') || 
        err.message.includes('ERR_CONNECTION_REFUSED')
      );
      
      if (isNetworkError) {
        setError('Backend não disponível. Verifique se o servidor está rodando.');
      } else {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Painel Administrativo - Stripe</CardTitle>
          <CardDescription>Gerencie seus produtos e preços do Stripe</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <Button
              onClick={() => fetchProducts()}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Atualizar Lista'}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {/* Implementar edição */}}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}