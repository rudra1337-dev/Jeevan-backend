const express = require("express");
const verifyToken = require("../middleware/authMiddleware.js");
const { addTokenToBlacklist } = require("../middleware/tokenBlacklist.js");

const router = express.Router();

// POST /api/auth/logout
router.post("/logout", verifyToken, (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  addTokenToBlacklist(token);

  res.status(200).json({ message: "Logged out successfully ✅" });
});

module.exports = router;