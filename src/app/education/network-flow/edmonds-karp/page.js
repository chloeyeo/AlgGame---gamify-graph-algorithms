"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";
import EdmondsKarpGraphVisualisation from "@/components/EdmondsKarpGraphVisualisation";

const edmondsKarpSteps = [
  {
    graphState: {
      nodes: [
        { id: "S", x: 100, y: 250, visited: false },
        { id: "A", x: 250, y: 150, visited: false },
        { id: "B", x: 250, y: 350, visited: false },
        { id: "C", x: 400, y: 250, visited: false },
        { id: "T", x: 550, y: 250, visited: false },
      ],
      edges: [
        { source: "S", target: "A", weight: 7, flow: 0 },
        { source: "S", target: "B", weight: 4, flow: 0 },
        { source: "A", target: "B", weight: 5, flow: 0 },
        { source: "A", target: "C", weight: 3, flow: 0 },
        { source: "B", target: "C", weight: 3, flow: 0 },
        { source: "C", target: "T", weight: 8, flow: 0 },
      ],
      mstEdges: [],
      currentNode: null,
    },
    explanation:
      "Initial flow network with source S and sink T. Edge labels show capacity/current flow. All flows are initially 0.",
  },
  {
    graphState: {
      nodes: [
        { id: "S", visited: true },
        { id: "A", visited: true },
        { id: "C", visited: true },
        { id: "T", visited: true },
        { id: "B", visited: false },
      ],
      edges: [
        { source: "S", target: "A", weight: 7, flow: 3 },
        { source: "S", target: "B", weight: 4, flow: 0 },
        { source: "A", target: "B", weight: 5, flow: 0 },
        { source: "A", target: "C", weight: 3, flow: 3 },
        { source: "B", target: "C", weight: 3, flow: 0 },
        { source: "C", target: "T", weight: 8, flow: 3 },
      ],
      mstEdges: ["S-A", "A-C", "C-T"],
      currentNode: "T",
    },
    explanation:
      "First augmenting path found: S → A → C → T. The minimum capacity along this path is 3 units. Flow updated accordingly.",
  },
  {
    graphState: {
      nodes: [
        { id: "S", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "T", visited: true },
        { id: "A", visited: false },
      ],
      edges: [
        { source: "S", target: "A", weight: 7, flow: 3 },
        { source: "S", target: "B", weight: 4, flow: 3 },
        { source: "A", target: "B", weight: 5, flow: 0 },
        { source: "A", target: "C", weight: 3, flow: 3 },
        { source: "B", target: "C", weight: 3, flow: 3 },
        { source: "C", target: "T", weight: 8, flow: 6 },
      ],
      mstEdges: ["S-B", "B-C", "C-T"],
      currentNode: "T",
    },
    explanation:
      "Second augmenting path found: S → B → C → T. The minimum capacity along this path is 3 units. Total flow is now 6 units.",
  },
  {
    graphState: {
      nodes: [
        { id: "S", visited: true },
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "T", visited: true },
      ],
      edges: [
        { source: "S", target: "A", weight: 7, flow: 6 },
        { source: "S", target: "B", weight: 4, flow: 4 },
        { source: "A", target: "B", weight: 5, flow: 1 },
        { source: "A", target: "C", weight: 3, flow: 3 },
        { source: "B", target: "C", weight: 3, flow: 3 },
        { source: "C", target: "T", weight: 8, flow: 8 },
      ],
      mstEdges: ["S-A", "A-B", "B-C", "C-T"],
      currentNode: "T",
    },
    explanation:
      "Third augmenting path found: S → A → B → C → T. The minimum capacity along this path is 1 unit. Total flow is now 7 units.",
  },
  {
    graphState: {
      nodes: [
        { id: "S", visited: true },
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "T", visited: true },
      ],
      edges: [
        { source: "S", target: "A", weight: 7, flow: 7 },
        { source: "S", target: "B", weight: 4, flow: 4 },
        { source: "A", target: "B", weight: 5, flow: 1 },
        { source: "A", target: "C", weight: 3, flow: 3 },
        { source: "B", target: "C", weight: 3, flow: 3 },
        { source: "C", target: "T", weight: 8, flow: 8 },
      ],
      mstEdges: [],
      currentNode: "S",
    },
    explanation:
      "No more augmenting paths found. The maximum flow from S to T is 8 units (3 units through S→A→C→T, 4 units through S→B→C→T, and 1 unit through S→A→B→C→T).",
  },
];

const edmondsKarpConceptText = {
  introduction:
    "The Edmonds-Karp algorithm is an implementation of the Ford-Fulkerson method for computing the maximum flow in a flow network. It specifically uses Breadth-First Search (BFS) to find augmenting paths, which guarantees a polynomial time complexity.",
  keyCharacteristics: [
    "Uses Breadth-First Search (BFS) to find augmenting paths",
    "Guaranteed to terminate in polynomial time O(VE²)",
    "Always finds the shortest augmenting path",
    "Maintains a residual graph during execution",
    "Updates flow in both forward and reverse directions",
    "Terminates when no augmenting path exists",
  ],
  applications: [
    "Network flow optimization",
    "Bipartite matching problems",
    "Image segmentation in computer vision",
    "Airline scheduling",
    "Transportation and logistics",
    "Resource allocation in distributed systems",
  ],
};

const edmondsKarpPseudocode = `function EdmondsKarp(graph, source, sink):
    Initialize flow to 0
    Initialize residual graph from input graph
    
    while true:
        path = BFS(residual_graph, source, sink)
        if path does not exist:
            break
        
        path_flow = min(residual_capacity along path)
        
        for each edge (u, v) in path:
            residual_graph[u][v] -= path_flow
            residual_graph[v][u] += path_flow
        
        flow += path_flow
    
    return flow`;

export default function EdmondsKarpEducationPage() {
  return (
    <EducationPageStructure
      title="Edmonds-Karp Algorithm"
      steps={edmondsKarpSteps}
      conceptText={edmondsKarpConceptText}
      pseudocode={edmondsKarpPseudocode}
      GraphVisualisationComponent={EdmondsKarpGraphVisualisation}
    />
  );
}
