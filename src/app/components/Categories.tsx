"use client"
import React from "react";
import { knownGenres } from "../utils/functions";

export default function Categories() {
  return (
    <section className="section">
      <h2>Explore by Category</h2>
      <ul>
        {knownGenres.slice(0, 10).map((genre, index) => (
          <li
            key={`genre-${genre}-${index}`}
            onClick={() => window.location.href = `/collection?q=${genre}`}
          >
            <span>{genre}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}