import { supabase } from "./supabase";

interface ReturnAlbumData {
  id: number;
  albumArtist: string;
  albumTitle: string;
  albumCategory?: string;
  albumDate: string;
  albumCover: {
    src: string;
    alt: string;
  };
}

interface AlbumDataModel {
  mbid: string;
  artist: string;
  name: string;
  image: { "#text": string }[];
  tags?: { tag?: { name: string }[] };
}

export const knownGenres: string[] = [
  "rock",
  "pop",
  "alternative",
  "alternative rock",
  "indie",
  "electronic",
  "metal",
  "hip-hop",
  "jazz",
  "classical",
  "punk",
  "rap",
  "folk",
  "soul",
  "hard rock",
  "soft rock",
  "progressive rock",
  "psychedelic rock",
  "garage rock",
  "grunge",
  "post-rock",
  "arena rock",
  "math rock",
  "synth-pop",
  "electropop",
  "k-pop",
  "j-pop",
  "dance-pop",
  "teen pop",
  "bubblegum pop",
  "death metal",
  "black metal",
  "thrash metal",
  "doom metal",
  "power metal",
  "symphonic metal",
  "nu-metal",
  "progressive metal",
  "house",
  "techno",
  "trance",
  "dubstep",
  "drum and bass",
  "ambient",
  "chiptune",
  "idm",
  "lo-fi",
  "future bass",
  "downtempo",
  "trap",
  "boom bap",
  "drill",
  "gangsta rap",
  "conscious hip-hop",
  "freestyle",
  "mumble rap",
  "lo-fi hip-hop",
  "smooth jazz",
  "bebop",
  "swing",
  "fusion",
  "free jazz",
  "cool jazz",
  "latin jazz",
  "acid jazz",
  "baroque",
  "romantic",
  "modern classical",
  "opera",
  "symphonic",
  "minimalism",
  "neoclassical",
  "chamber music",
  "pop punk",
  "post-punk",
  "hardcore punk",
  "crust punk",
  "ska punk",
  "folk punk",
  "emo punk",
  "reggae",
  "dancehall",
  "ska",
  "blues",
  "funk",
  "disco",
  "bluegrass",
  "world",
  "latin",
  "afrobeat",
  "reggaeton",
  "samba",
  "bossa nova",
  "flamenco",
  "edm",
  "trap",
  "synthwave",
  "vaporwave",
  "hyperpop",
  "cloud rap",
  "future funk",
  "neo-soul",
  "electro-swing",
  "cumbia",
  "tango",
  "mariachi",
  "klezmer",
  "celtic",
  "indian classical",
  "bollywood",
  "african",
  "balkan",
  "native american",
  "australian aboriginal",
  "noise",
  "avant-garde",
  "industrial",
  "shoegaze",
  "post-rock",
  "dream pop",
  "no wave",
  "glitch",
  "psytrance",
  "americana",
  "british folk",
  "celtic folk",
  "traditional folk",
  "folk rock",
  "neofolk",
  "world folk",
  "chillout",
  "meditation",
  "spoken word",
  "soundtrack",
  "musical theater",
  "video game music",
  "children's music",
  "holiday",
  "christian",
  "gospel",
  "new age",
  "psychedelic",
  "art rock",
  "garage punk",
  "emo",
  "ska-core",
  "progressive trance",
  "hard trance",
  "uk garage",
  "speed metal",
  "blackgaze",
  "country",
  "outlaw country",
  "cowpunk",
  "southern rock",
  "nashville sound",
  "space rock",
  "krautrock",
  "ethereal wave",
  "breakbeat",
  "gabber",
  "jungle",
  "hardcore techno",
  "happy hardcore",
  "new wave",
  "dark wave",
  "cold wave",
  "grindcore",
  "sludge metal",
  "djent",
  "melodic death metal",
  "industrial rock",
  "industrial metal",
  "gothic rock",
  "gothic metal",
  "nu-gaze",
  "post-metal",
  "stoner rock",
  "stoner metal",
  "surf rock",
  "exotica",
  "zydeco",
  "tex-mex",
  "mariachi punk",
  "desert blues",
  "mbalax",
  "highlife",
  "calypso",
  "mento",
  "roots reggae",
  "dub reggae",
  "dub",
  "electro",
  "breakcore",
  "trap soul",
  "witch house",
  "dark ambient",
  "neurofunk",
  "screamo",
  "cybergrind",
  "glam rock",
  "glam metal",
  "barbershop",
  "a cappella",
  "acid house",
  "tech house",
  "deep house",
  "funky house",
  "latin house",
  "afro house",
  "afrobeats",
  "gqom",
  "kuduro",
  "bachata",
  "merengue",
  "salsa",
  "charanga",
  "son cubano",
  "bolero",
  "tropipop",
  "bossa nova",
  "piano jazz",
  "stride",
  "ragtime",
  "big band",
  "afro-cuban jazz",
  "bebop revival",
  "gypsy jazz",
  "manouche",
  "progressive folk",
  "newgrass",
  "nordic folk",
  "slavic folk",
  "sea shanties",
  "minimal wave",
  "vaportrap",
  "future house",
  "moombahton",
  "tropical house",
  "uk drill",
  "phonk",
  "bedroom pop",
  "chillwave",
  "bedroom rock",
  "dreamcore",
  "post-hardcore",
  "emocore",
  "nu-punk",
  "rnb",
  "soul jazz",
  "dance",
  "synthpop",
  "canadian",
];

export const parseAlbumData = (model: AlbumDataModel): ReturnAlbumData => {
  const getCategory = (tags: AlbumDataModel["tags"]) => {
    if (!tags?.tag) return undefined;
    if (Array.isArray(tags.tag) && tags.tag.length === 1) {
      const tagName = tags.tag[0].name.toLowerCase();
      return knownGenres.includes(tagName) ? tagName : undefined;
    }
    const data =
      (Array.isArray(tags.tag) &&
        tags.tag.map((tag) => tag.name.toLowerCase())) ||
      [];
    return data.find((tag) => knownGenres.includes(tag)) || undefined;
  };
  const Category = getCategory(model.tags);
  return {
    id: parseInt(model.mbid),
    albumArtist: model.artist,
    albumTitle: model.name,
    albumCategory: Category,
    albumDate: model.tags?.tag?.[0]?.name || "",
    albumCover: {
      src: model.image[5]["#text"].replace("http:", "https:"),
      alt: `${model.name} album cover`,
    },
  };
};

export const getAlbumData = (
  album: string,
  artist: string
): string => {
  try {
    const filename = `${album}-${artist}`.replace(/[^a-zA-Z0-9-_\.]/g, '_');
    const { data } = supabase.storage.from("albumcovers").getPublicUrl(`images/${filename}`);
    if(!data) {
      console.error(`No data found for album cover for ${album} by ${artist}`);
      return '/placeholder.png';
    }
    console.log(`Fetched album data for ${album} by ${artist}:`, data);
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

export const isGif = (src?: string): boolean => {
  const extension = src?.split(".").pop()?.toLowerCase();
  return extension === "gif";
};
