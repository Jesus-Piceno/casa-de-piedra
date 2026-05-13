import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      <Link
        href={currentPage > 1 ? `/?page=${currentPage - 1}` : '#'}
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
            href={`/?page=${page}`}
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
        href={currentPage < totalPages ? `/?page=${currentPage + 1}` : '#'}
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
