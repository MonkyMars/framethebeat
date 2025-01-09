import { knownGenres } from "@/app/utils/knownGenres";
import { Album } from "@/app/utils/types";
import { X } from "lucide-react";

interface FilterBarProps {
  sortBy: string;
  collection: Album[];
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  filterBy: string;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSelectedGenre: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
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
}: FilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)]">
    <div className="filters flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        disabled={collection.length === 0}
        className="w-full md:w-auto px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
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
        className="w-full md:w-auto px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
      >
        <option value="all">All Years</option>
        {Array.from(
          new Set(
            collection
              .map((album) => album.release_date.toString())
              .filter((date) => date !== "unknown")
              .sort((a, b) => parseInt(b || "0") - parseInt(a || "0"))
          )
        ).map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        name="genre"
        id="genre"
        onChange={(e) => setSelectedGenre(e.target.value)}
        disabled={collection.length === 0}
        className="w-full md:w-auto px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
      >
        <option value="all">All Genres</option>
        {knownGenres.map((genre, index) => (
          <option key={`${genre}-${index}`} value={genre}>
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </option>
        ))}
      </select>
    </div>

    <div className="search flex items-center gap-2 w-full md:w-auto">
      <input
        type="text"
        placeholder="Search saved albums..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={collection.length === 0}
        className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
      />
      {searchQuery && (
        <X
          size={24}
          className="clear cursor-pointer flex-shrink-0"
          onClick={() => setSearchQuery("")}
        />
      )}
    </div>
  </div>
  );
};

export default FilterBar;
