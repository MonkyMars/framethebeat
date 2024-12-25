"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { Album } from "../utils/types";
import "./styles.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Banner from "../components/Banner";

const Collection = () => {
  const [collection, setCollection] = useState<Album[]>([]);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch("/api/collection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
          return;
        }
        setCollection(data);
      } catch (error) {
        console.error(error);
        const props: Album = {
          id: 1,
          title: "Moral Panic",
          date: "2020",
          albumCover: {
            src: "/albumcovers/nothingbutthieves_moralpanic_fsei.jpg",
            alt: "Moral Panic album cover",
          },
          artist: "Nothing But Thieves",
        };
        setCollection([props]);
      }
    };
    fetchCollection();
  }, []);

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
