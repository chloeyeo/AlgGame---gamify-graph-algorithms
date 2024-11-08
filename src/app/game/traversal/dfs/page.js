"use client";

import React from "react";
import GamePageStructure from "@/components/GamePageStructure";

const createGraphState = (graphId, nodes, edges) => ({
  graphId,
  nodes: nodes.map((id) => ({
    id,
    visited: false,
    backtracked: false,
    current: false,
  })),
  edges,
  currentNode: null,
  stack: [],
});

const graphStates = [
  // Graph A - Basic (Tree)
  createGraphState(
    "A",
    ["A", "B", "C", "D", "E", "F", "G"],
    [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
      { source: "B", target: "E" },
      { source: "C", target: "F" },
      { source: "D", target: "G" },
    ]
  ),

  // Graph B - Caterpillar
  createGraphState(
    "B",
    ["A", "B", "C", "D", "E", "F", "G", "H"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "C", target: "D" },
      { source: "D", target: "E" },
      { source: "B", target: "F" },
      { source: "C", target: "G" },
      { source: "D", target: "H" },
      { source: "E", target: "A" },
    ]
  ),

  // Graph C - Star
  createGraphState(
    "C",
    ["A", "B", "C", "D", "E", "F"],
    [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "A", target: "D" },
      { source: "A", target: "E" },
      { source: "A", target: "F" },
    ]
  ),

  // Graph D - Diamond
  createGraphState(
    "D",
    ["A", "B", "C", "D"],
    [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
      { source: "C", target: "D" },
    ]
  ),

  // Graph E - Cycle
  createGraphState(
    "E",
    ["A", "B", "C", "D", "E", "F"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "C", target: "D" },
      { source: "D", target: "E" },
      { source: "E", target: "F" },
      { source: "F", target: "A" },
    ]
  ),

  // Graph F - Disconnected
  createGraphState(
    "F",
    ["A", "B", "C", "D", "E", "F"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "D", target: "E" },
      { source: "E", target: "F" },
    ]
  ),
];

const DFSGamePage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <GamePageStructure
        title="DFS Graph Game"
        graphStates={graphStates}
        isValidMove={isValidMove}
        getNodeStatus={getNodeStatus}
        isGameComplete={isGameComplete}
        getMessage={getMessage}
        getScore={getScore}
      />
    </div>
  );
};

const isValidMove = (graphState, nodeId) => {
  const newState = JSON.parse(JSON.stringify(graphState));
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);

  // Starting move validation
  if (!newState.currentNode) {
    switch (graphState.graphId) {
      case "A":
        if (nodeId !== "A") {
          return {
            newState: graphState,
            validMove: false,
            message:
              "DFS must start from node A! Let's begin our depth-first exploration from the root node, which is always node A in this graph.",
          };
        }
        break;
      case "B":
        if (nodeId !== "A" && nodeId !== "B") {
          return {
            newState: graphState,
            validMove: false,
            message:
              "DFS must start from node A or node B! Let's begin our depth-first exploration from the root node, which is always node A or B in this graph.",
          };
        }
        break;
      default:
        if (nodeId !== "A") {
          return {
            newState: graphState,
            validMove: false,
            message:
              "DFS must start from node A! Let's begin our depth-first exploration from the root node, which is always node A in this graph.",
          };
        }
    }
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.stack.push(nodeId);
    return { newState, validMove: true, nodeStatus: "unvisited" };
  }

  // Check if nodes are connected
  const isConnected = newState.edges.some(
    (e) =>
      (e.source === newState.currentNode && e.target === nodeId) ||
      (e.target === newState.currentNode && e.source === nodeId)
  );
  if (!isConnected) {
    return {
      newState: graphState,
      validMove: false,
      message: `Node ${nodeId} is not connected to your current position (${newState.currentNode}). 
                In DFS, we can only move along edges to reach adjacent nodes. Check the available edges 
                from your current node and try again.`,
    };
  }

  // Validate backtracking
  if (clickedNode.backtracked) {
    return {
      newState: graphState,
      validMove: false,
      message: `We've already fully explored node ${nodeId} and backtracked from it. 
                In DFS, once we backtrack from a node and mark it as 'completed', we don't 
                visit it again. Try finding an unexplored node or backtracking to a different 
                node that still has unexplored children.`,
    };
  }

  if (clickedNode.visited && !clickedNode.backtracked) {
    const currentChildren = newState.edges
      .filter((e) => e.source === newState.currentNode)
      .map((e) => newState.nodes.find((n) => n.id === e.target));

    if (!currentChildren.every((child) => child.visited)) {
      return {
        newState: graphState,
        validMove: false,
        message: `Cannot backtrack to ${nodeId} yet! In DFS, we must completely explore 
                 all children of the current node (${newState.currentNode}) before backtracking. 
                 There are still unvisited children that need to be explored first.`,
      };
    }

    // Valid backtracking
    const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
    prevNode.backtracked = true;
    prevNode.current = false;

    switch (graphState.graphId) {
      case "A":
        if (
          nodeId === "A" &&
          newState.nodes.every((n) => n.id === "A" || n.backtracked)
        ) {
          clickedNode.backtracked = true;
          clickedNode.current = false;
          newState.currentNode = null;
          newState.stack.pop();
          return { newState, validMove: true, nodeStatus: "final-move" };
        }
        break;
      case "B":
        if (
          (nodeId === "A" &&
            newState.nodes.every((n) => n.id === "A" || n.backtracked)) ||
          (nodeId === "B" &&
            newState.nodes.every((n) => n.id === "B" || n.backtracked))
        ) {
          clickedNode.backtracked = true;
          clickedNode.current = false;
          newState.currentNode = null;
          newState.stack.pop();
          return { newState, validMove: true, nodeStatus: "final-move" };
        }
        break;
      default:
        if (
          nodeId === "A" &&
          newState.nodes.every((n) => n.id === "A" || n.backtracked)
        ) {
          clickedNode.backtracked = true;
          clickedNode.current = false;
          newState.currentNode = null;
          newState.stack.pop();
          return { newState, validMove: true, nodeStatus: "final-move" };
        }
    }

    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.stack.pop();
    return { newState, validMove: true, nodeStatus: "visited" };
  }

  // Valid move to unvisited node
  const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
  prevNode.current = false;
  clickedNode.visited = true;
  clickedNode.current = true;
  newState.currentNode = nodeId;
  newState.stack.push(nodeId);
  return { newState, validMove: true, nodeStatus: "unvisited" };
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
      return `Great! You've visited Node ${nodeId} for the first time. Keep exploring deeper following DFS principles!`;
    case "visited":
      return `Successfully backtracked to Node ${nodeId}. This is the correct DFS behavior - we're moving back up the tree after fully exploring a branch.`;
    case "final-move":
      return `Excellent! You've completed the DFS traversal by backtracking to Node A. 
              All nodes have been visited and backtracked from in the correct DFS order. 
              The exploration is complete!`;
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
    case "final-move":
      return 15;
    default:
      return 0;
  }
};

export default DFSGamePage;
