"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import GraphVisualisation from "@/components/GraphVisualisation";

const generateInitialGraphState = (
  nodeCount,
  algorithm,
  difficulty = "medium"
) => {
  // Generate nodes in a circular layout like Dijkstra's page
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / nodeCount;
    const radius = 200;
    return {
      id: String.fromCharCode(65 + i),
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 0,
      current: false,
      recentlyUpdated: false,
      displayText: "∞",
    };
  });

  // Generate weighted edges similar to Dijkstra's page
  const edges = [];
  // Ensure basic connectivity
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      weight: Number((Math.random() * 8 + 1).toFixed(2)),
    });
  }

  // Add extra edges based on difficulty
  const maxEdges = {
    easy: nodeCount * 1.5,
    medium: nodeCount * 2,
    hard: nodeCount * 2.5,
  }[difficulty];

  while (edges.length < maxEdges) {
    const source = Math.floor(Math.random() * nodes.length);
    const target = Math.floor(Math.random() * nodes.length);

    if (
      source !== target &&
      !edges.some(
        (e) =>
          (e.source === nodes[source].id && e.target === nodes[target].id) ||
          (e.source === nodes[target].id && e.target === nodes[source].id)
      )
    ) {
      edges.push({
        source: nodes[source].id,
        target: nodes[target].id,
        weight: Number((Math.random() * 8 + 1).toFixed(2)),
      });
    }
  }

  return {
    nodes,
    edges,
    currentNode: null,
    startNode: null,
    goalNode: nodes[nodes.length - 1].id,
  };
};

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
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(6)
  );

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(
      generateInitialGraphState(fixedNodeCount, "A*", selectedDifficulty)
    );
  };

  return (
    <GamePageStructure
      title="A* Algorithm Game"
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
          ? "Invalid move! In A*, select the unvisited node with lowest f-value (f = g + h)."
          : `Valid move to node ${nodeId}`
      }
      isGameComplete={(state) =>
        state.nodes.find((n) => n.id === state.goalNode)?.visited
      }
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
