"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Nav from "../components/Nav";
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
          (u: { artist: string; album: string }) =>
            u.artist === album.artist && u.album === album.album
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
      <header className="flex flex-col items-center py-12 px-8 text-center">
        <h2 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground mb-2 shadow-[0_0_15px_rgba(255,255,255,0.6),0_0_25px_rgba(255,255,255,0.4),0_0_35px_rgba(var(--theme-rgb),0.3)]">
          Album covers you saved!
        </h2>
        <p className="text-[clamp(0.9rem,2vw,1.2rem)] text-[rgba(var(--foreground-rgb),0.5)] max-w-[600px]">
          Here you&apos;ll find the collection of your favorite album covers.
        </p>
      </header>

      <div className="flex justify-between items-center p-4 mx-8 mb-8 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-lg rounded-xl border border-[rgba(var(--theme-rgb),0.2)] md:flex-row flex-col gap-4">
        <div className="flex gap-4 md:flex-row flex-col w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            disabled={savedAlbums.length === 0}
            className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
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
            className="filterSelect"
          >
            <option value="all">All Years</option>
            {Array.from(
              new Set(
                savedAlbums
                  .map((album) => album.release_date)
                  .filter(
                    (date): date is number => date !== undefined && date !== null
                  )
                  .sort(
                    (a, b) =>
                      parseInt(b.toString() || "0") -
                      parseInt(a.toString() || "0")
                  )
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
            className="filterSelect"
          >
            <option value="all">All Genres</option>
            {knownGenres.map((genre, index) => (
              <option key={`${genre}-${index}`} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search saved albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={savedAlbums.length === 0}
            className="filterSelect"
          />
        </div>
      </div>

      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 px-8 pb-8">
          {filteredAlbums.map((album, index) => (
            <SavedCard
              key={index}
              album={album}
              onShare={onShare}
              onRemove={handleRemove}
              saves={
                collection.find((item) => item.album === album.album)?.saves ||
                0
              }
              release_date={album.release_date?.toString() || "unknown"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-8 text-foreground/70">
          {session?.user?.id ? (
            <>
              <h3 className="text-xl mb-4">No saved albums yet</h3>
              <p className="text-base mb-8">
                Start building your collection by saving some album covers!
              </p>
              <button
                onClick={() => (window.location.href = "/collection")}
                className="px-6 py-3 rounded-lg bg-gradient-to-br from-theme to-theme/80 text-foreground text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme/30"
              >
                Explore Collection
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl mb-4">Not logged in yet</h3>
              <p className="text-base mb-8">
                Log in to start building your collection by saving some album
                covers!
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-6 py-3 rounded-lg bg-gradient-to-br from-theme to-theme/80 text-foreground text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme/30"
              >
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

const SavedCard: React.FC<SavedCardProps> = ({
  album,
  onShare,
  onRemove,
  saves,
  release_date,
}) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = album.albumCover?.src && !imageError 
    ? album.albumCover.src 
    : "/placeholder.png";

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
      <div className="w-full aspect-square relative">
        <Image
          src={imageUrl}
          alt={album.albumCover?.alt || "Album cover"}
          layout="fill"
          objectFit="cover"
          priority={isHighPriority(imageUrl)}
          unoptimized={true}
          onError={() => setImageError(true)}
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
        {release_date && release_date !== "unknown" && (
          <p className="text-sm text-[rgba(var(--foreground-rgb),0.7)]">
            {release_date}
          </p>
        )}
        {album.genre && album.genre.toLowerCase() !== "unknown" && (
          <p className="font-extrabold text-xs tracking-wider text-[rgba(var(--foreground-rgb),0.9)] uppercase bg-[rgba(var(--theme-rgb),0.15)] px-3 py-1.5 rounded-full border border-[rgba(var(--theme-rgb),0.2)] backdrop-blur-sm transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.25)]">
            {album.genre.charAt(0).toUpperCase() + album.genre.slice(1)}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 w-full px-4">
        <button className="p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out text-theme flex items-center justify-center">
          <Share2 size={24} onClick={() => onShare(album.artist, album.album)} />
        </button>
        <button className="flex items-center gap-2 p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
          <Heart
            size={24}
            onClick={() => onRemove(album.artist, album.album)}
            className="cursor-pointer text-theme fill-theme"
          />
          <span>{saves}</span>
        </button>
      </div>
    </div>
  );
};

const SavedWrapped = dynamic(() => Promise.resolve(Saved), { ssr: false });

export default SavedWrapped;