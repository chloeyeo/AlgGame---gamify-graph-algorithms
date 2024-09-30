"use client";

import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false },
    { id: "B", visited: false },
    { id: "C", visited: false },
    { id: "D", visited: false },
    { id: "E", visited: false },
    { id: "F", visited: false },
    { id: "G", visited: false },
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
};

const isValidMove = (graphState, nodeId) => {
  if (!graphState.currentNode) return true; // First move is always valid
  const edge = graphState.edges.find(
    (e) =>
      (e.source === graphState.currentNode && e.target === nodeId) ||
      (e.target === graphState.currentNode && e.source === nodeId)
  );
  return !!edge;
};

const getNodeStatus = (graphState, nodeId) => {
  const node = graphState.nodes.find((n) => n.id === nodeId);
  if (!node.visited) return "new";
  if (node.visited && !node.backtracked) return "backtrack";
  return "reset";
};

const getScore = (nodeStatus) => {
  switch (nodeStatus) {
    case "new":
      return 10;
    case "backtrack":
      return 5;
    case "reset":
      return -5;
    default:
      return 0;
  }
};

const getMessage = (nodeStatus, nodeId) => {
  switch (nodeStatus) {
    case "new":
      return `Visited Node ${nodeId}!`;
    case "backtrack":
      return `Backtracked from Node ${nodeId}!`;
    case "reset":
      return `Node ${nodeId} already visited and backtracked!`;
    default:
      return "";
  }
};

const isGameComplete = (graphState) => {
  return graphState.nodes.every((node) => node.visited);
};

export default function DFSGamePage() {
  return (
    <GamePageStructure
      title="Depth-First Search (DFS) Game"
      initialGraphState={initialGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      getScore={getScore}
      getMessage={getMessage}
      isGameComplete={isGameComplete}
    />
  );
}
