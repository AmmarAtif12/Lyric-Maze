const express = require("express");
const router = express.Router();
const lyricsController = require("../controllers/lyricsController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/quiz/:artist", verifyToken, lyricsController.getQuizQuestion);
router.get("/:artist", verifyToken, lyricsController.getLyrics);

module.exports = router;
