export interface AlbumCover {
    src: string;
    alt: string;
}

export interface Album {
    title: string;
    artist: string;
    albumCover: AlbumCover;
    date?: string;
    id: number;
    category?: string;
}