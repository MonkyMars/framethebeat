"use client"
import React from "react";
import { knownGenres } from "../utils/knownGenres";
import { useRouter } from 'next/navigation';

export default function Categories() {
  const router = useRouter();
  
  const handleGenreClick = (genre: string) => {
    router.push(`/collection?q=${encodeURIComponent(genre)}`);
  };
  
  return (
    <section className="section" aria-labelledby="categories-heading">
      <h2 id="categories-heading">Explore by Category</h2>
      <ul className="flex flex-wrap gap-3 justify-center" role="list" aria-label="Music genres">
        {knownGenres.slice(0, 10).map((genre, index) => (
          <li
            key={`genre-${genre}-${index}`}
          >
            <button
              onClick={() => handleGenreClick(genre)}
              className="px-4 py-2 bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--theme-rgb),0.6)]"
              aria-label={`Browse ${genre} albums`}
            >
              <span>{genre}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}