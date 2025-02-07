"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateInitialGraphState } from "@/utils/graphUtils.js";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import GraphVisualisation from "@/components/GraphVisualisation";

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
      console.log("First move - Selecting start node:", nodeId);
      const goalNode = state.nodes.find((n) => n.id === state.goalNode);
      console.log("Goal node:", goalNode);

      const calculateHeuristic = (node) => {
        console.log(`\nCalculating heuristic for ${node.id}:`);
        console.log(`Node coordinates: (${node.x}, ${node.y})`);
        console.log(`Goal coordinates: (${goalNode.x}, ${goalNode.y})`);

        const dx = Math.abs(node.x - goalNode.x);
        const dy = Math.abs(node.y - goalNode.y);
        console.log(`dx: ${dx}, dy: ${dy}`);

        // Scale down the Manhattan distance to be comparable to edge weights
        const scaleFactor = 0.02; // This will make 300 -> 6
        const h = roundToTwo((dx + dy) * scaleFactor);
        console.log(`Final h value: ${h}`);
        return h;
      };

      console.log("Initializing nodes with heuristics...");
      const newNodes = state.nodes.map((node) => {
        const h = roundToTwo(calculateHeuristic(node));
        const g = node.id === nodeId ? 0 : Infinity;
        const f = node.id === nodeId ? h : Infinity;

        console.log(`Node ${node.id} initial values:`, {
          h: h,
          g: g,
          f: f,
          isStart: node.id === nodeId,
        });

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

      // After calculating new nodes
      console.log("New nodes:", newNodes);

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
    console.log("\nProcessing regular move...");

    // Check if node is already visited
    const isVisited = state.nodes.find((n) => n.id === nodeId).visited;
    if (isVisited) {
      console.log("Invalid move: Node already visited!");
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message: "This node has already been visited!",
      };
    }

    // Find unvisited node with minimum f-value
    const unvisitedNodes = state.nodes.filter((n) => !n.visited);
    console.log(
      "Unvisited nodes:",
      unvisitedNodes.map((n) => ({
        id: n.id,
        f: n.f,
        g: n.g,
        h: n.h,
      }))
    );

    const minFNode = unvisitedNodes.reduce(
      (min, node) => (!min || node.f < min.f ? node : min),
      null
    );
    console.log("Node with minimum f:", minFNode);
    console.log("Selected node:", nodeId);

    if (!minFNode || nodeId !== minFNode.id) {
      console.log("Invalid move: Not the node with minimum f-value!");
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
    console.log("Current node:", currentNode);

    const calculateHeuristic = (node) => {
      const h = Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);
      console.log(`Calculating heuristic for node ${node.id}:`, h);
      return h;
    };

    // Find neighbors through edges
    const neighbors = state.edges
      .filter(
        (e) => e.source === state.currentNode || e.target === state.currentNode
      )
      .map((e) => ({
        id: e.source === state.currentNode ? e.target : e.source,
        weight: e.weight,
      }));

    console.log("Found neighbors:", neighbors);

    const newNodes = state.nodes.map((node) => {
      const neighbor = neighbors.find((n) => n.id === node.id);
      if (neighbor) {
        const tentativeGScore = roundToTwo(currentNode.g + neighbor.weight);
        console.log("Node:", node.id);
        console.log("Current g:", node.g);
        console.log("Tentative g:", tentativeGScore);
        const h = roundToTwo(calculateHeuristic(node));
        const newF = roundToTwo(tentativeGScore + h);
        console.log("h value:", h);
        console.log("New f value:", newF);

        if (tentativeGScore < node.g) {
          console.log(`Updating node ${node.id} values:`, {
            oldG: node.g,
            newG: tentativeGScore,
            h: h,
            newF: newF,
          });

          return {
            ...node,
            g: tentativeGScore,
            h,
            f: newF,
            recentlyUpdated: true,
            displayText: `f=${newF}`,
          };
        }
      }
      return {
        ...node,
        recentlyUpdated: false,
        visited: node.id === nodeId ? true : node.visited,
        current: node.id === nodeId,
      };
    });

    const isComplete =
      nodeId === state.goalNode ||
      newNodes.every((node) => node.visited || node.f === Infinity);

    console.log("\nMove validation complete:");
    console.log("Is complete:", isComplete);
    console.log(
      "Updated nodes:",
      newNodes.map((n) => ({
        id: n.id,
        f: n.f,
        g: n.g,
        h: n.h,
        visited: n.visited,
        current: n.current,
      }))
    );

    // Before returning state
    console.log("Returning state:", {
      validMove: true,
      newState: {
        ...state,
        nodes: newNodes,
        currentNode: nodeId,
      },
    });

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
      setGraphState={(newState) => {
        console.log("Setting new graph state:", newState);
        setGraphState(newState);
      }}
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
        console.log(`Node ${node.id} status:`, status);
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
