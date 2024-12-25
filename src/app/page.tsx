import React from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import { Album } from "@/app/utils/types";
import Footer from "./components/Footer";
import Cta from "./components/Cta";
import StartCollection from "./components/StartCollection";
import Featured from "./components/Featured";
import SearchComponent from "./components/Search";
import Categories from "./components/Categories";
import Nav from "./components/Nav";
import Discover from "./components/Discover";
export default function Home() {
  const ImageRandomizer = () => {
    const images = [
      "nothingbutthieves_moralpanic_fsei.jpg",
      "kanyewest_mybeautifuldarktwist_ehfh.jpg",
      "kendricklamar_goodkidmaadcity_4zxm.jpg",
      "twentyonepilots_scaledandicy_e2xt.jpg",
      "theweeknd_mydearmelancholy_albq.jpg",
      "tameimpala_currents_857m.jpg",
    ];
    const selectedImage = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * images.length);
    return images[selectedImage];
  };

  const AlbumCover = (index: number): Album => {
    const albumCovers: Album[] = [
      {
        id: 1,
        title: "Moral Panic",
        artist: "Nothing But Thieves",
        albumCover: {
          src: "nothingbutthieves_moralpanic_fsei.jpg",
          alt: "Moral Panic album cover",
        },
        date: "2020",
      },
      {
        id: 2,
        title: "My Beautiful Dark Twisted Fantasy",
        artist: "Kanye West",
        albumCover: {
          src: "kanyewest_mybeautifuldarktwist_ehfh.jpg",
          alt: "My Beautiful Dark Twisted Fantasy album cover",
        },
        date: "2010",
      },
      {
        id: 3,
        title: "Good Kid, M.A.A.D City",
        artist: "Kendrick Lamar",
        albumCover: {
          src: "kendricklamar_goodkidmaadcity_4zxm.jpg",
          alt: "Good Kid, M.A.A.D City album cover",
        },
        date: "2012",
      },
      {
        id: 4,
        title: "Scaled and Icy",
        artist: "Twenty One Pilots",
        albumCover: {
          src: "twentyonepilots_scaledandicy_e2xt.jpg",
          alt: "Scaled and Icy album cover",
        },
        date: "2021",
      },
    ];
    return albumCovers[index];
  };
  return (
    <>
      <Nav/>
      <main className={styles.mainContent}>
        <div className={styles.mobile}>
          <h1>Frame The Beat</h1>
          <Image
            src={`/albumcovers/${ImageRandomizer()}`}
            width={2000}
            height={2000}
            alt="album cover"
          />
        </div>
        <div className={styles.desktop}>
          <h1>Frame The Beat</h1>
          <Image
            src={`/albumcovers/${ImageRandomizer()}`}
            width={2000}
            height={2000}
            alt="album cover"
          />
        </div>
      </main>
      <Discover/>
      <SearchComponent/>
      <Categories />
      <Featured AlbumCover={AlbumCover} />
      <StartCollection />
      <Cta />
      <Footer/>
    </>
  );
}
