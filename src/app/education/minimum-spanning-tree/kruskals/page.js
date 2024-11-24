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
      "Add edge A-B (weight 4) to the MST. It's the next lowest weight edge that doesn't form a cycle.",
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
        { source: "C", target: "F", weight: 4 },
      ],
    },
    explanation:
      "Add edge C-F (weight 4) to the MST. This edge completes the MST by connecting the remaining subgraphs without forming any cycles. The MST is now complete with 6 edges connecting all 7 vertices.",
  },
];

// Example C specifically shows cycle detection
const kruskalStepsGraphC = [
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
        { source: "A", target: "B", weight: 5 },
        { source: "B", target: "C", weight: 2 },
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
      "Initial state: Looking at the same graph structure as before, but we'll focus on cycle detection this time.",
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
        { source: "B", target: "C", weight: 2 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2, highlight: true },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      mstEdges: [{ source: "B", target: "E", weight: 2 }],
    },
    explanation:
      "First, we add B-E (weight 2). This is our first edge, so no cycle is possible yet.",
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
        { source: "B", target: "C", weight: 2 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2, highlight: true },
      ],
      mstEdges: [
        { source: "B", target: "E", weight: 2 },
        { source: "F", target: "G", weight: 2 },
      ],
    },
    explanation:
      "Then add F-G (weight 2). Still no cycles possible as these edges aren't connected.",
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
        { source: "B", target: "C", weight: 2 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4, highlight: true },
        { source: "F", target: "G", weight: 2 },
      ],
      mstEdges: [
        { source: "B", target: "E", weight: 2 },
        { source: "F", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 4 },
      ],
      cycleEdges: ["B", "E", "G"], // Optional: Could be used to highlight cycle path
    },
    explanation:
      "If we try to add edge E-G (weight 4), it would create a cycle B-E-G! Even though it has a low weight, we must skip it to maintain our tree structure.",
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
        { source: "B", target: "C", weight: 2 },
        { source: "A", target: "C", weight: 3, highlight: true },
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
      "Instead of creating a cycle, we look for the next best edge that doesn't create a cycle. A-C (weight 3) is a good choice.",
  },
  // Continue with the rest of Graph B's steps...
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

// Updated pseudocode that matches the educational steps better
const kruskalPseudocode = `
# Kruskal's Algorithm for Minimum Spanning Tree
function KruskalMST(graph):
    mst = empty set of edges

    # Sort edges by weight (lowest first)
    edges = sort edges in graph by weight

    # Track connected components
    components = DisjointSet(all vertices)

    for each edge (u,v) in edges:
        # Key step: Skip if adding edge would create cycle
        if components.find(u) != components.find(v):
            add edge (u,v) to mst
            components.union(u, v)
        else:
            # Edge would create cycle, skip it
            continue

    return mst

# Example:
# - Pick lowest weight edge if no cycle forms
# - Use disjoint sets to detect cycles
# - Continue until all vertices connected
`;

export default function KruskalsEducationPage() {
  return (
    <EducationPageStructure
      title="Kruskal's Algorithm"
      graphStates={[kruskalStepsGraphA, kruskalStepsGraphB, kruskalStepsGraphC]}
      conceptText={kruskalConceptText}
      pseudocode={kruskalPseudocode}
    />
  );
}
