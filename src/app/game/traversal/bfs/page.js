"use client";

import React from "react";
import GamePageStructure from "@/components/GamePageStructure";

const createGraphState = (graphId, nodes, edges) => ({
  graphId,
  nodes: nodes.map((id) => ({
    id,
    visited: false,
    current: false,
  })),
  edges,
  currentNode: null,
  currentLevel: [],
  nextLevel: [],
  visitedNodes: [],
  levelMap: {}, // Tracks which level each node belongs to
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
      { source: "A", target: "E" },
      { source: "E", target: "D" },
      { source: "D", target: "C" },
      { source: "C", target: "B" },
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
      { source: "B", target: "A" },
      { source: "E", target: "A" },
      { source: "C", target: "A" },
      { source: "D", target: "A" },
      { source: "F", target: "A" },
    ]
  ),

  // Graph D - Diamond graph
  createGraphState(
    "D",
    ["A", "B", "C", "D"],
    [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "C" },
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

const getNodeNeighbors = (graphState, nodeId) => {
  return graphState.edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target);
};

const getLevelForNode = (graphState, nodeId) => {
  if (nodeId === graphState.visitedNodes[0]) return 0;
  const parentEdge = graphState.edges.find((e) => e.target === nodeId);
  if (!parentEdge) return -1;
  return (graphState.levelMap[parentEdge.source] || 0) + 1;
};

const isValidMove = (graphState, nodeId) => {
  const newState = JSON.parse(JSON.stringify(graphState));
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);

  // Initial move validation
  if (!newState.currentNode) {
    switch (graphState.graphId) {
      case "A":
        if (nodeId !== "A") {
          return {
            newState: graphState,
            validMove: false,
            message:
              "BFS must start from node A! Let's begin our breadth-first exploration from the root node.",
          };
        }
        break;
      case "B":
        if (nodeId !== "A" && nodeId !== "B") {
          return {
            newState: graphState,
            validMove: false,
            message: "BFS must start from node A or B in this graph!",
          };
        }
        break;
      case "F":
        if (
          nodeId !== "A" &&
          nodeId !== "D" &&
          nodeId !== "C" &&
          nodeId !== "F"
        ) {
          return {
            newState: graphState,
            validMove: false,
            message:
              "For disconnected graphs, BFS must start from node A or C for left component, or start from D or F for right component!",
          };
        }
        break;
    }

    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.visitedNodes = [nodeId];
    newState.levelMap = { [nodeId]: 0 };

    // Initialize next level with unvisited neighbors
    const children = getNodeNeighbors(newState, nodeId);
    children.forEach((childId) => {
      newState.levelMap[childId] = 1;
    });
    newState.currentLevel = children;

    return { newState, validMove: true, nodeStatus: "unvisited" };
  }

  // Node already visited
  if (clickedNode.visited) {
    return {
      newState: graphState,
      validMove: false,
      message: `Node ${nodeId} was already visited! In BFS, we never revisit nodes.`,
    };
  }

  // Special handling for disconnected graph (Graph F)
  if (graphState.graphId === "F") {
    const component1 = ["A", "B", "C"];
    const component2 = ["D", "E", "F"];
    const currentComponent = component1.includes(newState.currentNode)
      ? component1
      : component2;
    const isInSameComponent = currentComponent.includes(nodeId);

    if (!isInSameComponent) {
      const isCurrentComponentComplete = currentComponent.every(
        (id) => newState.nodes.find((n) => n.id === id).visited
      );

      if (!isCurrentComponentComplete) {
        return {
          newState: graphState,
          validMove: false,
          message:
            "Complete the current component first before moving to the other component.",
        };
      }

      if (
        !clickedNode.visited &&
        (nodeId === "A" || nodeId === "C" || nodeId === "D" || nodeId === "F")
      ) {
        // Start new component
        const prevNode = newState.nodes.find(
          (n) => n.id === newState.currentNode
        );
        prevNode.current = false;

        clickedNode.visited = true;
        clickedNode.current = true;
        newState.currentNode = nodeId;
        newState.visitedNodes.push(nodeId);
        newState.levelMap = { [nodeId]: 0 };
        newState.currentLevel = getNodeNeighbors(newState, nodeId);
        newState.nextLevel = [];

        return { newState, validMove: true, nodeStatus: "unvisited" };
      }
    }
  }

  // Check if the clicked node is in the current level
  if (!newState.currentLevel.includes(nodeId)) {
    return {
      newState: graphState,
      validMove: false,
      message: `Cannot visit node ${nodeId} yet! In BFS, we must complete the current level first.`,
    };
  }

  // Valid move
  const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
  prevNode.current = false;
  clickedNode.visited = true;
  clickedNode.current = true;
  newState.currentNode = nodeId;
  newState.visitedNodes.push(nodeId);

  // Update levels
  newState.currentLevel = newState.currentLevel.filter((id) => id !== nodeId);
  const newNeighbors = getNodeNeighbors(newState, nodeId).filter(
    (id) =>
      !newState.nodes.find((n) => n.id === id).visited &&
      !newState.currentLevel.includes(id) &&
      !newState.nextLevel.includes(id)
  );
  newState.nextLevel.push(...newNeighbors);

  // Update level map for new neighbors
  newNeighbors.forEach((neighborId) => {
    newState.levelMap[neighborId] = newState.levelMap[nodeId] + 1;
  });

  // If current level is empty, move to next level
  if (newState.currentLevel.length === 0) {
    newState.currentLevel = newState.nextLevel;
    newState.nextLevel = [];
  }

  // Check if BFS is complete
  if (newState.currentLevel.length === 0 && newState.nextLevel.length === 0) {
    clickedNode.current = false;
    newState.currentNode = null;
    return {
      newState,
      validMove: true,
      nodeStatus: "final-move",
      message: `Excellent! You've completed the BFS traversal in the correct order: ${newState.visitedNodes.join(
        " → "
      )}`,
    };
  }

  return { newState, validMove: true, nodeStatus: "unvisited" };
};

const getNodeStatus = (node) => {
  if (node.current) return "current";
  if (node.visited) return "visited";
  return "unvisited";
};

const isGameComplete = (graphState) => {
  if (graphState.graphId === "F") {
    const component1 = ["A", "B", "C"];
    const component2 = ["D", "E", "F"];
    return (
      component1.every(
        (id) => graphState.nodes.find((n) => n.id === id).visited
      ) &&
      component2.every(
        (id) => graphState.nodes.find((n) => n.id === id).visited
      )
    );
  }
  return graphState.nodes.every((node) => node.visited);
};

const getMessage = (nodeStatus, nodeId) => {
  switch (nodeStatus) {
    case "unvisited":
      return `Successfully visited Node ${nodeId}. Continue exploring nodes at the current level!`;
    case "final-move":
      return `Congratulations! You've completed the BFS traversal by visiting all nodes in the correct order.`;
    default:
      return "";
  }
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
    <div className="w-full max-w-7xl mx-auto p-4">
      <GamePageStructure
        title="BFS Graph Game"
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

export default BFSGamePage;
