"use client"
import { useEffect } from 'react';

interface PaginationProps {
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  gridRef: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  ITEMS_PER_PAGE: number;
  setITEMS_PER_PAGE: React.Dispatch<React.SetStateAction<number>>;
  initialPage?: number;
  initialItemsPerPage?: number;
}

const Pagination = ({
  totalPages,
  setCurrentPage,
  gridRef,
  currentPage,
  ITEMS_PER_PAGE,
  setITEMS_PER_PAGE,
}: PaginationProps) => {


  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, gridRef]);

  const onPageNext = () => {
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
    if (typeof window !== "undefined") {
      gridRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onPagePrev = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
    if (typeof window !== "undefined") {
      gridRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pagination flex justify-center items-center gap-4 my-8">
      <button
        onClick={onPagePrev}
        disabled={currentPage === 0}
        className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-foreground">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        onClick={onPageNext}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
      <select
        name="pages"
        id="pages"
        value={ITEMS_PER_PAGE}
        onChange={(e) => setITEMS_PER_PAGE(parseInt(e.target.value))}
        className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)]"
      >
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
        <option value="500">500</option>
        <option value="1000">1000</option>
      </select>
    </div>
  );
};

export default Pagination;