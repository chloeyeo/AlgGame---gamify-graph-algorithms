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
  components: new Map([
    ["A", "A"],
    ["B", "B"],
    ["C", "C"],
    ["D", "D"],
    ["E", "E"],
    ["F", "F"],
  ]),
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
  components: new Map([
    ["A", "A"],
    ["B", "B"],
    ["C", "C"],
    ["D", "D"],
    ["E", "E"],
    ["F", "F"],
    ["G", "G"],
  ]),
};

const findComponent = (components, node) => {
  let current = node;
  while (components.get(current) !== current) {
    current = components.get(current);
  }
  return current;
};

const unionComponents = (components, node1, node2) => {
  const root1 = findComponent(components, node1);
  const root2 = findComponent(components, node2);
  if (root1 !== root2) {
    components.set(root2, root1);
    return true;
  }
  return false;
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

  // Create a new Map from the components entries
  newState.components = new Map(
    Object.entries(Object.fromEntries(graphState.components))
  );

  // Find the minimum weight among unselected edges
  const unselectedEdges = graphState.edges.filter((e) => !e.selected);
  if (unselectedEdges.length === 0) {
    return {
      newState: graphState,
      validMove: false,
      message: "No more edges available.",
    };
  }

  const minWeight = Math.min(...unselectedEdges.map((e) => e.weight));

  // If not selecting the minimum weight edge
  if (selectedEdge.weight > minWeight) {
    return {
      newState: graphState,
      validMove: false,
      message: `Incorrect! Edge ${selectedEdge.source}-${selectedEdge.target} (weight: ${selectedEdge.weight}) is not the minimum weight edge available. Look for an edge with weight ${minWeight}.`,
    };
  }

  // Check if adding this edge would create a cycle
  if (
    !unionComponents(
      newState.components,
      selectedEdge.source,
      selectedEdge.target
    )
  ) {
    return {
      newState: graphState,
      validMove: false,
      message: `Adding edge ${selectedEdge.source}-${selectedEdge.target} would create a cycle! Try another edge.`,
    };
  }

  // Valid move - update the state
  selectedEdge.selected = true;
  newState.mstEdges.push({
    source: selectedEdge.source,
    target: selectedEdge.target,
    weight: selectedEdge.weight,
  });

  // Update node visited status
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

// Rest of the utility functions remain the same
const getNodeStatus = (node) => {
  if (node.visited) return "visited";
  return "unvisited";
};

const isGameComplete = (graphState) => {
  return graphState.mstEdges.length === graphState.nodes.length - 1;
};

const getMessage = (nodeStatus, edgeIndex, graphState) => {
  if (edgeIndex === undefined) {
    return "Click on edges in ascending order of weight to build the Minimum Spanning Tree!";
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

const KruskalsGamePage = () => {
  return (
    <GamePageStructure
      title="Kruskal's Algorithm Game"
      graphStates={[graphAState, graphBState]}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      isGameComplete={isGameComplete}
      getMessage={getMessage}
      getScore={getScore}
    />
  );
};

export default KruskalsGamePage;
