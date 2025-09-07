const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware.js"); // external JWT middleware

const router = express.Router();

// PATCH /api/profile/update
router.patch(
  "/update",
  verifyToken,
  [
    body("name").optional().isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
    body("adhar").optional().matches(/^\d{4}-\d{4}-\d{4}$/).withMessage("Invalid Aadhar format"),
    body("age").optional().isInt({ min: 1, max: 120 }).withMessage("Age must be between 1 and 120"),
    body("bloodGroup").optional().isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).withMessage("Invalid blood group"),
    body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
    body("phone").optional().matches(/^\d{10}$/).withMessage("Phone must be exactly 10 digits"),
    body("relativePhone").optional().matches(/^\d{10}$/).withMessage("Relative phone must be exactly 10 digits"),
    body("email").optional().isEmail().withMessage("Invalid email address"),
    body("location").optional().notEmpty().withMessage("Location cannot be empty"),
    body("photo").optional().isURL().withMessage("Photo must be a valid URL"),
    body("role").optional().isIn(["citizen", "member"]).withMessage("Role must be citizen or member"),
  ],
  async (req, res) => {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, role } = req.user; // from JWT

      // Find and update user
      const updatedUser = await User.findOneAndUpdate(
        { email, role },
        { $set: req.body },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;