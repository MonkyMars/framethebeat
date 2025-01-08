"use client";
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
  
  return (
    <section className="flex flex-col gap-5 m-6 z-10 relative p-8 backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:shadow-lg">
      <h2 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground">
        Most Popular Albums
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {album.map(
          (item, index) =>
            item && (
              <div key={index} className="flex flex-col gap-4 p-6 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.1)] shadow-lg transition-all duration-300 hover:shadow-md hover:scale-102">
                <Image
                  src={getAlbumData(item.album, item.artist) || "/placeholder.png"}
                  alt={`Album cover for ${item.album} by ${item.artist}`}
                  width={1500}
                  height={1500}
                  priority
                  className="rounded-lg shadow-md"
                />
                <div className="flex justify-between items-center text-[rgba(var(--foreground-rgb),0.7)] text-sm p-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-md border border-[rgba(255,255,255,0.1)]">
                  <h3 className="text-foreground font-semibold truncate">{item.album}</h3>
                  <span>{item.release_date}</span>
                </div>
                <div className="flex justify-between items-center text-[rgba(var(--foreground-rgb),0.7)] text-sm p-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-md border border-[rgba(255,255,255,0.1)]">
                  <p className="truncate">{item.artist}</p>
                  <div className="flex items-center gap-2 bg-[rgba(var(--theme-rgb),0.1)] p-1 rounded-md">
                    <Heart size={24} onClick={() => router.push(`/collection/share?artist=${encodeURIComponent(item.artist)}&album=${encodeURIComponent(item.album)}`)}/>
                    <span>{item.saves}</span>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </section>
  );
};

export default Featured;