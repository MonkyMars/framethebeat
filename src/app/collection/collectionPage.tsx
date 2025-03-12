"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import "../globals.css";
import Banner from "../components/Banner";
import {
  getAlbumData,
  useFilteredData,
  onShare,
  onSave,
  onDelete,
  capitalizeFirstLetter,
} from "../utils/functions";
import Pagination from "./components/pagination";
import SharePopup from "../components/SharePopup";
import LoadingSpinner from "./components/loadingspinners";
import CollectionCard from "../utils/components/albumCard";
import Link from "next/link";
import { fetchCollection, fetchUserCollection } from "../utils/database";
import { useAuth } from "../utils/AuthContext";
import { Album } from "../utils/types";
import CollectionHeader from "../utils/components/collectionHeader";
import ExtraDataCard from "../utils/components/extraDataCard";
import { X } from "lucide-react";


const Collection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sharePopUp, setSharePopUp] = useState<{
    artist: string;
    album: string;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<Album[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get("genre") || "all");
  const [selectedAlbum, setSelectedAlbum] = useState<string>(searchParams.get("album") || "");
  const [selectedArtist, setSelectedArtist] = useState<string>(searchParams.get("artist") || "");
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
  const [isLoading, setIsLoading] = useState(true);
  const [extraData, setExtraData] = useState<Album | null>(null);

  // Function to update URL with query parameters
  const updateUrlWithFilters = (
    genre?: string,
    album?: string,
    artist?: string,
    query?: string
  ) => {
    const params = new URLSearchParams();
    
    if (genre && genre !== "all") {
      params.set("genre", genre);
    }
    
    if (album) {
      params.set("album", album);
    }
    
    if (artist) {
      params.set("artist", artist);
    }
    
    if (query) {
      params.set("q", query);
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newUrl);
  };

  // Effect to handle URL query parameters
  useEffect(() => {
    // Update search query from URL
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }

    // Update genre filter from URL
    const genreParam = searchParams.get("genre");
    if (genreParam) {
      setSelectedGenre(genreParam);
    }

    // Update album filter from URL
    const albumParam = searchParams.get("album");
    if (albumParam) {
      setSelectedAlbum(albumParam);
    }

    // Update artist filter from URL
    const artistParam = searchParams.get("artist");
    if (artistParam) {
      setSelectedArtist(artistParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const getCollection = async () => {
      const response = await fetchCollection();
      const { collection } = await response.json();
      const mappedData = collection
        .map((item: Album) => {
          if (!item?.artist || !item?.album) {
            console.error("Invalid album data:", item);
            return null;
          }
          return {
            artist: item.artist,
            album: item.album,
            saves: item.saves,
            release_date: item.release_date,
            genre: item.genre,
            albumCover: {
              src: getAlbumData(item.album, item.artist),
              alt: `${item.album} by ${item.artist}`,
            },
            tracklist: item.tracklist
          };
        })
        .filter(Boolean);
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
      setIsLoading(false);
    };

    fetchData();
  }, [session]);

  const filteredAlbums = useFilteredData(
    collection,
    searchQuery,
    filterBy,
    selectedGenre,
    sortBy,
    selectedAlbum,
    selectedArtist
  );

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

  // Handle filter changes
  const handleGenreChange = (newGenre: string) => {
    setSelectedGenre(newGenre);
    updateUrlWithFilters(
      newGenre, 
      selectedAlbum, 
      selectedArtist, 
      searchQuery
    );
  };

  const handleAlbumChange = (newAlbum: string) => {
    setSelectedAlbum(newAlbum);
    updateUrlWithFilters(
      selectedGenre,
      newAlbum || undefined,
      selectedArtist,
      searchQuery
    );
  };

  const handleArtistChange = (newArtist: string) => {
    setSelectedArtist(newArtist);
    updateUrlWithFilters(
      selectedGenre,
      selectedAlbum,
      newArtist || undefined,
      searchQuery
    );
  };

  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    
    // Only update URL if query is significant
    if (newQuery.length >= 3 || newQuery === "") {
      updateUrlWithFilters(
        selectedGenre, 
        selectedAlbum, 
        selectedArtist, 
        newQuery || undefined
      );
    }
  };

  return (
    <>
      <Nav />
      <main className="p-8 w-full">
        <CollectionHeader collection={collection} page="collection" />
        <div className="flex flex-col gap-4 p-4 bg-[rgba(var(--background-rgb),0.05)] backdrop-blur-md rounded-2xl border border-[rgba(var(--theme-rgb),0.2)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              disabled={collection.length === 0}
              className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
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
              className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
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
                <option key={`year-${year}-${index}`} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              name="genre"
              id="genre"
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              disabled={collection.length === 0}
              className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground cursor-pointer transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
            >
              <option value="all">All Genres</option>
              {Array.from(
                new Set(
                  collection
                    .filter((album) => album.genre)
                    .map((album) => album.genre?.toLowerCase())
                )
              ).map((genre, index) => (
                <option key={`genre-${genre}-${index}`} value={genre}>
                  {capitalizeFirstLetter(genre)}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={collection.length === 0}
                className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
              />
              {searchQuery && (
                <X
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleSearchChange("")}
                />
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Filter by album..."
                value={selectedAlbum}
                onChange={(e) => handleAlbumChange(e.target.value)}
                disabled={collection.length === 0}
                className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
              />
              {selectedAlbum && (
                <X
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleAlbumChange("")}
                />
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Filter by artist..."
                value={selectedArtist}
                onChange={(e) => handleArtistChange(e.target.value)}
                disabled={collection.length === 0}
                className="w-full px-4 py-2 border border-[rgba(var(--theme-rgb),0.3)] rounded-md bg-[rgba(var(--background-rgb),0.1)] text-foreground transition-all duration-300 ease-in-out hover:border-[rgba(var(--theme-rgb),0.5)] focus:outline-none focus:border-[var(--theme)] focus:shadow-[0_0_10px_rgba(var(--theme-rgb),0.2)] disabled:bg-[rgba(var(--theme-rgb),0.1)] disabled:text-[rgba(var(--foreground-rgb),0.5)] disabled:cursor-not-allowed"
              />
              {selectedArtist && (
                <X
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => handleArtistChange("")}
                />
              )}
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"
          ref={gridRef}
        >
          {displayedAlbums.length > 0 &&
            displayedAlbums.map((album, index) => (
              <CollectionCard
                key={`${album.artist}-${album.album}-${index}`}
                {...album}
                setExtraData={setExtraData}
                tracklist={album.tracklist}
                onHeartClick={(e) =>
                  userCollectionNames.find((item) => item.title === album.album)
                    ? onDelete(
                        e,
                        album.artist,
                        album.album,
                        collection,
                        setCollection,
                        userCollectionNames,
                        setUserCollectionNames,
                        session?.user.id,
                        setTitle,
                        setError
                      )
                    : onSave(
                        e,
                        album.artist,
                        album.album,
                        collection,
                        setCollection,
                        userCollectionNames,
                        setUserCollectionNames,
                        session?.user.id,
                        setTitle
                      )
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
                onShare={() =>
                  onShare(album.artist, album.album, setSharePopUp)
                }
                releaseDate={album.release_date?.toString() || "unknown"}
              />
            ))}
          {(collection.length === 0 && filteredAlbums.length === 0) ||
            (isLoading && <LoadingSpinner text="Loading our collection..." />)}
          {filteredAlbums.length === 0 && collection.length > 0 && (
            <LoadingSpinner text="No results found with search filters. Please try different filters" />
          )}
        </div>
      </main>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          gridRef={gridRef}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          setITEMS_PER_PAGE={setITEMS_PER_PAGE}
        />
      </div>
      <div className="endText flex flex-col items-center gap-4 mt-8 px-4 md:px-8 max-w-2xl mx-auto">
        <p className="text-center text-sm md:text-base">
          You&apos;ve reached the end of our collection! Didn&apos;t find the
          album you were looking for? Reach out to us!
        </p>
        <Link
          href="mailto:support@framethebeat.com"
          className="text-[var(--theme)] underline text-sm md:text-base hover:opacity-80 transition-opacity"
        >
          Support@framethebeat.com
        </Link>
        <button
          onClick={() =>
            gridRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="w-full sm:w-auto px-4 py-2 mb-4 border border-[rgba(var(--theme-rgb),0.3)] rounded bg-transparent text-foreground text-sm md:text-base cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(var(--theme-rgb),0.1)] hover:border-[rgba(var(--theme-rgb),0.5)]"
        >
          Back to the top
        </button>
      </div>
      {error && <Banner title="Error" subtitle={error} />}
      {title && <Banner title={title} subtitle={title} />}
      {extraData && (
        <>
        <ExtraDataCard extraData={extraData} setExtraData={setExtraData}/>
        </>
      )}
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

const CollectionPage = () => {
  return (
    <Suspense
      fallback={
        <div className="loading-container flex flex-col items-center justify-center gap-4">
          <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--theme)]"></div>
          <p className="loading-text text-lg">Loading our collection...</p>
        </div>
      }
    >
      <Collection />
    </Suspense>
  );
};

export default CollectionPage;
