const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/:userId", verifyToken, userController.getProfile);
router.put("/:userId", verifyToken, userController.updateProfile);

module.exports = router;
