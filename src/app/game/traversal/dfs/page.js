"use client";

import React, { useState, useEffect } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateRandomGraph } from "@/components/GamePageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import { toast } from "react-hot-toast";
import { isValidDFSMove } from "@/utils/graphAlgorithms";

const generateInitialGraphState = (nodeCount, difficulty = "medium") => {
  const { nodes, edges } = generateRandomGraph(nodeCount, difficulty);

  return {
    nodes: nodes.map((node) => ({
      ...node,
      visited: false,
      backtracked: false,
      current: false,
    })),
    edges,
    currentNode: null,
    stack: [],
    visitedNodes: [],
    backtrackedNodes: [],
    round: 1,
  };
};

const DFSGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(4);
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(4)
  );
  const [bestScores, setBestScores] = useState([]);

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(
      generateInitialGraphState(fixedNodeCount, selectedDifficulty)
    );
  };

  const handleRoundComplete = async (currentScore) => {
    setRound((prev) => prev + 1);
    setTotalScore((prev) => prev + currentScore);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/scores/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          algorithm: "dfs",
          difficulty: difficulty,
          score: currentScore,
          timeSpent: Date.now() - startTime,
          movesCount: moves,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error("Failed to save score");
    }

    // Generate new graph for next round
    setGraphState(generateInitialGraphState(nodeCount, difficulty));
  };

  const getNodeStatus = (node) => {
    if (node.current) return "current";
    if (node.backtracked) return "backtracked";
    if (node.visited) return "visited";
    return "unvisited";
  };

  const isGameComplete = (state) => {
    // Game is complete when all nodes are visited AND backtracked
    // (except the last node we end up at)
    const allNodesVisited = state.nodes.every((node) => node.visited);
    const allNodesBacktrackedExceptCurrent = state.nodes
      .filter((node) => !node.current)
      .every((node) => node.backtracked);

    return allNodesVisited && allNodesBacktrackedExceptCurrent;
  };

  return (
    <GamePageStructure
      title="DFS Graph Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidDFSMove}
      getNodeStatus={getNodeStatus}
      getScore={(status) => (status === "correct" ? 10 : -5)}
      getMessage={(status, nodeId) =>
        status === "incorrect"
          ? "Invalid move! Follow DFS rules: visit unvisited neighbors or backtrack when needed."
          : `Valid move to node ${nodeId}`
      }
      isGameComplete={isGameComplete}
      onRoundComplete={handleRoundComplete}
      round={round}
      totalScore={totalScore}
      difficulty={difficulty}
      onDifficultySelect={handleDifficultySelect}
      initialMessage="Start DFS from any node!"
    />
  );
};

export default DFSGamePage;
