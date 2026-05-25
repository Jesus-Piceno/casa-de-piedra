import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { NewInMarket } from "@/components/home/NewInMarket";
import { createClient } from "@/utils/supabase/server";

// Force Next.js to always fetch fresh data from DB on every request
export const dynamic = "force-dynamic";

// Define the Property type according to the DB schema mapping
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  type: string;
  images: string[];
  beds: number;
  baths: number;
  area: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isExclusive?: boolean;
  slug: string;
}

export default async function Home(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const typeFilter = typeof searchParams?.type === 'string' ? searchParams.type : null;
  const statusFilter = typeof searchParams?.status === 'string' ? searchParams.status : null;
  const searchQuery = typeof searchParams?.q === 'string' ? searchParams.q : null;
  const minPrice = typeof searchParams?.minPrice === 'string' ? parseInt(searchParams.minPrice.replace(/,/g, ''), 10) : null;
  const maxPrice = typeof searchParams?.maxPrice === 'string' ? parseInt(searchParams.maxPrice.replace(/,/g, ''), 10) : null;
  const beds = typeof searchParams?.beds === 'string' ? parseInt(searchParams.beds, 10) : null;
  const baths = typeof searchParams?.baths === 'string' ? parseInt(searchParams.baths, 10) : null;
  const amenitiesParam = typeof searchParams?.amenities === 'string' ? searchParams.amenities : null;
  const amenitiesArray = amenitiesParam ? amenitiesParam.split(',') : [];
  
  const limit = 8;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  // Create a fresh server-side client for each request (respects auth cookies)
  const supabase = await createClient();


  // Fetch featured properties
  let featuredQuery = supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('title');

  if (typeFilter) featuredQuery = featuredQuery.ilike('type', typeFilter);
  if (statusFilter) featuredQuery = featuredQuery.eq('status', statusFilter);
  if (searchQuery) featuredQuery = featuredQuery.or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
  if (minPrice !== null && !isNaN(minPrice)) featuredQuery = featuredQuery.gte('price', minPrice);
  if (maxPrice !== null && !isNaN(maxPrice)) featuredQuery = featuredQuery.lte('price', maxPrice);
  if (beds !== null && !isNaN(beds)) featuredQuery = featuredQuery.gte('beds', beds);
  if (baths !== null && !isNaN(baths)) featuredQuery = featuredQuery.gte('baths', baths);
  if (amenitiesArray.length > 0) featuredQuery = featuredQuery.contains('amenities', amenitiesArray);

  const { data: featuredData } = await featuredQuery;

  // Fetch paginated "new" properties (not featured)
  let newQuery = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .eq('is_active', true)
    .order('title')
    .range(start, end);

  if (typeFilter) newQuery = newQuery.ilike('type', typeFilter);
  if (statusFilter) newQuery = newQuery.eq('status', statusFilter);
  if (searchQuery) newQuery = newQuery.or(`title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
  if (minPrice !== null && !isNaN(minPrice)) newQuery = newQuery.gte('price', minPrice);
  if (maxPrice !== null && !isNaN(maxPrice)) newQuery = newQuery.lte('price', maxPrice);
  if (beds !== null && !isNaN(beds)) newQuery = newQuery.gte('beds', beds);
  if (baths !== null && !isNaN(baths)) newQuery = newQuery.gte('baths', baths);
  if (amenitiesArray.length > 0) newQuery = newQuery.contains('amenities', amenitiesArray);

  const { data: newData, count } = await newQuery;

  // Map snake_case to camelCase
  const mapProperty = (p: any): Property => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    status: p.status,
    type: p.type,
    images: p.gallery_images || [],
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    isFeatured: p.is_featured,
    isNewArrival: p.is_new_arrival,
    isExclusive: p.is_exclusive,
    slug: p.slug,
  });

  const featuredProperties = (featuredData || []).map(mapProperty);
  const newProperties = (newData || []).map(mapProperty);
  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={null}>
          <HeroSection />
        </Suspense>
        <FeaturedCollections properties={featuredProperties} />
        <NewInMarket 
          properties={newProperties} 
          currentPage={page} 
          totalPages={totalPages} 
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          minPrice={minPrice}
          maxPrice={maxPrice}
          beds={beds}
          baths={baths}
          amenities={amenitiesParam}
        />
      </main>
    </>
  );
}
