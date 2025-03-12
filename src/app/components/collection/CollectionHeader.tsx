'use client';

import React from 'react';
import { type Album } from '../../utils/types';

interface CollectionHeaderProps {
  collection: Album[];
  page: 'collection' | 'saved';
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collection, page }) => {
  const title = page === 'collection' ? 'Our Collection' : 'Your Collection';
  const description = `Here are all the albums ${page === 'collection' ? 'we' : 'you'}'ve saved.`;
  
  return (
    <header 
      className="relative flex flex-col items-center gap-6 py-12 px-4 md:px-8"
      aria-labelledby="collection-title"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--theme-rgb),0.1)] to-transparent opacity-50 blur-xl pointer-events-none" 
        aria-hidden="true"
      />

      <h2 
        id="collection-title"
        className="relative text-[clamp(1.85rem,5vw,3rem)] font-black uppercase tracking-[0.2em] z-10"
      >
        {title}
      </h2>

      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-lg md:text-xl font-medium text-[rgba(var(--foreground-rgb),0.8)]">
          {description}
        </p>

        {collection && collection.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="px-4 py-1 rounded-full bg-[rgba(var(--theme-rgb),0.1)] border border-[rgba(var(--theme-rgb),0.2)] backdrop-blur-sm">
              <p className="text-center text-sm md:text-base font-medium">
                <span className="font-bold text-[var(--theme)]">
                  {collection.length}
                </span>{" "}
                albums in collection
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CollectionHeader; 