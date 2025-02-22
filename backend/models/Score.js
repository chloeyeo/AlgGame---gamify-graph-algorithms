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
      "hungarianKuhnMunkres",
    ],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  score: {
    type: Number,
    required: true,
    set: (v) => Number(v),
  },
  timeSpent: {
    type: Number,
    required: true,
    set: (v) => Number(v),
  },
  movesCount: {
    type: Number,
    required: true,
    set: (v) => Number(v),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
scoreSchema.index({ algorithm: 1, score: -1 });
scoreSchema.index({ userId: 1, algorithm: 1 });

module.exports = mongoose.model("Score", scoreSchema);
