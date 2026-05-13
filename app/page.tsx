import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewInMarket } from "@/components/home/NewInMarket";
import { supabase } from "@/utils/supabase/client";

// Define the Property type according to the DB schema mapping
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  type: string;
  imageUrl: string;
  beds: number;
  baths: number;
  area: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isExclusive?: boolean;
}

export default async function Home(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const limit = 8;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Fetch featured properties
  const { data: featuredData } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('title');

  // Fetch paginated "new" properties (not featured)
  const { data: newData, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('title')
    .range(start, end);

  // Map snake_case to camelCase
  const mapProperty = (p: any): Property => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    status: p.status,
    type: p.type,
    imageUrl: p.image_url,
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    isFeatured: p.is_featured,
    isNewArrival: p.is_new_arrival,
    isExclusive: p.is_exclusive,
  });

  const featuredProperties = (featuredData || []).map(mapProperty);
  const newProperties = (newData || []).map(mapProperty);
  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />
        <FeaturedCollections properties={featuredProperties} />
        <NewInMarket 
          properties={newProperties} 
          currentPage={page} 
          totalPages={totalPages} 
        />
      </main>
    </>
  );
}
