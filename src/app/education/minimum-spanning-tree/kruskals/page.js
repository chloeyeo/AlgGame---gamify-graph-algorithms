"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const EDGE_STATES = {
  NORMAL: "normal", // gray
  CONSIDERING: "checking", // green
  MST: "mst", // red
  CYCLE: "cycle", // orange/yellow
};

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
  // Initial state
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
        { source: "A", target: "B", weight: 2 }, // Part of potential cycle
        { source: "A", target: "C", weight: 2 }, // Part of potential cycle
        { source: "B", target: "C", weight: 2 }, // The tempting edge that would create cycle
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [],
    },
    explanation:
      "Initial state: Let's build the MST while paying attention to cycle formation.",
  },
  // First edge: A-B (weight 2)
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C" },
        { id: "D" },
        { id: "E" },
        { id: "F" },
        { id: "G" },
      ],
      edges: [
        { source: "A", target: "B", weight: 2, highlight: true },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [{ source: "A", target: "B", weight: 2 }],
    },
    explanation:
      "Add edge A-B (weight 2). This is our first edge, so no cycles are possible yet.",
  },
  // Second edge: A-C (weight 2)
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
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2, highlight: true },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
      ],
    },
    explanation:
      "Add edge A-C (weight 2). Both A-B and A-C have the same low weight.",
  },
  // Tempting mistake: Try to add B-C (would create cycle)
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
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2, highlight: true },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
      ],
      cycleEdges: ["A", "B", "C"], // Highlight the potential cycle
    },
    explanation:
      "❌ Tempting mistake: Adding B-C (weight 2) would create a cycle A-B-C! Even though it has the same low weight as our previous edges, we must skip it to avoid the cycle.",
  },
  // Add B-E instead (weight 3)
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
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3, highlight: true },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
      ],
    },
    explanation:
      "Instead of creating a cycle, we add B-E (weight 3). Even though it has a higher weight than B-C, it's the better choice as it expands our tree without creating cycles.",
  },
  // Add F-G (weight 3)
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
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3, highlight: true },
        { source: "B", target: "D", weight: 3 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
      ],
    },
    explanation: "Add edge F-G (weight 3) to continue expanding our tree.",
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
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3, highlight: true },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3 },
      ],
    },
    explanation: "Add edge B-D (weight 3) to continue expanding our tree.",
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
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3, highlight: true },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 4 },
        { source: "E", target: "G", weight: 3 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "E", weight: 3 },
        { source: "F", target: "G", weight: 3 },
        { source: "B", target: "D", weight: 3 },
        { source: "E", target: "G", weight: 3 },
      ],
    },
    explanation:
      "Complete the MST by adding remaining edges that don't create cycles. Key lesson: Even when an edge has a very low weight (like B-C), we must skip it if it would create a cycle.",
  },
];

const kruskalStepsGraphD = [
  {
    graphState: {
      nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }],
      edges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 4 },
        { source: "C", target: "E", weight: 3 },
        { source: "D", target: "E", weight: 2 },
      ],
      mstEdges: [],
    },
    explanation:
      "Initial state: Graph with 5 vertices and 6 edges. We'll select edges in order of increasing weight that don't create cycles.",
  },
  // Step 1: Choose A-B
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C" },
        { id: "D" },
        { id: "E" },
      ],
      edges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 4 },
        { source: "C", target: "E", weight: 3 },
        { source: "D", target: "E", weight: 2 },
      ],
      mstEdges: [{ source: "A", target: "B", weight: 2 }],
    },
    explanation: "Step 1: Choose edge A-B with weight 2",
  },
  // Step 2: Choose A-C
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E" },
      ],
      edges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 4 },
        { source: "C", target: "E", weight: 3 },
        { source: "D", target: "E", weight: 2 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
      ],
    },
    explanation: "Step 2: Choose edge A-C with weight 2",
  },
  // Step 3: Cannot choose B-C (would create cycle)
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D" },
        { id: "E" },
      ],
      edges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2, highlight: true },
        { source: "B", target: "D", weight: 4 },
        { source: "C", target: "E", weight: 3 },
        { source: "D", target: "E", weight: 2 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
      ],
      cycleEdges: ["A", "B", "C"],
    },
    explanation:
      "Step 3: Cannot choose B-C (weight 2) as it would create a cycle A-B-C",
  },
  // Step 4: Choose D-E
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
      ],
      edges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 4 },
        { source: "C", target: "E", weight: 3 },
        { source: "D", target: "E", weight: 2 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "D", target: "E", weight: 2 },
      ],
    },
    explanation: "Step 4: Choose edge D-E with weight 2",
  },
  // Step 5: Choose C-E
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
      ],
      edges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 4 },
        { source: "C", target: "E", weight: 3 },
        { source: "D", target: "E", weight: 2 },
      ],
      mstEdges: [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "C", weight: 2 },
        { source: "D", target: "E", weight: 2 },
        { source: "C", target: "E", weight: 3 },
      ],
    },
    explanation:
      "Step 5: Complete the MST by adding edge C-E with weight 3. Total MST weight = 9",
  },
];

