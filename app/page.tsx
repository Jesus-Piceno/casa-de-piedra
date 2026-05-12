import { Navbar } from "@/components/layout/Navbar";
import { mockProperties } from "@/data/mockProperties";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewInMarket } from "@/components/home/NewInMarket";

export default function Home() {
  const featuredProperties = mockProperties.filter(p => p.isFeatured);
  const newProperties = mockProperties.filter(p => !p.isFeatured);

  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <FeaturedCollections properties={featuredProperties} />
        <NewInMarket properties={newProperties} />
      </main>
    </>
  );
}
