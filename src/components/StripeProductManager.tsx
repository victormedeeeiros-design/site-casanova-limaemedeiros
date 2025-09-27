import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, ExternalLink, Copy, Check } from "lucide-react";
import { useGifts, GiftItem } from "@/hooks/useGifts";
import { useToast } from "@/hooks/use-toast";

interface StripeProductManagerProps {
  gifts: GiftItem[];
  onUpdateGift: (giftId: string, updates: Partial<GiftItem>) => void;
}

const StripeProductManager = ({ gifts, onUpdateGift }: StripeProductManagerProps) => {
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { createProductInStripe, generatePaymentLink, creatingProduct } = useGifts();
  const { toast } = useToast();

  const handleCreateProduct = async (gift: GiftItem) => {
    try {
      const productId = await createProductInStripe(gift);
      onUpdateGift(gift.id, { stripeProductId: productId });
      
      // Gera o link de pagamento
      const link = await generatePaymentLink({ ...gift, stripeProductId: productId });
      setPaymentLink(link);
      
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  const handleGenerateLink = async (gift: GiftItem) => {
    try {
      const link = await generatePaymentLink(gift);
      setPaymentLink(link);
    } catch (error) {
      console.error('Erro ao gerar link:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link de pagamento foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const updateGiftDescription = (description: string) => {
    if (selectedGift) {
      onUpdateGift(selectedGift.id, { description });
      setSelectedGift({ ...selectedGift, description });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Gerenciador de Produtos Stripe</h2>
        <p className="text-muted-foreground">
          Crie produtos no Stripe e gere links de pagamento para cada presente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) => (
          <Card key={gift.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{gift.name}</h3>
                  <p className="text-lg font-bold text-primary">R$ {gift.price.toFixed(2)}</p>
                </div>
                <Badge variant={gift.stripeProductId ? "default" : "secondary"}>
                  {gift.stripeProductId ? "Criado" : "Pendente"}
                </Badge>
              </div>

              <img 
                src={gift.image} 
                alt={gift.name}
                className="w-full h-24 object-cover rounded-md"
              />

              <div className="space-y-2">
                {!gift.stripeProductId ? (
                  <Button
                    onClick={() => handleCreateProduct(gift)}
                    disabled={creatingProduct === gift.id}
                    size="sm"
                    className="w-full"
                  >
                    {creatingProduct === gift.id ? "Criando..." : "Criar no Stripe"}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleGenerateLink(gift)}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Gerar Link
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedGift(gift)}
                          size="sm"
                          variant="ghost"
                          className="w-full"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configurar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Configurar {gift.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="description">Descrição do Produto</Label>
                            <Textarea
                              id="description"
                              value={selectedGift?.description || ''}
                              onChange={(e) => updateGiftDescription(e.target.value)}
                              placeholder="Descrição detalhada do produto..."
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <Label>ID do Produto no Stripe</Label>
                            <Input
                              value={gift.stripeProductId || ''}
                              readOnly
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {paymentLink && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Link de Pagamento Gerado</h3>
          <div className="flex gap-2">
            <Input
              value={paymentLink}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={() => copyToClipboard(paymentLink)}
              variant="outline"
              size="icon"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => window.open(paymentLink, '_blank')}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StripeProductManager;
