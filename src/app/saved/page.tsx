"use client";
import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fetchUserCollection, fetchCollection } from "../utils/database";
import { useAuth } from "../utils/AuthContext";
import Banner from "../components/Banner";
import SharePopup from "../components/SharePopup";
import {
  getAlbumData,
  onRemove,
  useFilteredData,
  onShare,
} from "../utils/functions";
import CollectionCard from "../utils/components/albumCard";
import FilterBar from "../utils/components/filterBar";
import { Album } from "../utils/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../collection/components/loadingspinners";
import CollectionHeader from "../utils/components/collectionHeader";
import ExtraDataCard from "../utils/components/extraDataCard";

const SavedContent = () => {
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const { session } = useAuth();
  const [filterBy, setFilterBy] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [sharePopUp, setSharePopUp] = useState<{
    artist: string;
    album: string;
  } | null>(null);
  const [collection, setCollection] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [extraData, setExtraData] = useState<Album | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!session?.user?.id) {
          setIsLoading(false);
          return;
        }

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
          tracklist: item.tracklist ? item.tracklist : null,
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
      } catch (error) {
        setError('Failed to load collection');
        console.error(error);
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
          collection={collection}
          setSelectedGenre={setSelectedGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isLoading ? (
          <LoadingSpinner text="Loading your collection..." />
        ) : filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {filteredAlbums.map((album, index) => (
              <CollectionCard
              setExtraData={setExtraData}
                key={index}
                {...album}
                onShare={() =>
                  onShare(album.artist, album.album, setSharePopUp)
                }
                onHeartClick={() =>
                  onRemove(
                    album.artist,
                    album.album,
                    session?.user?.id || "",
                    setError,
                    savedAlbums,
                    setSavedAlbums,
                    setTitle
                  )
                }
                saves={
                  collection.find((item) => item.album === album.album)
                    ?.saves || 0
                }
                saved={
                  savedAlbums.find((item) => item.album === album.album)
                    ? true
                    : false
                }
                releaseDate={album.release_date?.toString() || "unknown"}
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
      </main>
      <Footer />
      {error && <Banner title="Error" subtitle={error} />}
      {title && <Banner title="Success" subtitle={title} />}
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
