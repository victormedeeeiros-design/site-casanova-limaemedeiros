import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BACKEND_URL, ADMIN_TOKEN } from '@/config';

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