"use client";
import React, { useState, useEffect, useMemo } from "react";
import Nav from "../components/Nav";
//";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Heart, Share2 } from "lucide-react";
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
  const [collection, setCollection] = useState<Album[]>([]);
  
  useEffect(() => {
      const fetchData = async () => {
        if (!session?.user?.id) return;
        const [collectionResp, userResp] = await Promise.all([
          fetchCollection(),
          fetchUserCollection(session.user.id),
        ]);
        const { collection } = await collectionResp.json();
        const userData = await userResp.json();
    
        const mappedCollection = collection.map((item: Album) => ({
          artist: item.artist,
          album: item.album,
          saves: item.saves,
          release_date: item.release_date,
          genre: item.genre,
          albumCover: {
            src: getAlbumData(item.album, item.artist),
            alt: `${item.album} by ${item.artist}`,
          },
        }));
    
        const userCollectionItems = userData.map(
          (item: { artist: string; album: string }) => ({
            artist: item.artist,
            album: item.album,
          })
        );
    
        const userCollectionOnly = mappedCollection.filter((album: Album) =>
          userCollectionItems.some(
            (u: { artist: string; album: string }) => u.artist === album.artist && u.album === album.album
          )
        );
    
        setCollection(mappedCollection);
        setSavedAlbums(userCollectionOnly);
      };
  
      fetchData();
    }, [session]);

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

  const handleRemove = async (artist: string, album: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to remove albums");
      return;
    }
    const originalAlbums = [...savedAlbums];

    try {
      setSavedAlbums((prev) => prev.filter((item) => item.album !== album));
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
        if (!album?.album || !album?.artist) return false;
        if (filterBy === "all" && selectedGenre === "all") return true;

        const matchesYear =
          filterBy === "all" || String(album.release_date) === filterBy;

        const matchesGenre =
          selectedGenre === "all" ||
          (album.genre &&
            album.genre.toLowerCase() === selectedGenre.toLowerCase());

        return matchesYear && matchesGenre;
      })
      .filter((album) => {
        if (!album?.album || !album?.artist) return false;

        const searchTerm = searchQuery
          .toLowerCase()
          .replace(/[. ]/g, "")
          .trim();
        const albumName = album.album.toLowerCase().replace(/[. ]/g, "");
        const artistName = album.artist.toLowerCase().replace(/[. ]/g, "");
        const genreName = album.genre?.toLowerCase() || "";
        const releaseYear = String(album.release_date || "");

        return (
          albumName.includes(searchTerm) ||
          artistName.includes(searchTerm) ||
          genreName.includes(searchTerm) ||
          releaseYear.includes(searchTerm)
        );
      })
      .sort((a, b) => {
        if (!a?.album || !b?.album) return 0;

        if (sortBy === "newest" || sortBy === "oldest") {
          const aDate = Number(a.release_date) || 0;
          const bDate = Number(b.release_date) || 0;
          return sortBy === "newest" ? bDate - aDate : aDate - bDate;
        }

        return sortBy === "title"
          ? a.album.localeCompare(b.album)
          : a.artist.localeCompare(b.artist);
      });
  }, [filterBy, selectedGenre, searchQuery, sortBy, savedAlbums]);
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
                  .filter((date): date is number => date !== undefined && date !== null)
                  .sort((a, b) => parseInt(b.toString() || "0") - parseInt(a.toString() || "0"))
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
                collection.find((item) => item.album === album.album)
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
  onRemove: (artist: string, album: string) => void;
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
        <h3>{album.album}</h3>
        <p className="artist">{album.artist}</p>
        {release_date !== "unknown" && (
          <p className="date">{release_date}</p>
        )}
        {album.genre && (
          <p className="category">
            {album.genre.charAt(0).toUpperCase() + album.genre.slice(1)}
          </p>
        )}
      </div>
      <div className="cardActions">
        <button onClick={() => onShare(album.artist, album.album)}>
          <Share2 size={20} />
        </button>
        <button onClick={() => onRemove(album.artist, album.album)}>
          <Heart size={20} className="heart saves" />
          <span>{saves}</span>
        </button>
      </div>
    </div>
  );
};

export default Saved;
