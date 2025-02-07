"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateInitialGraphState } from "@/utils/graphUtils.js";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import GraphVisualisation from "@/components/GraphVisualisation";

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
    // First move - selecting start node
    if (!state.startNode) {
      const goalNode = state.nodes.find((n) => n.id === state.goalNode);
      const calculateHeuristic = (node) => {
        return Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);
      };

      const newNodes = state.nodes.map((node) => ({
        ...node,
        h: calculateHeuristic(node),
        g: node.id === nodeId ? 0 : Infinity,
        f: node.id === nodeId ? calculateHeuristic(node) : Infinity,
        visited: node.id === nodeId,
        current: node.id === nodeId,
        displayText: node.id === nodeId ? `f=${calculateHeuristic(node)}` : "∞",
      }));

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
    if (state.nodes.find((n) => n.id === nodeId).visited) {
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

    const currentNode = state.nodes.find((n) => n.id === nodeId);
    const neighbors = state.edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => ({
        id: e.source === nodeId ? e.target : e.source,
        weight: e.weight,
      }))
      .filter((n) => !state.nodes.find((node) => node.id === n.id).visited);

    const newNodes = state.nodes.map((node) => {
      const neighbor = neighbors.find((n) => n.id === node.id);
      if (neighbor) {
        const tentativeGScore = Number(
          (currentNode.g + neighbor.weight).toFixed(2)
        );
        if (tentativeGScore < node.g) {
          const newF = Number((tentativeGScore + node.h).toFixed(2));
          return {
            ...node,
            g: tentativeGScore,
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
        if (node.current) return "current";
        if (node.visited) return "visited";
        if (node.recentlyUpdated) return "updated";
        return "unvisited";
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
