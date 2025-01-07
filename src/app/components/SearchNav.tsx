"use client";
import { X, ArrowRight } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
    <div className={`fixed top-0 left-0 bg-background/95 backdrop-blur-sm w-full h-24 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'} z-50 shadow-lg flex items-center justify-center gap-4 px-6`}>
      <button 
      className="absolute top-4 right-4 p-3 bg-gradient-to-br from-[rgba(var(--theme-rgb),0.8)] to-[var(--theme)] text-foreground rounded-lg transition-all duration-300 hover:shadow-[0_6px_20px_rgba(var(--theme-rgb),0.3)] active:scale-95" 
      onClick={onClose}
      aria-label="Close search"
      >
      <X size={24} />
      </button>
      <div className="relative flex-1 max-w-2xl">
      <input
        type="search"
        placeholder="Search album covers..."
        className="pl-10 w-full p-4 bg-background/50 border-2 border-[rgba(var(--theme-rgb),0.2)] rounded-xl text-foreground text-lg transition-all duration-300 focus:outline-none focus:border-[rgba(var(--theme-rgb),0.6)] focus:shadow-[0_0_16px_rgba(var(--theme-rgb),0.15)] placeholder:text-foreground/50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button 
        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-br from-[var(--theme)] to-[rgba(var(--theme-rgb),0.8)] text-foreground rounded-lg transition-all duration-300 hover:shadow-[0_6px_20px_rgba(var(--theme-rgb),0.3)] active:scale-95" 
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