"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateRandomGraph } from "@/components/GamePageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import { toast } from "react-hot-toast";

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

const isValidMove = (state, nodeId) => {
  const newState = { ...state };
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);
  const visited = new Set(newState.visitedNodes);

  // First move - matches education page initialization
  if (!newState.currentNode) {
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.queue = [nodeId];
    newState.visitedNodes = [nodeId];
    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Starting BFS from node ${nodeId}`,
    };
  }

  // Get unvisited neighbors using the same logic as education page
  const neighbors = newState.edges
    .filter(
      (edge) =>
        (edge.source === newState.currentNode && !visited.has(edge.target)) ||
        (edge.target === newState.currentNode && !visited.has(edge.source))
    )
    .map((edge) =>
      edge.source === newState.currentNode ? edge.target : edge.source
    )
    .sort();

  // If clicked node is the next node in queue (following BFS order)
  if (newState.queue[0] === nodeId) {
    const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
    prevNode.current = false;
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.queue.shift(); // dequeue the current node

    // Add unvisited neighbors to queue (like in education page)
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor) && !newState.queue.includes(neighbor)) {
        newState.queue.push(neighbor);
      }
    });

    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Processing node ${nodeId} in BFS order`,
    };
  }

  return {
    validMove: false,
    newState: state,
    nodeStatus: "incorrect",
    message:
      "Invalid move! In BFS, you must visit nodes in queue order, level by level.",
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

    setGraphState(generateInitialGraphState(nodeCount, difficulty));
  };

  return (
    <GamePageStructure
      title="BFS Graph Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      getScore={(status) => (status === "correct" ? 10 : -5)}
      getMessage={(status, nodeId) =>
        status === "incorrect"
          ? "Invalid move! In BFS, you must visit nodes in queue order, level by level."
          : `Valid move to node ${nodeId}`
      }
      isGameComplete={isGameComplete}
      onRoundComplete={handleRoundComplete}
      round={round}
      totalScore={totalScore}
      difficulty={difficulty}
      onDifficultySelect={handleDifficultySelect}
      initialMessage="Start BFS from any node!"
    />
  );
};

export default BFSGamePage;
