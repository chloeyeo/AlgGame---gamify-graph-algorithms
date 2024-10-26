"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const kruskalStepsGraphA = [
  {
    graphState: {
      nodes: [
        { id: "A" },
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
      "Initial state: All edges are sorted by weight. No edges are in the MST yet.",
  },
  {
    graphState: {
      nodes: [
        { id: "A" },
        { id: "B" },
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
      mstEdges: [{ source: "C", target: "F", weight: 2 }],
    },
    explanation:
      "Add edge C-F (weight 2) to the MST. It's the lowest weight edge and doesn't form a cycle.",
  },
  {
    graphState: {
      nodes: [
        { id: "A" },
        { id: "B" },
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
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
      ],
    },
    explanation:
      "Add edge D-E (weight 6) to the MST. It's the next lowest weight edge and doesn't form a cycle.",
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
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "A", target: "B", weight: 7 },
      ],
    },
    explanation:
      "Add edge A-B (weight 7) to the MST. It's the next lowest weight edge and doesn't form a cycle.",
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
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
      ],
    },
    explanation:
      "Add edge A-C (weight 9) to the MST. It's the next lowest weight edge that doesn't form a cycle.",
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
        { source: "C", target: "F", weight: 2 },
        { source: "D", target: "E", weight: 6 },
        { source: "A", target: "B", weight: 7 },
        { source: "A", target: "C", weight: 9 },
        { source: "E", target: "F", weight: 9 },
      ],
    },
    explanation:
      "Add edge E-F (weight 9) to the MST. This edge connects the remaining vertices without forming a cycle. The MST is now complete with 5 edges connecting all 6 vertices.",
  },
];

const kruskalStepsGraphB = [
  {
    graphState: {
      nodes: [
        { id: "A" },
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
      "Initial state: All edges are sorted by weight. No edges are in the MST yet.",
  },
  {
    graphState: {
      nodes: [
        { id: "A" },
        { id: "B", visited: true },
        { id: "C" },
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
      mstEdges: [{ source: "B", target: "E", weight: 2 }],
    },
    explanation:
      "Add edge B-E (weight 2) to the MST. It's the lowest weight edge and doesn't form a cycle.",
  },
  {
    graphState: {
      nodes: [
        { id: "A" },
        { id: "B", visited: true },
        { id: "C" },
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
        { source: "B", target: "E", weight: 2 },
        { source: "F", target: "G", weight: 2 },
      ],
    },
    explanation:
      "Add edge F-G (weight 2) to the MST. It's the next lowest weight edge and doesn't form a cycle.",
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
        { source: "B", target: "E", weight: 2 },
        { source: "F", target: "G", weight: 2 },
        { source: "A", target: "C", weight: 3 },
      ],
    },
    explanation:
      "Add edge A-C (weight 3) to the MST. It's the next lowest weight edge and doesn't form a cycle.",
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
        { source: "B", target: "E", weight: 2 },
        { source: "F", target: "G", weight: 2 },
        { source: "A", target: "C", weight: 3 },
        { source: "D", target: "G", weight: 3 },
      ],
    },
    explanation:
      "Add edge D-G (weight 3) to the MST. It's the next lowest weight edge and doesn't form a cycle.",
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
        { source: "B", target: "E", weight: 2 },
        { source: "F", target: "G", weight: 2 },
        { source: "A", target: "C", weight: 3 },
        { source: "D", target: "G", weight: 3 },
        { source: "A", target: "B", weight: 4 },
      ],
    },
    explanation:
      "Add edge A-B (weight 4) to the MST. It's the next lowest weight edge that doesn't form a cycle. The MST is now complete with 6 edges connecting all 7 vertices.",
  },
];

const kruskalConceptText = {
  introduction:
    "Kruskal's algorithm is a greedy algorithm used to find the Minimum Spanning Tree (MST) of a weighted, undirected graph. It works by sorting all edges by weight and then adding them to the MST one by one, as long as they don't create a cycle.",
  keyCharacteristics: [
    "Greedy approach: Always selects the edge with the lowest weight",
    "Uses a disjoint-set data structure to detect cycles",
    "Produces a minimum spanning tree that connects all vertices",
    "Time complexity: O(E log E) or O(E log V), where E is the number of edges and V is the number of vertices",
  ],
  applications: [
    "Network design (e.g., laying cable for computer networks)",
    "Approximation algorithms for NP-hard problems",
    "Cluster analysis in data mining",
    "Image segmentation in computer vision",
  ],
};

const kruskalPseudocode = `function Kruskal(G):
    A = ∅
    foreach v ∈ G.V:
        MakeSet(v)
    foreach (u, v) in G.E ordered by weight(u, v), increasing:
        if FindSet(u) ≠ FindSet(v):
            A = A ∪ {(u, v)}
            Union(u, v)
    return A`;

export default function KruskalsEducationPage() {
  return (
    <EducationPageStructure
      title="Kruskal's Algorithm"
      steps={kruskalStepsGraphA}
      comparisonSteps={kruskalStepsGraphB}
      conceptText={kruskalConceptText}
      pseudocode={kruskalPseudocode}
    />
  );
}
