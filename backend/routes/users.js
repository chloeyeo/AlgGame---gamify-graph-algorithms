const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

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

module.exports = router;
