"use client";

import React from "react";
import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false, backtracked: false, current: false },
    { id: "B", visited: false, backtracked: false, current: false },
    { id: "C", visited: false, backtracked: false, current: false },
    { id: "D", visited: false, backtracked: false, current: false },
    { id: "E", visited: false, backtracked: false, current: false },
    { id: "F", visited: false, backtracked: false, current: false },
    { id: "G", visited: false, backtracked: false, current: false },
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
  stack: [],
};

const isValidMove = (graphState, nodeId) => {
  const newState = JSON.parse(JSON.stringify(graphState));
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);

  if (!newState.currentNode) {
    if (nodeId === "A") {
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.push(nodeId);
      return { newState, validMove: true, nodeStatus: "unvisited" };
    }
    return { newState: graphState, validMove: false, nodeStatus: null };
  }

  const edge = newState.edges.find(
    (e) =>
      (e.source === newState.currentNode && e.target === nodeId) ||
      (e.target === newState.currentNode && e.source === nodeId)
  );
  if (!edge)
    return { newState: graphState, validMove: false, nodeStatus: null };

  if (!clickedNode.visited) {
    // Valid move to unvisited node
    const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
    prevNode.current = false;
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.stack.push(nodeId);
    return { newState, validMove: true, nodeStatus: "unvisited" };
  } else if (!clickedNode.backtracked) {
    // Backtracking
    const children = newState.edges
      .filter((e) => e.source === newState.currentNode)
      .map((e) => newState.nodes.find((n) => n.id === e.target));
    if (children.every((child) => child.visited)) {
      const prevNode = newState.nodes.find(
        (n) => n.id === newState.currentNode
      );
      prevNode.backtracked = true;
      prevNode.current = false;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.pop();
      return { newState, validMove: true, nodeStatus: "visited" };
    }
  }

  return { newState: graphState, validMove: false, nodeStatus: null };
};

const getNodeStatus = (node) => {
  if (node.current) return "current";
  if (node.backtracked) return "backtracked";
  if (node.visited) return "visited";
  return "unvisited";
};

const isGameComplete = (graphState) => {
  return graphState.nodes.every((node) => node.backtracked);
};

const getMessage = (nodeStatus, nodeId) => {
  switch (nodeStatus) {
    case "unvisited":
      return `Visited Node ${nodeId}!`;
    case "visited":
      return `Backtracked to Node ${nodeId}!`;
    default:
      return "";
  }
};

const getScore = (nodeStatus) => {
  switch (nodeStatus) {
    case "unvisited":
      return 10;
    case "visited":
      return 5;
    default:
      return 0;
  }
};

const DFSGame = () => {
  return (
    <GamePageStructure
      title="DFS Graph Game"
      initialGraphState={initialGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      isGameComplete={isGameComplete}
      getMessage={getMessage}
      getScore={getScore}
    />
  );
};

export default DFSGame;
