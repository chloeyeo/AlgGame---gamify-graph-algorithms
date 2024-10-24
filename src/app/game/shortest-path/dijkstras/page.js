"use client";

import React from "react";
import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false, distance: 0, recentlyUpdated: false },
    { id: "B", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "C", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "D", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "E", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "F", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "G", visited: false, distance: Infinity, recentlyUpdated: false },
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "D", weight: 3 },
    { source: "B", target: "E", weight: 1 },
    { source: "C", target: "F", weight: 5 },
    { source: "D", target: "G", weight: 2 },
    { source: "E", target: "G", weight: 3 },
    { source: "F", target: "G", weight: 1 },
  ],
  currentNode: null,
};

const findUnvisitedNodeWithSmallestDistance = (nodes) => {
  let smallestDistance = Infinity;
  let nodesWithSmallestDistance = [];

  nodes.forEach((node) => {
    if (!node.visited) {
      if (node.distance < smallestDistance) {
        smallestDistance = node.distance;
        nodesWithSmallestDistance = [node.id];
      } else if (node.distance === smallestDistance) {
        nodesWithSmallestDistance.push(node.id);
      }
    }
  });

  return {
    nodeId: nodesWithSmallestDistance[0] || null,
    tiedNodes: nodesWithSmallestDistance,
  };
};

const getNeighbors = (nodeId, edges) => {
  return edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => ({
      id: edge.target,
      weight: edge.weight,
    }));
};

const updateNeighborDistances = (currentNodeId, nodes, edges) => {
  const currentNode = nodes.find((n) => n.id === currentNodeId);
  const neighbors = getNeighbors(currentNodeId, edges);

  return nodes.map((node) => {
    if (node.visited) return node;

    const neighborInfo = neighbors.find((n) => n.id === node.id);
    if (neighborInfo) {
      const newDistance = currentNode.distance + neighborInfo.weight;
      if (newDistance < node.distance) {
        return {
          ...node,
          distance: newDistance,
          recentlyUpdated: true,
        };
      }
    }
    return { ...node, recentlyUpdated: false };
  });
};

const formatDistance = (distance) => {
  return distance === Infinity ? "∞" : distance;
};

