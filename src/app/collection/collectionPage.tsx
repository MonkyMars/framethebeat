"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Image from "next/image";
import { useEffect, useState, Suspense, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Share2, X } from "lucide-react";
import Banner from "../components/Banner";
import {
  getAlbumData,
  isHighPriority,
  knownGenres,
} from "../utils/functions";
import SharePopup from "../components/SharePopup";
import Link from "next/link";
import {
  fetchCollection,
  saveAlbum,
  fetchUserCollection,
  deleteAlbum,
  verifyAlbumDeleted,
} from "../utils/database";
import { useAuth } from "../utils/AuthContext";

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

const Collection = () => {
  const searchParams = useSearchParams();
  const [sharePopUp, setSharePopUp] = useState<{
    artist: string;
    album: string;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<Album[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const { session } = useAuth();
  const [userCollectionNames, setUserCollectionNames] = useState<
    { artist: string; title: string }[]
  >([]);
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(50);
  const [displayedAlbums, setDisplayedAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const getCollection = async () => {
      const response = await fetchCollection();
      const { collection } = await response.json();
      const mappedData = collection.map((item: Album) => {
        if (!item?.artist || !item?.album) {
          console.error('Invalid album data:', item);
          return null;
        }
        return{
        artist: item.artist,
        album: item.album,
        saves: item.saves,
        release_date: item.release_date,
        genre: item.genre,
        albumCover: {
          src: getAlbumData(item.album, item.artist),
          alt: `${item.album} by ${item.artist}`,
        },
      };
      }).filter(Boolean)
      setCollection(mappedData);
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
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  interface SaveResponse {
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

  const onSave = async (
    e: React.MouseEvent<SVGSVGElement>,
    artist: string,
    album: string
  ) => {
    if (!session?.user?.id) {
      showBanner("You must be logged in to save albums", "error", "error");
      return;
    }

    // Store original states for rollback
    const originalCollection = [...collection];
    const originalUserCollection = [...userCollectionNames];
    const originalFillColor = (e.target as SVGElement).style.fill;

    try {
      // Optimistic UI updates
      (e.target as SVGElement).style.fill = "var(--theme)";
      const albumData = getAlbumData(album, artist);
      setCollection((prev) => {
        if (!album || !artist) return prev;

        const existingAlbum = prev.find((item) => item.album === album);
        const newSaves = (existingAlbum?.saves ?? 0) + 1;

        if (existingAlbum) {
          return prev.map((item) =>
            item.album === album ? { ...item, saves: newSaves } : item
          );
        }
        return [
          ...prev,
          {
            artist,
            album,
            saves: 1,
            release_date: 0,
            genre: "unknown",
            albumCover: {
              src: albumData ?? "/placeholder.png",
              alt: `${album} by ${artist}`,
            },
          },
        ];
      });

      setUserCollectionNames((prev) => [...prev, { artist, title: album }]);

      // API call
      const response: SaveResponse = await saveAlbum(
        artist,
        album,
        session.user.id
      );

      if (response.status !== 200) {
        throw new Error(response.message);
      }

      showBanner(`${album} saved successfully`, "success", "save");
    } catch (error) {
      // Rollback on failure
      (e.target as SVGElement).style.fill = originalFillColor;
      setCollection(originalCollection);
      setUserCollectionNames(originalUserCollection);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to save album";
      showBanner(errorMessage, "error", "error");
    }
  };

  const filteredAlbums = useMemo(() => {
    return collection
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
  }, [collection, filterBy, selectedGenre, searchQuery, sortBy]);

  useEffect(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const paginatedAlbums = filteredAlbums.slice(start, start + ITEMS_PER_PAGE);
    setDisplayedAlbums(paginatedAlbums);
    setTotalPages(Math.ceil(filteredAlbums.length / ITEMS_PER_PAGE));
  }, [currentPage, filteredAlbums, ITEMS_PER_PAGE]);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      setCurrentPage(0);
    }
  }, [searchQuery]);

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

  const onDelete = async (
    e: React.MouseEvent<SVGSVGElement>,
    artist: string,
    album: string
  ) => {
    if (!session?.user?.id) {
      showBanner("You must be logged in to remove albums", "error", "error");
      return;
    }

    // Store original states for rollback
    const originalFillColor = (e.target as SVGElement).style.fill;
    const originalCollection = [...collection];
    const originalUserCollection = [...userCollectionNames];

    try {
      (e.target as SVGElement).style.fill = "var(--background)";

      // Update collection counts
      const newSaves =
        (collection?.find((item) => item.album === album)?.saves ?? 0) - 1;

      setCollection((prev) =>
        prev.map((item) =>
          item.album === album ? { ...item, saves: newSaves } : item
        )
      );

      // Remove from user collection
      setUserCollectionNames((prev) =>
        prev.filter((item) => item.title !== album)
      );

      // API call
      const response: DeleteResponse = await deleteAlbum(
        artist,
        album,
        session.user.id
      );

      if (response.status !== 200) {
        throw new Error(response.message);
      }

      showBanner(`${album} removed successfully`, "success", "delete");

      // Verify deletion success
      const isStillInDB = await verifyAlbumDeleted(
        artist,
        album,
        session.user.id
      );
      if (isStillInDB) {
        throw new Error("Album deletion verification failed");
      }
    } catch (error) {
      // Rollback on failure
      (e.target as SVGElement).style.fill = originalFillColor;
      setCollection(originalCollection);
      setUserCollectionNames(originalUserCollection);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove album";

      showBanner(errorMessage, "error", "error");
      setError(errorMessage);
    }
  };

  const showBanner = (
    albumTitle: string,
    status: string,
    action: string
  ): void => {
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
  if (!collection) {
    return <div>Loading...</div>;
  }

  const onShare = (artist: string, album: string) => {
    setSharePopUp({
      artist: artist,
      album: album,
    });
  };

  const Pagination = () => {
    const onPageNext = () => {
      setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
      gridRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onPagePrev = () => {
      setCurrentPage((p) => Math.max(0, p - 1));
      gridRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
      <div className="pagination flex justify-center items-center gap-4 my-8">
        <button
          onClick={onPagePrev}
          disabled={currentPage === 0}
          className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-foreground">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={onPageNext}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <select
          name="pages"
          id="pages"
          value={ITEMS_PER_PAGE}
          onChange={(e) => setITEMS_PER_PAGE(parseInt(e.target.value))}
          className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)]"
        >
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>
      </div>
    );
  };

  return (
    <>
      <Nav />
      <main className="mainContent p-8 w-full">
        <div className="header flex flex-col items-center gap-4 p-8">
          <h2 className="text-[clamp(1.5rem,5vw,2.2rem)] font-extrabold uppercase tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] via-[var(--foreground)] to-[var(--foreground)] shadow-white">
            Our Collection
          </h2>
          <p className="text-center text-lg">Here are all the albums we&apos;ve saved.</p>
          {collection && <p className="text-center text-lg">Browse between {collection.length} albums!</p>}
        </div>
        <div className="controlBar flex justify-between items-center p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)]">
          <div className="filters flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={collection.length === 0}
              className="px-4 py-3 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
              <option value="artist">By Artist</option>
            </select>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              disabled={collection.length === 0}
              className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
            >
              <option value="all">All Years</option>
              {Array.from(
                new Set(
                  collection
                    .map((album) => album.release_date.toString())
                    .filter((date) => date !== "unknown")
                    .sort((a, b) => parseInt(b || "0") - parseInt(a || "0"))
                )
              ).map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="genre"
              id="genre"
              onChange={(e) => setSelectedGenre(e.target.value)}
              disabled={collection.length === 0}
              className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
            >
              <option value="all">All Genres</option>
              {knownGenres.map((genre, index) => (
                <option key={`${genre}-${index}`} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="search flex items-center gap-2">
            <input
              type="text"
              placeholder="Search saved albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={collection.length === 0}
              className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
            />
            <X
              size={24}
              className="clear cursor-pointer"
              onClick={() => setSearchQuery("")}
              style={{ display: searchQuery ? "block" : "none" }}
            />
          </div>
        </div>
        <div className="collectionGrid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8" ref={gridRef}>
          {displayedAlbums.length > 0 &&
            displayedAlbums.map((album, index) => (
              <CollectionCard
                key={`${album.artist}-${album.album}-${index}`}
                {...album}
                onHeartClick={(e) =>
                  userCollectionNames.find((item) => item.title === album.album)
                    ? onDelete(e, album.artist, album.album)
                    : onSave(e, album.artist, album.album)
                }
                saves={
                  collection.find((item) => item.album === album.album)
                    ?.saves || 0
                }
                saved={
                  userCollectionNames.find((item) => item.title === album.album)
                    ? true
                    : false
                }
                onShare={onShare}
                releaseDate={album.release_date?.toString() || "unknown"}
              />
            ))}
          {collection.length === 0 && filteredAlbums.length === 0 && (
            <div className="loading-container flex flex-col items-center justify-center gap-4">
              <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--theme)]"></div>
              <p className="loading-text text-lg">Loading our collection...</p>
            </div>
          )}
          {filteredAlbums.length === 0 && collection.length > 0 && (
            <div className="loading-container flex flex-col items-center justify-center gap-4">
              <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--theme)]"></div>
              <p className="loading-text text-lg">
                No results found with search filters. Please try different
                filters.
              </p>
            </div>
          )}
        </div>
        <Pagination />
        <div className="endText flex flex-col items-center gap-4 mt-8">
          <p className="text-center">
            You&apos;ve reached the end of our collection! Didn&apos;t find the
            album you were looking for? Reach out to us!
          </p>
          <Link href="mailto:support@framethebeat.com" className="text-[var(--theme)] underline">
            Support@framethebeat.com
          </Link>
          <button
            onClick={() =>
              gridRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)]"
          >
            Back to the top
          </button>
        </div>
      </main>
      {error && <Banner title="Error" subtitle={error} />}
      {title && <Banner title={title} subtitle={title} />}
      {sharePopUp && (
        <SharePopup
          artistName={sharePopUp.artist}
          albumName={sharePopUp.album}
          onClose={() => setSharePopUp(null)}
        />
      )}
      <Footer />
    </>
  );
};

