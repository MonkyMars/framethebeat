"use client";
import '../globals.css'
import React from "react";
import Image from "next/image";
import { getAlbumData } from "../utils/functions";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface Album {
  artist: string;
  album: string;
  saves: number;
  release_date: number;
  genre: string;
  albumCover: {
    src: string;
    alt: string;
  };
}

interface FeaturedProps {
  album: Album[];
}

const AlbumSkeleton = () => (
  <article className="flex flex-col gap-4 p-6 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg">
    <div className="w-full aspect-square bg-[rgba(var(--theme-rgb),0.1)] rounded-lg"></div>
    <div className="flex justify-between items-center p-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-md border border-[rgba(255,255,255,0.1)]">
      <div className="h-5 w-24 bg-[rgba(var(--theme-rgb),0.1)] rounded"></div>
      <div className="h-5 w-12 bg-[rgba(var(--theme-rgb),0.1)] rounded"></div>
    </div>
    <div className="flex justify-between items-center p-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-md border border-[rgba(255,255,255,0.1)]">
      <div className="h-5 w-20 bg-[rgba(var(--theme-rgb),0.1)] rounded"></div>
      <div className="flex items-center gap-2 bg-[rgba(var(--theme-rgb),0.1)] p-1 rounded-md">
        <div className="h-6 w-6 bg-[rgba(var(--theme-rgb),0.2)] rounded-full"></div>
        <div className="h-5 w-8 bg-[rgba(var(--theme-rgb),0.1)] rounded"></div>
      </div>
    </div>
  </article>
);

const Featured: React.FC<FeaturedProps> = ({ album }) => {
  const router = useRouter();
  
  const handleHeartClick = (artist: string, album: string) => {
    router.push(`/collection/share?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`);
  };
  
  const handleAlbumClick = (artist: string, album: string) => {
    router.push(`/collection?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`);
  };

  return (
    <section className="flex flex-col gap-5 m-6 z-10 relative p-8 backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:shadow-lg" aria-labelledby="popular-albums-heading">
      <h2 id="popular-albums-heading" className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        Most Popular Albums
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" role="list" aria-label="Popular albums list">
        {!album || album.length === 0 ? (
          // Show skeletons while loading
          Array.from({ length: 4 }).map((_, index) => (
            <AlbumSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          album.map((item, index) => (
            <article 
              key={index} 
              className="cursor-pointer flex flex-col gap-4 p-6 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg transition-all duration-300 hover:shadow-md hover:scale-102"
              aria-labelledby={`album-title-${index}`}
              onClick={() => handleAlbumClick(item.artist, item.album)}
            >
              <div className="w-full aspect-square relative">
                <div className="w-full h-full bg-[rgba(var(--theme-rgb),0.1)] rounded-lg absolute top-0 left-0"></div>
                <Image
                  src={getAlbumData(item.album, item.artist) || "/placeholder.png"}
                  alt={`Album cover for ${item.album} by ${item.artist}`}
                  width={300}
                  height={300}
                  priority={index < 2}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDIwOSwxMjYsNTksMC4xKSIvPjwvc3ZnPg=="
                />
              </div>
              <div className="flex justify-between items-center text-[rgba(var(--foreground-rgb),0.7)] text-sm p-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-md border border-[rgba(255,255,255,0.1)]">
                <h3 id={`album-title-${index}`} className="text-foreground font-semibold truncate">{item.album}</h3>
                <span aria-label={`Released in ${item.release_date}`}>{item.release_date}</span>
              </div>
              <div className="flex justify-between items-center text-[rgba(var(--foreground-rgb),0.7)] text-sm p-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-md border border-[rgba(255,255,255,0.1)]">
                <p className="truncate" aria-label={`Artist: ${item.artist}`}>{item.artist}</p>
                <div className="flex items-center gap-2 bg-[rgba(var(--theme-rgb),0.1)] p-1 rounded-md">
                  <button 
                    onClick={() => handleHeartClick(item.artist, item.album)}
                    aria-label={`Save ${item.album} by ${item.artist}`}
                    className="focus:outline-none focus:ring-2 focus:ring-[rgba(var(--theme-rgb),0.6)] rounded-full p-1"
                  >
                    <Heart size={24} aria-hidden="true" />
                  </button>
                  <span aria-label={`${item.saves} saves`}>{item.saves}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Featured;