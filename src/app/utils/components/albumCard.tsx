import { type Album } from "../../utils/types";
import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import { isHighPriority } from "../../utils/functions";

type CollectionCardProps = Album & {
  onHeartClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onShare: (artist: string, album: string) => void;
  saves: number;
  saved: boolean;
  releaseDate: string;
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
}: CollectionCardProps) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl =
    albumCover?.src && !imageError ? albumCover.src : "/placeholder.png";

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
      <div className="w-full aspect-square relative">
        <Image
          src={imageUrl}
          alt={albumCover?.alt || "Album cover"}
          layout="fill"
          objectFit="cover"
          priority={isHighPriority(imageUrl)}
          unoptimized={true}
          onError={() => setImageError(true)}
          className="rounded-lg hover:shadow-sm  transition-all duration-300 ease-in-out brightness-105 w-full h-full"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-bold text-center tracking-wide hover:text-[var(--theme)] transition-colors duration-300">
          {album}
        </h3>
        <p className="text-lg text-[rgba(var(--theme-rgb),0.7)]">{artist}</p>
        {releaseDate && (
          <p className="text-sm text-[rgba(var(--foreground-rgb),0.7)]">
            {releaseDate}
          </p>
        )}
        {genre && genre.toLocaleLowerCase() !== "unknown" && (
          <p className="font-extrabold text-xs tracking-wider text-[rgba(var(--foreground-rgb),0.9)] uppercase bg-[rgba(var(--theme-rgb),0.15)] px-3 py-1.5 rounded-full border border-[rgba(var(--theme-rgb),0.2)] backdrop-blur-sm transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.25)]">
            {genre.charAt(0).toLocaleUpperCase() + genre.slice(1)}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 w-full px-4">
        <button className="p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out text-theme flex items-center justify-center">
          <Share2 size={24} onClick={() => onShare(artist, album)} />
        </button>
        <button className="flex items-center gap-2 p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
          <Heart
            size={24}
            onClick={(e) => onHeartClick(e)}
            className={clsx(
              "cursor-pointer text-theme",
              saved && "text-theme fill-theme"
            )}
          />
          <span>{saves}</span>
        </button>
      </div>
    </div>
  );
};

export default CollectionCard;