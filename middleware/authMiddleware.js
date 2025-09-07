// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("./tokenBlacklist.js");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied ❌" });
  }

  // Check if token is blacklisted
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ message: "Token is blacklisted ❌" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded data to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid ❌" });
  }
};

module.exports = verifyToken;