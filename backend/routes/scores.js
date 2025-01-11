const express = require("express");
const Score = require("../models/Score");
const auth = require("../middleware/auth");

const router = express.Router();

// Submit new score (protected route)
router.post("/", auth, async (req, res) => {
  try {
    const { algorithm, score, timeSpent, movesCount } = req.body;
    const userId = req.user.id;

    const newScore = new Score({
      userId,
      algorithm,
      score,
      timeSpent,
      movesCount,
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get leaderboard for specific algorithm
router.get("/leaderboard/:algorithm", async (req, res) => {
  try {
    const { algorithm } = req.params;
    const { limit = 10 } = req.query;

    const leaderboard = await Score.find({ algorithm })
      .sort({ score: -1 })
      .limit(Number(limit))
      .populate("userId", "username")
      .select("score timeSpent movesCount createdAt");

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's personal best scores
router.get("/personal", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const personalBests = await Score.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: "$algorithm",
          bestScore: { $first: "$score" },
          bestTime: { $first: "$timeSpent" },
          bestMoves: { $first: "$movesCount" },
          lastPlayed: { $first: "$createdAt" },
        },
      },
    ]);

    res.json(personalBests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;