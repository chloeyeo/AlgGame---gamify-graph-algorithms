"use client";

import React from "react";
import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false, current: false },
    { id: "B", visited: false, current: false },
    { id: "C", visited: false, current: false },
    { id: "D", visited: false, current: false },
    { id: "E", visited: false, current: false },
    { id: "F", visited: false, current: false },
    { id: "G", visited: false, current: false },
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" },
    { source: "B", target: "E" },
    { source: "C", target: "F" },
    { source: "D", target: "G" },
  ],
  currentNode: null,
  queue: [],
  currentLevel: [],
};

const isValidMove = (graphState, nodeId) => {
  const newState = JSON.parse(JSON.stringify(graphState));
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);

  // Initial move
  if (!newState.currentNode) {
    if (nodeId === "A") {
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.currentLevel = [];
      newState.nextLevel = [];
      // Add unvisited children of A to the current level
      newState.currentLevel = newState.edges
        .filter((e) => e.source === "A")
        .map((e) => e.target);
      return { newState, validMove: true, nodeStatus: "unvisited" };
    }
    return { newState: graphState, validMove: false, nodeStatus: null };
  }

  // Check if the clicked node is in the current level
  if (!newState.currentLevel.includes(nodeId)) {
    return { newState: graphState, validMove: false, nodeStatus: null };
  }

  // Valid move
  const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
  prevNode.current = false;
  clickedNode.visited = true;
  clickedNode.current = true;
  newState.currentNode = nodeId;

  // Remove the visited node from the current level
  newState.currentLevel = newState.currentLevel.filter((id) => id !== nodeId);

  // Add unvisited children to the next level
  const childrenNodes = newState.edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target)
    .filter((id) => !newState.nodes.find((n) => n.id === id).visited);
  newState.nextLevel.push(...childrenNodes);

  // If current level is empty, move to the next level
  if (newState.currentLevel.length === 0) {
    newState.currentLevel = newState.nextLevel;
    newState.nextLevel = [];
  }

  // Check if BFS is complete
  if (newState.currentLevel.length === 0 && newState.nextLevel.length === 0) {
    clickedNode.current = false;
    newState.currentNode = null;
    return { newState, validMove: true, nodeStatus: "final-move" };
  }

  return { newState, validMove: true, nodeStatus: "unvisited" };
};

const getNodeStatus = (node) => {
  if (node.current) return "current";
  if (node.visited) return "visited";
  return "unvisited";
};

const isGameComplete = (graphState) => {
  return (
    graphState.nodes.every((node) => node.visited) &&
    graphState.queue.length === 0
  );
};

const getMessage = (nodeStatus, nodeId) => {
  switch (nodeStatus) {
    case "unvisited":
      return `Visited Node ${nodeId}!`;
    case "final-move":
      return `Visited Node ${nodeId}. BFS complete!`;
    default:
      return "";
  }
};

const getScore = (nodeStatus) => {
  switch (nodeStatus) {
    case "unvisited":
      return 10;
    default:
      return 0;
  }
};

const BFSGame = () => {
  return (
    <GamePageStructure
      title="BFS Graph Game"
      initialGraphState={initialGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      isGameComplete={isGameComplete}
      getMessage={getMessage}
      getScore={getScore}
    />
  );
};

export default BFSGame;
