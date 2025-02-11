const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/scores");
const userRoutes = require("./routes/users");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
// updated CORS configuration
// origin:
//   process.env.NODE_ENV === "production"
//     ? ["https://algggame.netlify.app"] // my Netlify URL
//     : ["http://localhost:3000"],
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://algggame.netlify.app",
      "https://alggame-backend.onrender.com",
      "https://alggame.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads/profile-images");
fs.mkdirSync(uploadDir, { recursive: true });

// Serve static files from the correct path
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Your routes
app.use("/api/users", userRoutes);

// Basic health check route
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI.replace(
        /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
        "mongodb+srv://***:***@"
      )
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if can't connect to database
  });

// Add this to test the routes are properly set up
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