type CollectionCardProps = Album & {
  onHeartClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  onShare: (artist: string, album: string) => void;
  saves: number;
  saved: boolean;
  releaseDate: string;
};

const CollectionCard = ({
  album,
  genre,
  albumCover,
  artist,
  onHeartClick,
  saves,
  saved = false,
  onShare,
  releaseDate,
}: CollectionCardProps) => (
  <div className="flex flex-col items-center gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)] hover:scale-102 transition-all duration-300 ease-in-out">
    <div className="w-full h-64 relative">
      <Image
        src={albumCover.src ?? "/placeholder.png"}
        alt={albumCover.alt || "Album cover"}
        objectFit="cover"
        layout="fill"
        priority={isHighPriority(albumCover.src)}
        unoptimized={true}
        className="rounded-lg hover:shadow-sm hover:shadow-theme transition-all duration-300 ease-in-out"
      />
    </div>
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-lg font-bold text-center tracking-wide hover:text-[var(--theme)] transition-colors duration-300">{album}</h3>
      <p className="text-md text-[rgba(var(--theme-rgb),0.7)]">{artist}</p>
      {releaseDate && <p className="text-sm text-[rgba(var(--foreground-rgb),0.7)]">{releaseDate}</p>}
      {genre && genre.toLocaleLowerCase() !== "unknown" && (
        <p className="text-xs font-medium tracking-wider text-[rgba(var(--foreground-rgb),0.9)] uppercase bg-[rgba(var(--theme-rgb),0.15)] px-3 py-1.5 rounded-full border border-[rgba(var(--theme-rgb),0.2)] backdrop-blur-sm transition-all duration-300 hover:bg-[rgba(var(--theme-rgb),0.25)]">
          {genre.charAt(0).toLocaleUpperCase() + genre.slice(1)}
        </p>
      )}
    </div>
    <div className="flex gap-4">
      <button className="p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out text-theme flex items-center justify-center">
        <Share2 size={24} onClick={() => onShare(artist, album)} />
      </button>
      <button className="flex items-center gap-2 p-2 rounded-full bg-[rgba(var(--theme-rgb),0.1)] hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300 ease-in-out">
        <Heart
          size={24}
          onClick={(e) => onHeartClick(e)}
          className={`cursor-pointer text-theme ${saved ? "text-theme fill-theme" : ""}`}	
        />
        <span>{saves}</span>
      </button>
    </div>
  </div>
);

const CollectionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Collection />
    </Suspense>
  );
};

export default CollectionPage;
