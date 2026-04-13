const express = require("express");
const router = express.Router();
const scoresController = require("../controllers/scoresController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, scoresController.saveScore);
router.get("/leaderboard", scoresController.getLeaderboard);

module.exports = router;
