"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { Album } from "../utils/types";
import "./styles.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Banner from "../components/Banner";
import { fetchCollection, saveAlbum, fetchUserCollection, deleteAlbum } from "../utils/database";
import { useAuth } from "../utils/AuthContext";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface API_RESPONSE {
  album: {
    mbid: string;
    artist: string;
    name: string;
    image: { "#text": string }[];
    wiki?: {
      published: string;
    };
  };
}

const isHighPriority = (src?: string): boolean => {
  if (!src || src.includes("placeholder")) return false;
  const extension = src.split(".").pop()?.toLowerCase();
  return extension !== "gif";
};

const isGif = (src?: string): boolean => {
  const extension = src?.split(".").pop()?.toLowerCase();
  return extension === "gif";
};

const Collection = () => {
  const [collection, setCollection] = useState<Album[]>([]);

  const { session } = useAuth();
  const [collectionNames, setCollectionNames] = useState<
    { artist: string; title: string; saves: number }[]
  >([]);
  const [userCollectionNames, setUserCollectionNames] = useState<
    { artist: string; title: string }[]
  >([]);
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getCollection = async () => {
      const data: { artist: string; album: string; saves: number }[] =
        await fetchCollection();
      const mappedData = data.map((item) => ({
        artist: item.artist,
        title: item.album,
        saves: item.saves,
      }));
      setCollectionNames(mappedData);
    };
    const getUserCollection = async () => {
      if (!session?.user?.id) {
        return;
      }
      const data: { artist: string, album: string }[] = await fetchUserCollection(session.user.id);
      const mappedData = data.map((item) => ({
        artist: item.artist,
        title: item.album,
      }));
      setUserCollectionNames(mappedData);
    }
    getCollection();
    getUserCollection();
  }, [session]);

  useEffect(() => {
    const fetchSavedAlbums = async ({
      title,
      artist,
    }: {
      title: string;
      artist: string;
    }) => {
      try {
        const response = await fetch(
          `${API_URL}/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(
            artist
          )}&album=${encodeURIComponent(title)}&format=json`
        );
        const data = await response.json();
        const { album: model } = data as API_RESPONSE;
        if (!model) {
          return;
        }
        const albumData = {
          id: parseInt(model.mbid),
          albumArtist: model.artist,
          albumTitle: model.name,
          albumCover: {
            src: model.image[3]["#text"].replace("http:", "https:"),
            alt: `${model.name} album cover`,
          },
          albumDate:
            model.wiki?.published?.split(" ")[2].trim().slice(0, 4) ||
            "unknown",
        };
        const returnData: Album[] = [
          {
            id: albumData.id,
            title: albumData.albumTitle,
            artist: albumData.albumArtist,
            date: albumData.albumDate,
            albumCover: {
              src: albumData.albumCover.src,
              alt: albumData.albumCover.alt,
            },
          },
        ];
        setCollection((prev) => {
          const newAlbums = returnData.filter(
            (newAlbum) =>
              !prev.some(
                (existingAlbum) =>
                  existingAlbum.title === newAlbum.title &&
                  existingAlbum.artist === newAlbum.artist
              )
          );
          return [...prev, ...newAlbums];
        });
      } catch (error) {
        console.error(
          `Error fetching album data for ${title} by ${artist}:`,
          error
        );
        setError(`error: ${error}`);
      }
    };
    collectionNames?.map((album) => {
      fetchSavedAlbums({
        title: album.title,
        artist: album.artist,
      });
    });
  }, [collectionNames]);

  const onSave = async (
    e: React.MouseEvent<SVGSVGElement>,
    artist: string,
    album: string,
  ) => {
    if (!session?.user?.id) {
      showBanner("You must be logged in order to save albums", "error", "error");
      return;
    }
    (e.target as SVGElement).style.fill = "var(--theme)";
    const newLikesCount = (collectionNames?.find(
      (item) => item.title === album
    )?.saves ?? 0) + 1;
    setCollectionNames((prev) => {
      const updatedCollection = prev.map((item) => {
        if (item.title === album) {
          return { ...item, saves: newLikesCount };
        }
        return item;
      });
      return updatedCollection;
    });
    setUserCollectionNames((prev) => {
      const updatedCollection = [...prev, { artist, title: album }];
      return updatedCollection;
    });
    showBanner(album, "success", "save");
    const response = await saveAlbum(artist, album, session?.user?.id);
    if (response.status !== 200) {
      setError(response.message);
    }
  };

  const onDelete = async (e: React.MouseEvent<SVGSVGElement>, artist: string, album: string) => {
    if (!session?.user?.id) {
      showBanner("You must be logged in order to save albums", "error", "error");
      return;
    }
    (e.target as SVGElement).style.fill = "var(--background)";
    const newLikesCount = (collectionNames?.find(
      (item) => item.title === album
    )?.saves ?? 0) - 1;
    setCollectionNames((prev) => {
      const updatedCollection = prev.map((item) => {
        if (item.title === album) {
          return { ...item, saves: newLikesCount };
        }
        return item;
      });
      return updatedCollection;
    });
    setUserCollectionNames((prev) => {
      const updatedCollection = prev.filter((item) => item.title !== album);
      return updatedCollection;
    });
    showBanner(album, "success", "delete");
    const response = await deleteAlbum(artist, album, session?.user?.id);
    if (response.status !== 200) {
      setError(response.message);
    }
  }

  const showBanner = (albumTitle: string, status: string, action: string): void => {
    if (status === "error") {
      setTitle(albumTitle);
    }
    if (status === "success" && action === "delete") {
      setTitle(`${albumTitle} has been successfully deleted.`);
    } else if (status === "success" && action === "save") {
      setTitle(`${albumTitle} has been successfully saved.`);
    }
    setTimeout(() => {
      setTitle("");
    }, 3000);
  };
  if (!collectionNames || !collection) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Nav />
      <main className="mainContent">
        <div className="header">
          <h2>Our Collection</h2>
          <p>Here are all the albums we&apos;ve saved.</p>
        </div>
        <div className="collectionGrid">
          {collection.length > 0 ? (
            collection.map((album, index) => (
              <CollectionCard
                key={index}
                {...album}
                onHeartClick={(e) => userCollectionNames.find((item) => item.title === album.title) ? onDelete(e, album.artist, album.title) : onSave(e, album.artist, album.title)}
                saves={
                  collectionNames.find((item) => item.title === album.title)
                    ?.saves || 0
                }
                saved={userCollectionNames.find((item) => item.title === album.title) ? true : false}
              />
            ))
          ) : (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your collection...</p>
            </div>
          )}
        </div>
      </main>
      {error && <Banner title="Error" subtitle={error} />}
      {title && (
        <Banner
          title={title}
          subtitle={title}
        />
      )}
      <Footer />
    </>
  );
};

type CollectionCardProps = Album & {
  onHeartClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  saves: number;
  saved: boolean;
};

const CollectionCard = ({
  id,
  title,
  date,
  albumCover,
  artist,
  onHeartClick,
  saves,
  saved = false,
}: CollectionCardProps) => (
  <div className="collectionCard" key={id}>
    <div className="albumImage">
      <Image
        src={albumCover.src || "/placeholder.png"}
        alt={albumCover.alt || "Album cover"}
        width={1500}
        height={1500}
        priority={isHighPriority(albumCover.src)}
        unoptimized={isGif(albumCover.src)}
      />
    </div>
    <div className="albumInfo">
      <h3>{title}</h3>
      <p className="artist">{artist}</p>
      <p className="date">{date}</p>
    </div>
    <div className="albumActions">
      <Heart size={24} onClick={(e) => onHeartClick(e)} style={{fill: saved ? 'var(--theme)' : 'var(--background)'}}/>
      <span>{saves}</span>
    </div>
  </div>
);

export default Collection;
