import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import albumImage1 from "@/assets/gifts_personalized/albumcasal1.jpeg";
import albumImage2 from "@/assets/gifts_personalized/albumcasal2.jpeg";
import albumImage3 from "@/assets/gifts_personalized/albumcasal3.jpeg";
import albumImage4 from "@/assets/gifts_personalized/albumcasal4.jpeg";
import albumImage5 from "@/assets/gifts_personalized/albumcasal5.jpeg";

const CoupleStory = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const albumImages = [albumImage1, albumImage2, albumImage3, albumImage4, albumImage5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % albumImages.length
      );
    }, 4000); // Troca a imagem a cada 4 segundos

    return () => clearInterval(interval);
  }, [albumImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % albumImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? albumImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="couple" className="py-20 px-4 bg-secondary/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Heart className="mx-auto mb-4 text-primary" size={48} />
          <h2 className="text-4xl font-bold text-primary mb-4">Nossa História</h2>
          <p className="text-lg text-muted-foreground">
            Um amor que encontrou seu lar
          </p>
        </div>

        <Card className="p-8 shadow-soft bg-gradient-card">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-4">
                O Início de Tudo
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Há alguns anos, duas vidas se encontraram e descobriram que juntas 
                formavam algo muito especial. Após muitos momentos compartilhados, 
                risadas, sonhos e planos, chegou o momento de dar o próximo grande 
                passo: construir um lar juntos.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Agora, com as chaves da nossa primeira casa em mãos, queremos 
                compartilhar esta alegria com vocês, pessoas especiais que fazem 
                parte da nossa jornada.
              </p>
              
              <div className="text-center lg:text-left">
                <Home className="mx-auto lg:mx-0 mb-4 text-accent" size={60} />
                <h4 className="text-xl font-semibold text-primary mb-2">
                  Nossa Nova Casa
                </h4>
                <p className="text-muted-foreground">
                  Um espaço para criar memórias, receber amigos e família, 
                  e começar este novo capítulo das nossas vidas.
                </p>
              </div>
            </div>
            
            {/* Carrossel de imagens do casal */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-lg aspect-square">
                {albumImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Foto do casal ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Overlay com gradiente para melhor contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Controles de navegação */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Indicadores de imagem */}
              <div className="flex justify-center mt-4 space-x-2">
                {albumImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-primary shadow-md scale-125' 
                        : 'bg-primary/30 hover:bg-primary/50'
                    }`}
                    aria-label={`Ver foto ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CoupleStory;
