"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";

const EDGE_STATES = {
  NORMAL: "normal", // gray
  CONSIDERING: "checking", // green
  MST: "mst", // red
  FRONTIER: "frontier", // yellow - edges connected to MST
};

const primPseudocode = `function Prim(graph, startNode):
    visited = {startNode}
    mstEdges = []
    frontier = all edges connected to startNode
    while frontier is not empty:
        minEdge = edge with minimum weight in frontier
        remove minEdge from frontier
        newNode = unvisited node of minEdge
        if both nodes of minEdge are visited:
            continue
        add minEdge to mstEdges
        add newNode to visited
        add edges connected to newNode to frontier
    return mstEdges`;

const primConceptText = {
  introduction: `Prim's algorithm finds the minimum spanning tree (MST) of a weighted graph. Unlike Kruskal's algorithm which considers edges globally, Prim's grows a tree from a starting node by repeatedly adding the lowest-weight edge that connects a new node to the growing tree.`,

  keyCharacteristics: [
    "Starts from a single node and grows the MST one edge at a time",
    "Maintains a frontier of edges that could be added next",
    "Always chooses the lowest-weight edge that connects a new node",
    "Automatically avoids cycles by only connecting new nodes",
    "Runs until all nodes are connected",
  ],

  visualization: `The visualization uses the following color coding:
• Blue: Nodes in the current MST
• Green: Edge being considered
• Red: Edges in the MST
• Yellow: Frontier edges (connected to MST but not yet chosen)
• Gray: Unvisited edges
• Numbers on edges: Edge weights`,

  timeComplexity: `Time Complexity: O(E log V) with a binary heap, where E is the number of edges and V is the number of vertices.`,

  spaceComplexity: `Space Complexity: O(V + E) to store the graph and priority queue.`,

  realWorldApplications: [
    "Network Design: Planning efficient computer networks",
    "Circuit Design: Minimizing wire length in electronic circuits",
    "Transportation: Planning road networks between cities",
    "Utilities: Designing power and water distribution networks",
    "Clustering: Used in some clustering algorithms",
  ],

  comparisonWithKruskal: `While both Prim's and Kruskal's algorithms find the MST, they work differently:
• Prim's grows a single tree from a start node
• Kruskal's can grow multiple trees that eventually merge
• Prim's is often better for dense graphs
• Kruskal's is often better for sparse graphs`,

  tips: [
    "• The choice of starting node doesn't affect the final MST",
    "• Keep track of the frontier edges to quickly find the next edge to add",
    "• Only consider edges that connect to unvisited nodes",
    "• The algorithm naturally avoids cycles",
    "• The MST will have exactly (V-1) edges when complete",
  ],
};

