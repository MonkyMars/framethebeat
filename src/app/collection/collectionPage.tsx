"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useEffect, useState, Suspense, useRef, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import "../globals.css";
import Banner from "../components/Banner";
import {
  getAlbumData,
  useFilteredData,
  onShare,
  onSave,
  onDelete,
} from "../utils/functions";
import Pagination from "../components/collection/Pagination";
import SharePopup from "../components/SharePopup";
import LoadingSpinner from "./components/loadingspinners";
import Link from "next/link";
import { fetchCollection, fetchUserCollection } from "../utils/databaseService";
import { useAuth } from "../utils/AuthContext";
import { Album } from "../utils/types";
import { formatErrorMessage } from "../utils/errorHandler";

// Import our new components
import AlbumCard from "../components/collection/AlbumCard";
import CollectionHeader from "../components/collection/CollectionHeader";
import ExtraDataCard from "../components/collection/ExtraDataCard";
import FilterBar from "../components/collection/FilterBar";

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

  const albumSavesMap = useMemo(() => {
    return collection.reduce<Record<string, number>>((acc, item) => {
      acc[item.album] = item.saves || 0;
      return acc;
    }, {});
  }, [collection]);

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

  const getCollection = useCallback(async () => {
    try {
      const response = await fetchCollection();
      if (response.error) {
        console.error("Error fetching collection:", response.error);
        setError(formatErrorMessage(response.error));
        setCollection([]);
        return;
      }
      
      if (!response.data) {
        console.error("No collection data received");
        setCollection([]);
        return;
      }
      
      const mappedData = response.data
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
            tracklist: item.tracklist,
          };
        })
        .filter((item): item is Album => item !== null);
      setCollection(mappedData);
    } catch (err) {
      console.error("Error in getCollection:", err);
      setError(formatErrorMessage(err));
      setCollection([]);
    }
  }, [setCollection, setError]);

  const getUserCollection = useCallback(async () => {
    if (!session?.user?.id) {
      return;
    }
    try {
      const response = await fetchUserCollection(session.user.id);
      if (response.error) {
        console.error("Error fetching user collection:", response.error);
        setError(formatErrorMessage(response.error));
        setUserCollectionNames([]);
        return;
      }
      
      if (!response.data) {
        console.error("No user collection data received");
        setUserCollectionNames([]);
        return;
      }
      
      const mappedData = response.data.map(
        (item: { artist: string; album: string }) => ({
          artist: item.artist,
          title: item.album,
        })
      );
      setUserCollectionNames(mappedData);
    } catch (err) {
      console.error("Error in getUserCollection:", err);
      setError(formatErrorMessage(err));
      setUserCollectionNames([]);
    }
  }, [session?.user?.id, setUserCollectionNames, setError]);

  const fetchData = useCallback(async () => {
    await Promise.all([getCollection(), getUserCollection()]);
    setIsLoading(false);
  }, [getCollection, getUserCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData, session]);

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
      <main className="p-8 w-full" id="main-content" role="main" aria-labelledby="collection-heading">
        <CollectionHeader collection={collection} page={pathname.includes("saved") ? "saved" : "collection"} />

        <FilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          collection={collection}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          setSelectedGenre={handleGenreChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          selectedGenre={selectedGenre}
          selectedAlbum={selectedAlbum}
          setSelectedAlbum={handleAlbumChange}
          selectedArtist={selectedArtist}
          setSelectedArtist={handleArtistChange}
        />

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"
          ref={gridRef}
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading && <LoadingSpinner text="Loading our collection..." />}
          
          {!isLoading && displayedAlbums.length > 0 &&
            displayedAlbums.map((album, index) => (
              <AlbumCard
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
                saves={albumSavesMap[album.album] || 0}
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
          
          {!isLoading && collection.length > 0 && displayedAlbums.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-xl text-center text-[rgba(var(--foreground-rgb),0.7)]">
                No results found with the current filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterBy('all');
                  setSelectedGenre('all');
                  setSelectedAlbum('');
                  setSelectedArtist('');
                }}
                className="mt-4 px-6 py-2 bg-[rgba(var(--theme-rgb),0.1)] border border-[rgba(var(--theme-rgb),0.3)] rounded-md hover:bg-[rgba(var(--theme-rgb),0.2)] transition-all duration-300"
                aria-label="Clear all filters"
              >
                Clear all filters
              </button>
            </div>
          )}
          
          {!isLoading && collection.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-xl text-center text-[rgba(var(--foreground-rgb),0.7)]">
                No albums found in the collection.
              </p>
            </div>
          )}
        </div>
      </main>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          gridRef={gridRef}
          itemsPerPage={ITEMS_PER_PAGE}
          setItemsPerPage={setITEMS_PER_PAGE}
          totalItems={filteredAlbums.length}
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
        <ExtraDataCard extraData={extraData} setExtraData={setExtraData} />
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
