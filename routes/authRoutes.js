const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  "/signup",
  [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("adhar").matches(/^\d{4}-\d{4}-\d{4}$/).withMessage("Aadhar must be in the format XXXX-XXXX-XXXX"),
    body("age").isInt({ min: 1, max: 120 }).withMessage("Age must be between 1 and 120"),
    body("bloodGroup").isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).withMessage("Invalid blood group"),
    body("gender").isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
    body("phone").matches(/^\d{10}$/).withMessage("Phone number must be exactly 10 digits"),
    body("relativePhone").matches(/^\d{10}$/).withMessage("Relative's phone must be exactly 10 digits"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("location").notEmpty().withMessage("Location is required"),
    body("role").optional().isIn(["citizen", "member"]).withMessage("Role must be either citizen or member"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, adhar, age, bloodGroup, gender, phone, relativePhone, email, location, photo, role, password } = req.body;

    try {
      // Check if user exists
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      existingUser = await User.findOne({ adhar });
      if (existingUser) {
        return res.status(400).json({ message: "Aadhar already registered" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = new User({
        name,
        adhar,
        age,
        bloodGroup,
        gender,
        phone,
        relativePhone,
        email,
        location,
        photo,
        role,
        password: hashedPassword,
      });

      await newUser.save();

      // Create JWT token
      const payload = {
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d"
      });

      

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: payload,
      });
    } catch (err) {
  console.error("Signup error:", err.message); // log short error
  console.error(err); // log full stack trace
  res.status(500).json({ message: err.message }); // send real error for debugging
}
  }
);

module.exports = router;