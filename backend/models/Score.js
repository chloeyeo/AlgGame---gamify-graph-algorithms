const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  algorithm: {
    type: String,
    required: true,
    enum: [
      "dfs",
      "bfs",
      "dijkstra",
      "astar",
      "kruskal",
      "prim",
      "fordFulkerson",
      "edmondsKarp",
    ],
  },
  score: {
    type: Number,
    required: true,
  },
  timeSpent: {
    type: Number,
    required: true,
  },
  movesCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster leaderboard queries
scoreSchema.index({ algorithm: 1, score: -1 });

module.exports = mongoose.model("Score", scoreSchema);