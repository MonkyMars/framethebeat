"use client";
import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import { Album } from "@/app/utils/types";
import Footer from "./components/Footer";
import Cta from "./components/Cta";
import Featured from "./components/Featured";
import SearchComponent from "./components/Search";
import Categories from "./components/Categories";
import Nav from "./components/Nav";
import Discover from "./components/Discover";
import { fetchMostSavedAlbums } from "./utils/database";
import { getAlbumData } from "./utils/functions";

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

  const [randomImage, setRandomImage] = React.useState<string>(images[0]);
  const [mostSavedAlbums, setMostSavedAlbums] = React.useState<Album[]>([]);
  const [mostAlbumSaves, setMostAlbumSaves] = React.useState<{ artist: string; album: string; saves: number}[] | null>(null);
  React.useEffect(() => {
    const ImageRandomizer = () => {
      const selectedImage = Math.floor(Math.random() * images.length);
      return images[selectedImage];
    };
    setRandomImage(ImageRandomizer());
  }, [images]);

const getMostSavedAlbums = async () => {
  try {
    const data = await fetchMostSavedAlbums(4);
    if (!data) return;

    const { collection } = await data.json();
    if (!collection || !Array.isArray(collection)) return;
    const mappedData = collection.map((album) => ({
      album: album.album,
      artist: album.artist,
      saves: album.saves,
    }));
    setMostAlbumSaves(mappedData);
    const albumPromises = collection.map(async (album) => {
      const albumDetails = await getAlbumData(album.album, album.artist);
      if (!albumDetails?.[0]) return null;

      return {
        id: albumDetails[0].id,
        title: album.album,
        artist: album.artist,
        release_date: album.release_date,
        category: albumDetails[0].albumCategory,
        albumCover: {
          src: albumDetails[0].albumCover.src || "/placeholder.png",
          alt: `${album.album} by ${album.artist}`,
        },
        saves: album.saves,
      };
    });

    const albums = await Promise.all(albumPromises);
    setMostSavedAlbums(albums.filter((album) => album !== null));
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
      <main className={styles.mainContent}>
        <div className={styles.mobile}>
          <h1>Frame The Beat</h1>
          <Image
            src={`/albumcovers/${randomImage}`}
            width={2000}
            height={2000}
            alt="album cover"
          />
        </div>
        <div className={styles.desktop}>
          <h1>Frame The Beat</h1>
          <Image
            src={`/albumcovers/${randomImage}`}
            width={2000}
            height={2000}
            alt="album cover"
          />
        </div>
      </main>
      <Discover />
      <SearchComponent />
      <Categories />
      <Featured album={mostSavedAlbums} saves={mostAlbumSaves} />
      <Cta />
      <Footer />
    </>
  );
}
