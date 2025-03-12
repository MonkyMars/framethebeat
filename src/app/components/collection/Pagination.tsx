'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  gridRef: React.RefObject<HTMLDivElement | null>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
  gridRef,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate visible page numbers
  useEffect(() => {
    const calculateVisiblePages = () => {
      const maxVisiblePages = 5;
      const pages: number[] = [];
      
      if (totalPages <= maxVisiblePages) {
        // Show all pages if there are fewer than maxVisiblePages
        for (let i = 0; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(0);
        
        // Calculate middle pages
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages - 2, currentPage + 1);
        
        // Adjust if we're near the beginning
        if (currentPage < 2) {
          endPage = 3;
        }
        
        // Adjust if we're near the end
        if (currentPage > totalPages - 3) {
          startPage = totalPages - 4;
        }
        
        // Add ellipsis after first page if needed
        if (startPage > 1) {
          pages.push(-1); // -1 represents ellipsis
        }
        
        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        // Add ellipsis before last page if needed
        if (endPage < totalPages - 2) {
          pages.push(-2); // -2 represents ellipsis
        }
        
        // Always show last page
        pages.push(totalPages - 1);
      }
      
      setVisiblePages(pages);
    };
    
    calculateVisiblePages();
  }, [totalPages, currentPage]);

  const scrollToTop = useCallback(() => {
    if (mounted && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mounted, gridRef]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    scrollToTop();
  }, [setCurrentPage, scrollToTop]);

  const handlePrevious = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      scrollToTop();
    }
  }, [currentPage, setCurrentPage, scrollToTop]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      scrollToTop();
    }
  }, [currentPage, totalPages, setCurrentPage, scrollToTop]);

  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setItemsPerPage(newValue);
    setCurrentPage(0); // Reset to first page when changing items per page
    scrollToTop();
  }, [setItemsPerPage, setCurrentPage, scrollToTop]);

  if (!mounted || totalPages <= 1) return null;

  return (
    <nav 
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4"
      aria-label="Pagination"
    >
      <div className="flex items-center gap-2 text-sm text-[rgba(var(--foreground-rgb),0.7)]">
        <span>Showing</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="px-2 py-1 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-[rgba(var(--background-rgb),0.8)] text-foreground cursor-pointer transition-all duration-300 hover:border-[rgba(var(--theme-rgb),0.5)]"
          aria-label="Items per page"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
        <span>items per page</span>
        {totalItems && (
          <span className="ml-2">
            of <strong>{totalItems}</strong> total items
          </span>
        )}
      </div>
      
      <div className="flex items-center">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(var(--theme-rgb),0.3)] bg-[rgba(var(--background-rgb),0.8)] text-foreground transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center mx-2">
          {visiblePages.map((page, index) => {
            // Render ellipsis
            if (page < 0) {
              return (
                <span 
                  key={`ellipsis-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-[rgba(var(--foreground-rgb),0.7)]"
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              );
            }
            
            // Render page number
            return (
              <button
                key={`page-${page}`}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full mx-1 transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-[rgba(var(--theme-rgb),0.2)] border border-[rgba(var(--theme-rgb),0.5)] font-medium'
                    : 'hover:bg-[rgba(var(--theme-rgb),0.1)] border border-transparent hover:border-[rgba(var(--theme-rgb),0.3)]'
                }`}
                aria-label={`Page ${page + 1}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page + 1}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(var(--theme-rgb),0.3)] bg-[rgba(var(--background-rgb),0.8)] text-foreground transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination; 