const isValidMove = (currentState, selectedNodeId) => {
  const newState = {
    ...currentState,
    nodes: [...currentState.nodes],
    edges: [...currentState.edges],
  };

  // Handle first move - must start from node A
  if (currentState.currentNode === null) {
    if (selectedNodeId !== "A") {
      return {
        newState: currentState,
        validMove: false,
        nodeStatus: "invalid_start",
        message: `Invalid starting node! In Dijkstra's algorithm, we must start from node A (the source node).
                   
                   • Node A's distance is initialized to 0
                   • All other nodes start with distance = ∞
                   • From A, we'll update distances to its neighbors and then choose the unvisited node with smallest distance
                   
                   Click node A to begin.`,
      };
    }

    // Initialize starting node A and update its neighbors
    newState.currentNode = "A";
    newState.nodes = updateNeighborDistances(
      "A",
      newState.nodes.map((node) =>
        node.id === "A" ? { ...node, visited: true } : node
      ),
      newState.edges
    );

    const updates = newState.nodes
      .filter((node) => node.recentlyUpdated)
      .map((node) => `• Node ${node.id}: updated distance to ${node.distance}`);

    return {
      newState,
      validMove: true,
      nodeStatus: "start",
      message: `Perfect start! Node A is our source node.
  
                 Initial distances updated:
                 ${updates.join("\n")}
                 
                 Next, find the unvisited node with the smallest current distance.`,
    };
  }

  // Get all nodes with the smallest distance
  const { nodeId: suggestedNextNode, tiedNodes } =
    findUnvisitedNodeWithSmallestDistance(currentState.nodes);

  // If no unvisited nodes remain, the game is complete
  if (suggestedNextNode === null) {
    return {
      newState: currentState,
      validMove: false,
      nodeStatus: "game_complete",
      message: `Congratulations! You've completed Dijkstra's algorithm!
                 
                 Final shortest path distances from A:
                 ${currentState.nodes
                   .map(
                     (node) =>
                       `• Node ${node.id}: ${formatDistance(node.distance)}`
                   )
                   .join("\n")}`,
    };
  }

  // Get info about selected node
  const selectedNode = currentState.nodes.find((n) => n.id === selectedNodeId);

  // Check if node has already been visited
  if (selectedNode.visited) {
    return {
      newState: currentState,
      validMove: false,
      nodeStatus: "already_visited",
      message: `Node ${selectedNodeId} has already been visited! 
                 
                 In Dijkstra's algorithm, we:
                 1. Never revisit nodes
                 2. Always choose an unvisited node with smallest current distance
                 
                 The unvisited nodes with smallest distance are: ${tiedNodes.join(
                   ", "
                 )} (distance = ${formatDistance(selectedNode.distance)})`,
    };
  }

  // Check if selected node has the smallest distance (including ties)
  const isValidSelection = tiedNodes.includes(selectedNodeId);
  if (!isValidSelection) {
    const smallestDistance = currentState.nodes.find(
      (n) => n.id === suggestedNextNode
    ).distance;

    return {
      newState: currentState,
      validMove: false,
      nodeStatus: "wrong_node",
      message: `Incorrect choice! You selected node ${selectedNodeId} (distance = ${formatDistance(
        selectedNode.distance
      )})
                 but nodes ${tiedNodes.join(
                   ", "
                 )} have smaller distance (${formatDistance(smallestDistance)}).
                 
                 In Dijkstra's algorithm, we always choose an unvisited node with the smallest current distance.
                 This ensures we find the shortest paths first.`,
    };
  }

  // Valid move - update state with the selected node
  newState.currentNode = selectedNodeId;
  newState.nodes = updateNeighborDistances(
    selectedNodeId,
    newState.nodes.map((node) =>
      node.id === selectedNodeId ? { ...node, visited: true } : node
    ),
    newState.edges
  );

  // Generate detailed feedback about distance updates
  const updates = newState.nodes
    .filter((node) => node.recentlyUpdated)
    .map((node) => `• Node ${node.id}: ${formatDistance(node.distance)}`);

  let message;
  if (tiedNodes.length > 1) {
    message = `Excellent! Nodes ${tiedNodes.join(
      ", "
    )} all had distance ${formatDistance(
      selectedNode.distance
    )}. Any of them was a valid choice.
      
      ${
        updates.length > 0
          ? `Updated distances for unvisited neighbors:\n${updates.join("\n")}`
          : "No neighbor distances needed updating this time."
      }
      
      Continue with the next unvisited node with smallest distance.`;
  } else {
    message =
      updates.length > 0
        ? `Excellent! Node ${selectedNodeId} was the unvisited node with smallest distance.
         
           Updated distances for unvisited neighbors:
           ${updates.join("\n")}
           
           Now find the next unvisited node with smallest distance.`
        : `Correct! Node ${selectedNodeId} was the unvisited node with smallest distance.
           
           No neighbor distances needed updating this time.
           Continue with the next unvisited node with smallest distance.`;
  }

  return {
    newState,
    validMove: true,
    nodeStatus: "correct",
    message,
  };
};

const getNodeStatus = (graphState, nodeId) => {
  const node = graphState.nodes.find((n) => n.id === nodeId);
  if (!node) return "unknown";
  if (node.visited) return "visited";
  if (node.recentlyUpdated) return "updated";
  return "unvisited";
};

const isGameComplete = (graphState) => {
  return graphState.nodes.every((node) => node.visited);
};

const getScore = (nodeStatus) => {
  const scoreMap = {
    start: 10,
    correct: 15,
    wrong_node: -5,
    wrong_node_tied: -5,
    invalid_start: -10,
    already_visited: -5,
  };
  return scoreMap[nodeStatus] || 0;
};

export default function DijkstraGamePage() {
  return (
    <GamePageStructure
      title="Dijkstra's Algorithm Game"
      initialGraphState={initialGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      getScore={getScore}
      isGameComplete={isGameComplete}
    />
  );
}
