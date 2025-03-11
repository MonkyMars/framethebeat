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

const Featured: React.FC<FeaturedProps> = ({ album }) => {
  const router = useRouter();
  
  if (!album || album.length === 0) {
    return null;
  }
  
  const handleHeartClick = (artist: string, album: string) => {
    router.push(`/collection/share?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`);
  };
  
  return (
    <section className="flex flex-col gap-5 m-6 z-10 relative p-8 backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:shadow-lg" aria-labelledby="popular-albums-heading">
      <h2 id="popular-albums-heading" className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        Most Popular Albums
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" role="list" aria-label="Popular albums list">
        {album.map(
          (item, index) =>
            item && (
              <article 
                key={index} 
                className="flex flex-col gap-4 p-6 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg transition-all duration-300 hover:shadow-md hover:scale-102"
                aria-labelledby={`album-title-${index}`}
              >
                <Image
                  src={getAlbumData(item.album, item.artist) || "/placeholder.png"}
                  alt={`Album cover for ${item.album} by ${item.artist}`}
                  width={1500}
                  height={1500}
                  priority
                  className="rounded-lg shadow-md"
                  unoptimized
                />
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
            )
        )}
      </div>
    </section>
  );
};

export default Featured;