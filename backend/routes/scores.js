const express = require("express");
const Score = require("../models/Score");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

// Submit new score (protected route)
router.post("/", auth, async (req, res) => {
  try {
    const { algorithm, score, timeSpent, movesCount, difficulty } = req.body;
    const userId = req.user.userId;

    if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty level" });
    }

    const newScore = new Score({
      userId,
      algorithm,
      score,
      timeSpent,
      movesCount,
      difficulty,
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    console.error("Score submission error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get leaderboard for specific algorithm
router.get("/leaderboard/:algorithm", async (req, res) => {
  try {
    const { algorithm } = req.params;
    const { limit = 10 } = req.query;

    console.log(`Fetching leaderboard for ${algorithm}`); // Debug log

    const leaderboard = await Score.find({
      algorithm,
      difficulty: req.query.difficulty || "easy",
    })
      .sort({ score: -1 })
      .limit(Number(limit))
      .populate("userId", "username")
      .select("score timeSpent movesCount difficulty createdAt");

    console.log(`Found ${leaderboard.length} scores`); // Debug log

    res.json(leaderboard || []); // Ensure we always send an array
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.json([]); // Return empty array instead of error
  }
});

// Get user's personal best scores
router.get("/personal", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const personalBests = await Score.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
        },
      },
      {
        $sort: {
          algorithm: 1,
          score: -1,
          timeSpent: 1,
        },
      },
      {
        $group: {
          _id: "$algorithm",
          scores: {
            $push: {
              score: "$score",
              timeSpent: "$timeSpent",
              movesCount: "$movesCount",
              difficulty: "$difficulty",
              _id: "$_id",
              createdAt: "$createdAt",
            },
          },
        },
      },
    ]);

    res.json(personalBests);
  } catch (error) {
    console.error("Personal stats error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
