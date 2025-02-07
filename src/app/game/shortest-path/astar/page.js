"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateInitialGraphState } from "@/utils/graphUtils.js";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";

const roundToTwo = (num) => {
  if (num === Infinity) return "∞";
  if (isNaN(num)) return "∞";
  return Number(Math.round(num + "e2") + "e-2");
};

const AStarGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(6);
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(4, "astar")
  );

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(
      generateInitialGraphState(fixedNodeCount, "astar", selectedDifficulty)
    );
    setRound(1);
  };

  const isValidMove = (state, nodeId) => {
    const visited = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const cameFrom = new Map();
    const openSet = new Set();

    // Initialize scores for all nodes
    state.nodes.forEach((node) => {
      gScore.set(node.id, node.id === state.startNode ? 0 : Infinity);
      fScore.set(node.id, Infinity);
    });

    // First move - selecting start node
    if (!state.startNode) {
      const goalNode = state.nodes.find((n) => n.id === state.goalNode);

      const calculateHeuristic = (node) => {
        const dx = Math.abs(node.x - goalNode.x);
        const dy = Math.abs(node.y - goalNode.y);
        const scaleFactor = 0.02;
        return roundToTwo((dx + dy) * scaleFactor);
      };

      const newNodes = state.nodes.map((node) => {
        const h = roundToTwo(calculateHeuristic(node));
        const g = node.id === nodeId ? 0 : Infinity;
        const f = node.id === nodeId ? h : Infinity;

        return {
          ...node,
          h,
          g,
          f,
          visited: node.id === nodeId,
          current: node.id === nodeId,
          recentlyUpdated: false,
          displayText: node.id === nodeId ? `f=${h}` : "∞",
        };
      });

      return {
        validMove: true,
        newState: {
          ...state,
          nodes: newNodes,
          startNode: nodeId,
          currentNode: nodeId,
        },
        nodeStatus: "correct",
      };
    }

    // Regular moves
    state.nodes.forEach((node) => {
      if (node.visited) visited.add(node.id);
      gScore.set(node.id, node.g);
      fScore.set(node.id, node.f);
    });

    // Check if node is already visited
    if (visited.has(nodeId)) {
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message: "This node has already been visited!",
      };
    }

    // Find unvisited node with minimum f-value
    const unvisitedNodes = state.nodes.filter((n) => !n.visited);
    const minFNode = unvisitedNodes.reduce(
      (min, node) => (!min || node.f < min.f ? node : min),
      null
    );

    if (!minFNode || nodeId !== minFNode.id) {
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message:
          "Invalid move! In A*, you must select the unvisited node with the lowest f-value.",
      };
    }

    const currentNode = state.nodes.find((n) => n.id === state.currentNode);
    const goalNode = state.nodes.find((n) => n.id === state.goalNode);

    const calculateHeuristic = (node) => {
      const dx = Math.abs(node.x - goalNode.x);
      const dy = Math.abs(node.y - goalNode.y);
      const scaleFactor = 0.02;
      return roundToTwo((dx + dy) * scaleFactor);
    };

    // Process neighbors
    const neighbors = state.edges
      .filter(
        (e) => e.source === state.currentNode || e.target === state.currentNode
      )
      .map((e) => ({
        id: e.source === state.currentNode ? e.target : e.source,
        weight: e.weight,
      }));

    // Update g and f scores for neighbors
    for (const neighbor of neighbors) {
      const tentativeGScore = roundToTwo(
        gScore.get(currentNode.id) + neighbor.weight
      );

      if (tentativeGScore < gScore.get(neighbor.id)) {
        cameFrom.set(neighbor.id, currentNode.id);
        gScore.set(neighbor.id, tentativeGScore);
        const h = calculateHeuristic(
          state.nodes.find((n) => n.id === neighbor.id)
        );
        fScore.set(neighbor.id, roundToTwo(tentativeGScore + h));
        openSet.add(neighbor.id);
      }
    }

    const newNodes = state.nodes.map((node) => {
      return {
        ...node,
        g: gScore.get(node.id),
        h: calculateHeuristic(node),
        f: fScore.get(node.id),
        recentlyUpdated: openSet.has(node.id),
        visited: node.id === nodeId ? true : node.visited,
        current: node.id === nodeId,
        displayText: `f=${roundToTwo(fScore.get(node.id))}`,
      };
    });

    const isComplete =
      nodeId === state.goalNode ||
      newNodes.every((node) => node.visited || node.f === Infinity);

    return {
      validMove: true,
      newState: {
        ...state,
        nodes: newNodes,
        currentNode: nodeId,
      },
      nodeStatus: "correct",
      message: isComplete ? "A* algorithm complete!" : undefined,
    };
  };

  return (
    <GamePageStructure
      title="A* Algorithm Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      algorithm="astar"
      getNodeStatus={(node) => {
        const status = node.current
          ? "current"
          : node.visited
          ? "visited"
          : node.recentlyUpdated
          ? "updated"
          : "unvisited";
        return status;
      }}
      getScore={(status) => (status === "correct" ? 15 : -5)}
      getMessage={(status, nodeId) =>
        status === "incorrect"
          ? "Invalid move! In A*, you must select the unvisited node with the lowest f-value."
          : `Valid move to node ${nodeId}`
      }
      isGameComplete={(state) => state.nodes.every((node) => node.visited)}
      round={round}
      setRound={setRound}
      totalScore={totalScore}
      setTotalScore={setTotalScore}
      nodeCount={nodeCount}
      difficulty={difficulty}
      onDifficultySelect={handleDifficultySelect}
      initialMessage="Select a starting node for A* algorithm!"
    />
  );
};

export default AStarGamePage;
