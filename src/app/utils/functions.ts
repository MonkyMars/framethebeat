import { supabase } from "./supabase";
import { Album } from "./types";
import { useMemo } from "react";
import { DeleteResponse, SaveResponse } from "./types";
import { verifyAlbumDeleted, deleteAlbum, saveAlbum } from "./database";

export const getAlbumData = (album: string, artist: string): string => {
  try {
    const filename = `${album}-${artist}`.replace(/[^a-zA-Z0-9-_\.]/g, "_");
    const { data } = supabase.storage
      .from("albumcovers")
      .getPublicUrl(`images/${filename}`);
    if (!data) {
      console.error(`No data found for album cover for ${album} by ${artist}`);
      return "/placeholder.png";
    }

    return data.publicUrl;
  } catch (error) {
    console.error(
      `Error fetching album data for ${album} by ${artist}:`,
      error
    );
    return "/placeholder.png";
  }
};

export const isHighPriority = (src?: string): boolean => {
  if (!src || src.includes("placeholder")) return false;
  const extension = src.split(".").pop()?.toLowerCase();
  return extension !== "gif";
};

export const useFilteredData = (
  data: Album[],
  searchQuery: string,
  filterBy: string,
  selectedGenre: string,
  sortBy: string
): Album[] => {
  return useMemo(() => {
    return data
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
  }, [data, filterBy, selectedGenre, searchQuery, sortBy]);
};

export const onShare = (
  artist: string,
  album: string,
  setSharePopUp: (data: { artist: string; album: string }) => void
) => {
  setSharePopUp({
    artist: artist,
    album: album,
  });
};

export const showBanner = (
  albumTitle: string,
  status: string,
  action: string,
  setTitle: (title: string) => void
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

export const onDelete = async (
  e: React.MouseEvent<SVGSVGElement>,
  artist: string,
  album: string,
  collection: Album[],
  setCollection: (data: Album[] | ((prev: Album[]) => Album[])) => void,
  userCollectionNames: { artist: string; title: string }[],
  setUserCollectionNames: (
    data:
      | { artist: string; title: string }[]
      | ((
          prev: { artist: string; title: string }[]
        ) => { artist: string; title: string }[])
  ) => void,
  user_id: string | undefined,
  setTitle: (title: string) => void,
  setError: (error: string) => void
) => {
  if (!user_id) {
    showBanner(
      "You must be logged in to remove albums",
      "error",
      "error",
      setTitle
    );
    return;
  }

  // Store original states for rollback
  const originalFillColor = (e.target as SVGElement).style.fill;
  const originalCollection = [...collection];
  const originalUserCollection = [...userCollectionNames];

  try {
    (e.target as SVGElement).style.fill = "var(--background)";

    const newSaves =
      (collection?.find((item) => item.album === album)?.saves ?? 0) - 1;

    const updatedCollection = collection.map((item) =>
      item.album === album ? { ...item, saves: newSaves } : item
    );
    setCollection(updatedCollection);

    const filteredCollection = userCollectionNames
      .map((item) => ({ artist, title: item.title }))
      .filter((item) => item.title !== album);
    setUserCollectionNames(filteredCollection);

    const response: DeleteResponse = await deleteAlbum(artist, album, user_id);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    showBanner(`${album} removed successfully`, "success", "delete", setTitle);

    const isStillInDB = await verifyAlbumDeleted(artist, album, user_id);
    if (isStillInDB) {
      throw new Error("Album deletion verification failed");
    }
  } catch (error) {
    (e.target as SVGElement).style.fill = originalFillColor;
    setCollection(originalCollection);
    setUserCollectionNames(originalUserCollection);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove album";

    showBanner(errorMessage, "error", "error", setTitle);
    setError(errorMessage);
  }
};

export const onSave = async (
  e: React.MouseEvent<SVGSVGElement>,
  artist: string,
  album: string,
  collection: Album[],
  setCollection: (data: Album[] | ((prev: Album[]) => Album[])) => void,
  userCollectionNames: { artist: string; title: string }[],
  setUserCollectionNames: (
    data:
      | { artist: string; title: string }[]
      | ((
          prev: { artist: string; title: string }[]
        ) => { artist: string; title: string }[])
  ) => void,
  user_id: string | undefined,
  setTitle: (title: string) => void
) => {
  if (!user_id) {
    showBanner(
      "You must be logged in to save albums",
      "error",
      "error",
      setTitle
    );
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
    setCollection((prev: Album[]) => {
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

    const response: SaveResponse = await saveAlbum(artist, album, user_id);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    showBanner(`${album} saved successfully`, "success", "save", setTitle);
  } catch (error) {
    (e.target as SVGElement).style.fill = originalFillColor;
    setCollection(originalCollection);
    setUserCollectionNames(originalUserCollection);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to save album";
    showBanner(errorMessage, "error", "error", setTitle);
  }
};

export const onRemove = async (
  artist: string,
  album: string,
  user_id: string,
  setError: (error: string) => void,
  savedAlbums: Album[],
  setSavedAlbums: (data: Album[] | ((prev: Album[]) => Album[])) => void,
  setTitle: (title: string) => void
): Promise<void> => {
  if (!user_id) {
    showBanner(
      "You must be logged in to remove albums",
      "error",
      "error",
      setTitle
    );
    return;
  }

  const originalAlbums = [...savedAlbums];

  try {
    setSavedAlbums((prev) => prev.filter((item) => item.album !== album));
    const response: DeleteResponse = await deleteAlbum(artist, album, user_id);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    showBanner(album, "success", "delete", setTitle);
  } catch (error) {
    setSavedAlbums(originalAlbums);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove album";
    showBanner(errorMessage, "error", "error", setTitle);
    setError(errorMessage);
  }
};
