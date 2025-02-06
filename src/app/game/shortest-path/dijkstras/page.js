"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateInitialGraphState } from "@/utils/graphUtils.js";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import GraphVisualisation from "@/components/GraphVisualisation";

const DijkstraGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(4);
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(4, "dijkstra")
  );

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(
      generateInitialGraphState(fixedNodeCount, "dijkstra", selectedDifficulty)
    );
    setRound(1);
  };

  const isValidMove = (state, nodeId) => {
    const distances = new Map();
    const visited = new Set();

    // First move
    if (!state.startNode) {
      state.nodes.forEach((node) => {
        distances.set(node.id, node.id === nodeId ? 0 : Infinity);
      });

      const neighbors = state.edges
        .filter((edge) => edge.source === nodeId || edge.target === nodeId)
        .map((edge) => ({
          id: edge.source === nodeId ? edge.target : edge.source,
          weight: edge.weight,
        }));

      // Update neighbor distances
      neighbors.forEach((n) => {
        distances.set(n.id, n.weight);
      });

      const newState = {
        ...state,
        startNode: nodeId,
        currentNode: nodeId,
        nodes: state.nodes.map((node) => ({
          ...node,
          distance: distances.get(node.id),
          displayText:
            distances.get(node.id) === Infinity
              ? "∞"
              : distances.get(node.id).toString(),
          visited: node.id === nodeId,
          current: node.id === nodeId,
          recentlyUpdated: neighbors.some((n) => n.id === node.id),
        })),
      };

      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
      };
    }

    // Subsequent moves
    state.nodes.forEach((node) => {
      distances.set(node.id, node.distance);
      if (node.visited) visited.add(node.id);
    });

    // Find node with minimum distance
    const minNode = state.nodes
      .filter((node) => !node.visited)
      .reduce(
        (min, node) => (!min || node.distance < min.distance ? node : min),
        null
      );

    if (!minNode || nodeId !== minNode.id) {
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message:
          "Invalid move! In Dijkstra's algorithm, you must select the unvisited node with the smallest tentative distance.",
      };
    }

    visited.add(nodeId);
    const neighbors = state.edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => ({
        id: edge.source === nodeId ? edge.target : edge.source,
        weight: edge.weight,
      }))
      .filter((n) => !visited.has(n.id));

    // Update distances through current node
    neighbors.forEach((n) => {
      const newDist = distances.get(nodeId) + n.weight;
      if (newDist < distances.get(n.id)) {
        distances.set(n.id, newDist);
      }
    });

    const newState = {
      ...state,
      currentNode: nodeId,
      nodes: state.nodes.map((node) => ({
        ...node,
        distance: distances.get(node.id),
        displayText:
          distances.get(node.id) === Infinity
            ? "∞"
            : distances.get(node.id).toString(),
        visited: visited.has(node.id),
        current: node.id === nodeId,
        recentlyUpdated: neighbors.some((n) => n.id === node.id),
      })),
    };

    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
    };
  };

  return (
    <GamePageStructure
      title="Dijkstra's Algorithm Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      getNodeStatus={(node) => {
        if (node.current) return "current";
        if (node.visited) return "visited";
        if (node.recentlyUpdated) return "updated";
        return "unvisited";
      }}
      getScore={(status) => (status === "correct" ? 15 : -5)}
      getMessage={(status, nodeId) =>
        status === "incorrect"
          ? "Invalid move! In Dijkstra's algorithm, you must select the unvisited node with the smallest tentative distance."
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
      initialMessage="Select a starting node for Dijkstra's algorithm!"
      VisualizationComponent={({ graphState, onNodeClick }) => (
        <GraphVisualisation
          graphState={graphState}
          onNodeClick={onNodeClick}
          mode="game"
          isDijkstraPage={true}
        />
      )}
    />
  );
};

export default DijkstraGamePage;
