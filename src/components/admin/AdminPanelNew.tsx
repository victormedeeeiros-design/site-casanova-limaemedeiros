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
  // Adicione mais itens conforme necessário
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Gerencie produtos Stripe e configurações do sistema</p>
      </div>

      {/* Configuração da Chave API do Stripe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Configuração do Stripe
          </CardTitle>
          <CardDescription>
            Configure sua chave secreta do Stripe para habilitar pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe-key">Chave Secreta do Stripe</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="stripe-key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk_test_... ou sk_live_..."
                  value={stripeApiKey}
                  onChange={(e) => setStripeApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={handleSaveApiKey} disabled={savingApiKey}>
                {savingApiKey ? "Salvando..." : "Salvar"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Após salvar, todos os produtos serão sincronizados automaticamente com o Stripe
            </p>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSyncProducts} 
              disabled={syncingProducts}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncingProducts ? 'animate-spin' : ''}`} />
              {syncingProducts ? "Sincronizando..." : "Sincronizar Produtos"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos Stripe */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos no Stripe</CardTitle>
          <CardDescription>Lista de produtos já configurados no Stripe</CardDescription>
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
              variant="outline"
            >
              {loading ? 'Carregando...' : 'Atualizar Lista'}
            </Button>
          </div>

          {products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Preço ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.default_price || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto encontrado no Stripe
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gerenciador de Produtos Stripe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Gerenciador de Produtos
          </CardTitle>
          <CardDescription>
            Gerencie e configure produtos do site no Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StripeProductManager gifts={mockGifts} onUpdateGift={updateGift} />
        </CardContent>
      </Card>
    </div>
  );
}