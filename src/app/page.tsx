"use client";
import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import Footer from "./components/Footer";
import Cta from "./components/Cta";
import Featured from "./components/Featured";
import SearchComponent from "./components/Search";
import Categories from "./components/Categories";
import Nav from "./components/Nav";
import Discover from "./components/Discover";
import { fetchMostSavedAlbums } from "./utils/database";

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

export default function Home() {
  const images = React.useMemo(
    () => [
      "nothingbutthieves_moralpanic_fsei.jpg",
      "kanyewest_mybeautifuldarktwist_ehfh.jpg",
      "kendricklamar_goodkidmaadcity_4zxm.jpg",
      "twentyonepilots_scaledandicy_e2xt.jpg",
      "theweeknd_mydearmelancholy_albq.jpg",
      "tameimpala_currents_857m.jpg",
    ],
    []
  );

  
  const PreloadImages = () => {
    React.useEffect(() => {
      images.forEach((image) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = `/albumcovers/${image}`;
        document.head.appendChild(link);
      });
    }, []);
  
    return null
  };

  const [randomImage, setRandomImage] = React.useState<string>(images[0]);
  const [mostSavedAlbums, setMostSavedAlbums] = React.useState<Album[]>([]);

  React.useEffect(() => {
    const ImageRandomizer = () => {
      const selectedImage = Math.floor(Math.random() * images.length);
      return images[selectedImage];
    };
    setRandomImage(ImageRandomizer());
  }, [images]);

const getMostSavedAlbums = async () => {
  try {
    const collection = await fetchMostSavedAlbums(4);
    setMostSavedAlbums(collection as Album[]);
  } catch (error) {
    console.error('Error fetching most saved albums:', error);
    setMostSavedAlbums([]);
  }
};

  React.useEffect(() => {
    getMostSavedAlbums();
  }, []);

  return (
    <>
      <Nav />
      <PreloadImages />
      <main className={styles.mainContent}>
        <div className={styles.mobile}>
          <h1>Frame The Beat</h1>
          <Image
            src={`/albumcovers/${randomImage}`}
            width={2000}
            height={2000}
            alt="album cover"
            priority
            loading="eager"
          />
        </div>
        <div className={styles.desktop}>
          <h1>Frame The Beat</h1>
          <Image
            src={`/albumcovers/${randomImage}`}
            width={2000}
            height={2000}
            alt="album cover"
            priority
          />
        </div>
      </main>
      <Discover />
      <SearchComponent />
      <Categories />
      <Featured album={mostSavedAlbums} />
      <Cta />
      <Footer />
    </>
  );
}
