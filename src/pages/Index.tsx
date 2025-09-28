import Hero from "@/components/Hero";
import CoupleStory from "@/components/CoupleStory";
import GiftList from "@/components/GiftList";
import Footer from "@/components/Footer";
import Header from "@/components/Header"; // Linha adicionada

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header /> {/* Componente adicionado */}
      <Hero />
      <CoupleStory />
      <GiftList />
      <Footer />
    </div>
  );
};

export default Index;