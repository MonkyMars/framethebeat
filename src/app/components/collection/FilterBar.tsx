'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Album } from "../../utils/types";
import { X, Search, Filter } from "lucide-react";
import { capitalizeFirstLetter } from '../../utils/functions';

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

const FilterBar: React.FC<FilterBarProps> = ({
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
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const yearOptions = useMemo(() => {
    if (!collection || !Array.isArray(collection)) return [];
    
    return Array.from(
      new Set(
        collection
          .map((album) => album.release_date?.toString())
          .filter((date) => date && date !== "unknown")
      )
    ).sort((a, b) => parseInt(b) - parseInt(a));
  }, [collection]);

  const genreOptions = useMemo(() => {
    if (!collection || !Array.isArray(collection)) return [];
    
    return Array.from(
      new Set(
        collection
          .map((album) => album.genre?.toLowerCase())
          .filter((genre) => genre && genre !== "unknown")
      )
    ).sort();
  }, [collection]);

  const artistOptions = useMemo(() => {
    if (!collection || !Array.isArray(collection)) return [];
    
    return Array.from(
      new Set(
        collection.map((album) => album.artist)
      )
    ).sort();
  }, [collection]);

  const albumOptions = useMemo(() => {
    if (!collection || !Array.isArray(collection)) return [];
    
    return Array.from(
      new Set(
        collection.map((album) => album.album)
      )
    ).sort();
  }, [collection]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  }, [setSortBy]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(e.target.value);
    
    // Reset other filters when changing the main filter
    if (e.target.value !== 'genre') setSelectedGenre('all');
    if (e.target.value !== 'artist' && setSelectedArtist) setSelectedArtist('');
    if (e.target.value !== 'album' && setSelectedAlbum) setSelectedAlbum('');
  }, [setFilterBy, setSelectedGenre, setSelectedArtist, setSelectedAlbum]);

  const handleGenreChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  }, [setSelectedGenre]);

  const handleArtistChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setSelectedArtist) setSelectedArtist(e.target.value);
  }, [setSelectedArtist]);

  const handleAlbumChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setSelectedAlbum) setSelectedAlbum(e.target.value);
  }, [setSelectedAlbum]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const toggleFilterExpand = useCallback(() => {
    setIsFilterExpanded(prev => !prev);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-[rgba(var(--theme-rgb),0.2)] py-4 px-4 md:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-[rgba(var(--theme-rgb),0.7)]" aria-hidden="true" />
            </div>
            <input
              type="search"
              id="collection-search"
              className="block w-full p-2 pl-10 text-sm border rounded-lg bg-[rgba(var(--background-rgb),0.8)] border-[rgba(var(--theme-rgb),0.3)] focus:ring-[rgba(var(--theme-rgb),0.5)] focus:border-[rgba(var(--theme-rgb),0.5)]"
              placeholder="Search by artist or album..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search collection"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Clear search"
              >
                <X size={18} className="text-[rgba(var(--theme-rgb),0.7)]" />
              </button>
            )}
          </div>
          
          <button 
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300"
            onClick={toggleFilterExpand}
            aria-expanded={isFilterExpanded}
            aria-controls="filter-controls"
          >
            <Filter size={18} className="text-[rgba(var(--theme-rgb),0.7)]" aria-hidden="true" />
            <span>Filters</span>
          </button>
          
          <div className={`flex flex-wrap items-center gap-4 w-full md:w-auto ${isFilterExpanded ? 'block' : 'hidden md:flex'}`} id="filter-controls">
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label htmlFor="sort-select" className="text-xs font-medium text-[rgba(var(--foreground-rgb),0.7)]">
                Sort by
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={handleSortChange}
                className="p-2 text-sm border rounded-lg bg-[rgba(var(--background-rgb),0.8)] border-[rgba(var(--theme-rgb),0.3)] focus:ring-[rgba(var(--theme-rgb),0.5)] focus:border-[rgba(var(--theme-rgb),0.5)]"
                aria-label="Sort collection"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="most-saved">Most Saved</option>
                <option value="least-saved">Least Saved</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label htmlFor="filter-select" className="text-xs font-medium text-[rgba(var(--foreground-rgb),0.7)]">
                Filter by
              </label>
              <select
                id="filter-select"
                value={filterBy}
                onChange={handleFilterChange}
                className="p-2 text-sm border rounded-lg bg-[rgba(var(--background-rgb),0.8)] border-[rgba(var(--theme-rgb),0.3)] focus:ring-[rgba(var(--theme-rgb),0.5)] focus:border-[rgba(var(--theme-rgb),0.5)]"
                aria-label="Filter collection"
              >
                <option value="all">All</option>
                <option value="genre">Genre</option>
                <option value="year">Year</option>
                <option value="artist">Artist</option>
                <option value="album">Album</option>
              </select>
            </div>
            
            {filterBy === "genre" && (
              <div className="flex flex-col gap-1 min-w-[150px]">
                <label htmlFor="genre-select" className="text-xs font-medium text-[rgba(var(--foreground-rgb),0.7)]">
                  Genre
                </label>
                <select
                  id="genre-select"
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  className="p-2 text-sm border rounded-lg bg-[rgba(var(--background-rgb),0.8)] border-[rgba(var(--theme-rgb),0.3)] focus:ring-[rgba(var(--theme-rgb),0.5)] focus:border-[rgba(var(--theme-rgb),0.5)]"
                  aria-label="Select genre"
                >
                  <option value="all">All Genres</option>
                  {genreOptions.map((genre) => (
                    <option key={genre} value={genre}>
                      {capitalizeFirstLetter(genre)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {filterBy === "year" && (
              <div className="flex flex-col gap-1 min-w-[150px]">
                <label htmlFor="year-select" className="text-xs font-medium text-[rgba(var(--foreground-rgb),0.7)]">
                  Year
                </label>
                <select
                  id="year-select"
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  className="p-2 text-sm border rounded-lg bg-[rgba(var(--background-rgb),0.8)] border-[rgba(var(--theme-rgb),0.3)] focus:ring-[rgba(var(--theme-rgb),0.5)] focus:border-[rgba(var(--theme-rgb),0.5)]"
                  aria-label="Select year"
                >
                  <option value="all">All Years</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {filterBy === "artist" && setSelectedArtist && (
              <div className="flex flex-col gap-1 min-w-[150px]">
                <label htmlFor="artist-select" className="text-xs font-medium text-[rgba(var(--foreground-rgb),0.7)]">
                  Artist
                </label>
                <select
                  id="artist-select"
                  value={selectedArtist}
                  onChange={handleArtistChange}
                  className="p-2 text-sm border rounded-lg bg-[rgba(var(--background-rgb),0.8)] border-[rgba(var(--theme-rgb),0.3)] focus:ring-[rgba(var(--theme-rgb),0.5)] focus:border-[rgba(var(--theme-rgb),0.5)]"
                  aria-label="Select artist"
                >
                  <option value="">All Artists</option>
                  {artistOptions.map((artist) => (
                    <option key={artist} value={artist}>
                      {artist}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {filterBy === "album" && setSelectedAlbum && (
              <div className="flex flex-col gap-1 min-w-[150px]">
                <label htmlFor="album-select" className="text-xs font-medium text-[rgba(var(--foreground-rgb),0.7)]">
                  Album
                </label>
                <select
                  id="album-select"
                  value={selectedAlbum}
                  onChange={handleAlbumChange}
                  className="p-2 text-sm border rounded-lg bg-[rgba(var(--background-rgb),0.8)] border-[rgba(var(--theme-rgb),0.3)] focus:ring-[rgba(var(--theme-rgb),0.5)] focus:border-[rgba(var(--theme-rgb),0.5)]"
                  aria-label="Select album"
                >
                  <option value="">All Albums</option>
                  {albumOptions.map((album) => (
                    <option key={album} value={album}>
                      {album}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 