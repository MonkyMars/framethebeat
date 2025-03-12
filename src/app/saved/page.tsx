"use client";
import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fetchCollection, fetchUserCollection } from "../utils/databaseService";
import { useAuth } from "../utils/AuthContext";
import Banner from "../components/Banner";
import SharePopup from "../components/SharePopup";
import {
  useFilteredData,
  onShare,
  onDelete,
} from "../utils/functions";
import AlbumCard from "../components/collection/AlbumCard";
import FilterBar from "../components/collection/FilterBar";
import { Album } from "../utils/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../collection/components/loadingspinners";
import CollectionHeader from "../components/collection/CollectionHeader";
import ExtraDataCard from "../components/collection/ExtraDataCard";
import { formatErrorMessage } from "../utils/errorHandler";

const SavedContent = () => {
  const { session } = useAuth();
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [sharePopUp, setSharePopUp] = useState<{
    artist: string;
    album: string;
  } | null>(null);
  const [extraData, setExtraData] = useState<Album | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!session?.user?.id) {
          setTitle("Please sign in to view your saved albums");
          setIsLoading(false);
          return;
        }
        
        const collectionResp = await fetchCollection();
        const userResp = await fetchUserCollection(session.user.id);
        
        if (collectionResp.error) {
          throw collectionResp.error;
        }
        
        if (userResp.error) {
          throw userResp.error;
        }
        
        const collection = collectionResp.data || [];
        const userData = userResp.data || [];
        
        // Filter the collection to only include items saved by the user
        const savedAlbums = collection.filter((album) =>
          userData.some((item) => item.album === album.album)
        );
        
        setSavedAlbums(savedAlbums);
        setTitle(
          savedAlbums.length > 0
            ? `Your saved albums (${savedAlbums.length})`
            : "You haven't saved any albums yet"
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(formatErrorMessage(err));
        setTitle("Error loading your saved albums");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session]);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filteredAlbums = useFilteredData(
    savedAlbums,
    searchQuery,
    filterBy,
    selectedGenre,
    sortBy
  );
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Nav />
      <main className="p-8 w-full">
      <CollectionHeader collection={savedAlbums} page="saved" />
        <FilterBar
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          collection={savedAlbums}
          setSelectedGenre={setSelectedGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {isLoading && <LoadingSpinner text="Loading your collection..." />}
          
          {!isLoading && filteredAlbums.length > 0 &&
            filteredAlbums.map((album, index) => (
              <AlbumCard
                key={`${album.artist}-${album.album}-${index}`}
                album={album.album}
                genre={album.genre}
                albumCover={album.albumCover}
                artist={album.artist}
                onHeartClick={(e) =>
                  onDelete(
                    e,
                    album.artist,
                    album.album,
                    savedAlbums,
                    setSavedAlbums,
                    [],
                    () => {},
                    session?.user.id,
                    setTitle,
                    setError
                  )
                }
                onShare={() => onShare(album.artist, album.album, setSharePopUp)}
                saves={album.saves || 0}
                saved={true}
                releaseDate={album.release_date?.toString() || "unknown"}
                setExtraData={setExtraData}
                tracklist={album.tracklist}
              />
            ))}
          
          {!isLoading && filteredAlbums.length === 0 && (
            <div className="text-center py-16 px-8 text-foreground/70">
              {session?.user?.id ? (
                <>
                  <h3 className="text-xl mb-4">No saved albums yet</h3>
                  <p className="text-base mb-8">
                    Start building your collection by saving some album covers!
                  </p>
                  <button
                    onClick={() => handleNavigate("/collection")}
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
                    onClick={() => handleNavigate("/login")}
                    className="px-6 py-3 rounded-lg bg-gradient-to-br from-theme to-theme/80 text-foreground text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme/30"
                  >
                    Log in!
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      {error && <Banner title="Error" subtitle={error} />}
      {title && <Banner title="Success" subtitle={title} />}
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
    </>
  );
};

const Saved = () => {
  return (
    <Suspense
      fallback={
        <div className="loading-container flex flex-col items-center justify-center gap-4">
          <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--theme)]"></div>
          <p className="loading-text text-lg">Loading your collection...</p>
        </div>
      }
    >
      <SavedContent />
    </Suspense>
  );
};

const SavedWrapped = dynamic(() => Promise.resolve(Saved), { ssr: false });

export default SavedWrapped;
