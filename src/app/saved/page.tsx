"use client";
import React, { useState, useEffect, useMemo } from "react";
import Nav from "../components/Nav";
import "./styles.scss";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Heart, Share2 } from "lucide-react";
import { Album } from "../utils/types";
import Footer from "../components/Footer";
import {
  deleteAlbum,
  fetchUserCollection,
  fetchCollection,
} from "../utils/database";
import { useAuth } from "../utils/AuthContext";
import Banner from "../components/Banner";
import SharePopup from "../components/SharePopup";
import {
  getAlbumData,
  isGif,
  isHighPriority,
  knownGenres,
} from "../utils/functions";

const Saved = () => {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const { session } = useAuth();
  const [filterBy, setFilterBy] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [sharePopUp, setSharePopUp] = useState<{
    artist: string;
    album: string;
  } | null>(null);
  const [collectionNames, setCollectionNames] = useState<
    { artist: string; title: string; saves: number; release_date: number }[]
  >([]);
  const [userCollectionNames, setUserCollectionNames] = useState<
    { artist: string; title: string }[]
  >([]);

  useEffect(() => {
    const getCollection = async () => {
      const response = await fetchCollection();
      const { collection } = await response.json();
      const mappedData = collection.map(
        (
          item: {
            artist: string;
            album: string;
            saves: string;
            release_date: number;
          },
          index: number
        ) => ({
          artist: item.artist,
          title: item.album,
          saves: item.saves,
          release_date: item.release_date,
          key: index,
        })
      );
      setCollectionNames(mappedData);
    };

    const getUserCollection = async () => {
      if (!session?.user?.id) {
        return;
      }
      const response = await fetchUserCollection(session.user.id);
      const data = await response.json();
      const mappedData = data.map(
        (item: { artist: string; album: string }) => ({
          artist: item.artist,
          title: item.album,
        })
      );
      setUserCollectionNames(mappedData);
    };

    const fetchData = async () => {
      await Promise.all([getCollection(), getUserCollection()]);
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchSavedAlbums = async (title: string, artist: string) => {
      const fetchedData = await getAlbumData(title, artist);
      if (!fetchedData) return;
      setSavedAlbums((prev) => {
        const newAlbums = fetchedData
          .filter(
            (newAlbum) =>
              !prev.some(
                (existingAlbum) =>
                  existingAlbum.title === newAlbum.albumTitle &&
                  existingAlbum.artist === newAlbum.albumArtist
              )
          )
          .map((albumData) => {
            const matchingCollection = collectionNames.find(
              (item) =>
                item.title.toLowerCase() ===
                  albumData.albumTitle.toLowerCase() &&
                item.artist.toLowerCase() ===
                  albumData.albumArtist.toLowerCase()
            );
            return {
              id: albumData.id,
              title: matchingCollection?.title ?? albumData.albumTitle,
              artist: matchingCollection?.artist ?? albumData.albumArtist,
              release_date: String(
                matchingCollection?.release_date ?? albumData.albumDate
              ),
              category: albumData.albumCategory,
              albumCover: albumData.albumCover,
              saves: matchingCollection?.saves ?? 0,
            };
          });
        return [...prev, ...newAlbums];
      });
    };

    userCollectionNames.forEach((album) => {
      fetchSavedAlbums(album.title, album.artist);
    });
  }, [userCollectionNames, collectionNames, session]);

  interface DeleteResponse {
    message: string;
    status: number;
    response: {
      artist: string;
      album: string;
      user_id: string;
    };
    updateData: {
      album: string;
      artist: string;
      saves: number;
    };
  }

  const handleRemove = async (id: number, artist: string, album: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to remove albums");
      return;
    }
    const originalAlbums = [...savedAlbums];

    try {
      setSavedAlbums((prev) => prev.filter((item) => item.id !== id));
      const response: DeleteResponse = await deleteAlbum(
        artist,
        album,
        session.user.id
      );
      if (response.status === 200) {
        toast.success("Album removed from your collection");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setSavedAlbums(originalAlbums);
      setError(err instanceof Error ? err.message : "Failed to remove album");
      toast.error("Failed to remove album. Please try again.");
    }
  };

  const filteredAlbums = useMemo(() => {
    return savedAlbums
      .filter((album) => {
        if (filterBy === "all" && selectedGenre === "all") return true;
        const matchesYear =
          filterBy === "all" ||
          collectionNames.some(
            (name) =>
              name.title === album.title &&
              name.release_date.toString() === filterBy
          );
        const matchesGenre =
          selectedGenre === "all" ||
          album.category?.toLowerCase() === selectedGenre.toLowerCase();
        return matchesYear && matchesGenre;
      })
      .filter((album) => {
        const searchTerm = searchQuery
          .toLowerCase()
          .replace(".", "")
          .replace(" ", "")
          .trim();
        return (
          album.title
            .toLowerCase()
            .replace(".", "")
            .replace(" ", "")
            .includes(searchTerm) ||
          album.artist
            .toLowerCase()
            .replace(".", "")
            .replace(" ", "")
            .includes(searchTerm) ||
          album.category?.toLowerCase().includes(searchTerm) ||
          album.release_date.toString().includes(searchTerm)
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest" || sortBy === "oldest") {
          const aDate = parseInt(a.release_date?.toString() || "0");
          const bDate = parseInt(b.release_date?.toString() || "0");
          return sortBy === "newest" ? bDate - aDate : aDate - bDate;
        }
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return a.artist.localeCompare(b.artist);
      });
  }, [
    savedAlbums,
    collectionNames,
    filterBy,
    selectedGenre,
    searchQuery,
    sortBy,
  ]);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onShare = (artist: string, album: string) => {
    setSharePopUp({ artist, album });
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            disabled={savedAlbums.length === 0}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
            <option value="artist">By Artist</option>
          </select>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            disabled={savedAlbums.length === 0}
          >
            <option value="all">All Years</option>
            {Array.from(
              new Set(
                savedAlbums
                  .map((album) => album.release_date)
                  .filter((date) => date !== "unknown")
                  .sort((a, b) => parseInt(b || "0") - parseInt(a || "0"))
              )
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            name="genre"
            id="genre"
            onChange={(e) => setSelectedGenre(e.target.value)}
            disabled={savedAlbums.length === 0}
          >
            <option value="all">All Genres</option>
            {knownGenres.map((genre, index) => (
              <option key={`${genre}-${index}`} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
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
            disabled={savedAlbums.length === 0}
          />
        </div>
      </div>

      {filteredAlbums.length > 0 ? (
        <div className="savedGrid">
          {filteredAlbums.map((album, index) => {
            return(
            <SavedCard
              key={index}
              album={album}
              onShare={onShare}
              onRemove={handleRemove}
              saves={
                collectionNames.find((item) => item.title === album.title)
                  ?.saves || 0
              }
              release_date={album.release_date?.toString() || "unknown"}
            />
)})}
        </div>
      ) : (
        <div className="emptyState">
          {session?.user?.id ? (
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
      {sharePopUp && (
        <SharePopup
          artistName={sharePopUp.artist}
          albumName={sharePopUp.album}
          onClose={() => setSharePopUp(null)}
        />
      )}
    </>
  );
};

interface SavedCardProps {
  album: Album;
  onShare: (artist: string, album: string) => void;
  onRemove: (id: number, artist: string, album: string) => void;
  saves: number;
  release_date: string;
}

const SavedCard: React.FC<SavedCardProps> = ({ album, onShare, onRemove, saves, release_date }) => {
  return (
    <div className="savedCard">
      <Image
        src={album.albumCover.src || "/placeholder.png"}
        alt={album.albumCover.alt}
        width={1500}
        height={1500}
        priority={isHighPriority(album.albumCover.src)}
        unoptimized={isGif(album.albumCover.src)}
      />
      <div className="cardContent">
        <h3>{album.title}</h3>
        <p className="artist">{album.artist}</p>
        {release_date !== "unknown" && (
          <p className="date">{release_date}</p>
        )}
        {album.category && (
          <p className="category">
            {album.category.charAt(0).toUpperCase() + album.category.slice(1)}
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
