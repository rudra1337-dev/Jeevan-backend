// routes/requestHistoryRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const Request = require("../models/Request");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware.js"); // JWT Middleware

const router = express.Router();

// GET /api/requests/history
router.get("/history", verifyToken, async (req, res) => {
  try {
    // Get email from JWT
    const { email } = req.user;

    // Find user by email, exclude password
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure user._id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find all requests for this user & populate details
    const requests = await Request.find({ user: user._id })
      .populate({ path: "user", select: "-password" })
      .sort({ createdAt: -1 }); // Latest first

    // Handle case when no requests found
    if (requests.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "No requests found for this user",
        requests: [],
      });
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;