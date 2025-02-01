"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import {
  generateDFSSteps,
  generateDFSExplanation,
} from "@/components/EducationPageStructure";

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

const generateRandomGraph = (nodeCount = 6) => {
  const nodes = [];
  const width = 800;
  const height = 600;
  const padding = 100;
  const centerX = width / 2;
  const centerY = height / 2;

  // Generate nodes in a circular layout with random offsets
  for (let i = 0; i < nodeCount; i++) {
    const baseAngle = (2 * Math.PI * i) / nodeCount;
    const randomOffset = (Math.random() - 0.5) * (Math.PI / nodeCount);
    const angle = baseAngle + randomOffset;

    const minRadius = (height - 2 * padding) / 3;
    const maxRadius = (height - 2 * padding) / 2;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);

    nodes.push({
      id: String.fromCharCode(65 + i),
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  // Generate edges (ensuring connected graph)
  const edges = [];

  // First ensure the graph is connected
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push(
      { source: nodes[i].id, target: nodes[i + 1].id },
      { source: nodes[i + 1].id, target: nodes[i].id }
    );
  }

  // Add some random additional edges (max 3 extra edges)
  const maxExtraEdges = Math.min(nodeCount - 1, 3);
  for (let i = 0; i < maxExtraEdges; i++) {
    const source = Math.floor(Math.random() * nodes.length);
    const target = Math.floor(Math.random() * nodes.length);

    if (
      source !== target &&
      !edges.some(
        (e) =>
          (e.source === nodes[source].id && e.target === nodes[target].id) ||
          (e.source === nodes[target].id && e.target === nodes[source].id)
      )
    ) {
      edges.push(
        { source: nodes[source].id, target: nodes[target].id },
        { source: nodes[target].id, target: nodes[source].id }
      );
    }
  }

  return { nodes, edges };
};

const DFSGamePage = () => {
  const [nodeCount, setNodeCount] = useState(6);
  const [graphState, setGraphState] = useState(() => {
    const { nodes, edges } = generateRandomGraph(nodeCount);
    const initialNodes = nodes.map((node) => ({
      ...node,
      visited: false,
      backtracked: false,
      current: false,
    }));

    // Generate all possible DFS steps
    const steps = generateDFSSteps(initialNodes, edges);

    return {
      nodes: initialNodes,
      edges,
      currentNode: null,
      stack: [],
      expectedSteps: steps,
      currentStep: 0,
    };
  });

  const isValidMove = (state, nodeId, currentStep) => {
    const expectedStep = state.expectedSteps[currentStep];
    if (!expectedStep) return { validMove: false };

    const isCorrectNode = expectedStep.graphState.currentNode === nodeId;

    if (isCorrectNode) {
      return {
        validMove: true,
        newState: {
          ...state,
          nodes: state.nodes.map((node) => ({
            ...node,
            visited: expectedStep.graphState.nodes.find((n) => n.id === node.id)
              .visited,
            backtracked: expectedStep.graphState.nodes.find(
              (n) => n.id === node.id
            ).backtracked,
            current: node.id === nodeId,
          })),
          currentNode: nodeId,
          stack: expectedStep.graphState.stack,
          expectedSteps: state.expectedSteps,
          currentStep: currentStep + 1,
        },
        nodeStatus: "correct",
        message: expectedStep.explanation,
      };
    }

    return {
      validMove: false,
      newState: state,
      nodeStatus: "incorrect",
      message: `Expected ${expectedStep.graphState.currentNode}, but got ${nodeId}`,
    };
  };

  const handleNodeCountChange = (newCount) => {
    setNodeCount(newCount);
    const { nodes, edges } = generateRandomGraph(newCount);
    const initialNodes = nodes.map((node) => ({
      ...node,
      visited: false,
      backtracked: false,
      current: false,
    }));

    setGraphState({
      nodes: initialNodes,
      edges,
      currentNode: null,
      stack: [],
      expectedSteps: generateDFSSteps(initialNodes, edges),
      currentStep: 0,
    });
  };

  return (
    <GamePageStructure
      title="DFS Graph Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      getNodeStatus={() => "default"}
      getScore={(status) => (status === "correct" ? 10 : 0)}
      getMessage={(status, nodeId) =>
        status === "correct"
          ? graphState.expectedSteps[graphState.currentStep - 1]?.explanation ||
            `Correct! Node ${nodeId} is the next step`
          : `Incorrect! Try again`
      }
      isGameComplete={(state) =>
        state.currentStep >= state.expectedSteps.length
      }
      nodeCountProp={nodeCount}
      onNodeCountChange={handleNodeCountChange}
      maxNodes={8}
    />
  );
};

export default DFSGamePage;
