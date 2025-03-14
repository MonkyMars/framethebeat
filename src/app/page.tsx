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
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const [cover, setCover] = React.useState<"pink" | "dawnfm">("pink");
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
    switch(theme) {
      case "pink":
        setCover("pink");
        break;
      case "dawnfm":
        setCover("dawnfm");
        break;
      default:
        setCover("pink");
    }
  }, [theme]);

  return (
    <>
      <Nav />
      <main className="mainContent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="main-content" role="main" aria-labelledby="main-heading">
        <div className="desktop flex flex-col items-center justify-center gap-8 py-12">
          <h1 id="main-heading" className="text-[clamp(2.5rem,8vw,5rem)] font-black uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-theme to-theme/20 text-center">
            Frame The Beat
          </h1>
          <figure aria-labelledby="featured-album-caption" className="w-full max-w-[600px] aspect-square relative">
            <div className="w-full h-full bg-[rgba(var(--theme-rgb),0.1)] rounded-md absolute top-0 left-0"></div>
            <Image
              src={`/albumcovers/${cover}.webp`}
              width={600}
              height={600}
              alt={`Album Cover: ${cover}`}
              priority
              className="w-full p-1 h-full object-contain rounded-md transition-all duration-300 hover:shadow-xl hover:shadow-theme-dark hover:scale-102"
              sizes="(max-width: 768px) 100vw, 600px"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDIwOSwxMjYsNTksMC4xKSIvPjwvc3ZnPg=="
            />
            <figcaption id="featured-album-caption" className="sr-only">Featured album: Nothing But Thieves - Moral Panic</figcaption>
          </figure>
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
