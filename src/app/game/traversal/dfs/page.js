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
      { source: "B", target: "A" },
      { source: "A", target: "C" },
      { source: "C", target: "A" },
      { source: "B", target: "D" },
      { source: "D", target: "B" },
      { source: "B", target: "E" },
      { source: "E", target: "B" },
      { source: "C", target: "F" },
      { source: "F", target: "C" },
      { source: "D", target: "G" },
      { source: "G", target: "D" },
    ]
  ),

  // Graph B - Caterpillar
  createGraphState(
    "B",
    ["A", "B", "C", "D", "E", "F", "G", "H"],
    [
      { source: "A", target: "E" },
      { source: "E", target: "A" },
      { source: "B", target: "C" },
      { source: "C", target: "B" },
      { source: "C", target: "D" },
      { source: "D", target: "C" },
      { source: "D", target: "E" },
      { source: "E", target: "D" },
      { source: "B", target: "F" },
      { source: "F", target: "B" },
      { source: "C", target: "G" },
      { source: "G", target: "C" },
      { source: "D", target: "H" },
      { source: "H", target: "D" },
    ]
  ),

  // Graph C - Star
  createGraphState(
    "C",
    ["A", "B", "C", "D", "E", "F"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "A" },
      { source: "A", target: "C" },
      { source: "C", target: "A" },
      { source: "A", target: "D" },
      { source: "D", target: "A" },
      { source: "A", target: "E" },
      { source: "E", target: "A" },
      { source: "A", target: "F" },
      { source: "F", target: "A" },
    ]
  ),

  // Graph D - Diamond graph - 4 vertices 5 edges
  createGraphState(
    "D",
    ["A", "B", "C", "D"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "A" },
      { source: "A", target: "C" },
      { source: "C", target: "A" },
      { source: "B", target: "C" },
      { source: "C", target: "B" },
      { source: "B", target: "D" },
      { source: "D", target: "B" },
      { source: "C", target: "D" },
      { source: "D", target: "C" },
    ]
  ),

  // Graph E - Cycle
  createGraphState(
    "E",
    ["A", "B", "C", "D", "E", "F"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "A" },
      { source: "B", target: "C" },
      { source: "C", target: "B" },
      { source: "C", target: "D" },
      { source: "D", target: "C" },
      { source: "D", target: "E" },
      { source: "E", target: "D" },
      { source: "E", target: "F" },
      { source: "F", target: "E" },
      { source: "F", target: "A" },
      { source: "A", target: "F" },
    ]
  ),

  // Graph F - Disconnected
  createGraphState(
    "F",
    ["A", "B", "C", "D", "E", "F"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "A" },
      { source: "B", target: "C" },
      { source: "C", target: "B" },
      { source: "D", target: "E" },
      { source: "E", target: "D" },
      { source: "E", target: "F" },
      { source: "F", target: "E" },
    ]
  ),

  // Graph G - Complete graph - the only graph where only one move is needed to visit all adjacent vertices
  createGraphState(
    "G",
    ["A", "B", "C", "D"],
    [
      { source: "A", target: "B" },
      { source: "B", target: "A" },
      { source: "A", target: "C" },
      { source: "C", target: "A" },
      { source: "B", target: "C" },
      { source: "C", target: "B" },
      { source: "B", target: "D" },
      { source: "D", target: "B" },
      { source: "C", target: "D" },
      { source: "D", target: "C" },
      { source: "A", target: "D" },
      { source: "D", target: "A" },
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
      case "F":
        const component1 = ["A", "B", "C"];
        const component2 = ["D", "E", "F"];

        const isComponent1Complete = component1.every(
          (id) => graphState.nodes.find((n) => n.id === id).backtracked
        );
        const isComponent2Complete = component2.every(
          (id) => graphState.nodes.find((n) => n.id === id).backtracked
        );

        if (
          (isComponent1Complete && component1.includes(nodeId)) ||
          (isComponent2Complete && component2.includes(nodeId))
        ) {
          return {
            newState: graphState,
            validMove: false,
            message:
              "This component is already completed. Start with a node from the other component.",
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
  if (!isConnected && graphState.graphId !== "F") {
    return {
      newState: graphState,
      validMove: false,
      message: `Node ${nodeId} is not connected to your current position (${newState.currentNode}). 
                In DFS, we can only move along edges to reach adjacent nodes. Check the available edges 
                from your current node and try again.`,
    };
  }

  // Validate backtracking
  if (clickedNode.visited) {
    // For Graph F, handle component separation
    if (graphState.graphId === "F") {
      const component1 = ["A", "B", "C"];
      const component2 = ["D", "E", "F"];
      const currentComponent = component1.includes(newState.currentNode)
        ? component1
        : component2;

      if (!currentComponent.includes(nodeId)) {
        return {
          newState: graphState,
          validMove: false,
          message:
            "Complete the current component before moving to another component.",
        };
      }
    }
    // Check if it's a valid backtrack move (must be previous node in stack)
    if (newState.stack[newState.stack.length - 2] !== nodeId) {
      return {
        newState: graphState,
        validMove: false,
        message:
          "You must backtrack in the reverse order of visited nodes. " +
          `The previous node in your path was ${
            newState.stack[newState.stack.length - 2]
          }.`,
      };
    }
    // Check if all neighbors of current node are visited before allowing backtrack
    const currentNeighbors = newState.edges
      .filter(
        (e) =>
          e.source === newState.currentNode || e.target === newState.currentNode
      )
      .map((e) => (e.source === newState.currentNode ? e.target : e.source));

    const allNeighborsVisited = currentNeighbors.every(
      (neighborId) => newState.nodes.find((n) => n.id === neighborId).visited
    );

    if (!allNeighborsVisited) {
      return {
        newState: graphState,
        validMove: false,
        message: `Cannot backtrack yet! You must explore all unvisited neighbors of ${newState.currentNode} first.`,
      };
    }

    // Valid backtracking
    const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
    prevNode.current = false;
    prevNode.backtracked = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.stack.pop();

    // Check if this is the final backtrack move
    const isLastNode =
      newState.stack.length === 1 &&
      newState.nodes.every((n) => n.id === nodeId || n.backtracked);

    if (isLastNode) {
      clickedNode.backtracked = true;
      clickedNode.current = false;
      newState.currentNode = null;
      newState.stack.pop();
      return { newState, validMove: true, nodeStatus: "final-move" };
    }
    return { newState, validMove: true, nodeStatus: "visited" };
  }

  // Moving to an unvisited node
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
      return `Great! You've visited Node ${nodeId} for the first time. 
              Continue exploring unvisited neighbors using DFS.`;
    case "visited":
      return `Good backtracking to Node ${nodeId}! Remember, in DFS we must backtrack 
              in the reverse order of our visits once we've explored all neighbors of a node.`;
    case "final-move":
      return `Excellent! You've completed the DFS traversal by backtracking to the starting node. 
              All nodes have been visited and properly backtracked from in DFS order.`;
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
