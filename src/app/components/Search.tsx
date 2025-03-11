"use client"
import '../globals.css'
import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchComponent = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = React.useState<string>("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/collection?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="flex flex-col gap-5 m-6 z-10 relative p-8 backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:shadow-lg text-center" aria-labelledby="search-heading">
      <h2 id="search-heading" className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        Search Album Covers
      </h2>
      <form onSubmit={handleSearch} className="flex justify-center items-center gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md border-b border-[rgba(var(--theme-rgb),0.1)] transition-transform duration-300 w-full" role="search" aria-label="Search for albums">
        <label htmlFor="album-search" className="sr-only">Search by album or artist</label>
        <input 
          type="text" 
          id="album-search"
          placeholder="Search by album or artist" 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)} 
          onKeyDown={handleKeyDown}
          className="p-3 bg-transparent border border-[rgba(var(--theme-rgb),0.3)] rounded-md text-foreground text-base transition-all duration-300 focus:outline-none focus:border-[rgba(var(--theme-rgb),0.6)] focus:shadow-[0_0_8px_rgba(var(--theme-rgb),0.2)] w-full" 
          aria-label="Search by album or artist"
        />
        <button 
          type="submit"
          aria-label="Search" 
          className="p-3 bg-gradient-to-br from-[var(--theme)] to-[rgba(var(--theme-rgb),0.8)] text-foreground text-base font-semibold rounded-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(var(--theme-rgb),0.3)]"
        >
          <ArrowRight size={24} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
};

export default SearchComponent;