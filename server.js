const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db.js");
const User = require("./models/User.js");
const Request = require("./models/Request.js");
const AuthRoute = require("./routes/authRoutes.js");
const SignIn = require("./routes/signIn.js");
const Profile = require("./routes/profileRoutes.js");
const ProfileUpdate = require("./routes/profileUpdateRoutes.js");
const RequestSubmit = require("./routes/requestSubmitRoutes.js");
const RequestHistory = require("./routes/requestHistory.js");
const AllRequestHistory = require("./routes/allRequestHistory.js");
const VerifyToken = require("./routes/verifyToken.js");
const LogoutRoute = require("./routes/logOut.js");


dotenv.config(); // Load .env variables

const app = express();


// Security Middleware
app.use(helmet());

// Enable CORS for local frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rudra1337-dev.github.io"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running and connected to DB!");
});

// Routes
app.use("/api/auth", AuthRoute); // Signup
app.use("/api/auth", SignIn);
app.use("/api/auth", LogoutRoute);
app.use("/api/auth", VerifyToken);
app.use("/api/profile", Profile);
app.use("/api/profile", ProfileUpdate);
app.use("/api/request", RequestSubmit);
app.use("/api/request", RequestHistory);
app.use("/api/request", AllRequestHistory);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));