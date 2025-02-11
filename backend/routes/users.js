const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use absolute path
    const uploadPath = path.join(__dirname, "../../uploads/profile-images");
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Update username route
router.put("/update-username", auth, async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.userId;

    // Validate username
    if (!username || username.trim().length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters long",
      });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Sorry, that username is already taken",
      });
    }

    // Update username
    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Update username error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Update profile image route
router.put("/update-profile-image", auth, async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, "../../uploads/profile-images");
    await fs.mkdir(uploadDir, { recursive: true });

    upload.single("image")(req, res, async function (err) {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete old profile image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads/profile-images",
          path.basename(user.profileImage)
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Update the image URL to match the static serve path
      const imageUrl = `/uploads/profile-images/${req.file.filename}`;
      user.profileImage = imageUrl;
      await user.save();

      console.log("Image uploaded successfully:", imageUrl);
      res.json({ imageUrl });
    });
  } catch (error) {
    console.error("Update profile image error:", error);
    res.status(500).json({
      message: "Failed to update profile image",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Delete profile image route
router.delete("/delete-profile-image", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage) {
      const imagePath = path.join(
        __dirname,
        "../../uploads/profile-images/",
        path.basename(user.profileImage)
      );
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    user.profileImage = null;
    await user.save();

    res.json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
