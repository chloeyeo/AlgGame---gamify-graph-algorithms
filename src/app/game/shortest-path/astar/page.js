"use client";

import React from "react";
import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false, f: 7, g: 0, h: 7, recentlyUpdated: false },
    {
      id: "B",
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 9,
      recentlyUpdated: false,
    },
    {
      id: "C",
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 9,
      recentlyUpdated: false,
    },
    {
      id: "D",
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 11,
      recentlyUpdated: false,
    },
    {
      id: "E",
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 9,
      recentlyUpdated: false,
    },
    {
      id: "F",
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 7,
      recentlyUpdated: false,
    },
    {
      id: "G",
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 0,
      recentlyUpdated: false,
    },
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 3 },
    { source: "B", target: "D", weight: 5 },
    { source: "B", target: "E", weight: 2 },
    { source: "C", target: "F", weight: 4 },
    { source: "D", target: "G", weight: 3 },
    { source: "E", target: "G", weight: 4 },
    { source: "F", target: "G", weight: 2 },
  ],
  currentNode: null,
};

const findUnvisitedNodeWithSmallestF = (nodes) => {
  let smallestF = Infinity;
  let nodesWithSmallestF = [];

  nodes.forEach((node) => {
    if (!node.visited) {
      if (node.f < smallestF) {
        smallestF = node.f;
        nodesWithSmallestF = [node.id];
      } else if (node.f === smallestF) {
        nodesWithSmallestF.push(node.id);
      }
    }
  });

  return {
    nodeId: nodesWithSmallestF[0] || null,
    tiedNodes: nodesWithSmallestF,
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

const updateNeighborScores = (currentNodeId, nodes, edges) => {
  const currentNode = nodes.find((n) => n.id === currentNodeId);
  const neighbors = getNeighbors(currentNodeId, edges);

  return nodes.map((node) => {
    if (node.visited) return node;

    const neighborInfo = neighbors.find((n) => n.id === node.id);
    if (neighborInfo) {
      const newG = currentNode.g + neighborInfo.weight;
      if (newG < node.g) {
        const newF = newG + node.h;
        return {
          ...node,
          g: newG,
          f: newF,
          recentlyUpdated: true,
        };
      }
    }
    return { ...node, recentlyUpdated: false };
  });
};

const formatValue = (value) => {
  return value === Infinity ? "∞" : value;
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
        message: `Invalid starting node! In A* algorithm, we must start from node A.
                     
                   • Node A starts with g(A) = 0, h(A) = 7, f(A) = 7
                   • All other nodes start with g = ∞, f = ∞
                   • h values are pre-calculated heuristic estimates to goal
                     
                   Click node A to begin.`,
      };
    }

    newState.currentNode = "A";
    newState.nodes = updateNeighborScores(
      "A",
      newState.nodes.map((node) =>
        node.id === "A" ? { ...node, visited: true } : node
      ),
      newState.edges
    );

    const updates = newState.nodes
      .filter((node) => node.recentlyUpdated)
      .map(
        (node) =>
          `• Node ${node.id}: g=${formatValue(node.g)}, h=${
            node.h
          }, f=${formatValue(node.f)}`
      );

    return {
      newState,
      validMove: true,
      nodeStatus: "start",
      message: `Perfect start! Node A is our starting node.
    
                 Initial values updated:
                 ${updates.join("\n")}
                   
                 Next, find the unvisited node with the smallest f-value (g + h).`,
    };
  }

  // Check if game is already complete
  if (currentState.nodes.find((n) => n.id === "G").visited) {
    return {
      newState: currentState,
      validMove: false,
      nodeStatus: "game_complete",
      message: `The game is already complete! Node G has been reached.
                 
                 Final path costs from A to G:
                 ${currentState.nodes
                   .map(
                     (node) =>
                       `• Node ${node.id}: g=${formatValue(node.g)}, h=${
                         node.h
                       }, f=${formatValue(node.f)}`
                   )
                   .join("\n")}`,
    };
  }

  const { nodeId: suggestedNextNode, tiedNodes } =
    findUnvisitedNodeWithSmallestF(currentState.nodes);

  // If there are no unvisited nodes left
  if (suggestedNextNode === null) {
    return {
      newState: currentState,
      validMove: false,
      nodeStatus: "no_moves",
      message: "There are no valid moves remaining.",
    };
  }

  const selectedNode = currentState.nodes.find((n) => n.id === selectedNodeId);

  if (selectedNode.visited) {
    return {
      newState: currentState,
      validMove: false,
      nodeStatus: "already_visited",
      message: `Node ${selectedNodeId} has already been visited! 
                 
                 In A* algorithm, we:
                 1. Never revisit nodes
                 2. Always choose an unvisited node with smallest f-value
                   
                 The unvisited nodes with smallest f-value are: ${tiedNodes.join(
                   ", "
                 )} (f = ${formatValue(
        currentState.nodes.find((n) => n.id === suggestedNextNode).f
      )})`,
    };
  }

  const isValidSelection = tiedNodes.includes(selectedNodeId);
  if (!isValidSelection) {
    const smallestF = currentState.nodes.find(
      (n) => n.id === suggestedNextNode
    ).f;

    return {
      newState: currentState,
      validMove: false,
      nodeStatus: "wrong_node",
      message: `Incorrect choice! You selected node ${selectedNodeId} (f = ${formatValue(
        selectedNode.f
      )})
                 but nodes ${tiedNodes.join(
                   ", "
                 )} have smaller f-value (${formatValue(smallestF)}).
                 
                 Remember: In A*, we always choose the unvisited node with the smallest f-value where f(n) = g(n) + h(n).`,
    };
  }

  // Update the state for the selected node
  newState.currentNode = selectedNodeId;
  newState.nodes = updateNeighborScores(
    selectedNodeId,
    newState.nodes.map((node) =>
      node.id === selectedNodeId ? { ...node, visited: true } : node
    ),
    newState.edges
  );

  const updates = newState.nodes
    .filter((node) => node.recentlyUpdated)
    .map(
      (node) =>
        `• Node ${node.id}: g=${formatValue(node.g)}, h=${
          node.h
        }, f=${formatValue(node.f)}`
    );

  // Check if we just visited node G
  if (selectedNodeId === "G") {
    return {
      newState,
      validMove: true,
      nodeStatus: "goal_reached",
      message: `Congratulations! You've reached the goal node G!
                 
                 Final path costs:
                 ${newState.nodes
                   .map(
                     (node) =>
                       `• Node ${node.id}: g=${formatValue(node.g)}, h=${
                         node.h
                       }, f=${formatValue(node.f)}`
                   )
                   .join("\n")}`,
    };
  }

  let message;
  if (tiedNodes.length > 1) {
    message = `Excellent! Nodes ${tiedNodes.join(
      ", "
    )} all had f-value ${formatValue(
      selectedNode.f
    )}. Any of them was a valid choice.
        
        ${
          updates.length > 0
            ? `Updated values for unvisited neighbors:\n${updates.join("\n")}`
            : "No neighbor values needed updating this time."
        }
        
        Continue with the next unvisited node with smallest f-value.`;
  } else {
    message =
      updates.length > 0
        ? `Excellent! Node ${selectedNodeId} was the unvisited node with smallest f-value.
           
           Updated values for unvisited neighbors:
           ${updates.join("\n")}
           
           Now find the next unvisited node with smallest f-value.`
        : `Correct! Node ${selectedNodeId} was the unvisited node with smallest f-value.
           
           No neighbor values needed updating this time.
           Continue with the next unvisited node with smallest f-value.`;
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
  return graphState.nodes.find((n) => n.id === "G").visited;
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

export default function AStarGamePage() {
  return (
    <GamePageStructure
      title="A* Algorithm Game"
      initialGraphState={initialGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      getScore={getScore}
      isGameComplete={isGameComplete}
    />
  );
}
