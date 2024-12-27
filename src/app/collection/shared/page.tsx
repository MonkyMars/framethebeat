"use client";
import React, { useEffect } from "react";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { useSearchParams } from "next/navigation";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import "../styles.scss";
import { useAuth } from "@/app/utils/AuthContext";
import { fetchUserCollection } from "@/app/utils/database";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Album {
  album: {
    mbid: string;
    artist: string;
    name: string;
    image: { src: string | StaticImport; alt: string };
    wiki?: {
      published: string;
    };
  };
}

async function fetchAlbum(
  artistQuery: string,
  albumQuery: string
): Promise<Album["album"] | null | { message: string }> {
  try {
    const res = await fetch(
      `${API_URL}/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(
        artistQuery
      )}&album=${encodeURIComponent(albumQuery)}&format=json`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.album) {
      return null;
    }
    const albumData: Album["album"] = {
      mbid: data.album.mbid,
      artist: data.album.artist,
      name: data.album.name,
      image: {
        src: data.album.image[4]["#text"].replace("http:", "https:"),
        alt: `${data.album.name} album cover`,
      },
      wiki: {
        published:
          data.album.wiki?.published?.split(" ")[2].trim().slice(0, 4) ||
          "unknown",
      },
    };
    return (albumData as Album["album"]) || { message: "Album not found." };
  } catch (error) {
    console.error("Error fetching album data:", error);
    return {
      message: "Error fetching album data. Please try again later.",
    } as { message: string };
  }
}

const fetchUserInfo = async (user_id: string, album: string) => {
  const data = await fetchUserCollection(user_id);
  const liked = data.find((item: {artist: string; album: string}) => item.album === album) ? true : false;
  return liked;
};


export default function SharePage() {
  const searchParams = useSearchParams();
  const artistQuery = searchParams.get("artist");
  const albumQuery = searchParams.get("album");
  const [album, setAlbum] = React.useState<Album["album"] | null>(null);
  const [liked, setLiked] = React.useState<boolean>(false);
  const { session } = useAuth();

  useEffect(() => {
    if (!artistQuery || !albumQuery) return;
    const fetchAlbumFunc = async () => {
      if (!artistQuery || !albumQuery) return;
      const album = await fetchAlbum(artistQuery, albumQuery);
      if (!album) return;

      setAlbum(album as Album["album"]);
    };
    const fetchUserInfoFunc = async () => {
      if (!session || !artistQuery || !albumQuery) return;
      const user_id = session.user.id;
      setLiked(await fetchUserInfo(user_id, albumQuery));
    }
    fetchAlbumFunc();
    fetchUserInfoFunc();
  }, [artistQuery, albumQuery, session]);

  if (!artistQuery || !albumQuery) {
    return <div>No query params</div>;
  }
  if (!album) {
    return null;
  }

  return (
    <>
      <Nav />
      <main className="mainContent share">
        <section className="shareCard">
          <Image
            src={album.image.src || "/placeholder.png"}
            className="shareCard__image"
            alt={album.name}
            width={300}
            height={300}
            priority
          />
          <header className="shareCard__header">
            <h1>{album.name}</h1>
          </header>
          <main className="shareCard__content">
            <h2 className="shareCard__artist">{album.artist}</h2>
            {album.wiki && <p>Released: {album.wiki.published}</p>}
          </main>
          <footer className="shareCard_footer">
            <Share2 size={24} fill="var(--background)" />
            <Heart size={24} fill={liked ? "var(--theme)" : 'var(--background)'} />
          </footer>
        </section>
      </main>
      <Footer />
    </>
  );
}
