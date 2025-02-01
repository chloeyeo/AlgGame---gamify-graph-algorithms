"use client";

import React, { useState, useEffect } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateDFSSteps } from "@/components/EducationPageStructure";

// Helper function to generate a simple graph
const generateGameGraph = (nodeCount) => {
  const nodes = [];
  const edges = [];

  // Generate nodes in a circular layout
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: String.fromCharCode(65 + i),
      x: 300 + 200 * Math.cos((2 * Math.PI * i) / nodeCount),
      y: 300 + 200 * Math.sin((2 * Math.PI * i) / nodeCount),
    });
  }

  // Create a connected graph with bidirectional edges
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push(
      { source: nodes[i].id, target: nodes[i + 1].id },
      { source: nodes[i + 1].id, target: nodes[i].id }
    );
  }
  // Connect last and first node
  edges.push(
    { source: nodes[nodes.length - 1].id, target: nodes[0].id },
    { source: nodes[0].id, target: nodes[nodes.length - 1].id }
  );

  // Add some random edges for more interesting paths
  for (let i = 0; i < nodes.length; i++) {
    if (Math.random() > 0.5) {
      const target = Math.floor(Math.random() * nodes.length);
      if (
        target !== i &&
        !edges.some(
          (e) =>
            (e.source === nodes[i].id && e.target === nodes[target].id) ||
            (e.source === nodes[target].id && e.target === nodes[i].id)
        )
      ) {
        edges.push(
          { source: nodes[i].id, target: nodes[target].id },
          { source: nodes[target].id, target: nodes[i].id }
        );
      }
    }
  }

  return { nodes, edges };
};

const DFSGamePage = () => {
  const [nodeCount, setNodeCount] = useState(6);
  const [graphState, setGraphState] = useState(() => {
    const { nodes, edges } = generateGameGraph(nodeCount);
    return {
      nodes: nodes.map((node) => ({
        ...node,
        visited: false,
        backtracked: false,
        current: false,
      })),
      edges,
      currentNode: null,
      stack: [],
      visitedNodes: [],
      backtrackedNodes: [],
    };
  });

  const handleNodeCountChange = (newCount) => {
    const { nodes, edges } = generateGameGraph(newCount);
    setGraphState({
      nodes: nodes.map((node) => ({
        ...node,
        visited: false,
        backtracked: false,
        current: false,
      })),
      edges,
      currentNode: null,
      stack: [],
      visitedNodes: [],
      backtrackedNodes: [],
    });
  };

  const isValidMove = (graphState, nodeId) => {
    const newState = JSON.parse(JSON.stringify(graphState));
    const clickedNode = newState.nodes.find((n) => n.id === nodeId);

    if (!clickedNode) return { validMove: false, newState: graphState };

    // First move - can start from any node
    if (!newState.currentNode) {
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack = [nodeId];
      newState.visitedNodes.push(nodeId);
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Starting DFS from node ${nodeId}`,
      };
    }

    const neighbors = newState.edges
      .filter(
        (e) =>
          e.source === newState.currentNode || e.target === newState.currentNode
      )
      .map((e) => (e.source === newState.currentNode ? e.target : e.source));

    const unvisitedNeighbors = neighbors.filter(
      (n) => !newState.visitedNodes.includes(n)
    );

    // Visit unvisited neighbor
    if (neighbors.includes(nodeId) && !newState.visitedNodes.includes(nodeId)) {
      const prevNode = newState.nodes.find(
        (n) => n.id === newState.currentNode
      );
      prevNode.current = false;
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.push(nodeId);
      newState.visitedNodes.push(nodeId);
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Visited node ${nodeId}`,
      };
    }

    // Backtrack
    if (
      unvisitedNeighbors.length === 0 &&
      newState.stack.length > 1 &&
      newState.stack[newState.stack.length - 2] === nodeId
    ) {
      const prevNode = newState.nodes.find(
        (n) => n.id === newState.currentNode
      );
      prevNode.current = false;
      prevNode.backtracked = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.pop();
      newState.backtrackedNodes.push(prevNode.id);
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Backtracked to node ${nodeId}`,
      };
    }

    return {
      validMove: false,
      newState: graphState,
      nodeStatus: "incorrect",
      message:
        "Invalid move! Follow DFS rules: visit unvisited neighbors or backtrack when needed.",
    };
  };

  const getNodeStatus = (node) => {
    if (node.current) return "current";
    if (node.backtracked) return "backtracked";
    if (node.visited) return "visited";
    return "unvisited";
  };

  const isGameComplete = (state) => {
    // Game is complete when all nodes are visited AND backtracked
    // (except the last node we end up at)
    const allNodesVisited = state.nodes.every((node) => node.visited);
    const allNodesBacktrackedExceptCurrent = state.nodes
      .filter((node) => !node.current)
      .every((node) => node.backtracked);

    return allNodesVisited && allNodesBacktrackedExceptCurrent;
  };

  return (
    <GamePageStructure
      title="DFS Graph Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      getScore={(status) => (status === "correct" ? 10 : -5)}
      getMessage={(status, nodeId) =>
        status === "incorrect"
          ? "Invalid move! Follow DFS rules: visit unvisited neighbors or backtrack when needed."
          : `Valid move to node ${nodeId}`
      }
      isGameComplete={isGameComplete}
      nodeCountProp={nodeCount}
      onNodeCountChange={handleNodeCountChange}
      maxNodes={8}
    />
  );
};

export default DFSGamePage;
