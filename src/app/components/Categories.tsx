"use client"
import '../globals.css'
import React from "react";
import { knownGenres } from "../utils/knownGenres";
import { useRouter } from 'next/navigation';

export default function Categories() {
  const router = useRouter();
  return (
    <section className="section">
      <h2>Explore by Category</h2>
      <ul>
        {knownGenres.slice(0, 10).map((genre, index) => (
          <li
            key={`genre-${genre}-${index}`}
            onClick={() => router.push(`/collection?q=${genre}`)}
          >
            <span>{genre}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}