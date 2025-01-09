export interface Album {
  artist: string;
  album: string;
  saves: number;
  release_date: number;
  genre: string;
  albumCover: {
    src: string;
    alt: string;
  };
}

export interface DeleteResponse {
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

export interface SaveResponse {
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
