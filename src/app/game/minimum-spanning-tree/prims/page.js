"use client";

import React from "react";
import GamePageStructure from "@/components/GamePageStructure";

const graphAState = {
  nodes: [
    { id: "A", visited: false },
    { id: "B", visited: false },
    { id: "C", visited: false },
    { id: "D", visited: false },
    { id: "E", visited: false },
    { id: "F", visited: false },
  ],
  edges: [
    { source: "A", target: "B", weight: 7, selected: false },
    { source: "A", target: "C", weight: 9, selected: false },
    { source: "A", target: "F", weight: 14, selected: false },
    { source: "B", target: "C", weight: 10, selected: false },
    { source: "B", target: "D", weight: 15, selected: false },
    { source: "C", target: "D", weight: 11, selected: false },
    { source: "C", target: "F", weight: 2, selected: false },
    { source: "D", target: "E", weight: 6, selected: false },
    { source: "E", target: "F", weight: 9, selected: false },
  ],
  mstEdges: [],
  currentEdge: null,
};

const graphBState = {
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
    { source: "A", target: "B", weight: 4, selected: false },
    { source: "A", target: "C", weight: 3, selected: false },
    { source: "B", target: "D", weight: 5, selected: false },
    { source: "B", target: "E", weight: 2, selected: false },
    { source: "C", target: "F", weight: 4, selected: false },
    { source: "D", target: "G", weight: 3, selected: false },
    { source: "E", target: "G", weight: 4, selected: false },
    { source: "F", target: "G", weight: 2, selected: false },
  ],
  mstEdges: [],
  currentEdge: null,
};

const isValidMove = (graphState, edgeIndex) => {
  // Guard clause for invalid edge index
  if (
    edgeIndex === undefined ||
    edgeIndex < 0 ||
    edgeIndex >= graphState.edges.length
  ) {
    return {
      newState: graphState,
      validMove: false,
      message: "Invalid edge selection.",
    };
  }

  const newState = JSON.parse(JSON.stringify(graphState));
  const selectedEdge = newState.edges[edgeIndex];

  // Guard clause for invalid edge
  if (!selectedEdge) {
    return {
      newState: graphState,
      validMove: false,
      message: "Invalid edge selection.",
    };
  }

  // Get visited nodes
  const visitedNodes = new Set(
    newState.nodes.filter((n) => n.visited).map((n) => n.id)
  );

  // If no nodes are visited yet, only allow starting from node A
  if (visitedNodes.size === 0) {
    if (selectedEdge.source !== "A" && selectedEdge.target !== "A") {
      return {
        newState: graphState,
        validMove: false,
        message: "Must start from node A!",
      };
    }
  } else {
    // Check if the edge connects to the visited set
    const connectsToVisited =
      (visitedNodes.has(selectedEdge.source) &&
        !visitedNodes.has(selectedEdge.target)) ||
      (visitedNodes.has(selectedEdge.target) &&
        !visitedNodes.has(selectedEdge.source));

    if (!connectsToVisited) {
      return {
        newState: graphState,
        validMove: false,
        message: "Edge must connect a visited node to an unvisited node!",
      };
    }

    // Find the minimum weight among valid edges
    const minWeight = Math.min(
      ...newState.edges
        .filter(
          (e) =>
            !e.selected &&
            ((visitedNodes.has(e.source) && !visitedNodes.has(e.target)) ||
              (visitedNodes.has(e.target) && !visitedNodes.has(e.source)))
        )
        .map((e) => e.weight)
    );

    if (selectedEdge.weight > minWeight) {
      return {
        newState: graphState,
        validMove: false,
        message: `Incorrect! There is an available edge with lower weight (${minWeight}).`,
      };
    }
  }

  // Valid move - update the state
  selectedEdge.selected = true;
  newState.mstEdges.push({
    source: selectedEdge.source,
    target: selectedEdge.target,
    weight: selectedEdge.weight,
  });

  // Mark nodes as visited
  const sourceNode = newState.nodes.find((n) => n.id === selectedEdge.source);
  const targetNode = newState.nodes.find((n) => n.id === selectedEdge.target);
  if (sourceNode) sourceNode.visited = true;
  if (targetNode) targetNode.visited = true;

  newState.currentEdge = edgeIndex;

  let nodeStatus = "regular-move";
  if (newState.mstEdges.length === newState.nodes.length - 1) {
    nodeStatus = "final-move";
  }

  return {
    newState,
    validMove: true,
    nodeStatus,
    message: getMessage(nodeStatus, edgeIndex, newState),
  };
};

const getNodeStatus = (node) => {
  if (node.visited) return "visited";
  return "unvisited";
};

const isGameComplete = (graphState) => {
  return graphState.mstEdges.length === graphState.nodes.length - 1;
};

const getMessage = (nodeStatus, edgeIndex, graphState) => {
  if (edgeIndex === undefined) {
    return "Start by selecting edges to build the Minimum Spanning Tree. Begin from node A!";
  }

  const edge = graphState.edges[edgeIndex];
  const totalWeight = graphState.mstEdges.reduce((sum, e) => sum + e.weight, 0);

  switch (nodeStatus) {
    case "regular-move":
      return `Correct! Added edge ${edge.source}-${edge.target} (weight: ${edge.weight}) to the MST. Current total weight: ${totalWeight}`;
    case "final-move":
      return `Congratulations! You've completed the MST with total weight ${totalWeight}. All vertices are connected optimally!`;
    default:
      return "";
  }
};

const getScore = (nodeStatus) => {
  switch (nodeStatus) {
    case "regular-move":
      return 10;
    case "final-move":
      return 20;
    default:
      return 0;
  }
};

const PrimsGamePage = () => {
  return (
    <GamePageStructure
      title="Prim's Algorithm Game"
      initialGraphState={graphAState}
      secondaryGraphState={graphBState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      isGameComplete={isGameComplete}
      getMessage={getMessage}
      getScore={getScore}
    />
  );
};

export default PrimsGamePage;
