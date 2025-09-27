import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Gift, ShoppingCart, ExternalLink, Settings, Loader2 } from "lucide-react";
import { useGifts, GiftItem } from "@/hooks/useGifts";
import StripeProductManager from "./StripeProductManager";

// Eletrodomésticos
import microwaveImg from "@/assets/gifts/microwave-real.jpg";
import rangeHoodImg from "@/assets/gifts/range-hood.jpg";
import grillImg from "@/assets/gifts/grill.jpg";
import blenderImg from "@/assets/gifts/blender.jpg";
import mixerImg from "@/assets/gifts/mixer.jpg";
import electricOvenImg from "@/assets/gifts/electric-oven.jpg";
import airFryerImg from "@/assets/gifts/air-fryer.jpg";
import stoveImg from "@/assets/gifts/stove.jpg";
import refrigeratorImg from "@/assets/gifts/refrigerator.jpg";
import dishwasherImg from "@/assets/gifts/dishwasher.jpg";
import waterDispenserImg from "@/assets/gifts/water-dispenser.jpg";
import toasterImg from "@/assets/gifts/toaster.jpg";
import coffeeMakerImg from "@/assets/gifts/coffee-maker.jpg";

// Utensílios
import cookwareSetImg from "@/assets/gifts/cookware-set.jpg";
import pressureCookerImg from "@/assets/gifts/pressure-cooker.jpg";
import kettleImg from "@/assets/gifts/kettle.jpg";
import cuttingBoardsImg from "@/assets/gifts/cutting-boards.jpg";
import dishTowelsImg from "@/assets/gifts/dish-towels.jpg";
import fruitBowlImg from "@/assets/gifts/fruit-bowl.jpg";
import storageContainersImg from "@/assets/gifts/storage-containers.jpg";
import cookwareImg from "@/assets/gifts/cookware.jpg";

// Mesa e Decoração
import servingPlattersImg from "@/assets/gifts/serving-platters.jpg";
import cutlerySetImg from "@/assets/gifts/cutlery-set.jpg";
import wineGlassesImg from "@/assets/gifts/wine-glasses.jpg";
import beerGlassesImg from "@/assets/gifts/beer-glasses.jpg";
import tableclothImg from "@/assets/gifts/tablecloth.jpg";
import diningImg from "@/assets/gifts/dining.jpg";

// Outros
import extensionCordImg from "@/assets/gifts/extension-cord.jpg";
import drillSetImg from "@/assets/gifts/drill-set.jpg";

// Brincadeiras
import survivalKitRealImg from "@/assets/gifts/survival-kit-real.jpg";
import funnyTowelRealImg from "@/assets/gifts/funny-towel-real.jpg";
import funnyDoormattRealImg from "@/assets/gifts/funny-doormat-real.jpg";

