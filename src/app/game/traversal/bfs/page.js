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
  nextLevel: [],
  visitedNodes: [],
  levelMap: {}, // Tracks which level each node belongs to
};

const getNodeNeighbors = (graphState, nodeId) => {
  return graphState.edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target);
};

const getLevelForNode = (graphState, nodeId) => {
  if (nodeId === "A") return 0;
  const parentEdge = graphState.edges.find((e) => e.target === nodeId);
  if (!parentEdge) return -1;
  return (graphState.levelMap[parentEdge.source] || 0) + 1;
};

const getUnvisitedSiblings = (graphState, nodeId) => {
  // Find parent node
  const parentEdge = graphState.edges.find((e) => e.target === nodeId);
  if (!parentEdge) return [];

  // Get all siblings (nodes with same parent) that haven't been visited
  return graphState.edges
    .filter((e) => e.source === parentEdge.source)
    .map((e) => e.target)
    .filter((id) => !graphState.nodes.find((n) => n.id === id).visited);
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
      newState.visitedNodes = ["A"];
      newState.levelMap = { A: 0 };

      const children = getNodeNeighbors(newState, "A");
      children.forEach((childId) => {
        newState.levelMap[childId] = 1;
      });
      newState.currentLevel = children;

      return {
        newState,
        validMove: true,
        nodeStatus: "unvisited",
        message:
          "Great start! Beginning BFS from root node A. In BFS, we'll now explore its direct children (B and C) before moving deeper into the graph.",
      };
    }

    return {
      newState: graphState,
      validMove: false,
      nodeStatus: null,
      message: `Cannot start BFS from node ${nodeId}! BFS traversal must begin from the root node (A). This ensures we explore the graph level by level.`,
    };
  }

  // Node already visited
  if (clickedNode.visited) {
    const visitOrder = newState.visitedNodes.indexOf(nodeId) + 1;
    return {
      newState: graphState,
      validMove: false,
      nodeStatus: null,
      message: `Node ${nodeId} was already visited (it was your visit #${visitOrder})! In BFS, we never revisit nodes. The unvisited nodes at the current level are: ${newState.currentLevel.join(
        ", "
      )}.`,
    };
  }

  // Check if the clicked node is in the current level
  if (!newState.currentLevel.includes(nodeId)) {
    const nodeLevel = getLevelForNode(newState, nodeId);
    const currentLevelNum = getLevelForNode(newState, newState.currentLevel[0]);

    if (newState.nextLevel.includes(nodeId)) {
      const unvisitedCurrentLevel = newState.currentLevel.join(", ");
      return {
        newState: graphState,
        validMove: false,
        nodeStatus: null,
        message: `Hold on! Node ${nodeId} is at level ${nodeLevel}, but we must first complete level ${currentLevelNum}. In BFS, we visit ALL nodes at the current level (${unvisitedCurrentLevel}) before moving to the next level. This ensures we explore the graph breadth-first.`,
      };
    }

    const unvisitedSiblings = getUnvisitedSiblings(newState, nodeId);
    if (unvisitedSiblings.length > 0) {
      return {
        newState: graphState,
        validMove: false,
        nodeStatus: null,
        message: `Cannot visit node ${nodeId} yet! In BFS, we must first visit its sibling nodes (${unvisitedSiblings.join(
          ", "
        )}) since they're at the same level. Remember, BFS explores all nodes at the current distance from the root before moving further.`,
      };
    }

    return {
      newState: graphState,
      validMove: false,
      nodeStatus: null,
      message: `Invalid move to node ${nodeId}! This node isn't connected to any of the nodes at our current level (${newState.currentLevel.join(
        ", "
      )}). In BFS, we can only visit nodes that are direct children of previously visited nodes.`,
    };
  }

  // Valid move
  const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
  prevNode.current = false;
  clickedNode.visited = true;
  clickedNode.current = true;
  newState.currentNode = nodeId;
  newState.visitedNodes.push(nodeId);

  // Remove the visited node from the current level
  newState.currentLevel = newState.currentLevel.filter((id) => id !== nodeId);

  // Add unvisited children to the next level
  const childrenNodes = getNodeNeighbors(newState, nodeId).filter(
    (id) => !newState.nodes.find((n) => n.id === id).visited
  );
  newState.nextLevel.push(...childrenNodes);

  // Update level map for new children
  childrenNodes.forEach((childId) => {
    newState.levelMap[childId] = newState.levelMap[nodeId] + 1;
  });

  let message = "";
  const nodeLevel = newState.levelMap[nodeId];
  const remainingAtLevel = newState.currentLevel.length;

  // Check if BFS is complete
  if (newState.currentLevel.length === 0 && newState.nextLevel.length === 0) {
    clickedNode.current = false;
    newState.currentNode = null;
    return {
      newState,
      validMove: true,
      nodeStatus: "final-move",
      message: `Perfect! Visiting node ${nodeId} completes the BFS traversal. Your path (${newState.visitedNodes.join(
        " → "
      )}) is a valid breadth-first traversal because you explored each level completely before moving to the next level.`,
    };
  }

  if (remainingAtLevel > 0) {
    message = `Good choice! Node ${nodeId} is a valid node at level ${nodeLevel}. You still need to visit ${remainingAtLevel} more node(s) at this level (${newState.currentLevel.join(
      ", "
    )}) before moving deeper.`;
  } else if (newState.nextLevel.length > 0) {
    message = `Excellent! You've completed level ${nodeLevel}. Moving to level ${
      nodeLevel + 1
    } where we have nodes: ${newState.nextLevel.join(
      ", "
    )}. Remember, in BFS we'll explore all of these before going deeper.`;
  }

  // If current level is empty, move to the next level
  if (newState.currentLevel.length === 0) {
    newState.currentLevel = newState.nextLevel;
    newState.nextLevel = [];
  }

  return {
    newState,
    validMove: true,
    nodeStatus: "unvisited",
    message: message,
  };
};

const getNodeStatus = (node) => {
  if (node.current) return "current";
  if (node.visited) return "visited";
  return "unvisited";
};

const isGameComplete = (graphState) => {
  return (
    graphState.nodes.every((node) => node.visited) &&
    graphState.currentLevel.length === 0 &&
    graphState.nextLevel.length === 0
  );
};

const getMessage = (nodeStatus, nodeId) => {
  // Not used since we're returning custom messages from isValidMove
  return "";
};

const getScore = (nodeStatus) => {
  switch (nodeStatus) {
    case "unvisited":
      return 10;
    case "final-move":
      return 20;
    default:
      return 0;
  }
};

const BFSGamePage = () => {
  return (
    <GamePageStructure
      title="BFS Graph Traversal Game"
      initialGraphState={initialGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      isGameComplete={isGameComplete}
      getMessage={getMessage}
      getScore={getScore}
    />
  );
};

export default BFSGamePage;