const kruskalConceptText = {
  introduction: `Kruskal's algorithm finds the minimum spanning tree (MST) of a weighted graph. It works by repeatedly selecting the lowest weight edge that doesn't create a cycle.

The visualization uses the following color coding:
• Blue: Nodes connected in the current MST
• Green: Edge being considered
• Red: Edge that would create a cycle
• Black: Regular edges
• Numbers on edges: Edge weights`,
  keyCharacteristics: [
    "Processes edges in order of increasing weight",
    "Uses disjoint sets to detect cycles",
    "Builds MST by adding edges that don't create cycles",
    "Guarantees minimum total weight",
    "Works well for sparse graphs",
  ],
  applications: [
    "Network design and cable routing",
    "Cluster analysis in data mining",
    "Circuit design in electronics",
    "Water supply network design",
    "Transportation network planning",
  ],
};

const kruskalPseudocode = `function KruskalMST(Graph):
    MST = empty set of edges
    DisjointSet = new DisjointSet(Graph.vertices)
    sort Graph.edges by weight ascending
    
    for each edge (u,v) in sorted edges:
        if DisjointSet.find(u) ≠ DisjointSet.find(v):
            add edge (u,v) to MST
            DisjointSet.union(u, v)
    
    return MST`;

class DisjointSet {
  constructor(vertices) {
    this.parent = new Map();
    this.rank = new Map();
    vertices.forEach((v) => {
      this.parent.set(v, v);
      this.rank.set(v, 0);
    });
  }

  find(vertex) {
    if (this.parent.get(vertex) !== vertex) {
      this.parent.set(vertex, this.find(this.parent.get(vertex)));
    }
    return this.parent.get(vertex);
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank.get(rootX) < this.rank.get(rootY)) {
        this.parent.set(rootX, rootY);
      } else if (this.rank.get(rootX) > this.rank.get(rootY)) {
        this.parent.set(rootY, rootX);
      } else {
        this.parent.set(rootY, rootX);
        this.rank.set(rootX, this.rank.get(rootX) + 1);
      }
      return true;
    }
    return false;
  }
}

const generateKruskalSteps = (initialNodes, edges) => {
  const steps = [];
  const mstEdges = [];
  const ds = new DisjointSet(initialNodes.map((node) => node.id));

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  // Initial state
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
      })),
      edges: edges.map((edge) => ({
        ...edge,
        state: EDGE_STATES.NORMAL,
      })),
      mstEdges: [],
    },
    explanation:
      "Starting Kruskal's algorithm. Edges will be processed in order of increasing weight.",
    pseudoCodeLines: [1, 2, 3, 4],
  });

  // Process each edge
  for (const edge of sortedEdges) {
    // Step: Consider current edge
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: mstEdges.some(
            (e) => e.source === node.id || e.target === node.id
          ),
        })),
        edges: edges.map((e) => ({
          ...e,
          state: mstEdges.some(
            (mstEdge) =>
              (mstEdge.source === e.source && mstEdge.target === e.target) ||
              (mstEdge.source === e.target && mstEdge.target === e.source)
          )
            ? EDGE_STATES.MST
            : e.source === edge.source && e.target === edge.target
            ? EDGE_STATES.CONSIDERING
            : EDGE_STATES.NORMAL,
        })),
        mstEdges,
        currentEdge: edge,
      },
      explanation: `Considering edge ${edge.source}-${edge.target} with weight ${edge.weight}`,
      pseudoCodeLines: [5, 6],
    });

    const sourceRoot = ds.find(edge.source);
    const targetRoot = ds.find(edge.target);

    if (sourceRoot === targetRoot) {
      // Would create cycle
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: mstEdges.some(
              (e) => e.source === node.id || e.target === node.id
            ),
          })),
          edges: edges.map((e) => ({
            ...e,
            state: mstEdges.some(
              (mstEdge) =>
                (mstEdge.source === e.source && mstEdge.target === e.target) ||
                (mstEdge.source === e.target && mstEdge.target === e.source)
            )
              ? EDGE_STATES.MST
              : e.source === edge.source && e.target === edge.target
              ? EDGE_STATES.CYCLE
              : EDGE_STATES.NORMAL,
          })),
          mstEdges,
          cycleEdges: [edge.source, edge.target], // Add this to show the cycle
        },
        explanation: `Cannot add edge ${edge.source}-${edge.target} as it would create a cycle`,
        pseudoCodeLines: [7],
      });
    } else {
      // Add edge to MST
      mstEdges.push(edge);
      ds.union(edge.source, edge.target);

      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: mstEdges.some(
              (e) => e.source === node.id || e.target === node.id
            ),
          })),
          edges: edges.map((e) => ({
            ...e,
            state: mstEdges.some(
              (mstEdge) =>
                (mstEdge.source === e.source && mstEdge.target === e.target) ||
                (mstEdge.source === e.target && mstEdge.target === e.source)
            )
              ? EDGE_STATES.MST
              : EDGE_STATES.NORMAL,
          })),
          mstEdges: [...mstEdges],
        },
        explanation: `Added edge ${edge.source}-${edge.target} to MST. Total edges: ${mstEdges.length}`,
        pseudoCodeLines: [8, 9],
      });
    }
  }

  return steps;
};

export default function KruskalEducationPage() {
  return (
    <EducationPageStructure
      title="Kruskal's Algorithm"
      conceptText={kruskalConceptText}
      pseudocode={kruskalPseudocode}
      generateSteps={generateKruskalSteps}
    />
  );
}
