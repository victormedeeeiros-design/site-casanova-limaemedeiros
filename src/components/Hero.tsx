import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import heroImage1 from "@/assets/gifts_personalized/herosite.jpeg";
import heroImage2 from "@/assets/gifts_personalized/herosite2.jpeg";
import heroImage3 from "@/assets/gifts_personalized/herosite3.jpeg";

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [heroImage1, heroImage2, heroImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000); // Troca a imagem a cada 5 segundos

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToGifts = () => {
    document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCouple = () => {
    document.getElementById('couple')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background com transição de imagens */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Casal em sua nova casa ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Overlay escuro para melhor contraste com o texto */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <Heart className="mx-auto mb-6 text-white drop-shadow-lg" size={64} />
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Chá de Casa Nova
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
          Ajude o casal a mobiliar sua nova casa com amor e carinho
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={scrollToGifts}
            className="text-lg px-8 py-4 shadow-elegant hover:shadow-soft transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            Ver Lista de Presentes
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={scrollToCouple}
            className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm"
          >
            Conheça o Casal
          </Button>
        </div>

        {/* Indicadores de imagem */}
        <div className="flex justify-center mt-8 space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
