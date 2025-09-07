// routes/requestAllRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const Request = require("../models/Request");
const verifyToken = require("../middleware/authMiddleware.js");
const checkMemberRole = require("../middleware/roleMiddleware.js");

const router = express.Router();

// GET /api/requests/all
router.get("/all-history", verifyToken, checkMemberRole, async (req, res) => {
  try {
    // Fetch all requests with user details
    const requests = await Request.find({})
      .populate({ path: "user", select: "-password" })
      .sort({ createdAt: -1 })
      .lean();

    if (requests.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "No requests found",
        requests: [],
      });
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      message: "Requests fetched successfully",
      requests,
    });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;