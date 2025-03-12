import { supabase } from "./supabase";
import { Album, SaveResponse, DeleteResponse } from "./types";
import { asyncHandler, createError, ErrorType, logError } from "./errorHandler";

/**
 * Fetch a user's collection of saved albums
 */
export const fetchUserCollection = asyncHandler(async (id: string) => {
  if (!id) {
    throw createError(ErrorType.VALIDATION_ERROR, "User ID is required");
  }

  const { data: collection, error } = await supabase
    .from("saved")
    .select("*")
    .eq("user_id", id);

  if (error) {
    logError(error);
    throw createError(ErrorType.DATABASE_ERROR, error.message);
  }

  return collection as Album[];
});

/**
 * Fetch the entire collection of albums
 */
export const fetchCollection = asyncHandler(async () => {
  const { data: collection, error } = await supabase
    .from("collection")
    .select("*");

  if (error) {
    logError(error);
    throw createError(ErrorType.DATABASE_ERROR, error.message);
  }

  return collection as Album[];
});

/**
 * Fetch a specific album by artist and album name
 */
export const fetchAlbum = asyncHandler(async (artist: string, album: string) => {
  if (!artist || !album) {
    throw createError(ErrorType.VALIDATION_ERROR, "Artist and album names are required");
  }

  const { data, error } = await supabase
    .from("collection")
    .select("*")
    .eq("artist", artist)
    .eq("album", album)
    .single();

  if (error) {
    logError(error);
    throw createError(ErrorType.DATABASE_ERROR, error.message);
  }

  if (!data) {
    throw createError(ErrorType.NOT_FOUND_ERROR, "Album not found");
  }

  return data as Album;
});

/**
 * Fetch the most saved albums
 */
export const fetchMostSavedAlbums = asyncHandler(async (limit: number = 10) => {
  const { data, error } = await supabase
    .from("collection")
    .select("*")
    .order("saves", { ascending: false })
    .limit(limit);

  if (error) {
    logError(error);
    throw createError(ErrorType.DATABASE_ERROR, error.message);
  }

  return data as Album[];
});

/**
 * Save an album to a user's collection
 */
export const saveAlbum = asyncHandler(async (
  artist: string,
  album: string,
  userId: string
) => {
  if (!artist || !album || !userId) {
    throw createError(
      ErrorType.VALIDATION_ERROR,
      "Artist, album, and user ID are required"
    );
  }

  // Check if the album is already saved
  const { data: existingData, error: existingError } = await supabase
    .from("saved")
    .select("*")
    .eq("artist", artist)
    .eq("album", album)
    .eq("user_id", userId)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    logError(existingError);
    throw createError(ErrorType.DATABASE_ERROR, existingError.message);
  }

  if (existingData) {
    throw createError(
      ErrorType.VALIDATION_ERROR,
      "Album is already saved to your collection"
    );
  }

  // Save the album
  const { error: saveError } = await supabase
    .from("saved")
    .insert([{ artist, album, user_id: userId }]);

  if (saveError) {
    logError(saveError);
    throw createError(ErrorType.DATABASE_ERROR, saveError.message);
  }

  // Update the saves count in the collection
  const { data: albumData, error: albumError } = await supabase
    .from("collection")
    .select("saves")
    .eq("artist", artist)
    .eq("album", album)
    .single();

  if (albumError) {
    logError(albumError);
    throw createError(ErrorType.DATABASE_ERROR, albumError.message);
  }

  const currentSaves = albumData?.saves || 0;
  const newSaves = currentSaves + 1;

  const { error: updateError } = await supabase
    .from("collection")
    .update({ saves: newSaves })
    .eq("artist", artist)
    .eq("album", album);

  if (updateError) {
    logError(updateError);
    throw createError(ErrorType.DATABASE_ERROR, updateError.message);
  }

  const response: SaveResponse = {
    message: "Album saved successfully",
    status: 200,
    response: {
      artist,
      album,
      user_id: userId,
    },
    updateData: {
      artist,
      album,
      saves: newSaves,
    },
  };

  return response;
});

/**
 * Delete an album from a user's collection
 */
export const deleteAlbum = asyncHandler(async (
  artist: string,
  album: string,
  userId: string
) => {
  if (!artist || !album || !userId) {
    throw createError(
      ErrorType.VALIDATION_ERROR,
      "Artist, album, and user ID are required"
    );
  }

  // Check if the album exists in the user's collection
  const { error: existingError } = await supabase
    .from("saved")
    .select("*")
    .eq("artist", artist)
    .eq("album", album)
    .eq("user_id", userId)
    .single();

  if (existingError) {
    logError(existingError);
    throw createError(
      ErrorType.NOT_FOUND_ERROR,
      "Album not found in your collection"
    );
  }

  // Delete the album from the user's collection
  const { error: deleteError } = await supabase
    .from("saved")
    .delete()
    .eq("artist", artist)
    .eq("album", album)
    .eq("user_id", userId);

  if (deleteError) {
    logError(deleteError);
    throw createError(ErrorType.DATABASE_ERROR, deleteError.message);
  }

  // Update the saves count in the collection
  const { data: albumData, error: albumError } = await supabase
    .from("collection")
    .select("saves")
    .eq("artist", artist)
    .eq("album", album)
    .single();

  if (albumError) {
    logError(albumError);
    throw createError(ErrorType.DATABASE_ERROR, albumError.message);
  }

  const currentSaves = albumData?.saves || 0;
  const newSaves = Math.max(0, currentSaves - 1);

  const { error: updateError } = await supabase
    .from("collection")
    .update({ saves: newSaves })
    .eq("artist", artist)
    .eq("album", album);

  if (updateError) {
    logError(updateError);
    throw createError(ErrorType.DATABASE_ERROR, updateError.message);
  }

  const response: DeleteResponse = {
    message: "Album removed successfully",
    status: 200,
    response: {
      artist,
      album,
      user_id: userId,
    },
    updateData: {
      artist,
      album,
      saves: newSaves,
    },
  };

  return response;
});

/**
 * Verify if an album is in a user's collection
 */
export const verifyAlbumSaved = asyncHandler(async (
  artist: string,
  album: string,
  userId: string
) => {
  if (!artist || !album || !userId) {
    throw createError(
      ErrorType.VALIDATION_ERROR,
      "Artist, album, and user ID are required"
    );
  }

  const { data, error } = await supabase
    .from("saved")
    .select("*")
    .eq("artist", artist)
    .eq("album", album)
    .eq("user_id", userId);

  if (error) {
    logError(error);
    throw createError(ErrorType.DATABASE_ERROR, error.message);
  }

  return data && data.length > 0;
}); 