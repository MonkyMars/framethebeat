"use client";
import React from "react";
import { Album } from "../utils/types";
import Image from "next/image";
import { isGif, isHighPriority } from "../utils/functions";
import styles from "../page.module.scss";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
interface FeaturedProps {
  album: Album[];
  saves: { artist: string; album: string; saves: number }[] | null;
}

const Featured: React.FC<FeaturedProps> = ({ album, saves }) => {
  const router = useRouter();
  if (!album || album.length === 0) {
    return null;
  }

  const getSaveCount = (title: string, artist: string): number => {
    if (!saves) return 0;
    const albumSaves = saves.find(
      (save) => 
        save.album.toLowerCase() === title.toLowerCase() && 
        save.artist.toLowerCase() === artist.toLowerCase()
    );
    return albumSaves?.saves || 0;
  };

  return (
    <section className={styles.section}>
      <h2>Most Popular Albums</h2>
      <div className={styles.featuredGrid}>
        {album.map(
          (item, index) =>
            item &&
            item.albumCover && (
              <div key={index} className={styles.featuredCover}>
                <Image
                  src={item.albumCover.src || "/placeholder.png"}
                  alt={item.albumCover.alt}
                  width={1500}
                  height={1500}
                  priority={isHighPriority(item.albumCover.src)}
                  unoptimized={isGif(item.albumCover.src)}
                />
                <div className={styles.details}>
                  <h3>{item.title}</h3>
                  <span>{item.release_date}</span>
                </div>
                <div className={styles.additionals}>
                  <p>{item.artist}</p>
                  <div className={styles.saves}>
                    <Heart size={24} onClick={() => router.push(`/collection/share?artist=${encodeURIComponent(item.artist)}&album=${encodeURIComponent(item.title)}`)}/>
                    <span>{getSaveCount(item.title, item.artist)}</span>
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