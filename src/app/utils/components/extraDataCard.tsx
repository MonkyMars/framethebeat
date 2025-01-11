import React from "react";
import { Album } from "../types";
import { X } from "lucide-react";
import Image from "next/image";

const ExtraDataCard = ({extraData, setExtraData}: {extraData: Album, setExtraData: (album: Album | null) => void}) => {
  if (!extraData) return null;
  return (
    <div className="w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center bg-[rgba(var(--background-rgb),0.5)] backdrop-blur-md">
      <div className="w-11/12 h-11/12 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
        <div className="flex justify-end p-4">
          <button className="p-2 rounded-full hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out" onClick={() => setExtraData(null)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="w-full aspect-square relative">
            <Image
              src={extraData.albumCover.src}
              alt={extraData.album}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold">{extraData.album}</h1>
            <h2 className="text-lg font-semibold">{extraData.artist}</h2>
            <h3 className="text-base font-normal">{extraData.genre}</h3>
            <h4 className="text-sm font-light">{extraData.release_date}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExtraDataCard;