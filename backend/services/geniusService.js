const axios = require("axios");
const seedData = require("../models/seedData");

const GENIUS_BASE_URL = "https://api.genius.com";

const geniusApi = axios.create({
  baseURL: GENIUS_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.GENIUS_API_KEY}`,
  },
});

const searchArtist = async (artistName) => {
  try {
    const response = await geniusApi.get("/search", {
      params: { q: artistName },
    });

    const hits = response.data.response.hits;
    if (!hits.length) {
      return null;
    }

    const artist = hits[0].result.primary_artist;
    return {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.image_url,
    };
  } catch (error) {
    console.error("Error searching artist:", error.message);
    throw error;
  }
};

const getSongsByArtist = async (artistName) => {
  try {
    const response = await geniusApi.get("/search", {
      params: { q: artistName },
    });

    const hits = response.data.response.hits;
    const songs = hits
      .filter(
        (hit) =>
          hit.result.primary_artist.name.toLowerCase() ===
          artistName.toLowerCase()
      )
      .map((hit) => ({
        id: hit.result.id,
        title: hit.result.title,
        url: hit.result.url,
        thumbnailUrl: hit.result.song_art_image_thumbnail_url,
      }));

    return songs;
  } catch (error) {
    console.error("Error getting songs:", error.message);
    throw error;
  }
};

const getLyrics = async (songId) => {
  // Lyrics scraping requires additional implementation (e.g., web scraping the Genius song page).
  // The Genius API does not directly provide full lyrics.
  // Consider using a library like genius-lyrics or cheerio to scrape lyrics from the song URL.
  return {
    note: "Lyrics scraping requires additional implementation. The Genius API does not provide full lyrics directly.",
    songId,
  };
};

const getSeedDataForArtist = async (artistName) => {
  // Return pre-seeded data if available, otherwise call API
  const seeded = seedData[artistName];
  if (seeded) {
    return seeded;
  }

  // Fall back to API search
  const songs = await getSongsByArtist(artistName);
  return { songs };
};

module.exports = { searchArtist, getSongsByArtist, getLyrics, getSeedDataForArtist };
