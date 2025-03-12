'use client';

import { useEffect, useState } from 'react';
import { knownGenres } from "@/app/utils/knownGenres";
import { Album } from "@/app/utils/types";
import { X } from "lucide-react";
import { capitalizeFirstLetter } from '../functions';

interface FilterBarProps {
  sortBy: string;
  collection: Album[];
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  filterBy: string;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSelectedGenre: (genre: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre?: string;
  selectedAlbum?: string;
  setSelectedAlbum?: (album: string) => void;
  selectedArtist?: string;
  setSelectedArtist?: (artist: string) => void;
}

const FilterBar = ({
  sortBy,
  collection,
  setSortBy,
  filterBy,
  setFilterBy,
  setSelectedGenre,
  searchQuery, 
  setSearchQuery,
  selectedGenre = "all",
  selectedAlbum = "",
  setSelectedAlbum,
  selectedArtist = "",
  setSelectedArtist,
}: FilterBarProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const yearOptions = Array.from(
    new Set(
      collection
        .map((album) => album.release_date.toString())
        .filter((date) => date !== "unknown")
        .sort((a, b) => parseInt(b || "0") - parseInt(a || "0"))
    )
  );

  return (
    <div style={{ visibility: mounted ? 'visible' : 'hidden' }} className="flex flex-col gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          disabled={collection.length === 0}
          className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">By Title</option>
          <option value="artist">By Artist</option>
        </select>

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          disabled={collection.length === 0}
          className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
        >
          <option value="all">All Years</option>
          {yearOptions.map((year, index) => (
            <option key={`year-${year}-${index}`} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          name="genre"
          id="genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          disabled={collection.length === 0}
          className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
        >
          <option value="all">All Genres</option>
          {knownGenres.map((genre, index) => (
            <option key={`genre-${genre}-${index}`} value={genre}>
              {capitalizeFirstLetter(genre)}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            placeholder="Search collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={collection.length === 0}
            className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
          />
          {mounted && searchQuery && (
            <X
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Filter by album..."
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum && setSelectedAlbum(e.target.value)}
            disabled={collection.length === 0}
            className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
          />
          {mounted && selectedAlbum && (
            <X
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setSelectedAlbum && setSelectedAlbum("")}
            />
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Filter by artist..."
            value={selectedArtist}
            onChange={(e) => setSelectedArtist && setSelectedArtist(e.target.value)}
            disabled={collection.length === 0}
            className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
          />
          {mounted && selectedArtist && (
            <X
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setSelectedArtist && setSelectedArtist("")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;