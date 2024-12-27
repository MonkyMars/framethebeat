import { supabase } from "./supabase";

export const fetchUserCollection = async (id: string) => {
  try {
    const response = await fetch(
      `/api/saved?user_id=${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user collection:", error);
    throw error;
  }
};

export const saveAlbum = async (artist: string, album: string, user_id: string) => {
  try {
    const response = await fetch(`/api/saved`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artist, album, user_id }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      message: "Album saved successfully",
      status: response.status,
    }
  } catch (error) {
    console.error("Error saving album:", error);
    throw error;
  }
}

export const deleteAlbum = async (artist: string, album: string, user_id: string) => {
  try {
    const response = await fetch(`/api/saved`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artist, album, user_id }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting album:", error);
    throw error;
  }
}

export const fetchCollection = async () => {
  try {
    const response = await fetch(`/api/collection`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw error;
  }
}

export const signupUser = async (email: string, password: string) => {
  try{
    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
     return {data: (`HTTP error! status: ${response.status}`), status: 500};
    }
    const data = await response.json();
    return { data: data, status: data };
  } catch (error) {
    console.error("Error signing up user:", error);
    return { data: error as Error, status: 500 };
  }
};

export const logInUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return { 
      data: data.session,
      status: response.status 
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return { 
      data: error as Error, 
      status: 500 
    };
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
    }
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
