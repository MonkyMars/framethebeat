export const getAlbumReleaseDate = (text: string): string | undefined => {
  const dateRegexes = [
    /(?:released (?:on|through|via|by) )([A-Za-z]+ \d{1,2}, \d{4})/, // "Month DD, YYYY"
    /(?:released (?:on|through|via|by) )(\d{1,2} [A-Za-z]+ \d{4})/, // "DD Month YYYY"
    /(?:released (?:on|through|via|by) )[A-Za-z]+ (\d{1,2} [A-Za-z]+ \d{4})/, // "Friday DD Month YYYY"
    /(?:released (?:on|through|via|by) )(\d{1,2}-\d{1,2}-\d{4})/, // "DD-MM-YYYY"
    /(?:released (?:on|through|via|by) )(\d{4}-\d{1,2}-\d{1,2})/, // "YYYY-MM-DD"
    /(?:released (?:on|through|via|by) )(\d{1,2}\/\d{1,2}\/\d{4})/, // "DD/MM/YYYY"
    /(?:released (?:on|through|via|by) )(\d{4}\/\d{1,2}\/\d{1,2})/, // "YYYY/MM/DD"
    /(?:released (?:on|through|via|by) )([A-Za-z]+ \d{4})/, // "Month YYYY"
    /released.*?([A-Za-z]+ \d{1,2}, \d{4})/, // Fallback for any text between "released" and date
    /released.*?(\d{1,2} [A-Za-z]+ \d{4})/, // Fallback for any text between "released" and date
    /(?:released )(\d{4})/, // Just the year
    /(?:released in )(\d{4})/, // "released in YYYY"
    /(?:released during )(\d{4})/, // "released during YYYY"
    /(?:released \()(\d{4})/, // "released (YYYY"
  ];

  for (const regex of dateRegexes) {
    const match = text.match(regex);
    if (match) {
      try {
        // For formats that just contain the year, return it directly
        if (match[1].length === 4 && !isNaN(Number(match[1]))) {
          return match[1];
        }
        return new Date(match[1]).getFullYear().toString();
      } catch {
        // If date parsing fails, try to extract just the year
        const yearMatch = match[1].match(/\d{4}/);
        if (yearMatch) {
          return yearMatch[0];
        }
      }
    }
  }

  return undefined;
};

interface ReturnAlbumData {
  id: number;
  albumArtist: string;
  albumTitle: string;
  albumCover: {
    src: string;
    alt: string;
  };
  albumDate: string;
}

interface AlbumDataModel {
  mbid: string;
  artist: string;
  name: string;
  image: { "#text": string }[];
  wiki?: {
    content: string;
    summary: string;
    published: string;
  };
}

export const parseAlbumData = (model: AlbumDataModel): ReturnAlbumData => {
  const releaseDate = 
    model.wiki ? getAlbumReleaseDate(model?.wiki?.content) || 
    getAlbumReleaseDate(model?.wiki?.summary) || 
    model.wiki.published.split(" ")[2].replace(',', '') : "unknown";

  return {
    id: parseInt(model.mbid),
    albumArtist: model.artist,
    albumTitle: model.name,
    albumCover: {
      src: model.image[5]["#text"].replace("http:", "https:"),
      alt: `${model.name} album cover`,
    },
    albumDate: releaseDate,
  };
};