// Novas imagens otimizadas
import escorredorLoucaImg from "@/assets/gifts_optimized/escorredor_louca.jpg";
import peneiraPequenaImg from "@/assets/gifts_optimized/peneira_pequena.jpg";
import coadorCafePanoImg from "@/assets/gifts_optimized/coador_cafe_pano.jpg";
import medidorAlimentoImg from "@/assets/gifts_optimized/medidor_alimento.webp";
import lixeiraPenduravelImg from "@/assets/gifts_optimized/lixeira_penduravel.jpg";
import tesouraCozinhaImg from "@/assets/gifts_optimized/tesoura_cozinha.jpg";
import espremedorLimaoImg from "@/assets/gifts_optimized/espremedor_limao.jpg";
import kitUtensiliosImg from "@/assets/gifts_optimized/kit_utensilios.jpeg";
import raladorQueijoImg from "@/assets/gifts_optimized/ralador_queijo.jpg";
import espatulaSiliconeImg from "@/assets/gifts_optimized/espatula_silicone.png";
import jogoAssadeirasImg from "@/assets/gifts_optimized/jogo_assadeiras.jpg";
import escorredorArrozMacarraoImg from "@/assets/gifts_optimized/escorredor_arroz_macarrao.jpg";
import pegadorGeloImg from "@/assets/gifts_optimized/pegador_gelo.jpg";
import luvaFornoImg from "@/assets/gifts_optimized/luva_forno.jpg";
import kitTemperoGiratorioImg from "@/assets/gifts_optimized/kit_tempero_giratorio.jpeg";
import kitSaleiroPimenteiroImg from "@/assets/gifts_optimized/kit_saleiro_pimenteiro.jpg";
import boleiraImg from "@/assets/gifts_optimized/boleira.png";
import espatulaMassasImg from "@/assets/gifts_optimized/espatula_massas.jpg";
import kitHamburgueiraImg from "@/assets/gifts_optimized/kit_hamburgueira.jpeg";
import portaTemperosImg from "@/assets/gifts_optimized/porta_temperos.webp";
import espremedorAlhoImg from "@/assets/gifts_optimized/espremedor_alho.jpg";
import kitAbridorVinhoImg from "@/assets/gifts_optimized/kit_abridor_vinho.jpg";
import jogoFondueImg from "@/assets/gifts_optimized/jogo_fondue.jpg";
import travessasBaixelasImg from "@/assets/gifts_optimized/travessas_baixelas.jpg";
import toalhaMesaImg from "@/assets/gifts_optimized/toalha_mesa.jpg";
import faqueiroCompletoImg from "@/assets/gifts_optimized/faqueiro_completo.jpg";
import jogoFacasImg from "@/assets/gifts_optimized/jogo_facas.jpg";
import portaGuardanapoImg from "@/assets/gifts_optimized/porta_guardanapo.jpg";
import kitCafeChaPratoImg from "@/assets/gifts_optimized/kit_cafe_cha_prato.webp";
import kitChaImg from "@/assets/gifts_optimized/kit_cha.jpg";
import talheresAvulsosImg from "@/assets/gifts_optimized/talheres_avulsos.jpeg";
import portaTalheresImg from "@/assets/gifts_optimized/porta_talheres.jpg";
import saleiroImg from "@/assets/gifts_optimized/saleiro.jpg";
import kitTacasVinhoImg from "@/assets/gifts_optimized/kit_tacas_vinho.webp";
import tacaCervejaImg from "@/assets/gifts_optimized/taca_cerveja.jpg";
import jogoAmericanoImg from "@/assets/gifts_optimized/jogo_americano.jpg";
import coposVidroImg from "@/assets/gifts_optimized/copos_vidro.jpg";
import kitCopoImg from "@/assets/gifts_optimized/kit_copo.png";
import petisqueiraImg from "@/assets/gifts_optimized/petisqueira.jpeg";
import kitFerramentasImg from "@/assets/gifts_optimized/kit_ferramentas.jpg";
import amoladorFacaImg from "@/assets/gifts_optimized/amolador_faca.jpeg";
import trenaImg from "@/assets/gifts_optimized/trena.jpg";
import extensaoEletricaImg from "@/assets/gifts_optimized/extensao_eletrica.jpg";
import kitFerramentasParafusadeiraImg from "@/assets/gifts_optimized/kit_ferramentas_parafusadeira.jpg";
import kitSobrevivenciaImg from "@/assets/gifts_optimized/kit_sobrevivencia.jpg";
import panoPratoMotivacionalImg from "@/assets/gifts_optimized/pano_prato_motivacional.jpg";
import tapetePortaDivertidoImg from "@/assets/gifts_optimized/tapete_porta_divertido.jpg";

