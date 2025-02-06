"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import GraphVisualisation from "@/components/GraphVisualisation";
import { generateAStarGraph } from "@/utils/astarGraphGenerator";

const isValidMove = (state, nodeId) => {
  // First move - selecting start node
  if (!state.startNode) {
    const goalNode = state.nodes.find((n) => n.id === state.goalNode);
    const newNodes = state.nodes.map((node) => {
      const h = Number(
        Math.sqrt(
          Math.pow(node.x - goalNode.x, 2) + Math.pow(node.y - goalNode.y, 2)
        ).toFixed(2)
      );
      return {
        ...node,
        h,
        g: node.id === nodeId ? 0 : Infinity,
        f: node.id === nodeId ? h : Infinity,
        visited: node.id === nodeId,
        current: node.id === nodeId,
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

  // Find unvisited node with lowest f-value
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
    };
  }

  // Update neighbors
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
      const newG = Number((currentNode.g + neighbor.weight).toFixed(2));
      if (newG < node.g) {
        const newF = Number((newG + node.h).toFixed(2));
        return {
          ...node,
          g: newG,
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

  return {
    validMove: true,
    newState: {
      ...state,
      nodes: newNodes,
      currentNode: nodeId,
    },
    nodeStatus: "correct",
  };
};

const AStarGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(6);
  const [graphState, setGraphState] = useState(() => generateAStarGraph(6));

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(generateAStarGraph(fixedNodeCount, selectedDifficulty));
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
          ? "Invalid move! In A*, select the unvisited node with lowest f-value (f = g + h)."
          : `Valid move to node ${nodeId}`
      }
      isGameComplete={(state) => {
        // Check if we have a valid path to the goal node
        const goalNode = state.nodes.find((n) => n.id === state.goalNode);
        return goalNode?.visited && state.currentNode === state.goalNode;
      }}
      round={round}
      setRound={setRound}
      totalScore={totalScore}
      setTotalScore={setTotalScore}
      nodeCount={nodeCount}
      difficulty={difficulty}
      onDifficultySelect={handleDifficultySelect}
      initialMessage="A* starts from node A. Select nodes with lowest f-value (f = g + h) to reach the goal!"
      VisualizationComponent={({ graphState, onNodeClick }) => (
        <GraphVisualisation
          graphState={graphState}
          onNodeClick={onNodeClick}
          mode="game"
          isAStarPage={true}
        />
      )}
    />
  );
};

export default AStarGamePage;
