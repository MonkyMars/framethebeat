'use client';

import React from "react";
import { Album } from "../../utils/types";
import { X, Clock } from "lucide-react";
import Image from "next/image";

interface ExtraDataCardProps {
  extraData: Album;
  setExtraData: (album: Album | null) => void;
}

const ExtraDataCard: React.FC<ExtraDataCardProps> = ({
  extraData,
  setExtraData,
}) => {
  if (!extraData) return null;

  const handleClose = (): void => {
    setExtraData(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div 
      className="w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center bg-[rgba(var(--background-rgb),0.5)] backdrop-blur-md"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="album-detail-title"
    >
      <div 
        className="w-11/12 h-11/12 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4">
          <button
            className="p-2 rounded-full hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out"
            onClick={handleClose}
            aria-label="Close album details"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-4">
          <div className="w-64 shrink-0">
            <div className="aspect-square relative">
              <Image
                src={extraData.albumCover?.src || "/placeholder.png"}
                alt={extraData.albumCover?.alt || `Album cover for ${extraData.album} by ${extraData.artist}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                priority
                className="rounded-lg shadow-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.png";
                  console.error(`Failed to load image for ${extraData.album} by ${extraData.artist}`);
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-2 mt-4">
              <h1 id="album-detail-title" className="text-2xl font-bold">{extraData.album}</h1>
              <h2 className="text-lg font-semibold">{extraData.artist}</h2>
              <h3 className="text-base font-normal">{extraData.genre}</h3>
              <h4 className="text-sm font-light">{extraData.release_date}</h4>
              <h2 className="text-lg font-semibold">
                <code className="text-[rgb(var(--theme-rgb))]">
                  {extraData.saves}
                </code>{" "}
                saves
              </h2>
            </div>
          </div>

          <div className="flex-1 w-full">
            <h3 className="text-xl font-semibold mb-4">Tracklist</h3>
            <div className="space-y-2">
              {extraData.tracklist && extraData.tracklist.length > 0 ? (
                extraData.tracklist.map((track, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-[rgba(var(--theme-rgb),0.1)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[rgba(var(--theme-rgb),0.8)] w-6">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">
                          {track.track && track.track[0] ? track.track[0].name : "Unknown Track"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        size={14}
                        className="text-[rgba(var(--theme-rgb),0.8)]"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[rgba(var(--theme-rgb),0.7)]">
                        {track.track && track.track[0] ? track.track[0].duration : "--:--"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center w-full py-8">
                  <p className="text-2xl text-[var(--theme)] font-medium">No tracklist found</p>
                  <p className="text-sm text-[rgba(var(--theme-rgb),0.5)]">Track information unavailable</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraDataCard; 