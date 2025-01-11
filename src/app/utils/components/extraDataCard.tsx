import React from "react";
import { Album } from "../types";
import { X } from "lucide-react";
import Image from "next/image";

const ExtraDataCard = ({extraData}: {extraData: Album}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)]">
      <h2 className="text-lg font-semibold text-foreground">Extra Data</h2>
      <button className="self-end" onClick={() => {}}>
        <X size={24} />
      </button>
      <div className="flex flex-col gap-2">
        <Image
        src={extraData.albumCover.src}
        alt={extraData.albumCover.alt}
        width={200}
        height={200}
        />
      </div>
    </div>
  );
}

export default ExtraDataCard;