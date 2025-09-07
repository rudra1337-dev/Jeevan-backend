// routes/requestRoutes.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Request = require("../models/Request");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware.js"); // Middleware to decode JWT

const router = express.Router();

// POST /api/requests
router.post(
  "/form",
  verifyToken,
  [
    body("why")
      .notEmpty()
      .withMessage("Reason (why) is required")
      .isLength({ min: 3 })
      .withMessage("Reason must be at least 3 characters long"),
    body("what")
      .notEmpty()
      .withMessage("Details (what) are required")
      .isLength({ min: 3 })
      .withMessage("Details must be at least 3 characters long"),
    body("where").notEmpty().withMessage("Location (where) is required"),
    body("priority")
      .notEmpty()
      .withMessage("Priority is required")
      .isIn(["low", "medium", "high", "critical"])
      .withMessage("Priority must be low, medium, high, or critical"),
  ],
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get email from JWT
      const { email } = req.user;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Ensure user._id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(user._id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Create new request
      const newRequest = new Request({
        why: req.body.why,
        what: req.body.what,
        where: req.body.where,
        priority: req.body.priority,
        user: user._id, // Assign user from JWT
      });

      // Save and populate user (exclude password)
      await newRequest.save();
      await newRequest.populate({ path: "user", select: "-password" });

      res.status(201).json({
        success: true,
        message: "Request submitted successfully",
        request: newRequest,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;