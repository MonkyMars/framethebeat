"use client"
import React from "react";
import Image from "next/image";
import SearchComponent from "./components/Search";
import Categories from "./components/Categories";
import Nav from "./components/Nav";
import Discover from "./components/Discover";
import Cta from "./components/Cta";
import Footer from "./components/Footer";
import Featured from "./components/Featured";
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
  const [mostSavedAlbums, setMostSavedAlbums] = React.useState<Album[]>([]);

  const getMostSavedAlbums = async () => {
    try {
      const collection = await fetchMostSavedAlbums(4);
      setMostSavedAlbums(collection as Album[]);
    } catch (error) {
      console.error("Error fetching most saved albums:", error);
      setMostSavedAlbums([]);
    }
  };

  React.useEffect(() => {
    getMostSavedAlbums();
  }, []);

  return (
    <>
    {/* <Head>
      <link
        rel="canonical"
        href="https://framethebeat.com"
      />
    </Head> */}
      <Nav />
      <main className="mainContent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="desktop flex flex-col items-center justify-center gap-8 py-12">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-theme to-theme/20 text-center">
        Frame The Beat
          </h1>
          <Image
        src={`/albumcovers/nothingbutthieves_moralpanic_fsei.jpg`}
        width={2000}
        height={2000}
        alt="album cover"
        priority
        className="w-full max-w-[600px] aspect-square object-contain rounded-md transition-all duration-300 hover:shadow-xl hover:shadow-theme-dark hover:scale-102"
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
