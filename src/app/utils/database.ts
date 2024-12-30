import { supabase } from "./supabase";
import { NextResponse } from "next/server";

export const fetchUserCollection = async (id: string) => {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: collection, error } = await supabase
      .from("saved")
      .select("*")
      .eq("user_id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
};

export const fetchCollection = async () => {
  try {
    const { data: collection, error } = await supabase
      .from("collection")
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ collection });
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
};

interface SavedAlbum {
  artist: string;
  album: string;
  user_id: string;
}

interface SaveAlbumResponse {
  message: string;
  status: number;
  response: SavedAlbum;
  updateData: {
    album: string;
    artist: string;
    saves: number;
  };
}

export const saveAlbum = async (
  artist: string,
  album: string,
  user_id: string
): Promise<SaveAlbumResponse> => {
  if (!artist?.trim() || !album?.trim() || !user_id?.trim()) {
    throw new Error("Invalid input parameters");
  }

  try {
    const { data: response, error } = await supabase.rpc(
      "save_album_transaction",
      {
        p_artist: artist,
        p_album: album,
        p_user_id: user_id,
      }
    );

    if (error) {
      throw new Error(`Database operation failed: ${error.message}`);
    }

    return {
      message: "Album saved successfully",
      status: 200,
      response: {
        artist,
        album,
        user_id,
      },
      updateData: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Album save failed: ${error.message}`);
      throw new Error(`Failed to save album: ${error.message}`);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteAlbum = async (
  artist: string,
  album: string,
  user_id: string
) => {
  if (!artist?.trim() || !album?.trim() || !user_id?.trim()) {
    throw new Error("Invalid input parameters");
  }

  try {
    const { data: response, error } = await supabase.rpc(
      "delete_album_transaction",
      {
        p_artist: artist,
        p_album: album,
        p_user_id: user_id,
      }
    );

    if (error) {
      throw new Error(`Database operation failed: ${error.message}`);
    }

    return {
      message: "Album deleted successfully",
      status: 200,
      response,
      updateData: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Album deletion failed: ${error.message}`);
      throw new Error(`Failed to delete album: ${error.message}`);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signupUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};

export const logInUser = async (email: string, password: string) => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
};

export const logOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(`HTTP error! status: ${error}`);
    }

    return {
      message: "Logged out successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const updateUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`/api/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (user_id: string) => {
  try {
    const { data, error: SavedError } = await supabase
      .from("saved")
      .delete()
      .eq("user_id", user_id);

    const { error } = await supabase.auth.admin.deleteUser(user_id);

    if (error || SavedError) {
      return NextResponse.json(
        { error: error?.message || SavedError?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User deleted successfully",
      status: 200,
      data,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const verifyAlbumDeleted = async (
  artist: string,
  album: string,
  userId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from("saved")
    .select("*")
    .eq("artist", artist)
    .eq("album", album)
    .eq("user_id", userId)
    .single();

  return !!data;
};

export const fetchMostSavedAlbums = async (limit: number) => {
  try {
    const { data: collection, error } = await supabase
      .from("collection")
      .select("*")
      .order("saves", { ascending: false })
      .limit(limit);
    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 500 });
    }
    return NextResponse.json({
      message: "Most saved albums fetched successfully",
      status: 200,
      collection,
    });
  } catch (error) {
    console.error("Error fetching most saved albums:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
