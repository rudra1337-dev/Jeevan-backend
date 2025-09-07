// middleware/roleMiddleware.js
module.exports = function (req, res, next) {
  try {
    if (!req.user || req.user.role.toLowerCase() !== "member") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Members only.",
      });
    }
    next();
  } catch (err) {
    console.error("Role check error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};