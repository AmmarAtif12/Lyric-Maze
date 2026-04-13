const geniusService = require("../services/geniusService");

const getLyrics = async (req, res, next) => {
  try {
    const { artist } = req.params;
    const songs = await geniusService.getSongsByArtist(decodeURIComponent(artist));

    res.json({ artist: decodeURIComponent(artist), songs });
  } catch (error) {
    next(error);
  }
};

const getQuizQuestion = async (req, res, next) => {
  try {
    const { artist } = req.params;
    const artistName = decodeURIComponent(artist);
    const data = await geniusService.getSeedDataForArtist(artistName);

    if (!data || !data.songs || data.songs.length < 4) {
      return res
        .status(404)
        .json({ error: "Not enough songs found for this artist" });
    }

    const songs = data.songs;

    // Pick a random song as the correct answer
    const correctIndex = Math.floor(Math.random() * songs.length);
    const correctSong = songs[correctIndex];

    // Get lyric snippet (4 lines)
    const lines = correctSong.lyrics.split("\n");
    const snippet = lines.slice(0, 4).join("\n");

    // Generate wrong options from other songs by the same artist
    const otherSongs = songs.filter((_, i) => i !== correctIndex);
    const shuffled = otherSongs.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3).map((s) => s.title);

    // Build multiple choice options and shuffle
    const options = [correctSong.title, ...wrongOptions].sort(
      () => Math.random() - 0.5
    );

    res.json({
      artist: artistName,
      lyricSnippet: snippet,
      options,
      correctAnswer: correctSong.title,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLyrics, getQuizQuestion };
