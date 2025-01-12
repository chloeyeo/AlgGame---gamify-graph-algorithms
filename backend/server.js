const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/scores");

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
// updated CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-url.netlify.app"] // my Netlify URL
        : ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Basic health check route
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
