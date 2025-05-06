import { supabase } from "./supabase";
import { Album } from "./types";
import { useMemo } from "react";
import levenshtein from "fast-levenshtein";
import { DeleteResponse, SaveResponse } from "./types";
import { verifyAlbumDeleted, deleteAlbum, saveAlbum } from "./database";

export const getAlbumData = (album: string, artist: string): string => {
  try {
    const filename = `${album}-${artist}`
      .normalize("NFKD") // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace unwanted chars with underscores
      .replace(/_+/g, "_") // Collapse multiple underscores
      .replace(/^[_\.]+|[_\.]+$/g, "") // Trim leading/trailing underscores or dots
      .toLowerCase(); // Normalize case
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
  sortBy: string,
  selectedAlbum?: string,
  selectedArtist?: string
) => {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data
      .filter((album) => {
        if (!album?.album || !album?.artist) return false;

        // Filter by genre - strict exact match
        const matchesGenre =
          selectedGenre === "all" ||
          (album.genre &&
            album.genre.toLowerCase() === selectedGenre.toLowerCase());

        // Filter by year - exact match only
        const matchesYear =
          filterBy === "all" || String(album.release_date) === filterBy;

        // Filter by album name - stricter matching requiring complete word match
        const matchesAlbum =
          !selectedAlbum ||
          (() => {
            // Normalize album name: lowercase + remove punctuation
            const normalizedAlbum = album.album
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
            const albumWords = normalizedAlbum
              .split(/\s+/)
              .filter((word) => word.length > 0);

            // Normalize search: lowercase + remove punctuation
            const normalizedSearch = selectedAlbum
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
            const searchWords = normalizedSearch
              .split(/\s+/)
              .filter((word) => word.length > 0);

            return searchWords.every((searchWord) =>
              albumWords.some((albumWord) => albumWord === searchWord)
            );
          })();

        // Filter by artist name - stricter matching requiring complete word match
        const matchesArtist =
          !selectedArtist ||
          (() => {
            // Normalize artist name: lowercase + remove punctuation
            const normalizedArtist = album.artist
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
            const artistWords = normalizedArtist
              .split(/\s+/)
              .filter((word) => word.length > 0);

            // Normalize search: lowercase + remove punctuation
            const normalizedSearch = selectedArtist
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
            const searchWords = normalizedSearch
              .split(/\s+/)
              .filter((word) => word.length > 0);

            return searchWords.every((searchWord) =>
              artistWords.some((artistWord) => artistWord === searchWord)
            );
          })();

        return matchesYear && matchesGenre && matchesAlbum && matchesArtist;
      })
      .filter((album) => {
        if (!album?.album || !album?.artist) return false;
        if (!searchQuery) return true;

        // Normalize search: lowercase + remove punctuation
        const searchTerm = searchQuery.toLowerCase().trim();

        // Skip empty searches
        if (searchTerm.length === 0) return true;

        // Require minimum search length
        if (searchTerm.length < 3) return false;

        const albumName = album.album.toLowerCase();
        // Normalize artist name: lowercase + remove punctuation
        const artistName = album.artist
          .toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
          .trim();
        const genreName = album.genre?.toLowerCase() || "";
        const releaseYear = String(album.release_date || "");

        // Normalize search term: remove punctuation and split into words
        const normalizedSearchTerm = searchTerm.replace(
          /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
          " "
        );
        const searchWords = normalizedSearchTerm
          .split(/\s+/)
          .filter((word) => word.length > 0);

        // Require all search words to match something
        return searchWords.every((word) => {
          // Direct exact word matches - check if any field contains this exact word
          const albumWords = albumName
            .split(/\s+/)
            .filter((word) => word.length > 0);
          const artistWords = artistName
            .split(/\s+/)
            .filter((word) => word.length > 0);
          const genreWords = genreName
            .split(/\s+/)
            .filter((word) => word.length > 0);

          const exactWordMatch =
            albumWords.some((albumWord) => albumWord === word) ||
            artistWords.some((artistWord) => artistWord === word) ||
            genreWords.some((genreWord) => genreWord === word) ||
            releaseYear === word;

          if (exactWordMatch) return true;

          // Stricter substring matching - word must be at least 50% of the length of the field
          // to avoid matching on tiny substrings
          if (word.length >= 4) {
            if (
              albumName.includes(word) ||
              artistName.includes(word) ||
              genreName.includes(word) ||
              releaseYear.includes(word)
            ) {
              return true;
            }
          }

          // Reduced fuzzy matching with tighter thresholds
          if (word.length >= 4) {
            // Stricter threshold for fuzzy matching
            const threshold = Math.floor(word.length / 5);

            // Only allow 1 character difference for words under 10 chars
            if (threshold === 0) return false;

            return [...albumWords, ...artistWords, ...genreWords].some(
              (fieldWord) => {
                // Only compare words of similar length
                if (Math.abs(fieldWord.length - word.length) > 2) return false;

                return levenshtein.get(word, fieldWord) <= threshold;
              }
            );
          }

          return false;
        });
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
  }, [
    data,
    filterBy,
    selectedGenre,
    searchQuery,
    sortBy,
    selectedAlbum,
    selectedArtist,
  ]);
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
          tracklist: [],
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

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
