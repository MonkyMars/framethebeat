import React from "react";
import { capitalizeFirstLetter } from "../utils/functions";
import Link from "next/link";

export default function Categories() {
  const genres: string[] = [
    "pop",
    "hip-hop",
    "rock",
    "electronic",
    "r&b",
    "country",
    "latin",
    "k-pop",
    "rap",
    "indie"
  ];

  return (
    <section className="section" aria-labelledby="categories-heading">
      <h2 id="categories-heading">Explore by Category</h2>
      <div className="min-h-[120px]">
        <ul className="flex flex-wrap gap-3 justify-center" role="list" aria-label="Music genres">
          {genres.slice(0, 10).map((genre, index) => (
            <li
              key={`genre-${genre}-${index}`}
              className="inline-block" aria-label={`Browse ${genre} albums`}
            >
              <Link
                href={`/collection?genre=${encodeURIComponent(genre)}`}
                passHref
                prefetch
                className="px-4 py-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--theme-rgb),0.6)] min-w-[80px] text-center"
                aria-label={`Browse ${genre} albums`}
              >
                <span>{capitalizeFirstLetter(genre)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}