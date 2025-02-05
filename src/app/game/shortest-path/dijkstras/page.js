"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateRandomGraph } from "@/components/GamePageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import { isValidDijkstraMove } from "@/utils/graphAlgorithms";

const generateInitialGraphState = (nodeCount, difficulty = "medium") => {
  const { nodes, edges } = generateRandomGraph(nodeCount, difficulty);

  return {
    nodes: nodes.map((node) => ({
      ...node,
      visited: false,
      distance: Infinity,
      previous: null,
      current: false,
      recentlyUpdated: false,
    })),
    edges: edges.map((edge) => ({
      ...edge,
      weight: Math.floor(Math.random() * 10) + 1,
    })),
    currentNode: null,
    startNode: null,
    endNode: null,
    visitedNodes: [],
  };
};

const DijkstraGamePage = () => {
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
    setRound(1);
  };

  const getNodeStatus = (node) => {
    if (node.current) return "current";
    if (node.visited) return "visited";
    if (node.recentlyUpdated) return "updated";
    return "unvisited";
  };

  const isGameComplete = (state) => {
    return state.nodes.every((node) => node.visited);
  };

  return (
    <GamePageStructure
      title="Dijkstra's Algorithm Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidDijkstraMove}
      getNodeStatus={getNodeStatus}
      getScore={(status) => {
        switch (status) {
          case "correct":
            return 15;
          case "updated":
            return 10;
          case "incorrect":
            return -5;
          default:
            return 0;
        }
      }}
      getMessage={(status, nodeId) =>
        status === "incorrect"
          ? "Invalid move! Choose the unvisited node with smallest distance."
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
      initialMessage="Select a starting node for Dijkstra's algorithm!"
    />
  );
};

export default DijkstraGamePage;
