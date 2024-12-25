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