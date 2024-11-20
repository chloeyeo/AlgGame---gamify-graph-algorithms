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

  // Graph D - Diamond graph - 4 vertices 5 edges
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
  console.log("inside isValidMove");
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

      case "F":
        const component1 = ["A", "B", "C"];
        const component2 = ["D", "E", "F"];

        const isComponent1Complete = component1.every(
          (id) => graphState.nodes.find((n) => n.id === id).visited
        );
        const isComponent2Complete = component2.every(
          (id) => graphState.nodes.find((n) => n.id === id).visited
        );

        // If clicked node is in a completed component, reject the move
        if (
          (isComponent1Complete && component1.includes(nodeId)) ||
          (isComponent2Complete && component2.includes(nodeId))
        ) {
          return {
            newState: graphState,
            validMove: false,
            message:
              "This component is already completed. You cannot revisit its nodes.",
          };
        }

        break;

      default:
        if (graphState.graphId !== "C" && !nodeId) {
          return {
            newState: graphState,
            validMove: false,
            message: "Invalid move!",
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

  if (
    graphState.graphId === "F" ||
    (clickedNode.visited &&
      !clickedNode.backtracked &&
      graphState.graphId !== "D" &&
      graphState.graphId !== "E") ||
    // (clickedNode.visited && graphState.graphId === "D")
    (!clickedNode.visited &&
      !clickedNode.backtracked &&
      (graphState.graphId === "D" || graphState.graphId === "E"))
  ) {
    const currentChildren = newState.edges
      .filter((e) => e.source === newState.currentNode)
      .map((e) => newState.nodes.find((n) => n.id === e.target));

    if (
      graphState.graphId !== "F" &&
      ((graphState.graphId !== "D" &&
        graphState.graphId !== "E" &&
        !currentChildren.every((child) => child.visited)) ||
        ((graphState.graphId === "D" || graphState.graphId === "E") &&
          clickedNode.visited))
    ) {
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
    prevNode.backtracked =
      graphState.graphId !== "D" && graphState.graphId !== "E" ? true : false;
    prevNode.current = false;

    // let allNodesVisited;

    console.log("Graph:", graphState.graphId);

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
      case "C":
        if (newState.nodes.every((n) => n.id === nodeId || n.backtracked)) {
          clickedNode.backtracked = true;
          clickedNode.current = false;
          newState.currentNode = null;
          newState.stack.pop();
          return { newState, validMove: true, nodeStatus: "final-move" };
        }
        break;
      case "D":
        clickedNode.visited = true;
        const currentNeighbours = newState.edges
          .filter((e) => e.source === nodeId || e.target === nodeId)
          .map((e) => (e.source === nodeId ? e.target : e.source));

        // If all neighbors of current node are visited, mark it as backtracked
        const allNeighborsVisited = currentNeighbours.every(
          (neighborId) =>
            newState.nodes.find((n) => n.id === neighborId).visited
        );

        if (
          allNeighborsVisited &&
          !newState.nodes.every((node) => node.visited)
        ) {
          clickedNode.backtracked = true;
        }

        if (newState.nodes.every((node) => node.visited)) {
          newState.nodes = newState.nodes.map((node) => ({
            ...node,
            current: false,
            visited: true,
          }));
          // Clear current position and stack to prevent further moves
          newState.currentNode = null;
          newState.stack = [];
          return { newState, validMove: true, nodeStatus: "final-move" };
        }
        break;
      case "E":
        clickedNode.visited = true;
        // clickedNode.current = false;
        if (newState.nodes.every((node) => node.visited)) {
          newState.nodes = newState.nodes.map((node) => ({
            ...node,
            backtracked: false,
            current: false,
            visited: true,
          }));
          // Clear current position and stack to prevent further moves
          newState.currentNode = null;
          newState.stack = [];
          return { newState, validMove: true, nodeStatus: "final-move" };
        }
        break;
      case "F":
        // Define the two components
        const component1 = ["A", "B", "C"];
        const component2 = ["D", "E", "F"];

        // Determine which component we're currently in
        const currentComponent = component1.includes(newState.currentNode)
          ? component1
          : component2;

        // Check if clicked node is in the same component
        const isInSameComponent = currentComponent.includes(nodeId);

        // Check if the first graph is completed
        const isFirstGraphCompleted = component1.every(
          (id) => newState.nodes.find((n) => n.id === id).visited
        );

        // If the first graph is completed and user clicks on it, return an error message
        if (isFirstGraphCompleted && component1.includes(nodeId)) {
          return {
            newState: graphState,
            validMove: false,
            message:
              "The first graph is already completed. Please continue with the second graph.",
          };
        }

        if (!isInSameComponent) {
          // Check if current component is complete
          const isCurrentComponentComplete = currentComponent.every(
            (id) => newState.nodes.find((n) => n.id === id).visited
          );

          if (!isCurrentComponentComplete) {
            return {
              newState: graphState,
              validMove: false,
              message: `Complete the current component first before moving to the other component.`,
            };
          }

          // If current component is complete, allow starting the new component
          if (!clickedNode.visited) {
            if (newState.currentNode) {
              const prevNode = newState.nodes.find(
                (n) => n.id === newState.currentNode
              );
              prevNode.current = false;
              // Ensure previous node remains visited, not backtracked
              prevNode.visited = true;
              prevNode.backtracked = false;
            }

            clickedNode.visited = true;
            clickedNode.current = true;
            newState.currentNode = nodeId;
            newState.stack = [nodeId];
            return { newState, validMove: true, nodeStatus: "unvisited" };
          }

          return {
            newState: graphState,
            validMove: false,
            message: `Invalid move. When starting a new component, you must start with node A or D.`,
          };
        }

        if (!isConnected && isInSameComponent) {
          return {
            newState: graphState,
            validMove: false,
            message: `Node ${nodeId} is not connected to your current position (${newState.currentNode}).`,
          };
        }

        // Handle normal DFS moves within the same component
        if (!clickedNode.visited) {
          const prevNode = newState.nodes.find(
            (n) => n.id === newState.currentNode
          );
          prevNode.current = false;
          prevNode.visited = true;
          prevNode.backtracked = false;

          clickedNode.visited = true;
          clickedNode.current = true;
          newState.currentNode = nodeId;
          newState.stack.push(nodeId);

          // Check if this is the last node in the component
          const isLastNodeInComponent = currentComponent.every(
            (id) =>
              id === nodeId || newState.nodes.find((n) => n.id === id).visited
          );

          if (isLastNodeInComponent) {
            clickedNode.current = false; // Ensure last node is not marked as current
            clickedNode.visited = true;
            newState.currentNode = null;
          }

          // Check if both components are complete after this move
          const isAllComplete = [...component1, ...component2].every(
            (id) => newState.nodes.find((n) => n.id === id).visited
          );

          if (isAllComplete) {
            newState.nodes = newState.nodes.map((node) => ({
              ...node,
              current: false,
              visited: true,
              backtracked: node.backtracked,
            }));
            newState.currentNode = null;
            newState.stack = [];
            return { newState, validMove: true, nodeStatus: "final-move" };
          }

          return { newState, validMove: true, nodeStatus: "unvisited" };
        }

        // Allow backtracking within the same component
        if (clickedNode.visited && isConnected) {
          const prevNode = newState.nodes.find(
            (n) => n.id === newState.currentNode
          );
          prevNode.current = false;
          prevNode.visited = true;

          clickedNode.current = true;
          newState.currentNode = nodeId;
          newState.stack.pop();
          return { newState, validMove: true, nodeStatus: "visited" };
        }

        return {
          newState: graphState,
          validMove: false,
          message: `Invalid move.`,
        };

        break;
      default:
        console.log("default case");
        if (newState.nodes.every((n) => n.id === nodeId || n.backtracked)) {
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
  if (graphState.graphId === "F") {
    // Check if both components are fully visited
    const component1 = ["A", "B", "C"];
    const component2 = ["D", "E", "F"];

    const isComponent1FullyVisited = component1.every(
      (nodeId) => graphState.nodes.find((n) => n.id === nodeId).visited
    );
    const isComponent2FullyVisited = component2.every(
      (nodeId) => graphState.nodes.find((n) => n.id === nodeId).visited
    );

    return isComponent1FullyVisited && isComponent2FullyVisited;
  }
  return graphState.graphId === "D" || graphState.graphId === "E"
    ? graphState.nodes.every((node) => node.visited)
    : graphState.nodes.every((node) => node.backtracked);
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