const initialGifts: GiftItem[] = [
  // Eletrodomésticos
  { id: "1", name: "Micro-ondas", price: 450, category: "Eletrodomésticos", image: microwaveImg, description: "Micro-ondas moderno para aquecer e cozinhar alimentos rapidamente" },
  { id: "2", name: "Coifa", price: 350, category: "Eletrodomésticos", image: rangeHoodImg, description: "Coifa para exaustão de fumaça e odores da cozinha" },
  { id: "3", name: "Grill", price: 200, category: "Eletrodomésticos", image: grillImg, description: "Grill elétrico para preparar carnes e legumes grelhados" },
  { id: "4", name: "Liquidificador", price: 180, category: "Eletrodomésticos", image: blenderImg, description: "Liquidificador potente para vitaminas e sucos" },
  { id: "5", name: "Batedeira", price: 250, category: "Eletrodomésticos", image: mixerImg, description: "Batedeira planetária para massas e bolos" },
  { id: "6", name: "Forno elétrico", price: 400, category: "Eletrodomésticos", image: electricOvenImg, description: "Forno elétrico compacto para assar e gratinar" },
  { id: "7", name: "Air Fryer", price: 320, category: "Eletrodomésticos", image: airFryerImg, description: "Fritadeira elétrica sem óleo para comidas mais saudáveis" },
  { id: "8", name: "Fogão", price: 800, category: "Eletrodomésticos", image: stoveImg, description: "Fogão completo com 4 bocas e forno" },
  { id: "9", name: "Geladeira", price: 1500, category: "Eletrodomésticos", image: refrigeratorImg, description: "Geladeira duplex com freezer para conservar alimentos" },
  { id: "10", name: "Lava-louça", price: 1200, category: "Eletrodomésticos", image: dishwasherImg, description: "Lava-louças automática para facilitar a limpeza" },
  { id: "11", name: "Bebedouro", price: 300, category: "Eletrodomésticos", image: waterDispenserImg, description: "Bebedouro com água gelada e natural" },
  { id: "12", name: "Torradeira", price: 120, category: "Eletrodomésticos", image: toasterImg, description: "Torradeira elétrica para pães e sanduíches" },
  { id: "13", name: "Cafeteira", price: 200, category: "Eletrodomésticos", image: coffeeMakerImg, description: "Cafeteira elétrica para café fresco todos os dias" },
  { id: "14", name: "Mixer", price: 150, category: "Eletrodomésticos", image: mixerImg, description: "Mixer portátil para vitaminas e sopas" },

  // Utensílios de Cozinha
  { id: "15", name: "Escorredor", price: 80, category: "Utensílios", image: escorredorLoucaImg, description: "Escorredor de louças para organizar a pia" },
  { id: "16", name: "Jogo de panelas", price: 300, category: "Utensílios", image: cookwareSetImg, description: "Conjunto completo de panelas antiaderentes" },
  { id: "17", name: "Panela de pressão", price: 150, category: "Utensílios", image: pressureCookerImg, description: "Panela de pressão para cozinhar mais rápido" },
  { id: "18", name: "Chaleira", price: 100, category: "Utensílios", image: kettleImg, description: "Chaleira elétrica para água quente instantânea" },
  { id: "19", name: "Tábuas de cozinha", price: 60, category: "Utensílios", image: cuttingBoardsImg, description: "Conjunto de tábuas para cortar alimentos" },
  { id: "20", name: "Panos de prato", price: 40, category: "Utensílios", image: dishTowelsImg, description: "Panos de prato absorventes para secar louças" },
  { id: "21", name: "Fruteira", price: 70, category: "Utensílios", image: fruitBowlImg, description: "Fruteira decorativa para organizar frutas" },
  { id: "22", name: "Potes", price: 80, category: "Utensílios", image: storageContainersImg, description: "Conjunto de potes para armazenar alimentos" },
  { id: "23", name: "Garrafa térmica", price: 90, category: "Utensílios", image: storageContainersImg, description: "Garrafa térmica para manter bebidas quentes ou frias" },
  { id: "24", name: "Peneira", price: 25, category: "Utensílios", image: peneiraPequenaImg, description: "Peneira fina para coar alimentos" },
  { id: "25", name: "Coador", price: 30, category: "Utensílios", image: coadorCafePanoImg, description: "Coador de café tradicional de pano" },
  { id: "26", name: "Jarras", price: 60, category: "Utensílios", image: servingPlattersImg, description: "Jarras para servir sucos e água" },
  { id: "27", name: "Medidor de alimento", price: 35, category: "Utensílios", image: medidorAlimentoImg, description: "Conjunto de medidores para receitas precisas" },
  { id: "28", name: "Lixeira", price: 80, category: "Utensílios", image: lixeiraPenduravelImg, description: "Lixeira compacta para pia da cozinha" },
  { id: "29", name: "Tesoura", price: 40, category: "Utensílios", image: tesouraCozinhaImg, description: "Tesoura multiuso para cozinha" },
  { id: "30", name: "Espremedor de limão", price: 25, category: "Utensílios", image: espremedorLimaoImg, description: "Espremedor manual para cítricos" },
  { id: "31", name: "Kit utensílios de cozinha", price: 120, category: "Utensílios", image: kitUtensiliosImg, description: "Kit completo com utensílios essenciais" },
  { id: "32", name: "Ralador", price: 35, category: "Utensílios", image: raladorQueijoImg, description: "Ralador multifuncional para queijos e legumes" },
  { id: "33", name: "Espátulas", price: 45, category: "Utensílios", image: espatulaSiliconeImg, description: "Conjunto de espátulas de silicone" },
  { id: "34", name: "Jogo de assadeira", price: 100, category: "Utensílios", image: jogoAssadeirasImg, description: "Conjunto de assadeiras para forno" },
  { id: "35", name: "Escorredor de arroz", price: 30, category: "Utensílios", image: escorredorArrozMacarraoImg, description: "Escorredor específico para arroz" },
  { id: "36", name: "Escorredor de macarrão", price: 35, category: "Utensílios", image: escorredorArrozMacarraoImg, description: "Escorredor para massas e macarrão" },
  { id: "37", name: "Pegador de gelo", price: 20, category: "Utensílios", image: pegadorGeloImg, description: "Pegador de gelo em aço inoxidável" },
  { id: "38", name: "Luva", price: 25, category: "Utensílios", image: luvaFornoImg, description: "Luva térmica para forno" },
  { id: "39", name: "Kit tempero cozinha", price: 80, category: "Utensílios", image: kitTemperoGiratorioImg, description: "Porta temperos giratório com potes" },
  { id: "40", name: "Kit galheitero", price: 60, category: "Utensílios", image: kitSaleiroPimenteiroImg, description: "Conjunto saleiro e pimenteiro" },
  { id: "41", name: "Lixeira cozinha", price: 120, category: "Utensílios", image: lixeiraPenduravelImg, description: "Lixeira grande para cozinha" },
  { id: "42", name: "Boleira", price: 50, category: "Utensílios", image: boleiraImg, description: "Boleira com tampa para guardar bolos" },
  { id: "43", name: "Espátula massas", price: 30, category: "Utensílios", image: espatulaMassasImg, description: "Espátula específica para massas" },
  { id: "44", name: "Kit hamburgueira", price: 80, category: "Utensílios", image: kitHamburgueiraImg, description: "Kit para fazer hambúrgueres caseiros" },
  { id: "45", name: "Porta tempeiro", price: 40, category: "Utensílios", image: portaTemperosImg, description: "Organizador de temperos para parede" },
  { id: "46", name: "Espremedor de alho", price: 25, category: "Utensílios", image: espremedorAlhoImg, description: "Espremedor de alho multifuncional" },
  { id: "47", name: "Kit abridor de vinho", price: 60, category: "Utensílios", image: kitAbridorVinhoImg, description: "Kit completo para abrir vinhos" },
  { id: "48", name: "Jogo de Fondue", price: 150, category: "Utensílios", image: jogoFondueImg, description: "Conjunto completo para fondue" },

  // Louças e Mesa
  { id: "49", name: "Travessas e baixelas", price: 120, category: "Mesa e Decoração", image: travessasBaixelasImg, description: "Conjunto de travessas para servir" },
  { id: "50", name: "Toalhas de mesa", price: 80, category: "Mesa e Decoração", image: toalhaMesaImg, description: "Toalhas elegantes para mesa de jantar" },
  { id: "51", name: "Faqueiro", price: 200, category: "Mesa e Decoração", image: faqueiroCompletoImg, description: "Faqueiro completo em aço inoxidável" },
  { id: "52", name: "Jogo de facas", price: 150, category: "Mesa e Decoração", image: jogoFacasImg, description: "Conjunto de facas profissionais" },
  { id: "53", name: "Porta guardanapo", price: 30, category: "Mesa e Decoração", image: portaGuardanapoImg, description: "Porta guardanapos decorativos" },
  { id: "54", name: "Kit café, chá, prato", price: 100, category: "Mesa e Decoração", image: kitCafeChaPratoImg, description: "Conjunto para café e chá" },
  { id: "55", name: "Kit chá - WOLF", price: 120, category: "Mesa e Decoração", image: kitChaImg, description: "Kit premium para chá" },
  { id: "56", name: "Talheres", price: 80, category: "Mesa e Decoração", image: talheresAvulsosImg, description: "Talheres avulsos de qualidade" },
  { id: "57", name: "Porta talheres", price: 40, category: "Mesa e Decoração", image: portaTalheresImg, description: "Organizador de talheres" },
  { id: "58", name: "Saleiro", price: 25, category: "Mesa e Decoração", image: saleiroImg, description: "Saleiro em cerâmica" },
  { id: "59", name: "Kit taças de vinho", price: 100, category: "Mesa e Decoração", image: kitTacasVinhoImg, description: "Conjunto de taças para vinho" },
  { id: "60", name: "Taça cerveja", price: 60, category: "Mesa e Decoração", image: tacaCervejaImg, description: "Taças especiais para cerveja" },
  { id: "61", name: "Jogo americano", price: 50, category: "Mesa e Decoração", image: jogoAmericanoImg, description: "Jogos americanos para mesa" },
  { id: "62", name: "Copos", price: 70, category: "Mesa e Decoração", image: coposVidroImg, description: "Conjunto de copos de vidro" },
  { id: "63", name: "Kit de copo", price: 80, category: "Mesa e Decoração", image: kitCopoImg, description: "Kit variado de copos" },
  { id: "64", name: "Petisqueira", price: 60, category: "Mesa e Decoração", image: petisqueiraImg, description: "Petisqueira com divisórias" },

  // Outros
  { id: "65", name: "KIT", price: 100, category: "Outros", image: kitFerramentasImg, description: "Kit básico de ferramentas para casa" },
  { id: "66", name: "Amolador de faca", price: 50, category: "Outros", image: amoladorFacaImg, description: "Amolador profissional para facas" },
  { id: "67", name: "Trena", price: 40, category: "Outros", image: trenaImg, description: "Trena para medições domésticas" },
  { id: "68", name: "Extensão", price: 30, category: "Outros", image: extensaoEletricaImg, description: "Extensão elétrica com múltiplas tomadas" },
  { id: "69", name: "Kit ferramentas - parafusadeira", price: 200, category: "Outros", image: kitFerramentasParafusadeiraImg, description: "Kit completo com parafusadeira" },

  // Brincadeiras
  { id: "70", name: "Kit sobrevivência do morador novo", price: 80, category: "Brincadeiras", image: kitSobrevivenciaImg, description: "Kit divertido para novos moradores" },
  { id: "71", name: "Pano de prato motivacional", price: 35, category: "Brincadeiras", image: panoPratoMotivacionalImg, description: "Pano de prato com frases motivacionais" },
  { id: "72", name: "Tapete de porta diferentão", price: 65, category: "Brincadeiras", image: tapetePortaDivertidoImg, description: "Tapete com mensagens divertidas" },
  { id: "73", name: "Manual de sobrevivência doméstica", price: 45, category: "Brincadeiras", image: kitSobrevivenciaImg, description: "Guia humorístico para vida doméstica" },
  { id: "74", name: "Kit \"Eu não sei cozinhar\"", price: 120, category: "Brincadeiras", image: panoPratoMotivacionalImg, description: "Kit para iniciantes na cozinha" },
  { id: "75", name: "Placa \"Zona de descanso matrimonial\"", price: 55, category: "Brincadeiras", image: tapetePortaDivertidoImg, description: "Placa decorativa divertida" },
  { id: "76", name: "Avental \"Chef em treinamento\"", price: 40, category: "Brincadeiras", image: panoPratoMotivacionalImg, description: "Avental com frase divertida" },
  { id: "77", name: "Kit emergência \"Esqueci de fazer comida\"", price: 90, category: "Brincadeiras", image: kitSobrevivenciaImg, description: "Kit de emergência culinária" },
];

