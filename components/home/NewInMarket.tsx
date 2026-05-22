import { PropertyCard } from "@/components/ui/PropertyCard";
import { Property } from "@/app/[locale]/page";
import { Pagination } from "@/components/ui/Pagination";
import { getTranslations } from "next-intl/server";

interface NewInMarketProps {
  properties: Property[];
  currentPage: number;
  totalPages: number;
  typeFilter?: string | null;
  searchQuery?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  beds?: number | null;
  baths?: number | null;
  amenities?: string | null;
}

export async function NewInMarket({ 
  properties, 
  currentPage, 
  totalPages,
  typeFilter,
  searchQuery,
  minPrice,
  maxPrice,
  beds,
  baths,
  amenities
}: NewInMarketProps) {
  const t = await getTranslations('Home');

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">{t('newInMarket')}</h2>
          <p className="text-nordic-muted mt-1 text-sm">{t('newInMarketSubtitle')}</p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">{t('all')}</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">{t('buy')}</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">{t('rent')}</button>
        </div>
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              currentPage={currentPage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <p className="text-nordic-muted text-sm">{t('noProperties')}</p>
        </div>
      )}
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        typeFilter={typeFilter} 
        searchQuery={searchQuery}
        minPrice={minPrice}
        maxPrice={maxPrice}
        beds={beds}
        baths={baths}
        amenities={amenities}
      />
    </section>
  );
}
