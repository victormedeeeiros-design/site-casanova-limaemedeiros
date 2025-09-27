import { Heart } from "lucide-react";
import footerImage from "@/assets/gifts_personalized/imagecasalfooter.jpeg";

const Footer = () => {
  return (
    <footer className="relative bg-primary/5 py-16 text-center overflow-hidden">
      {/* Imagem de fundo do casal */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={footerImage} 
          alt="Casal feliz" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay para melhor contraste */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Heart className="mx-auto mb-4 text-primary" size={48} />
          
          <h3 className="text-2xl font-bold text-primary mb-4">
            Obrigado por fazer parte da nossa história!
          </h3>
          
          <p className="text-lg text-muted-foreground mb-6">
            Cada presente é um gesto de carinho que nos ajuda a construir 
            nosso lar com muito amor e gratidão.
          </p>
          
          <div className="border-t border-primary/20 pt-6 mt-8">
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              Feito com <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> para o casal • Chá de Casa Nova
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
