import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import LiveProjects from "@/components/LiveProjects";
import BehancePortfolio from "@/components/BehancePortfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Work />
      <LiveProjects />
      <BehancePortfolio />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
