"use client";
import React, { useState, useEffect } from "react";
import Nav from "../components/Nav";
import "./styles.scss";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import { Album } from "../utils/types";
import Footer from "../components/Footer";
import { fetchUserCollection } from "../utils/database";

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

// const dummyData: {
//   title: string;
//   artist: string;
// }[] = [
//   {
//     title: "Moral Panic",
//     artist: "Nothing But Thieves",
//   },
//   {
//     title: "The Slow Rush",
//     artist: "Tame Impala",
//   },
//   {
//     title: "A 20 Something Fuck",
//     artist: "Two Feet",
//   },
//   {
//     title: "After Hours",
//     artist: "The Weeknd",
//   },
//   {
//     title: "Fine Line",
//     artist: "Harry Styles",
//   },
//   {
//     title: "Fetch the Bolt Cutters",
//     artist: "Fiona Apple",
//   },
//   {
//     title: "RTJ4",
//     artist: "Run the Jewels",
//   },
// ];

const Saved = () => {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionNames, setCollectionNames] = useState<{artist: string; title: string; saves: number}[]>([]);
   useEffect(() => {
      const getCollection = async () => {
        const data: {artist: string; album: string, saves: number}[] = await fetchUserCollection(1);
        const mappedData = data.map(item => ({
          artist: item.artist,
          title: item.album,
          saves: item.saves
        }));
        console.log(data);
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
            id: Math.floor(Math.random() * 10000),
            title: albumData.albumTitle,
            artist: albumData.albumArtist,
            date: albumData.albumDate,
            albumCover: {
              src: albumData.albumCover.src,
              alt: albumData.albumCover.alt,
            },
          },
        ];
        setSavedAlbums((prev) => {
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
    collectionNames.map((album) => {
      fetchSavedAlbums({
        title: album.title,
        artist: album.artist,
      });
    });
  }, [collectionNames]);

  const handleRemove = (id: number) => {
    setSavedAlbums(savedAlbums.filter((album) => album.id !== id));
  };

  const handleShare = (album: Album) => {
    console.log("Sharing", album.title);
  };

  const filteredAlbums = savedAlbums
    .filter((album) => {
      if (filterBy === "all") return true;
      return album.date === filterBy;
    })
    .filter(
      (album) =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return parseInt(b.date || "0") - parseInt(a.date || "0");
      if (sortBy === "oldest") return parseInt(a.date || "0") - parseInt(b.date || "0");
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return a.artist.localeCompare(b.artist);
    });

  return (
    <>
      <Nav />
      <header className="header">
        <h2>Album covers you saved!</h2>
        <p>Here you&apos;ll find the collection of your favorite album covers.</p>
      </header>

      <div className="controlBar">
        <div className="filters">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
            <option value="artist">By Artist</option>
          </select>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Years</option>
          {Array.from(
            new Set(
              savedAlbums
                .map((album) => album.date)
                .filter((date) => date !== "unknown")
                .sort((a, b) => parseInt(b || '0') - parseInt(a || '0'))
            )
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
          </select>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search saved albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredAlbums.length > 0 ? (
        <div className="savedGrid">
          {filteredAlbums.map((album, index) => (
            <div key={album.id || index} className="savedCard">
              <Image
                src={album.albumCover.src}
                alt={album.albumCover.alt}
                width={300}
                height={300}
              />
              <div className="cardContent">
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <p>{album.date}</p>
              </div>
              <div className="cardActions">
                <button onClick={() => handleShare(album)}>
                  <Share2 size={20} />
                </button>
                <button onClick={() => handleRemove(album.id)}>
                  <Heart size={20} className="heart" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <h3>No saved albums yet</h3>
          <p>Start building your collection by saving some album covers!</p>
          <button onClick={() => (window.location.href = "/collection")}>
            Explore Collection
          </button>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Saved;
