"use client";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { Album } from "../utils/types";
import "./styles.scss";
import Image from "next/image";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Share2 } from "lucide-react";
import Banner from "../components/Banner";
import { getAlbumData, isGif, isHighPriority } from "../utils/functions";
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
  const { session } = useAuth();
  const [collectionNames, setCollectionNames] = useState<
    { artist: string; title: string; saves: number }[]
  >([]);
  const [userCollectionNames, setUserCollectionNames] = useState<
    { artist: string; title: string }[]
  >([]);
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getCollection = async () => {
      const response = await fetchCollection(); 
      const data = await response.json();
      const mappedData = data.map(
        (item: { artist: string; album: string; saves: string }) => ({
          artist: item.artist,
          title: item.album,
          saves: item.saves,
        })
      );
      
      setCollectionNames(mappedData);
      console.log(mappedData.find((item: { artist: string; title: string}) => item.title.toUpperCase() === "UTOPIA"));
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
  }, [session])

  const processedAlbums = useRef(new Set());

  useEffect(() => {
    if (!collectionNames?.length) return;

    const fetchSavedAlbums = async () => {
      const newAlbums = collectionNames.filter(
        (album) =>
          !processedAlbums.current.has(`${album.artist}-${album.title}`)
      );

      if (newAlbums.length === 0) return;
      const albumPromises = newAlbums.map(async (album) => {
        processedAlbums.current.add(`${album.artist}-${album.title}`);

        const fetchedData = await getAlbumData(album.title, album.artist);
        if (!fetchedData) return null;

        return fetchedData.map((album) => ({
          id: album.id,
          title: album.albumTitle,
          artist: album.albumArtist,
          date: album.albumDate,
          category: album.albumCategory,
          albumCover: album.albumCover,
        }));
      });

      const results = await Promise.all(albumPromises);

      setCollection((prev) => {
        const newAlbums = results
          .filter(Boolean)
          .flat()
          .filter((newAlbum) => {
            if (!newAlbum?.title || !newAlbum?.artist) return false;
            return !prev.some(
              (existingAlbum) =>
                existingAlbum.title === newAlbum.title &&
                existingAlbum.artist === newAlbum.artist
            );
          })
          .map(
            (album): Album => ({
              id: album!.id,
              title: album!.title,
              artist: album!.artist,
              date: album!.date || "unknown",
              category: album!.category || "unknown",
              albumCover: album!.albumCover || {
                src: "/placeholder.png",
                alt: `${album!.title} by ${album!.artist}`,
              },
            })
          );
        return [...prev, ...newAlbums];
      });
    };

    fetchSavedAlbums();
  }, [collectionNames]);

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
    const originalCollectionNames = [...collectionNames];
    const originalUserCollection = [...userCollectionNames];
    const originalFillColor = (e.target as SVGElement).style.fill;

    try {
      // Optimistic UI updates
      (e.target as SVGElement).style.fill = "var(--theme)";
      setCollectionNames((prev) => {
        if (!album || !artist) return prev;
        
        const existingAlbum = prev.find((item) => item.title === album);
        const newSaves = (existingAlbum?.saves ?? 0) + 1;

        if (existingAlbum) {
          return prev.map((item) =>
            item.title === album ? { ...item, saves: newSaves } : item
          );
        }
        return [...prev, { artist, title: album, saves: 1 }];
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
      setCollectionNames(originalCollectionNames);
      setUserCollectionNames(originalUserCollection);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to save album";
      showBanner(errorMessage, "error", "error");
    }
  };

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
    const originalCollectionNames = [...collectionNames];
    const originalUserCollection = [...userCollectionNames];

    try {
      (e.target as SVGElement).style.fill = "var(--background)";

      // Update collection counts
      const newSaves =
        (collectionNames?.find((item) => item.title === album)?.saves ?? 0) - 1;

      setCollectionNames((prev) =>
        prev.map((item) =>
          item.title === album ? { ...item, saves: newSaves } : item
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
      setCollectionNames(originalCollectionNames);
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
  if (!collectionNames || !collection) {
    return <div>Loading...</div>;
  }

  const filteredAlbums = collection
    .filter((album) => {
      if (filterBy === "all") return true;
      return album.date === filterBy;
    })
    .filter(
      (album) =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return parseInt(b.date || "0") - parseInt(a.date || "0");
      if (sortBy === "oldest")
        return parseInt(a.date || "0") - parseInt(b.date || "0");
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return a.artist.localeCompare(b.artist);
    });

  const onShare = (artist: string, album: string) => {
    setSharePopUp({
      artist: artist,
      album: album,
    });
  };

  return (
    <>
      <Nav />
      <main className="mainContent">
        <div className="header">
          <h2>Our Collection</h2>
          <p>Here are all the albums we&apos;ve saved.</p>
        </div>
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
                  collection
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
        <div className="collectionGrid" ref={gridRef}>
          {filteredAlbums.length > 0 &&
            filteredAlbums.map((album, index) => (
              <CollectionCard
                key={index}
                {...album}
                onHeartClick={(e) =>
                  userCollectionNames.find((item) => item.title === album.title)
                    ? onDelete(e, album.artist, album.title)
                    : onSave(e, album.artist, album.title)
                }
                saves={
                  collectionNames.find((item) => item.title === album.title)
                    ?.saves || 0
                }
                saved={
                  userCollectionNames.find((item) => item.title === album.title)
                    ? true
                    : false
                }
                onShare={onShare}
              />
            ))}
          {collection.length === 0 && filteredAlbums.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading our collection...</p>
            </div>
          )}
          {filteredAlbums.length === 0 && collection.length > 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">
                No results found with search filters. Please try different
                filters.
              </p>
            </div>
          )}
        </div>
        <div className="endText">
          <p>
            You&apos;ve reached the end of our collection! Didn&apos;t find the
            album you were looking for? Reach out to us!
          </p>
          <Link href="mailto:support@framethebeat.com">
            Support@framethebeat.com
          </Link>
          <button
            onClick={() =>
              gridRef.current?.scrollIntoView({ behavior: "smooth" })
            }
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
};

const CollectionCard = ({
  id,
  title,
  date,
  category,
  albumCover,
  artist,
  onHeartClick,
  saves,
  saved = false,
  onShare,
}: CollectionCardProps) => (
  <div className="collectionCard" key={id}>
    <div className="albumImage">
      <Image
        src={albumCover.src || "/placeholder.png"}
        alt={albumCover.alt || "Album cover"}
        width={1500}
        height={1500}
        priority={isHighPriority(albumCover.src)}
        unoptimized={isGif(albumCover.src)}
      />
    </div>
    <div className="albumInfo">
      <h3>{title}</h3>
      <p className="artist">{artist}</p>
      {date !== "unknown" && <p className="date">{date}</p>}
      {category && category.toLocaleLowerCase() !== "unknown" && (
        <p className="category">
          {category.charAt(0).toLocaleUpperCase() + category.slice(1)}
        </p>
      )}
    </div>
    <div className="albumActions">
      <button>
        <Share2 size={24} onClick={() => onShare(artist, title)} />
      </button>
      <button className="saves">
        <Heart
          size={24}
          onClick={(e) => onHeartClick(e)}
          style={{ fill: saved ? "var(--theme)" : "var(--background)" }}
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
