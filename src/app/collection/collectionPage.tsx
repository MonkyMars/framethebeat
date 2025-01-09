"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import "../globals.css";
import Banner from "../components/Banner";
import {
  getAlbumData,
  useFilteredData,
  onShare,
  onSave,
  onDelete,
} from "../utils/functions";
import Pagination from "./components/pagination";
import SharePopup from "../components/SharePopup";
import LoadingSpinner from "./components/loadingspinners";
import CollectionCard from "../utils/components/albumCard";
import Link from "next/link";
import { fetchCollection, fetchUserCollection } from "../utils/database";
import { useAuth } from "../utils/AuthContext";
import { Album } from "../utils/types";
import FilterBar from "../utils/components/filterBar";

const Collection = () => {
  const searchParams = useSearchParams();
  const [sharePopUp, setSharePopUp] = useState<{
    artist: string;
    album: string;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<Album[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
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
  const [isLoading, setIsLoading] = useState(true);

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
    sortBy
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

  return (
    <>
      <Nav />
      <main className="p-8 w-full">
        <header className="relative flex flex-col items-center gap-6 py-12 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--theme-rgb),0.1)] to-transparent opacity-50 blur-xl pointer-events-none" />

          <h2 className="relative text-[clamp(1.85rem,5vw,3rem)] font-black uppercase tracking-[0.2em] z-10">
            Our Collection
          </h2>

          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-lg md:text-xl font-medium text-[rgba(var(--foreground-rgb),0.8)]">
              Here are all the albums we&apos;ve saved.
            </p>

            {collection && collection.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="px-4 py-1 rounded-full bg-[rgba(var(--theme-rgb),0.1)] border border-[rgba(var(--theme-rgb),0.2)] backdrop-blur-sm">
                  <p className="text-center text-sm md:text-base font-medium">
                    <span className="font-bold text-[var(--theme)]">
                      {collection.length}
                    </span>{" "}
                    albums in collection
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>
        <FilterBar
          collection={collection}
          setSortBy={setSortBy}
          sortBy={sortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          setSelectedGenre={setSelectedGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"
          ref={gridRef}
        >
          {displayedAlbums.length > 0 &&
            displayedAlbums.map((album, index) => (
              <CollectionCard
                key={`${album.artist}-${album.album}-${index}`}
                {...album}
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
