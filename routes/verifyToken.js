// routes/authVerify.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: "Token expired or invalid" });
  }
});

module.exports = router;