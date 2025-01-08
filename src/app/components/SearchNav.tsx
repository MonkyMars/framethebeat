"use client";
import { X, ArrowRight } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface SearchNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchNav = ({ isOpen, onClose }: SearchNavProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  const handleSearch = () => {
    router.push(`/collection?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className={clsx(
      'fixed top-0 left-0 w-full h-24 transform transition-all duration-300 ease-in-out z-50',
      'backdrop-filter backdrop-blur-[10px] border-b border-[rgba(var(--theme-rgb),0.2)]',
      'flex items-center justify-center gap-4 px-6',
      isOpen ? 'translate-y-0' : '-translate-y-full'
    )}>
      <button 
      className="absolute top-4 right-4 p-3 text-foreground rounded-lg transition-all duration-300 hover:text-theme hover:transform hover:scale-110" 
      onClick={onClose}
      aria-label="Close search"
      >
      <X size={24} />
      </button>
      <div className="relative flex-1 max-w-2xl">
      <input
        type="search"
        placeholder="Search album covers..."
        className="w-full p-4 bg-[rgba(var(--background-rgb),0.45)] border-2 border-[rgba(var(--theme-rgb),0.2)] rounded-xl text-foreground text-lg transition-all duration-300 focus:outline-none focus:border-[rgba(var(--theme-rgb),0.7)] focus:shadow-[0_0_20px_rgba(var(--theme-rgb),0.25)] focus:translate-y-[-3px] placeholder:text-[rgba(var(--foreground-rgb),0.45)]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button 
        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-theme rounded-lg transition-all duration-300 hover:transform hover:scale-110" 
        onClick={handleSearch}
        aria-label="Search"
      >
        <ArrowRight size={24} />
      </button>
      </div>
    </div>
  );
};

const SearchComponent = ({ isOpen, onClose }: SearchNavProps) => {
  return <Suspense><SearchNav isOpen={isOpen} onClose={onClose} /></Suspense>;
}

export default SearchComponent;