'use client';

import { type Album } from "../../utils/types";
import clsx from "clsx";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Share2, Expand } from "lucide-react";
import { capitalizeFirstLetter, isHighPriority } from "../../utils/functions";

interface CollectionCardProps {
  album: string;
  genre: string;
  albumCover: {
    src: string;
    alt: string;
  };
  artist: string;
  onHeartClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onShare: (artist: string, album: string) => void;
  saves: number;
  saved?: boolean;
  releaseDate: string;
  setExtraData: (album: Album | null) => void;
  tracklist?: Album["tracklist"];
}

const AlbumCard = ({
  album,
  genre,
  albumCover,
  artist,
  onHeartClick,
  onShare,
  saves,
  saved = false,
  releaseDate,
  setExtraData,
  tracklist,
}: CollectionCardProps) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  
  const mappedAlbum: Album = {
    album,
    genre,
    albumCover,
    artist,
    saves,
    release_date: parseInt(releaseDate),
    tracklist: tracklist || []
  }
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const imageUrl =
    albumCover?.src && !imageError ? albumCover.src : "/placeholder.png";

  const handleImageError = (): void => {
    setImageError(true);
    console.error(`Failed to load image for ${album} by ${artist}`);
  };

  const handleExpandClick = (): void => {
    setExtraData(mappedAlbum);
  };

  const handleShareClick = (): void => {
    onShare(artist, album);
  };

  const skeletonCard = (
    <div className="flex flex-col items-center gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
      <div className="w-full aspect-square relative">
        <div className="w-full h-full rounded-lg bg-[rgba(var(--theme-rgb),0.1)]" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-7 w-48 bg-[rgba(var(--theme-rgb),0.1)] rounded" />
        <div className="h-6 w-36 bg-[rgba(var(--theme-rgb),0.1)] rounded" />
      </div>
    </div>
  );

  return (
    <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
      {mounted ? (
        <article
          className="relative flex flex-col items-center gap-5 p-5 bg-[rgba(var(--background-rgb),0.08)] backdrop-blur-lg rounded-2xl border border-[rgba(var(--theme-rgb),0.15)] shadow-sm shadow-[rgba(var(--theme-rgb),0.05)] transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[rgba(var(--theme-rgb),0.15)] hover:scale-[1.01] hover:border-[rgba(var(--theme-rgb),0.25)]"
          aria-labelledby={`album-title-${album}`}
        >
          {/* Expand button moved to the corner of the image for better integration */}
          <div className="w-full aspect-square relative rounded-xl overflow-hidden shadow-md">
            <Image
              src={imageUrl}
              alt={albumCover?.alt || `Album cover for ${album} by ${artist}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isHighPriority(imageUrl)}
              unoptimized={true}
              onError={handleImageError}
              className="object-cover transition-all duration-300 hover:brightness-[1.03]"
            />
            <button 
              className="absolute bottom-3 right-3 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110 hover:bg-background shadow-md"
              onClick={handleExpandClick}
              aria-label={`View details for ${album} by ${artist}`}
            >
              <Expand 
                size={20} 
                className="cursor-pointer text-theme"
              />
            </button>
          </div>

          <div className="flex flex-col items-center gap-2.5 w-full px-1">
            <h3 
              id={`album-title-${album}`}
              className="text-xl font-bold text-center tracking-wide hover:text-[var(--theme)] transition-colors duration-300 line-clamp-2"
            >
              {album}
            </h3>
            <p className="text-lg text-[rgba(var(--theme-rgb),0.8)] line-clamp-1 font-medium">{artist}</p>
            {releaseDate && (
              <p className="text-sm text-[rgba(var(--foreground-rgb),0.65)]">
                {releaseDate}
              </p>
            )}
            {genre && genre.toLocaleLowerCase() !== "unknown" && (
              <span className="font-semibold text-xs p-2 tracking-wider text-[rgba(var(--foreground-rgb),0.9)] uppercase bg-[rgba(var(--theme-rgb),0.15)] px-3.5 py-1.5 rounded-full border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.25)] shadow-sm">
                {capitalizeFirstLetter(genre)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between w-full mt-auto">
            <button 
              className="p-2.5 rounded-full bg-[rgba(var(--theme-rgb),0.08)] hover:bg-[rgba(var(--theme-rgb),0.18)] transition-all duration-300 text-theme border border-[rgba(var(--theme-rgb),0.15)] shadow-sm"
              onClick={handleShareClick}
              aria-label={`Share ${album} by ${artist}`}
            >
              <Share2 size={18} />
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(var(--theme-rgb),0.08)] hover:bg-[rgba(var(--theme-rgb),0.18)] transition-all duration-300 border border-[rgba(var(--theme-rgb),0.15)] shadow-sm"
              aria-label={saved ? `Remove ${album} by ${artist} from saved` : `Save ${album} by ${artist}`}
            >
              <Heart
                size={18}
                onClick={onHeartClick}
                className={clsx(
                  "cursor-pointer text-theme",
                  saved && "text-theme fill-theme"
                )}
                aria-hidden="true"
              />
              <span className="text-sm font-medium">{saves}</span>
            </button>
          </div>
        </article>
      ) : skeletonCard}
    </div>
  );
};

export default AlbumCard;