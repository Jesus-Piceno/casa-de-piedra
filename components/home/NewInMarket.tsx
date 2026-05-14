import { PropertyCard } from "@/components/ui/PropertyCard";
import { Property } from "@/app/page";
import { Pagination } from "@/components/ui/Pagination";

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
}

export function NewInMarket({ properties, currentPage, totalPages, typeFilter, searchQuery, minPrice, maxPrice, beds, baths }: NewInMarketProps) {
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">New in Market</h2>
          <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">All</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">Buy</button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">Rent</button>
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
          <p className="text-nordic-muted text-sm">No properties match your current filters. Try adjusting your search.</p>
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
      />
    </section>
  );
}
