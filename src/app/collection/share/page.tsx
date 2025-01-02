"use client";
import React, { useEffect, Suspense, useRef } from "react";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { useSearchParams } from "next/navigation";
import "../styles.scss";
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
}

const fetchUserInfo = async (user_id: string, album: string) => {
  const response = await fetchUserCollection(user_id);
  const data = await response.json();
  const liked = data ? data.find(
    (item: { artist: string; album: string }) => item.album === album
  )
    ? true
    : false : false;
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
      };
      setAlbum(mappedData); setLiked(await fetchUserInfo(session?.user?.id as string, albumQuery));
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
      <main className="mainContent share">
        <section className="shareCard">
          <Image
            src={album.albumCover.src || "/placeholder.png"}
            className="shareCard__image"
            alt={album.album}
            width={300}
            height={300}
            priority
          />
          <header className="shareCard__header">
            <h1>{album.album}</h1>
          </header>
          <main className="shareCard__content">
            <h2 className="shareCard__artist">{album.artist}</h2>
          </main>
          <footer className="shareCard_footer">
            <Share2
              size={24}
              fill="var(--background)"
              onClick={() => onShare(artistQuery, albumQuery)}
            />
            <Heart
              size={24}
              fill={liked ? "var(--theme)" : "var(--background)"}
              onClick={() => onHeart(artistQuery, albumQuery, liked)}
            />
          </footer>
        </section>
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