const categories = ["Eletrodomésticos", "Utensílios", "Mesa e Decoração", "Outros", "Brincadeiras"];

const GiftList = () => {
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts);
  const [showManager, setShowManager] = useState(false);
  const { handlePurchase, loading } = useGifts();

  const updateGift = (giftId: string, updates: Partial<GiftItem>) => {
    setGifts(prev => prev.map(gift => 
      gift.id === giftId ? { ...gift, ...updates } : gift
    ));
  };

  const categoryColors: { [key: string]: string } = {
    "Eletrodomésticos": "bg-primary/10 text-primary",
    "Utensílios": "bg-accent/60 text-accent-foreground",
    "Mesa e Decoração": "bg-secondary text-secondary-foreground",
    "Outros": "bg-muted text-muted-foreground",
    "Brincadeiras": "bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600"
  };

  return (
    <section id="gifts" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Gift className="mx-auto mb-4 text-primary" size={48} />
          <h2 className="text-4xl font-bold text-primary mb-4">Lista de Presentes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha um presente para ajudar o casal a mobiliar sua nova casa. 
            Você pode contribuir com o valor do presente através do Stripe.
          </p>
          
          <div className="mt-6">
            <Dialog open={showManager} onOpenChange={setShowManager}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Gerenciar Produtos Stripe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Gerenciador de Produtos Stripe</DialogTitle>
                </DialogHeader>
                <StripeProductManager gifts={gifts} onUpdateGift={updateGift} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-semibold font-edwardian text-primary mb-6 text-center">
              {category}
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {gifts
                .filter((gift) => gift.category === category)
                .map((item) => (
                <Card key={item.id} className="p-4 shadow-soft hover:shadow-elegant transition-all duration-300 bg-gradient-card group">
                  <div className="flex flex-col h-full">
                    <div className="mb-3">
                      <div className="relative overflow-hidden rounded-md mb-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {item.stripeProductId && (
                          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                            Stripe ✓
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-card-foreground text-sm leading-tight flex-1">
                          {item.name}
                        </h4>
                        <Badge className={categoryColors[item.category] + " ml-2 text-xs"}>
                          {item.category === "Brincadeiras" ? "😄" : item.category}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-lg font-bold text-primary mb-3">
                        R$ {item.price.toFixed(2)}
                      </p>
                      
                      <Button 
                        onClick={() => handlePurchase(item)}
                        disabled={loading}
                        size="sm"
                        className="w-full text-xs gap-1 transition-all duration-200 hover:scale-105"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            Presentear
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
                ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12 p-6 bg-secondary/30 rounded-lg">
          <h4 className="text-xl font-semibold text-primary mb-2">
            Como funciona?
          </h4>
          <p className="text-muted-foreground">
            Ao escolher um presente, você será redirecionado para o checkout seguro do Stripe. 
            O casal receberá o dinheiro para comprar exatamente o que precisam para a nova casa.
            <br />
            <strong>Pagamentos processados de forma segura através do Stripe!</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GiftList;
