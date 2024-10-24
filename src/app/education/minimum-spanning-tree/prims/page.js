"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";

const primStepsGraphA = [
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B" },
        { id: "C" },
        { id: "D" },
        { id: "E" },
        { id: "F" },
      ],
      edges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "A", target: "F", weight: 14 },
        { source: "B", target: "C", weight: 10 },
        { source: "B", target: "D", weight: 15 },
        { source: "C", target: "D", weight: 11 },
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "E", target: "F", weight: 9 },
      ],
      mstEdges: [],
    },
    explanation:
      "Initial state: We start with node A. No edges are in the Minimum Spanning Tree (MST) yet. All edges connected to A are considered: A-B (7), A-C (9), A-F (14).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C" },
        { id: "D" },
        { id: "E" },
        { id: "F" },
      ],
      edges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "A", target: "F", weight: 14 },
        { source: "B", target: "C", weight: 10 },
        { source: "B", target: "D", weight: 15 },
        { source: "C", target: "D", weight: 11 },
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "E", target: "F", weight: 9 },
      ],
      mstEdges: [{ source: "A", target: "B", weight: 7 }],
    },
    explanation:
      "Add edge A-B (weight 7) to the MST. It's the lowest weight edge connected to A. Now we consider edges connected to B as well: B-C (10), B-D (15).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E" },
        { id: "F" },
      ],
      edges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "A", target: "F", weight: 14 },
        { source: "B", target: "C", weight: 10 },
        { source: "B", target: "D", weight: 15 },
        { source: "C", target: "D", weight: 11 },
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "E", target: "F", weight: 9 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
      ],
    },
    explanation:
      "Add edge A-C (weight 9) to the MST. It's the next lowest weight edge connected to A or B that doesn't create a cycle. Now we consider edges connected to C: C-D (11), C-F (2).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E" },
        { id: "F", visited: true },
      ],
      edges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "A", target: "F", weight: 14 },
        { source: "B", target: "C", weight: 10 },
        { source: "B", target: "D", weight: 15 },
        { source: "C", target: "D", weight: 11 },
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "E", target: "F", weight: 9 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "C", target: "F", weight: 2 },
      ],
    },
    explanation:
      "Add edge C-F (weight 2) to the MST. It's the lowest weight edge connected to A, B, or C that doesn't create a cycle. Now we consider edges connected to F: E-F (9).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E", visited: true },
        { id: "F", visited: true },
      ],
      edges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "A", target: "F", weight: 14 },
        { source: "B", target: "C", weight: 10 },
        { source: "B", target: "D", weight: 15 },
        { source: "C", target: "D", weight: 11 },
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "E", target: "F", weight: 9 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "C", target: "F", weight: 2 },
        { source: "E", target: "F", weight: 9 },
      ],
    },
    explanation:
      "Add edge E-F (weight 9) to the MST. It's the lowest weight edge that connects a new node to our existing MST without creating a cycle. Now we need to connect D to our MST.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
        { id: "F", visited: true },
      ],
      edges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "A", target: "F", weight: 14 },
        { source: "B", target: "C", weight: 10 },
        { source: "B", target: "D", weight: 15 },
        { source: "C", target: "D", weight: 11 },
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "E", target: "F", weight: 9 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "C", target: "F", weight: 2 },
        { source: "E", target: "F", weight: 9 },
        { source: "D", target: "E", weight: 6 },
      ],
    },
    explanation:
      "Add edge D-E (weight 6) to the MST. This is the final edge needed to connect all nodes in the graph. Our Minimum Spanning Tree is now complete with a total weight of 33.",
  },
];

const primStepsGraphB = [
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B" },
        { id: "C" },
        { id: "D" },
        { id: "E" },
        { id: "F" },
        { id: "G" },
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
      mstEdges: [],
    },
    explanation:
      "Initial state: We start with node A. No edges are in the Minimum Spanning Tree (MST) yet.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B" },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E" },
        { id: "F" },
        { id: "G" },
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
      mstEdges: [{ source: "A", target: "C", weight: 3 }],
    },
    explanation:
      "Add edge A-C (weight 3) to the MST. It's the lowest weight edge connected to A.",
  },

  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E" },
        { id: "F" },
        { id: "G" },
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
      mstEdges: [
        { source: "A", target: "C", weight: 3 },
        { source: "A", target: "B", weight: 4 },
      ],
    },
    explanation:
      "Add edge A-B (weight 4) to the MST. It's the lowest weight edge connecting a new node to the MST.",
  },

  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E", visited: true },
        { id: "F" },
        { id: "G" },
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
      mstEdges: [
        { source: "A", target: "C", weight: 3 },
        { source: "A", target: "B", weight: 4 },
        { source: "B", target: "E", weight: 2 },
      ],
    },
    explanation:
      "Add edge B-E (weight 2) to the MST. It's the lowest weight edge connecting a new node to the MST.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E", visited: true },
        { id: "F", visited: true },
        { id: "G" },
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
      mstEdges: [
        { source: "A", target: "C", weight: 3 },
        { source: "A", target: "B", weight: 4 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
      ],
    },
    explanation:
      "Add edge C-F (weight 4) to the MST. It's the lowest weight edge connecting a new node to the MST.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E", visited: true },
        { id: "F", visited: true },
        { id: "G", visited: true },
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
      mstEdges: [
        { source: "A", target: "C", weight: 3 },
        { source: "A", target: "B", weight: 4 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
    },
    explanation:
      "Add edge F-G (weight 2) to the MST. It's the lowest weight edge connecting a new node to the MST.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
        { id: "F", visited: true },
        { id: "G", visited: true },
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
      mstEdges: [
        { source: "A", target: "C", weight: 3 },
        { source: "A", target: "B", weight: 4 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "F", target: "G", weight: 2 },
        { source: "D", target: "G", weight: 3 },
      ],
    },
    explanation:
      "Add edge D-G (weight 3) to the MST. This completes the Minimum Spanning Tree, connecting all nodes with the minimum total weight of 18.",
  },
];

const primConceptText = {
  introduction:
    "Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. It builds the MST by iteratively adding the smallest edge that connects a vertex in the partially constructed MST to a vertex outside it.",
  keyCharacteristics: [
    "Greedy approach: Always selects the edge with the smallest weight that connects a vertex in the MST to a vertex outside of it.",
    "Works with both directed and undirected graphs, but typically applied to undirected graphs.",
    "The algorithm runs in O(E log V) time using a priority queue, where E is the number of edges and V is the number of vertices.",
    "Guarantees a minimum spanning tree if the graph is connected.",
  ],
  applications: [
    "Network design: To minimize the cost of connecting different points in a network (e.g., telecommunications, transportation).",
    "Cluster analysis: To create clusters by connecting points with the smallest distances.",
    "Image segmentation: In computer vision, to separate different regions of an image.",
    "Approximation algorithms: Used as a subroutine in algorithms for NP-hard problems like the traveling salesman problem.",
  ],
};

const primPseudocode = `function prim(graph):
    let mst = empty set
    let visited = {arbitrary start node}
    let edges = all edges connected to start node

    while visited does not include all nodes:
        let (u, v) = cheapest edge from edges where u is in visited and v is not
        add v to visited
        add (u, v) to mst
        add to edges all edges connected to v that aren't in visited

    return mst`;

export default function PrimsAlgorithmEducationPage() {
  return (
    <EducationPageStructure
      title="Prim's Algorithm"
      steps={primStepsGraphA}
      comparisonSteps={primStepsGraphB}
      conceptText={primConceptText}
      pseudocode={primPseudocode}
    />
  );
}
