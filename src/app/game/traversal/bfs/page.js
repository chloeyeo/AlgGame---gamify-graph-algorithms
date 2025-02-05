"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateRandomGraph } from "@/components/GamePageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import { toast } from "react-hot-toast";
import { isValidBFSMove } from "@/utils/graphAlgorithms";

const generateInitialGraphState = (nodeCount, difficulty = "medium") => {
  const { nodes, edges } = generateRandomGraph(nodeCount, difficulty);

  return {
    nodes: nodes.map((node) => ({
      ...node,
      visited: false,
      current: false,
    })),
    edges,
    currentNode: null,
    queue: [],
    visitedNodes: [],
    round: 1,
  };
};

const getNodeStatus = (node) => {
  if (node.current) return "current";
  if (node.visited) return "visited";
  return "unvisited";
};

const isGameComplete = (state) => {
  return state.nodes.every((node) => node.visited);
};

const BFSGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(4);
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(4)
  );

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(
      generateInitialGraphState(fixedNodeCount, selectedDifficulty)
    );
  };

  const handleRoundComplete = async (currentScore) => {
    // Prevent multiple state updates by batching them
    const nextRound = round + 1;
    const nextTotalScore = totalScore + currentScore;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/scores/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          algorithm: "bfs",
          difficulty: difficulty,
          score: currentScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error("Failed to save score");
    }

    // Batch state updates
    React.startTransition(() => {
      setRound(nextRound);
      setTotalScore(nextTotalScore);
      setGraphState(generateInitialGraphState(nodeCount, difficulty));
    });
  };

  return (
    <GamePageStructure
      title="BFS Graph Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidBFSMove}
      getNodeStatus={getNodeStatus}
      getScore={(status) => (status === "correct" ? 10 : -5)}
      getMessage={(status, nodeId) =>
        status === "incorrect"
          ? "Invalid move! In BFS, you must visit nodes in queue order, level by level."
          : `Valid move to node ${nodeId}`
      }
      isGameComplete={isGameComplete}
      round={round}
      setRound={setRound}
      totalScore={totalScore}
      setTotalScore={setTotalScore}
      nodeCount={nodeCount}
      difficulty={difficulty}
      onDifficultySelect={handleDifficultySelect}
      initialMessage="Start BFS from any node!"
    />
  );
};

export default BFSGamePage;
