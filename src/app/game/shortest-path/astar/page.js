"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import GraphVisualisation from "@/components/GraphVisualisation";
import { isValidAStarMove } from "@/utils/graphAlgorithms";

const generateInitialGraphState = (nodeCount, difficulty = "medium") => {
  // Generate nodes in a grid-like pattern
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const baseX = 200 + col * 150;
    const baseY = 200 + row * 150;
    const jitter = 20;

    return {
      id: String.fromCharCode(65 + i),
      x: baseX + (Math.random() - 0.5) * jitter,
      y: baseY + (Math.random() - 0.5) * jitter,
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 0, // Will be calculated later
      recentlyUpdated: false,
      current: false,
    };
  });

  // Set goal node as the last node
  const goalNode = nodes[nodes.length - 1];

  // Calculate heuristic (h) values for each node using Manhattan distance
  nodes.forEach((node) => {
    node.h = Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);
    if (node.id === "A") {
      node.f = node.h;
      node.g = 0;
    }
  });

  // Generate edges based on difficulty
  const edges = [];
  const maxEdges = {
    easy: nodeCount * 1.5,
    medium: nodeCount * 2,
    hard: nodeCount * 2.5,
  }[difficulty];

  // Ensure basic connectivity
  for (let i = 0; i < nodes.length - 1; i++) {
    const weight = Math.floor(Math.random() * 8) + 1;
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      weight,
    });
  }

  // Add random extra edges
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
        weight: Math.floor(Math.random() * 8) + 1,
      });
    }
  }

  return {
    nodes,
    edges,
    currentNode: null,
    startNode: "A",
    goalNode: goalNode.id,
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
      generateInitialGraphState(fixedNodeCount, selectedDifficulty)
    );
  };

  return (
    <GamePageStructure
      title="A* Algorithm Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidAStarMove}
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
