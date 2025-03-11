"use client";
import React, { useEffect, Suspense, useRef } from "react";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/app/utils/AuthContext";
import {
  deleteAlbum,
  fetchAlbum,
  fetchUserCollection,
  saveAlbum,
} from "@/app/utils/database";
import Banner from "@/app/components/Banner";
import SharePopup from "@/app/components/SharePopup";
import { getAlbumData } from "@/app/utils/functions";

interface Album {
  artist: string;
  album: string;
  release_date: number;
  genre: string;
  albumCover: {
    src: string;
    alt: string;
  };
  tracklist?: {
    track: {
      name: string;
      duration: string;
    }[]
  }[];
  saves?: number;
}

const fetchUserInfo = async (user_id: string, album: string) => {
  const response = await fetchUserCollection(user_id);
  const data = await response.json();
  const liked = data
    ? data.find(
        (item: { artist: string; album: string }) => item.album === album
      )
      ? true
      : false
    : false;
  return liked;
};

const SharePageContent = () => {
  const searchParams = useSearchParams();
  const artistQuery = searchParams.get("artist");
  const albumQuery = searchParams.get("album");
  const [album, setAlbum] = React.useState<Album | null>(null);
  const [liked, setLiked] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const fetchedOnce = useRef(false);
  const { session } = useAuth();
  const [sharePopUp, setSharePopUp] = React.useState<{
    artist: string;
    album: string;
  } | null>(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  useEffect(() => {
    if (!artistQuery || !albumQuery) return;
    if (fetchedOnce.current) return;
    const fetchData = async () => {
      const item = await fetchAlbum(artistQuery, albumQuery);
      const mappedData = {
        artist: item.artist,
        album: item.album,
        release_date: item.release_date,
        genre: item.genre,
        albumCover: {
          src: getAlbumData(item.album, item.artist),
          alt: item.album,
        },
        tracklist: item.tracklist || [],
        saves: item.saves || 0
      };
      setAlbum(mappedData);
      setLiked(await fetchUserInfo(session?.user?.id as string, albumQuery));
    };

    fetchData();
  }, [artistQuery, albumQuery, session]);

  if (!artistQuery || !albumQuery) {
    return <div>No query params</div>;
  }
  if (!album) {
    return null;
  }
  const onHeart = async (artist: string, album: string, liked: boolean) => {
    if (!session?.user?.id) {
      setError("You must be logged in to like an album.");
      return;
    }
    setLiked(!liked);
    const user_id = session?.user?.id;
    const response: { status: number; message: string } = liked
      ? await deleteAlbum(artist, album, user_id)
      : await saveAlbum(artist, album, user_id);
    if (response.status !== 200) {
      setError(response.message);
    }
  };

  const onShare = (artist: string, album: string) => {
    setSharePopUp({
      artist: artist,
      album: album,
    });
  };

  return (
    <>
      <Nav />
      <main className="flex justify-center items-center w-screen h-screen p-8">
        <div className="flex flex-col items-center gap-4 p-8 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out w-[600px]">
          <div className="w-full aspect-square relative">
            <Image
              src={album.albumCover.src || "/placeholder.png"}
              alt={album.albumCover.alt || "Album cover"}
              layout="fill"
              objectFit="cover"
              priority={true}
              unoptimized={true}
              className="rounded-lg hover:shadow-sm transition-all duration-300 ease-in-out brightness-105 w-full h-full"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-xl font-bold text-center tracking-wide hover:text-[var(--theme)] transition-colors duration-300">
              {album.album}
            </h3>
            <p className="text-lg text-[rgba(var(--theme-rgb),0.7)]">
              {album.artist}
            </p>
            {album.release_date && (
              <p className="text-sm text-[rgba(var(--foreground-rgb),0.7)]">
                {album.release_date}
              </p>
            )}
            {album.genre && album.genre.toLowerCase() !== "unknown" && (
              <p className="font-extrabold text-xs tracking-wider text-[rgba(var(--foreground-rgb),0.9)] uppercase bg-[rgba(var(--theme-rgb),0.15)] px-3 py-1.5 rounded-full border border-[rgba(var(--theme-rgb),0.2)] backdrop-blur-sm transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.25)]">
                {album.genre.charAt(0).toUpperCase() + album.genre.slice(1)}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 w-full px-4"></div>
          <button className="p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out text-theme flex items-center justify-center">
            <Share2
              size={24}
              onClick={() => onShare(album.artist, album.album)}
            />
          </button>
          <button className="flex items-center gap-2 p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
            <Heart
              size={24}
              onClick={() => onHeart(album.artist, album.album, liked)}
              className={`cursor-pointer text-theme ${
                liked ? "fill-theme" : ""
              }`}
            />
          </button>
        </div>

        {error && <Banner title="Error" subtitle={error} />}
        {sharePopUp && (
          <SharePopup
            artistName={sharePopUp.artist}
            albumName={sharePopUp.album}
            onClose={() => setSharePopUp(null)}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

const SharePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SharePageContent />
    </Suspense>
  );
};

export default SharePage;
