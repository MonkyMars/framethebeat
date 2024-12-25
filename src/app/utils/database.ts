export const fetchUserCollection = async (id: number) => {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data: data, status: 200 };
  } catch (error) {
    console.error("Error signing up user:", error);
    return { data: error, status: 200 };
  }
};

export const logInUser = async (email: string, password: string) => {
  try{
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data: data, status: 200 };
  } catch (error) {
    console.error("Error signing up user:", error);
    return { data: error, status: 200 };
  }
};