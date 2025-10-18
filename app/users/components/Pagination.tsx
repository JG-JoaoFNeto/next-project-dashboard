"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper to create URL with preserved search params
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  // Helper to create URL for limit changes
  const createLimitUrl = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit.toString());
    params.set("page", "1"); // Reset to first page when changing limit
    return `?${params.toString()}`;
  };

  // Function to navigate and maintain scroll position at pagination component
  const navigateToPage = useCallback((url: string) => {
    // Push new URL without automatic scroll to top
    router.push(url, { scroll: false });
    
    // Use requestAnimationFrame for better timing and multiple fallbacks
    const scrollToPagination = () => {
      const element = document.getElementById('pagination-anchor');
      if (element) {
        // Try scrollIntoView first
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        
        // Fallback with window.scrollTo
        setTimeout(() => {
          const elementTop = element.offsetTop;
          const offset = window.innerHeight / 2 - element.offsetHeight / 2;
          window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
          });
        }, 50);
      }
    };
    
    // Multiple attempts to ensure scroll works
    requestAnimationFrame(() => {
      scrollToPagination();
    });
    
    setTimeout(() => {
      scrollToPagination();
    }, 150);
    
    setTimeout(() => {
      scrollToPagination();
    }, 300);
    
  }, [router]);

  // Limit options
  const limitOptions = [5, 10, 25, 50];

  // Calculate range info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 2; // Number of pages to show on each side of current

    // Always show first page
    pages.push(1);

    // Calculate start and end of middle range
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after 1 if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add middle range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    // Even with single page, show the controls without navigation buttons
    return (
      <div id="pagination-anchor" className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
        {/* Mobile: Just show results info */}
        <div className="flex-1 sm:hidden">
          <p className="text-sm text-gray-700">
            {totalItems} {totalItems === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>

        {/* Desktop: Show selector and results info */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">          
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                navigateToPage(createLimitUrl(Number(e.target.value)));
              }}
              className="text-blue-600 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">por página</span>
          </div>

          {/* Results info */}
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{startItem}</span> a{" "}
              <span className="font-medium">{endItem}</span> de{" "}
              <span className="font-medium">{totalItems}</span> resultados
            </p>
          </div>

          {/* Empty div to maintain layout balance */}
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div id="pagination-anchor" className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
      {/* Mobile: Simple Previous/Next */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => currentPage > 1 && navigateToPage(createPageUrl(currentPage - 1))}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage > 1
              ? "text-gray-700 bg-white hover:bg-gray-50"
              : "text-gray-400 bg-gray-50 cursor-not-allowed"
          }`}
        >
          Anterior
        </button>
        <button
          onClick={() => currentPage < totalPages && navigateToPage(createPageUrl(currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage < totalPages
              ? "text-gray-700 bg-white hover:bg-gray-50"
              : "text-gray-400 bg-gray-50 cursor-not-allowed"
          }`}
        >
          Próximo
        </button>
      </div>

      {/* Desktop: Full pagination */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">          
        {/* Items per page selector */}
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Mostrar:</span>
            <select
                value={itemsPerPage}
                onChange={(e) => {
                navigateToPage(createLimitUrl(Number(e.target.value)));
                }}
                className="text-blue-600 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
                {limitOptions.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
            <span className="text-sm text-gray-700">por página</span>
        </div>
        {/* Results info with items per page selector */}
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startItem}</span> a{" "}
            <span className="font-medium">{endItem}</span> de{" "}
            <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>

        {/* Page numbers */}
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous button */}
            <button
              onClick={() => currentPage > 1 && navigateToPage(createPageUrl(currentPage - 1))}
              disabled={currentPage <= 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage > 1
                  ? "text-gray-500 hover:bg-gray-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <span className="sr-only">Anterior</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <span key={index}>
                {page === "..." ? (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => navigateToPage(createPageUrl(page as number))}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </span>
            ))}

            {/* Next button */}
            <button
              onClick={() => currentPage < totalPages && navigateToPage(createPageUrl(currentPage + 1))}
              disabled={currentPage >= totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage < totalPages
                  ? "text-gray-500 hover:bg-gray-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <span className="sr-only">Próximo</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 5.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}