import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/config';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  status: 'active' | 'inactive';
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BACKEND_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Falha ao carregar produtos');
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar produtos",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      image_url: formData.get('image_url') as string,
    };

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingProduct
        ? `${BACKEND_URL}/admin/products/${editingProduct.id}`
        : `${BACKEND_URL}/admin/products`;
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Falha ao salvar produto');

      toast({
        title: "Sucesso",
        description: `Produto ${editingProduct ? 'atualizado' : 'criado'} com sucesso!`,
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao ${editingProduct ? 'atualizar' : 'criar'} produto`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BACKEND_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Falha ao deletar produto');

      toast({
        title: "Sucesso",
        description: "Produto deletado com sucesso!",
      });

      fetchProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao deletar produto",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                />
              </div>
              
              <div>
                <label htmlFor="price" className="text-sm font-medium">Preço</label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct?.price}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="image_url" className="text-sm font-medium">URL da Imagem</label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  defaultValue={editingProduct?.image_url}
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>R$ {product.price.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-sm ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => setEditingProduct(product)}
                    >
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Produto</DialogTitle>
                    </DialogHeader>
                    {/* Mesmo formulário de edição */}
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}