"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { Album } from "../utils/types";
import "./styles.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Banner from "../components/Banner";
import { fetchCollection } from "../utils/database";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface API_RESPONSE {
  album: {
    artist: string;
    name: string;
    image: { "#text": string }[];
    wiki?: {
      published: string;
    };
  };
}

const Collection = () => {
  const [collection, setCollection] = useState<Album[]>([]);
  const [collectionNames, setCollectionNames] = useState<{artist: string; title: string}[]>([]);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const getCollection = async () => {
      const data: {artist: string; album: string}[] = await fetchCollection();
      const mappedData = data.map(item => ({
        artist: item.artist,
        title: item.album
      }));
      setCollectionNames(mappedData);
    };
    getCollection();
  }, []);

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
          const albumData = {
            albumArtist: model.artist,
            albumTitle: model.name,
            albumCover: {
              src: model.image[3]["#text"],
              alt: `${model.name} album cover`,
            },
            albumDate:
              model.wiki?.published?.split(" ")[2].trim().slice(0, 4) || "unknown",
          };
          const returnData: Album[] = [
            {
              id: Math.floor(Math.random() * 1000),
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
          console.error(`Error fetching album data for ${title} by ${artist}:`, error);
        }
      };
      collectionNames?.map((album) => {
        fetchSavedAlbums({
          title: album.title,
          artist: album.artist,
        });
      });
    }, [collectionNames]);

  const showBanner = (albumTitle: string): void => {
    setTitle(`${albumTitle} has been successfully saved.`);
    setTimeout(() => {
      setTitle("");
    }, 3000);
  };

  return (
    <>
      <Nav />
      <main className="mainContent">
        <div className="header">
          <h2>Our Collection</h2>
          <p>Here are all the albums we&apos;ve saved.</p>
        </div>
        {title && <Banner title="Successfully saved" subtitle={title} />}
        <div className="collectionGrid">
          {collection.map((album) => (
            <CollectionCard
              key={album.id}
              {...album}
              onHeartClick={showBanner}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

type CollectionCardProps = Album & {
  onHeartClick: (albumTitle: string) => void;
};

const CollectionCard = ({
  id,
  title,
  date,
  albumCover,
  artist,
  onHeartClick,
}: CollectionCardProps) => (
  <div className="collectionCard" key={id}>
    <div className="albumImage">
      <Image
        src={albumCover.src}
        alt={albumCover.alt}
        width={1500}
        height={1500}
      />
    </div>
    <div className="albumInfo">
      <h3>{title}</h3>
      <p className="artist">{artist}</p>
      <p className="date">{date}</p>
    </div>
    <div className="albumActions">
      <Heart size={24} onClick={() => onHeartClick(title)} />
      <span>{2}</span>
    </div>
  </div>
);

export default Collection;
