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
  currentComponent: null,
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

const isValidMove = (graphState, nodeId) => {
  const newState = JSON.parse(JSON.stringify(graphState));
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);

  // For Graph F: Define components
  const component1 = ["A", "B", "C"];
  const component2 = ["D", "E", "F"];

  // Helper function to check if all neighbors are visited
  const areAllNeighborsVisited = (nodeId) => {
    const neighbors = newState.edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => (e.source === nodeId ? e.target : e.source));

    return neighbors.every(
      (neighborId) => newState.nodes.find((n) => n.id === neighborId).visited
    );
  };

  // Helper function to check if a component is complete
  const isComponentComplete = (component) => {
    return component.every(
      (id) => newState.nodes.find((n) => n.id === id).backtracked
    );
  };

  if (!newState.currentNode) {
    if (graphState.graphId === "F") {
      const isComponent1Complete = isComponentComplete(component1);
      const isComponent2Complete = isComponentComplete(component2);

      // If starting fresh or one component is complete, we can start with either component
      if (!isComponent1Complete && !isComponent2Complete) {
        newState.currentComponent = component1.includes(nodeId)
          ? component1
          : component2;
      } else if (isComponent1Complete && !isComponent2Complete) {
        if (component1.includes(nodeId)) {
          return {
            newState: graphState,
            validMove: false,
            message:
              "The first component is already completed. Start with a node from the second component.",
          };
        }
        newState.currentComponent = component2;
      } else if (!isComponent1Complete && isComponent2Complete) {
        if (component2.includes(nodeId)) {
          return {
            newState: graphState,
            validMove: false,
            message:
              "The second component is already completed. Start with a node from the first component.",
          };
        }
        newState.currentComponent = component1;
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
    // For Graph F, only allow disconnected moves when switching between completed components
    if (
      graphState.graphId === "F" &&
      ((component1.includes(newState.currentNode) &&
        component2.includes(nodeId)) ||
        (component2.includes(newState.currentNode) &&
          component1.includes(nodeId)))
    ) {
      // Check if the previous component is complete before allowing switch
      const currentComponent = component1.includes(newState.currentNode)
        ? component1
        : component2;
      if (
        !currentComponent.every(
          (id) => newState.nodes.find((n) => n.id === id).backtracked
        )
      ) {
        return {
          newState: graphState,
          validMove: false,
          message:
            "You must complete the current component before moving to another component.",
        };
      }
    } else {
      return {
        newState: graphState,
        validMove: false,
        message: `Node ${nodeId} is not connected to your current position (${newState.currentNode}).`,
      };
    }
  }

  // For Graph F, enforce completing the current component
  if (graphState.graphId === "F" && newState.currentComponent) {
    if (
      !newState.currentComponent.includes(nodeId) &&
      !clickedNode.backtracked
    ) {
      return {
        newState: graphState,
        validMove: false,
        message:
          "You must complete the current component before moving to another component.",
      };
    }
  }

  // Validate backtracking
  if (clickedNode.visited) {
    // Check if it's a valid backtrack move
    if (newState.stack[newState.stack.length - 2] !== nodeId) {
      return {
        newState: graphState,
        validMove: false,
        message: `Invalid backtracking order. You must backtrack to ${
          newState.stack[newState.stack.length - 2]
        }.`,
      };
    }

    // Check if all neighbors are visited before allowing backtrack
    if (!areAllNeighborsVisited(newState.currentNode)) {
      return {
        newState: graphState,
        validMove: false,
        message: "You must visit all unvisited neighbors before backtracking!",
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
      (graphState.graphId === "F"
        ? component1.includes(nodeId)
          ? component1.every(
              (id) =>
                id === nodeId ||
                newState.nodes.find((n) => n.id === id).backtracked
            )
          : component2.every(
              (id) =>
                id === nodeId ||
                newState.nodes.find((n) => n.id === id).backtracked
            )
        : newState.nodes.every((n) => n.id === nodeId || n.backtracked));

    if (isLastNode) {
      clickedNode.backtracked = true;
      clickedNode.current = false;
      newState.currentNode = null;
      newState.stack.pop();

      if (graphState.graphId === "F") {
        newState.currentComponent = null;
      }

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
  if (!graphState) return false;

  if (graphState.graphId === "F") {
    const component1 = ["A", "B", "C"];
    const component2 = ["D", "E", "F"];
    return (
      component1.every(
        (id) => graphState.nodes.find((n) => n.id === id).backtracked
      ) &&
      component2.every(
        (id) => graphState.nodes.find((n) => n.id === id).backtracked
      )
    );
  }
  return graphState.nodes.every((node) => node.backtracked);
};

const getMessage = (nodeStatus, nodeId, graphState) => {
  if (!graphState || !nodeId) {
    return "";
  }

  const areAllNeighborsVisited = (nodeId) => {
    if (!graphState.edges || !graphState.nodes) {
      return false;
    }

    const edges = graphState.edges;
    const neighbors = edges
      .filter((e) => e.source === nodeId || e.target === nodeId)
      .map((e) => (e.source === nodeId ? e.target : e.source));

    return neighbors.every(
      (neighborId) =>
        graphState.nodes.find((n) => n.id === neighborId)?.visited ?? false
    );
  };

  const component1 = ["A", "B", "C"];
  const component2 = ["D", "E", "F"];

  switch (nodeStatus) {
    case "unvisited":
      if (graphState.currentNode && areAllNeighborsVisited(nodeId)) {
        if (graphState.graphId === "F") {
          const currentComponent = component1.includes(nodeId)
            ? "first"
            : "second";
          return `You've visited Node ${nodeId}. All neighbors in the ${currentComponent} component have been visited - time to backtrack!`;
        }
        return `You've visited Node ${nodeId}. All neighbors have been visited - time to backtrack!`;
      }
      if (graphState.graphId === "F") {
        const currentComponent = component1.includes(nodeId)
          ? "first"
          : "second";
        return `You've visited Node ${nodeId}. Continue exploring unvisited neighbors in the ${currentComponent} component using DFS.`;
      }
      return `You've visited Node ${nodeId}. Continue exploring unvisited neighbors using DFS.`;

    case "visited":
      return `Good backtracking to Node ${nodeId}! Remember to backtrack in the reverse order of visits.`;

    case "final-move":
      if (graphState.graphId === "F") {
        const isComponent1 = component1.includes(nodeId);
        const componentName = isComponent1 ? "first" : "second";
        const otherComponentComplete = isComponent1
          ? component2.every(
              (id) =>
                graphState.nodes.find((n) => n.id === id)?.backtracked ?? false
            )
          : component1.every(
              (id) =>
                graphState.nodes.find((n) => n.id === id)?.backtracked ?? false
            );

        return otherComponentComplete
          ? "Excellent! You've completed DFS traversal for both components!"
          : `You've completed DFS for the ${componentName} component! Now start DFS on the other component.`;
      }
      return "Excellent! You've completed the DFS traversal by backtracking to the starting node!";

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

export default DFSGamePage;
