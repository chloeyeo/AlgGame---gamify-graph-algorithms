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
    const goalNode = state.nodes.find((n) => n.id === state.goalNode);

    const calculateHeuristic = (node) => {
      const dx = Math.abs(node.x - goalNode.x);
      const dy = Math.abs(node.y - goalNode.y);
      const scaleFactor = 0.02;
      return roundToTwo((dx + dy) * scaleFactor);
    };

    // Initialize scores from current state
    state.nodes.forEach((node) => {
      if (node.visited) visited.add(node.id);
      gScore.set(node.id, node.g === Infinity ? Infinity : node.g);
      const h = calculateHeuristic(node);
      fScore.set(node.id, node.f === Infinity ? Infinity : node.f);
      if (!node.visited && node.f !== Infinity) openSet.add(node.id);
    });

    // First move handling
    if (!state.startNode) {
      // Process neighbors for the first node
      const neighbors = state.edges
        .filter((e) => e.source === nodeId || e.target === nodeId)
        .map((e) => ({
          id: e.source === nodeId ? e.target : e.source,
          weight: e.weight,
        }));

      // Update neighbors' scores for the first node
      for (const neighbor of neighbors) {
        const tentativeGScore = neighbor.weight; // Since start node has g=0
        gScore.set(neighbor.id, tentativeGScore);
        const h = roundToTwo(
          calculateHeuristic(state.nodes.find((n) => n.id === neighbor.id))
        );
        const newF = roundToTwo(tentativeGScore + h);
        fScore.set(neighbor.id, newF);
        openSet.add(neighbor.id);
      }

      const newNodes = state.nodes.map((node) => {
        const isNeighbor = neighbors.some((n) => n.id === node.id);
        const h = calculateHeuristic(node);
        const g =
          node.id === nodeId ? 0 : isNeighbor ? gScore.get(node.id) : Infinity;
        const f =
          node.id === nodeId ? h : isNeighbor ? fScore.get(node.id) : Infinity;

        return {
          ...node,
          h,
          g,
          f,
          visited: node.id === nodeId,
          current: node.id === nodeId,
          recentlyUpdated: isNeighbor,
          displayText: f === Infinity ? "∞" : `f=${roundToTwo(f)}`,
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

    // Regular moves - validation
    if (visited.has(nodeId)) {
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message: "This node has already been visited!",
      };
    }

    // Find unvisited node with minimum f-value
    const unvisitedNodes = state.nodes.filter((n) => !visited.has(n.id));
    const minFNode = unvisitedNodes.reduce(
      (min, node) =>
        !min || fScore.get(node.id) < fScore.get(min.id) ? node : min,
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

    // Process neighbors
    const neighbors = state.edges
      .filter(
        (e) => e.source === state.currentNode || e.target === state.currentNode
      )
      .map((e) => ({
        id: e.source === state.currentNode ? e.target : e.source,
        weight: e.weight,
      }))
      .filter((n) => !visited.has(n.id));

    // Update neighbors' scores
    for (const neighbor of neighbors) {
      const tentativeGScore = roundToTwo(
        gScore.get(state.currentNode) + neighbor.weight
      );
      const currentNeighborGScore = gScore.get(neighbor.id);

      if (tentativeGScore < currentNeighborGScore) {
        cameFrom.set(neighbor.id, state.currentNode);
        gScore.set(neighbor.id, tentativeGScore);
        const h = roundToTwo(
          calculateHeuristic(state.nodes.find((n) => n.id === neighbor.id))
        );
        const newF = roundToTwo(tentativeGScore + h);
        fScore.set(neighbor.id, newF);
        openSet.add(neighbor.id);
      }
    }

    // Update node states
    const newNodes = state.nodes.map((node) => {
      const g = gScore.get(node.id);
      const h = roundToTwo(calculateHeuristic(node));
      const f = fScore.get(node.id);

      return {
        ...node,
        g: g === Infinity ? Infinity : roundToTwo(g),
        h,
        f: f === Infinity ? Infinity : roundToTwo(f),
        recentlyUpdated: openSet.has(node.id),
        visited: node.id === nodeId ? true : visited.has(node.id),
        current: node.id === nodeId,
        displayText: f === Infinity ? "∞" : `f=${roundToTwo(f)}`,
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
