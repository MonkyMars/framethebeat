"use client";
import React, { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav";
import "./styles.scss";
import Image from "next/image";
import { Heart, Share2 } from "lucide-react";
import { Album } from "../utils/types";
import Footer from "../components/Footer";
import { deleteAlbum, fetchUserCollection, fetchCollection } from "../utils/database";
import { useAuth } from "../utils/AuthContext";
import Banner from "../components/Banner";
import SharePopup from "../components/SharePopup";
import { getAlbumData, isGif, isHighPriority } from "../utils/functions";

const Saved = () => {
  const fetchedOnce = useRef(false);
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const { session, loading } = useAuth();
  const [filterBy, setFilterBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [sharePopUp, setSharePopUp] = React.useState<{ artist: string; album: string } | null>(null);
  const [collectionNames, setCollectionNames] = useState<
  { artist: string; title: string; saves: number }[]
>([]);
const [userCollectionNames, setUserCollectionNames] = useState<
  { artist: string; title: string }[]
>([]);
  useEffect(() => {
    if (loading) return;

    if (!session) {
      return;
    }

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
          const data: { artist: string; album: string }[] =
            await fetchUserCollection(session.user.id);
          const mappedData = data.map((item) => ({
            artist: item.artist,
            title: item.album,
          }));
          setUserCollectionNames(mappedData);
        };
        if (!fetchedOnce.current) {
          fetchedOnce.current = true;
          getCollection();
          getUserCollection();
        }
  }, [session, loading]);

  useEffect(() => {
    const fetchSavedAlbums = async ({
      title,
      artist,
    }: {
      title: string;
      artist: string;
    }) => {
      const fetchedData = await getAlbumData(title, artist);
      if (!fetchedData) return; 
      setSavedAlbums((prev) => {
          const newAlbums = fetchedData.filter(
            (newAlbum) =>
              !prev.some(
                (existingAlbum) =>
                  existingAlbum.title === newAlbum.albumTitle &&
                  existingAlbum.artist === newAlbum.albumArtist
              )
          ).map(album => ({
            id: album.id,
            title: album.albumTitle,
            artist: album.albumArtist,
            date: album.albumDate,
            category: album.albumCategory,
            albumCover: album.albumCover
          }));
          return [...prev, ...newAlbums];
        });
    };
    userCollectionNames.map((album) => {
      fetchSavedAlbums({
        title: album.title,
        artist: album.artist,
      });
    });
  }, [userCollectionNames]);

  const handleRemove = async (id: number, artist: string, album: string) => {
    if (!session?.user.id) return;
    setSavedAlbums(savedAlbums.filter((album) => album.id !== id));
    const response: {status: number; message: string} = await deleteAlbum(artist, album, session?.user.id);
    if (response.status !== 200) {
      setError(response.message);
    }
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
      if (sortBy === "newest")
        return parseInt(b.date || "0") - parseInt(a.date || "0");
      if (sortBy === "oldest")
        return parseInt(a.date || "0") - parseInt(b.date || "0");
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return a.artist.localeCompare(b.artist);
    });

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  const onShare = (artist: string, album: string) => {
    setSharePopUp({
      artist: artist,
      album: album,
    })
  };

  return (
    <>
      <Nav />
      <header className="header">
        <h2>Album covers you saved!</h2>
        <p>
          Here you&apos;ll find the collection of your favorite album covers.
        </p>
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
                  .sort((a, b) => parseInt(b || "0") - parseInt(a || "0"))
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
            <SavedCard
              key={index}
              album={album}
              onShare={onShare}
              onRemove={handleRemove}
              saves={
                collectionNames.find((item) => item.title === album.title)
                  ?.saves || 0
              }
            />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          {session?.user.id ? (
            <>
              <h3>No saved albums yet</h3>
              <p>Start building your collection by saving some album covers!</p>
              <button onClick={() => (window.location.href = "/collection")}>
                Explore Collection
              </button>
            </>
          ) : (
            <>
              <h3>Not logged in yet</h3>
              <p>
                Log in to start building your collection by saving some album
                covers!
              </p>
              <button onClick={() => (window.location.href = "/login")}>
                Log in!
              </button>
            </>
          )}
        </div>
      )}
      <Footer />
      {error && <Banner title="Error" subtitle={error} />}
      {sharePopUp && <SharePopup artistName={sharePopUp.artist} albumName={sharePopUp.album} onClose={() => setSharePopUp(null)}/>}
    </>
  );
};

interface savedCardProps {
  album: Album;
  onShare: (artist: string, album: string) => void;
  onRemove: (id: number, artist: string, album: string) => void;
  saves?: number;
}

const SavedCard: React.FC<savedCardProps> = ({ album, onShare, onRemove, saves }) => {
  return (
    <div className="savedCard">
      <Image
        src={album.albumCover.src}
        alt={album.albumCover.alt}
        width={1500}
        height={1500}
        priority={isHighPriority(album.albumCover.src)}
        unoptimized={isGif(album.albumCover.src)}

      />
      <div className="cardContent">
        <h3>{album.title}</h3>
        <p className="artist">{album.artist}</p>
        {album.date !== "unknown" && <p className="date">{album.date}</p>}
      {album.category && (
        <p className="category">
          {album.category.charAt(0).toLocaleUpperCase() + album.category.slice(1)}
        </p>
      )}
      </div>
      <div className="cardActions">
        <button onClick={() => onShare(album.artist, album.title)}>
          <Share2 size={20} />
        </button>
        <button onClick={() => onRemove(album.id, album.artist, album.title)}>
          <Heart size={20} className="heart saves" />
          <span>{saves}</span>
        </button>
      </div>
    </div>
  );
};

export default Saved;