const generatePrimSteps = (initialNodes, edges, startNodeId = "A") => {
  const steps = [];
  const mstEdges = [];
  const visited = new Set();
  const frontier = new Set();

  // Initial state
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: node.id === startNodeId,
      })),
      edges: edges.map((edge) => ({
        ...edge,
        state: EDGE_STATES.NORMAL,
      })),
      mstEdges: [],
    },
    explanation: `Starting Prim's algorithm from node ${startNodeId}. No edges in MST yet.`,
    pseudoCodeLines: [1, 2, 3, 4],
  });

  visited.add(startNodeId);
  edges.forEach((edge) => {
    if (edge.source === startNodeId || edge.target === startNodeId) {
      frontier.add(edge);
    }
  });

  while (frontier.size > 0) {
    // Step 1: Finding minimum edge
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : frontier.has(e)
            ? EDGE_STATES.FRONTIER
            : EDGE_STATES.NORMAL,
        })),
        mstEdges: [...mstEdges],
      },
      explanation: `Looking for the minimum weight edge in the frontier.`,
      pseudoCodeLines: [6], // Only highlight finding minEdge
    });

    let minEdge = Array.from(frontier).reduce((min, edge) =>
      edge.weight < min.weight ? edge : min
    );

    // Step 2: Removing from frontier
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : frontier.has(e)
            ? EDGE_STATES.FRONTIER
            : EDGE_STATES.NORMAL,
        })),
        mstEdges: [...mstEdges],
      },
      explanation: `Removing edge ${minEdge.source}-${minEdge.target} from frontier.`,
      pseudoCodeLines: [7], // Explicitly highlight remove step
    });

    frontier.delete(minEdge);

    // Step 3: Identify unvisited node
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : e === minEdge
            ? EDGE_STATES.CONSIDERING
            : frontier.has(e)
            ? EDGE_STATES.FRONTIER
            : EDGE_STATES.NORMAL,
        })),
        mstEdges: [...mstEdges],
      },
      explanation: `Identifying the unvisited node from edge ${minEdge.source}-${minEdge.target}.`,
      pseudoCodeLines: [8], // Explicitly highlight the newNode line
    });

    const newNode = !visited.has(minEdge.source)
      ? minEdge.source
      : minEdge.target;

    // Step 4: Check for cycle
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : e === minEdge
            ? EDGE_STATES.CONSIDERING
            : frontier.has(e)
            ? EDGE_STATES.FRONTIER
            : EDGE_STATES.NORMAL,
        })),
        mstEdges: [...mstEdges],
      },
      explanation: `Checking if edge ${minEdge.source}-${minEdge.target} would create a cycle.`,
      pseudoCodeLines: [9], // Explicitly highlight the cycle check line
    });

    if (visited.has(minEdge.source) && visited.has(minEdge.target)) {
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
          })),
          edges: edges.map((e) => ({
            ...e,
            state: mstEdges.some(
              (mstEdge) =>
                (mstEdge.source === e.source && mstEdge.target === e.target) ||
                (mstEdge.source === e.target && mstEdge.target === e.source)
            )
              ? EDGE_STATES.MST
              : e === minEdge
              ? EDGE_STATES.CONSIDERING
              : frontier.has(e)
              ? EDGE_STATES.FRONTIER
              : EDGE_STATES.NORMAL,
          })),
          mstEdges: [...mstEdges],
        },
        explanation: `Skipping edge ${minEdge.source}-${minEdge.target} as it would create a cycle.`,
        pseudoCodeLines: [10], // continue line
      });
      continue;
    }

    // Step 5: Add edge to MST
    mstEdges.push(minEdge);
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : e === minEdge
            ? EDGE_STATES.CONSIDERING
            : frontier.has(e)
            ? EDGE_STATES.FRONTIER
            : EDGE_STATES.NORMAL,
        })),
        mstEdges: [...mstEdges],
      },
      explanation: `Adding edge ${minEdge.source}-${minEdge.target} to MST.`,
      pseudoCodeLines: [11], // add to MST line
    });

    // Step 6: Mark node as visited
    visited.add(newNode);
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : e === minEdge
            ? EDGE_STATES.CONSIDERING
            : frontier.has(e)
            ? EDGE_STATES.FRONTIER
            : EDGE_STATES.NORMAL,
        })),
        mstEdges: [...mstEdges],
      },
      explanation: `Marking node ${newNode} as visited.`,
      pseudoCodeLines: [12], // add to visited line
    });

    // Step 7: Update frontier
    edges.forEach((edge) => {
      if (
        (edge.source === newNode || edge.target === newNode) &&
        !(visited.has(edge.source) && visited.has(edge.target))
      ) {
        frontier.add(edge);
      }
    });

    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : e === minEdge
            ? EDGE_STATES.CONSIDERING
            : frontier.has(e)
            ? EDGE_STATES.FRONTIER
            : EDGE_STATES.NORMAL,
        })),
        mstEdges: [...mstEdges],
      },
      explanation: `Updated frontier with edges connected to node ${newNode}.`,
      pseudoCodeLines: [13], // update frontier line
    });
  }

  return steps;
};

const generateRandomGraph = (numNodes) => {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: String.fromCharCode(65 + i), // A, B, C, ...
  }));

  const edges = [];
  // Generate random edges with weights
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Add edge with 70% probability
      if (Math.random() < 0.7) {
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          weight: Math.floor(Math.random() * 15) + 1, // weights 1-15
        });
      }
    }
  }

  return { nodes, edges };
};

export default function PrimEducationPage() {
  return (
    <EducationPageStructure
      title="Prim's Algorithm"
      conceptText={primConceptText}
      pseudocode={primPseudocode}
      generateSteps={generatePrimSteps}
      generateNewGraph={generateRandomGraph}
    />
  );
}
