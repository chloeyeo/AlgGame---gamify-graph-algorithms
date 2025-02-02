"use client";

import React, { useState, useEffect } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import {
  generateDFSSteps,
  isValidDFSMove,
} from "@/components/EducationPageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";

// Helper function to generate a simple graph
const generateGameGraph = (nodeCount) => {
  const nodes = [];
  const edges = [];

  // Generate nodes in a circular layout
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: String.fromCharCode(65 + i),
      x: 300 + 200 * Math.cos((2 * Math.PI * i) / nodeCount),
      y: 300 + 200 * Math.sin((2 * Math.PI * i) / nodeCount),
    });
  }

  // Create a connected graph with bidirectional edges
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push(
      { source: nodes[i].id, target: nodes[i + 1].id },
      { source: nodes[i + 1].id, target: nodes[i].id }
    );
  }
  // Connect last and first node
  edges.push(
    { source: nodes[nodes.length - 1].id, target: nodes[0].id },
    { source: nodes[0].id, target: nodes[nodes.length - 1].id }
  );

  // Add some random edges for more interesting paths
  for (let i = 0; i < nodes.length; i++) {
    if (Math.random() > 0.5) {
      const target = Math.floor(Math.random() * nodes.length);
      if (
        target !== i &&
        !edges.some(
          (e) =>
            (e.source === nodes[i].id && e.target === nodes[target].id) ||
            (e.source === nodes[target].id && e.target === nodes[i].id)
        )
      ) {
        edges.push(
          { source: nodes[i].id, target: nodes[target].id },
          { source: nodes[target].id, target: nodes[i].id }
        );
      }
    }
  }

  return { nodes, edges };
};

// Define this function before using it in useState
const generateInitialGraphState = (nodeCount) => {
  const { nodes, edges } = generateGameGraph(nodeCount);
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
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(4)
  );

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const initialNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setGraphState(generateInitialGraphState(initialNodeCount));
  };

  const handleRoundComplete = (currentScore) => {
    setRound((prev) => prev + 1);
    setTotalScore((prev) => prev + currentScore);

    // Get new node count based on difficulty and round
    const { minNodes, maxNodes } = DIFFICULTY_SETTINGS[difficulty];
    const newNodeCount = Math.min(
      maxNodes,
      minNodes + Math.floor((round - 1) / 2)
    );

    // Generate new graph state for next round
    setGraphState(generateInitialGraphState(newNodeCount));
  };

  // Replace the isValidMove function with this implementation
  const isValidMove = (state, nodeId) => {
    const newState = { ...state };
    const clickedNode = newState.nodes.find((n) => n.id === nodeId);

    // First move
    if (!newState.currentNode) {
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack = [nodeId];
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Starting DFS from node ${nodeId}`,
      };
    }

    // Get unvisited neighbors of current node
    const currentNodeNeighbors = newState.edges
      .filter((e) => e.source === newState.currentNode)
      .map((e) => e.target);

    const unvisitedNeighbors = currentNodeNeighbors.filter(
      (n) => !newState.nodes.find((node) => node.id === n).visited
    );

    // If clicked node is unvisited neighbor
    if (unvisitedNeighbors.includes(nodeId)) {
      const prevNode = newState.nodes.find(
        (n) => n.id === newState.currentNode
      );
      prevNode.current = false;
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.push(nodeId);
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Visited node ${nodeId}`,
      };
    }

    // If no unvisited neighbors, allow backtracking
    if (
      unvisitedNeighbors.length === 0 &&
      newState.stack.length > 1 &&
      newState.stack[newState.stack.length - 2] === nodeId
    ) {
      const prevNode = newState.nodes.find(
        (n) => n.id === newState.currentNode
      );
      prevNode.current = false;
      prevNode.backtracked = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.pop();
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Backtracked to node ${nodeId}`,
      };
    }

    return {
      validMove: false,
      newState: state,
      nodeStatus: "incorrect",
      message:
        "Invalid move! Follow DFS rules: visit unvisited neighbors or backtrack when needed.",
    };
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
      isValidMove={isValidMove}
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
    />
  );
};

export default DFSGamePage;
