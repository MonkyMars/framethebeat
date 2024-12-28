const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface API_RESPONSE {
  album: {
    mbid: string;
    artist: string;
    name: string;
    image: { "#text": string }[];
    tags: { tag: { name: string }[] };
    wiki?: {
      content: string;
      summary: string;
      published: string;
    };
  };
}

interface ReturnAlbumData {
  id: number;
  albumArtist: string;
  albumTitle: string;
  albumCategory?: string;
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
  tags?: { tag?: { name: string }[]};
  wiki?: {
    content: string;
    summary: string;
    published: string;
  };
}

const knownGenres: string[] = [
  "rock", "pop", "alternative", "alternative rock","indie", "electronic", "metal", 
  "hip-hop", "jazz", "classical", "punk", "rap", "folk", "soul",
  "hard rock", "soft rock", "progressive rock", "psychedelic rock", 
  "garage rock", "grunge", "post-rock", "arena rock", "math rock",
  "synth-pop", "electropop", "k-pop", "j-pop", "dance-pop", 
  "teen pop", "bubblegum pop", "death metal", "black metal", 
  "thrash metal", "doom metal", "power metal", "symphonic metal", 
  "nu-metal", "progressive metal", "house", "techno", "trance", 
  "dubstep", "drum and bass", "ambient", "chiptune", "idm", 
  "lo-fi", "future bass", "downtempo", "trap", "boom bap", 
  "drill", "gangsta rap", "conscious hip-hop", "freestyle", 
  "mumble rap", "lo-fi hip-hop", "smooth jazz", "bebop", 
  "swing", "fusion", "free jazz", "cool jazz", "latin jazz", 
  "acid jazz", "baroque", "romantic", "modern classical", "opera", 
  "symphonic", "minimalism", "neoclassical", "chamber music", 
  "pop punk", "post-punk", "hardcore punk", "crust punk", 
  "ska punk", "folk punk", "emo punk", "reggae", "dancehall", 
  "ska", "blues", "funk", "disco", "bluegrass", "world", 
  "latin", "afrobeat", "reggaeton", "samba", "bossa nova", 
  "flamenco", "edm", "trap", "synthwave", "vaporwave", 
  "hyperpop", "cloud rap", "future funk", "neo-soul", 
  "electro-swing", "cumbia", "tango", "mariachi", "klezmer", 
  "celtic", "indian classical", "bollywood", "african", "balkan", 
  "native american", "australian aboriginal", "noise", "avant-garde", 
  "industrial", "shoegaze", "post-rock", "dream pop", "no wave", 
  "glitch", "psytrance", "americana", "british folk", "celtic folk", 
  "traditional folk", "folk rock", "neofolk", "world folk", 
  "chillout", "meditation", "spoken word", "soundtrack", 
  "musical theater", "video game music", "children's music", 
  "holiday", "christian", "gospel", "new age", "psychedelic", 
  "art rock", "garage punk", "emo", "ska-core", "progressive trance", 
  "hard trance", "uk garage", "speed metal", "blackgaze", 
  "country", "outlaw country", "cowpunk", "southern rock", 
  "nashville sound", "space rock", "krautrock", "ethereal wave", 
  "breakbeat", "gabber", "jungle", "hardcore techno", "happy hardcore", 
  "new wave", "dark wave", "cold wave", "grindcore", "sludge metal", 
  "djent", "melodic death metal", "industrial rock", "industrial metal", 
  "gothic rock", "gothic metal", "nu-gaze", "post-metal", "stoner rock", 
  "stoner metal", "surf rock", "exotica", "zydeco", "tex-mex", 
  "mariachi punk", "desert blues", "mbalax", "highlife", "calypso", 
  "mento", "roots reggae", "dub reggae", "dub", "electro", 
  "breakcore", "trap soul", "witch house", "dark ambient", 
  "neurofunk", "screamo", "cybergrind", "glam rock", "glam metal", 
  "barbershop", "a cappella", "acid house", "tech house", 
  "deep house", "funky house", "latin house", "afro house", 
  "afrobeats", "gqom", "kuduro", "bachata", "merengue", 
  "salsa", "charanga", "son cubano", "bolero", "tropipop", 
  "bossa nova", "piano jazz", "stride", "ragtime", "big band", 
  "afro-cuban jazz", "bebop revival", "gypsy jazz", "manouche", 
  "progressive folk", "newgrass", "nordic folk", "slavic folk", 
  "sea shanties", "minimal wave", "vaportrap", "future house", 
  "moombahton", "tropical house", "uk drill", "phonk", 
  "bedroom pop", "chillwave", "bedroom rock", "dreamcore", 
  "post-hardcore", "emocore", "nu-punk", "rnb", "soul jazz", "dance", "synthpop", "canadian"
];

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
        if (match[1].length === 4 && !isNaN(Number(match[1]))) {
          return match[1];
        }
        return new Date(match[1]).getFullYear().toString();
      } catch {
        const yearMatch = match[1].match(/\d{4}/);
        if (yearMatch) {
          return yearMatch[0];
        }
      }
    }
  }

  return undefined;
};



export const parseAlbumData = (model: AlbumDataModel): ReturnAlbumData => {
  const releaseDate = 
    model.wiki ? getAlbumReleaseDate(model?.wiki?.content) || 
    getAlbumReleaseDate(model?.wiki?.summary) || 
    model.wiki.published.split(" ")[2].replace(',', '') : "unknown";

    const getCategory = (tags: AlbumDataModel["tags"]) => {
      if (!tags?.tag) return undefined;
      if (Array.isArray(tags.tag) && tags.tag.length === 1) {
      const tagName = tags.tag[0].name.toLowerCase();
      return knownGenres.includes(tagName) ? tagName : undefined;
      }
      const data = Array.isArray(tags.tag) && tags.tag.map(tag => tag.name.toLowerCase()) || [];
      return data.find(tag => knownGenres.includes(tag)) || undefined;
    };
    const Category = getCategory(model.tags);
  return {
    id: parseInt(model.mbid),
    albumArtist: model.artist,
    albumTitle: model.name,
    albumCategory: Category,
    albumCover: {
      src: model.image[5]["#text"].replace("http:", "https:"),
      alt: `${model.name} album cover`,
    },
    albumDate: releaseDate,
  };
};


export const getAlbumData = async (album: string, artist: string): Promise<ReturnAlbumData[] | undefined> => {
  try {
          const response = await fetch(
            `${API_URL}/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(
              artist
            )}&album=${encodeURIComponent(album)}&format=json`
          );
          const data = await response.json();
          const { album: model } = data as API_RESPONSE;
          if (!model) {
            return;
          }
          const albumData = parseAlbumData(model);
          const returnData: ReturnAlbumData[] = [
            {
              id: albumData.id,
              albumTitle: albumData.albumTitle,
              albumArtist: albumData.albumArtist,
              albumDate: albumData.albumDate,
              albumCategory: albumData.albumCategory,
              albumCover: {
                src: albumData.albumCover.src,
                alt: albumData.albumCover.alt,
              },
            },
          ];
          return returnData;
        } catch (error) {
          console.error(
            `Error fetching album data for ${album} by ${artist}:`,
            error
          );
        }
};

export const isHighPriority = (src?: string): boolean => {
  if (!src || src.includes("placeholder")) return false;
  const extension = src.split(".").pop()?.toLowerCase();
  return extension !== "gif";
};

export const isGif = (src?: string): boolean => {
  const extension = src?.split(".").pop()?.toLowerCase();
  return extension === "gif";
};