import styles from "../page.module.scss";
import Image from "next/image";
import React from "react";
import { Album } from "@/app/utils/types";

interface FeaturedProps {
    AlbumCover: (index: number) => Album;
}

const Featured: React.FC<FeaturedProps> = ({AlbumCover}) => {
    return(
        <section className={styles.section}>
        <h2>Featured Covers</h2>
        <div className={styles.featuredGrid}>
          {[0, 1, 2, 3].map((index) => {
            const album = AlbumCover(index);
            if (!album) {
              return (
                <div key={index} className={styles.featuredCover}>
                  <p>Album not found</p>
                </div>
              );
            }

            return (
              <div key={index} className={styles.featuredCover}>
                <Image
                  src={`/albumcovers/${album.albumCover.src}`}
                  width={2000}
                  height={2000}
                  alt={album.albumCover.alt}
                />
                <h3>{album.title}</h3>
                <div className={styles.details}>
                  <p>{album.artist}</p>
                  <p>{album.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    )
}

export default Featured;