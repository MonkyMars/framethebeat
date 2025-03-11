'use client';

import { type Album } from "../../utils/types";
import clsx from "clsx";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Share2, Expand } from "lucide-react";
import { isHighPriority } from "../../utils/functions";

type CollectionCardProps = Album & {
  onHeartClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onShare: (artist: string, album: string) => void;
  saves: number;
  saved: boolean;
  releaseDate: string;
  setExtraData: (album: Album | null) => void;
  tracklist?: Album["tracklist"];
};
const CollectionCard = ({
  album,
  genre,
  albumCover,
  artist,
  onHeartClick,
  saves,
  saved = false,
  onShare,
  releaseDate,
  setExtraData,
  tracklist,
}: CollectionCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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

  if (!mounted) {
    return (
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
  }

  return (
    <div className="group flex flex-col items-center gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out relative">
      <button className="absolute top-5 right-5 z-10 p-2 bg-background rounded-[50%] transition-all duration-300 hover:scale-110">
        <Expand 
      size={24} 
      onClick={() => setExtraData(mappedAlbum)}
      className="cursor-pointer text-theme"
      />
      </button>
      <div className="w-full aspect-square relative">
      <Image
        src={imageUrl}
        alt={albumCover?.alt || "Album cover"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={isHighPriority(imageUrl)}
        unoptimized={true}
        onError={() => setImageError(true)}
        className="rounded-lg object-cover transition-all duration-300 hover:brightness-105 hover:shadow-lg"
      />
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
      <h3 className="text-xl font-bold text-center tracking-wide hover:text-[var(--theme)] transition-colors duration-300 line-clamp-2">
        {album}
      </h3>
      <p className="text-lg text-[rgba(var(--theme-rgb),0.7)] line-clamp-1">{artist}</p>
      {releaseDate && (
        <p className="text-sm text-[rgba(var(--foreground-rgb),0.7)]">
        {releaseDate}
        </p>
      )}
      {genre && genre.toLocaleLowerCase() !== "unknown" && (
        <span className="font-semibold text-xs tracking-wider text-[rgba(var(--foreground-rgb),0.9)] uppercase bg-[rgba(var(--theme-rgb),0.15)] px-3 py-1.5 rounded-full border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.25)]">
        {genre.charAt(0).toLocaleUpperCase() + genre.slice(1)}
        </span>
      )}
      </div>

      <div className="flex items-center justify-between w-full mt-2">
      <button 
        className="p-2.5 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 text-theme"
        onClick={() => onShare(artist, album)}
      >
        <Share2 size={20} />
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300">
        <Heart
        size={20}
        onClick={onHeartClick}
        className={clsx(
          "cursor-pointer text-theme",
          saved && "text-theme fill-theme"
        )}
        />
        <span className="text-sm font-medium">{saves}</span>
      </button>
      </div>
    </div>
  );
};

export default CollectionCard;