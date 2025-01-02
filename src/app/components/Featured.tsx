"use client";
import React from "react";
import Image from "next/image";
import { getAlbumData } from "../utils/functions";
import styles from "../page.module.scss";
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
    <section className={styles.section}>
      <h2>Most Popular Albums</h2>
      <div className={styles.featuredGrid}>
        {album.map(
          (item, index) =>
            item && (
              <div key={index} className={styles.featuredCover}>
                <Image
                  src={getAlbumData(item.album, item.artist) || "/placeholder.png"}
                  alt={`Album cover for ${item.album} by ${item.artist}`}
                  width={1500}
                  height={1500}
                  priority
                />
                <div className={styles.details}>
                  <h3>{item.album}</h3>
                  <span>{item.release_date}</span>
                </div>
                <div className={styles.additionals}>
                  <p>{item.artist}</p>
                  <div className={styles.saves}>
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