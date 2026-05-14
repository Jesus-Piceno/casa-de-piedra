import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  typeFilter?: string | null;
  searchQuery?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  beds?: number | null;
  baths?: number | null;
}

function buildHref(page: number, typeFilter?: string | null, searchQuery?: string | null, minPrice?: number | null, maxPrice?: number | null, beds?: number | null, baths?: number | null) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (typeFilter) params.set('type', typeFilter);
  if (searchQuery) params.set('q', searchQuery);
  if (minPrice) params.set('minPrice', String(minPrice));
  if (maxPrice) params.set('maxPrice', String(maxPrice));
  if (beds) params.set('beds', String(beds));
  if (baths) params.set('baths', String(baths));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export function Pagination({ currentPage, totalPages, typeFilter, searchQuery, minPrice, maxPrice, beds, baths }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      <Link
        href={currentPage > 1 ? buildHref(currentPage - 1, typeFilter, searchQuery, minPrice, maxPrice, beds, baths) : '#'}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
          currentPage > 1 
            ? 'border-nordic-dark/20 text-nordic-dark hover:bg-nordic-dark hover:text-white' 
            : 'border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
        }`}
      >
        Previous
      </Link>
      
      <div className="flex space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={buildHref(page, typeFilter, searchQuery, minPrice, maxPrice, beds, baths)}
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-nordic-dark text-white border-nordic-dark'
                : 'border-nordic-dark/20 text-nordic-dark hover:bg-nordic-dark/10'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={currentPage < totalPages ? buildHref(currentPage + 1, typeFilter, searchQuery, minPrice, maxPrice, beds, baths) : '#'}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
          currentPage < totalPages 
            ? 'border-nordic-dark/20 text-nordic-dark hover:bg-nordic-dark hover:text-white' 
            : 'border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
        }`}
      >
        Next
      </Link>
    </div>
  );
}
