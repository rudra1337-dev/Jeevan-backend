// routes/profileRoutes.js
const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/profile
// @desc    Get user profile using token
// @access  Private
router.get("/", verifyToken, async (req, res) => {
  try {
    const { email, role } = req.user; // from decoded token

    const user = await User.findOne({ email, role }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ message: "Server error ⚠️" });
  }
});

module.exports = router;