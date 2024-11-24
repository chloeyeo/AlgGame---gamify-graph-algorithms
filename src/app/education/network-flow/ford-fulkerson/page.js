"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";

const FordFulkersonEducationPage = () => {
  const conceptText = {
    introduction: `Ford-Fulkerson is a method for computing the maximum flow in a flow network. A flow network is simply a graph whose edges have a capacity for flow. Maximum flow is the maximum amount of anything that you can move from a starting node (source) to an ending node (sink).`,
    keyCharacteristics: [
      "Flow Equilibrium: At each node (except source and sink), inflow must equal outflow",
      "Augmenting Paths: Can use either non-full forward edges or non-empty backward edges",
      "Bottleneck Capacity: Determined by the edge with smallest remaining capacity in path",
      "Residual Graph: Shows remaining capacity and possible flow reversals",
    ],
    applications: [
      "Network routing and bandwidth allocation",
      "Supply chain optimization",
      "Pipeline systems",
      "Traffic flow management",
    ],
  };

  const pseudocode = `FORD-FULKERSON Algorithm Steps:
1. Start by setting all flows to zero
2. While there exists an augmenting path from source to sink:
   a. Find an augmenting path
   b. Compute the bottleneck capacity
   c. Update flows along the path
3. Repeat until no augmenting path exists`;

  // Helper function to determine if an edge is part of current path
  const isEdgeInPath = (edge, path) => {
    if (!path || path.length < 2) return false;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (edge.source === path[i] && edge.target === path[i + 1]) ||
        (edge.source === path[i + 1] && edge.target === path[i]) // Check for reverse edges
      ) {
        return true;
      }
    }
    return false;
  };

  const steps = [
    // Step 1: Initial State
    {
      graphState: {
        nodes: [
          { id: "S" },
          { id: "A" },
          { id: "B" },
          { id: "C" },
          { id: "D" },
          { id: "T" },
        ],
        edges: [
          { source: "S", target: "A", capacity: 10, flow: 0 },
          { source: "S", target: "C", capacity: 10, flow: 0 },
          { source: "A", target: "B", capacity: 4, flow: 0 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 0 },
          { source: "B", target: "T", capacity: 10, flow: 0 },
          { source: "C", target: "D", capacity: 9, flow: 0 },
          { source: "D", target: "B", capacity: 6, flow: 0 },
          { source: "D", target: "T", capacity: 10, flow: 0 },
        ].map((edge) => ({
          ...edge,
          highlight: false,
        })),
        currentPath: [],
        maxFlow: 0,
      },
      explanation: `Initial state of the network:
• All edges show current flow/capacity (0/capacity for all edges)
• Flow equilibrium must be maintained at each node
• Look for first augmenting path from S to T`,
    },
    // Step 2: First Path (S→A→D→T)
    {
      graphState: {
        nodes: [
          { id: "S" },
          { id: "A" },
          { id: "B" },
          { id: "C" },
          { id: "D" },
          { id: "T" },
        ].map((node) => ({
          ...node,
          highlight: ["S", "A", "D", "T"].includes(node.id),
        })),
        edges: [
          { source: "S", target: "A", capacity: 10, flow: 8 },
          { source: "S", target: "C", capacity: 10, flow: 0 },
          { source: "A", target: "B", capacity: 4, flow: 0 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 8 },
          { source: "B", target: "T", capacity: 10, flow: 0 },
          { source: "C", target: "D", capacity: 9, flow: 0 },
          { source: "D", target: "B", capacity: 6, flow: 0 },
          { source: "D", target: "T", capacity: 10, flow: 8 },
        ].map((edge) => ({
          ...edge,
          highlight: isEdgeInPath(edge, ["S", "A", "D", "T"]),
        })),
        currentPath: ["S", "A", "D", "T"],
        maxFlow: 8,
      },
      explanation: `Found path S→A→D→T:
• Bottleneck capacity = min(10, 8, 10) = 8
• Updated flows: S→A: 8/10, A→D: 8/8, D→T: 8/10
• Current maximum flow: 8 units`,
    },
    // Step 3: Second Path (S→C→D→T)
    {
      graphState: {
        nodes: [
          { id: "S" },
          { id: "A" },
          { id: "B" },
          { id: "C" },
          { id: "D" },
          { id: "T" },
        ].map((node) => ({
          ...node,
          highlight: ["S", "C", "D", "T"].includes(node.id),
        })),
        edges: [
          { source: "S", target: "A", capacity: 10, flow: 8 },
          { source: "S", target: "C", capacity: 10, flow: 2 },
          { source: "A", target: "B", capacity: 4, flow: 0 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 8 },
          { source: "B", target: "T", capacity: 10, flow: 0 },
          { source: "C", target: "D", capacity: 9, flow: 2 },
          { source: "D", target: "B", capacity: 6, flow: 0 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ].map((edge) => ({
          ...edge,
          highlight: isEdgeInPath(edge, ["S", "C", "D", "T"]),
        })),
        currentPath: ["S", "C", "D", "T"],
        maxFlow: 10,
      },
      explanation: `Found path S→C→D→T:
• Bottleneck capacity = 2 (due to remaining capacities)
• Updated flows: S→C: 2/10, C→D: 2/9, D→T: 10/10
• Note: D→T is now saturated at 10/10
• Current maximum flow: 10 units`,
    },
    // Step 4: Third Path (S→C→D→A→B→T)
    {
      graphState: {
        nodes: [
          { id: "S" },
          { id: "A" },
          { id: "B" },
          { id: "C" },
          { id: "D" },
          { id: "T" },
        ].map((node) => ({
          ...node,
          highlight: ["S", "C", "D", "A", "B", "T"].includes(node.id),
        })),
        edges: [
          { source: "S", target: "A", capacity: 10, flow: 8 },
          { source: "S", target: "C", capacity: 10, flow: 6 },
          { source: "A", target: "B", capacity: 4, flow: 4 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 4 },
          { source: "B", target: "T", capacity: 10, flow: 4 },
          { source: "C", target: "D", capacity: 9, flow: 6 },
          { source: "D", target: "B", capacity: 6, flow: 0 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ].map((edge) => ({
          ...edge,
          highlight: isEdgeInPath(edge, ["S", "C", "D", "A", "B", "T"]),
        })),
        currentPath: ["S", "C", "D", "A", "B", "T"],
        maxFlow: 14,
      },
      explanation: `Found path using backward edge (D→A):
• Path includes backward flow from D to A
• Bottleneck capacity = 2 from remaining capacities
• Updated flows match diagram values
• Current maximum flow: 14 units
• Flow equilibrium maintained at all nodes`,
    },
    // Step 5: Fourth Path (S→A→D→B→T)
    {
      graphState: {
        nodes: [
          { id: "S" },
          { id: "A" },
          { id: "B" },
          { id: "C" },
          { id: "D" },
          { id: "T" },
        ].map((node) => ({
          ...node,
          highlight: ["S", "A", "D", "B", "T"].includes(node.id),
        })),
        edges: [
          { source: "S", target: "A", capacity: 10, flow: 10 },
          { source: "S", target: "C", capacity: 10, flow: 6 },
          { source: "A", target: "B", capacity: 4, flow: 4 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 6 },
          { source: "B", target: "T", capacity: 10, flow: 6 },
          { source: "C", target: "D", capacity: 9, flow: 6 },
          { source: "D", target: "B", capacity: 6, flow: 2 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ].map((edge) => ({
          ...edge,
          highlight: isEdgeInPath(edge, ["S", "A", "D", "B", "T"]),
        })),
        currentPath: ["S", "A", "D", "B", "T"],
        maxFlow: 16,
      },
      explanation: `Found path S→A→D→B→T:
• Bottleneck capacity = min(10-8, 8-6, 6-0, 10-4) = 2
• Updated flows: S→A: 10/10, A→D: 6/8, D→B: 2/6, B→T: 6/10
• Current maximum flow: 16 units`,
    },
    // Step 6: Fifth Path (S→C→D→B→T)
    {
      graphState: {
        nodes: [
          { id: "S" },
          { id: "A" },
          { id: "B" },
          { id: "C" },
          { id: "D" },
          { id: "T" },
        ].map((node) => ({
          ...node,
          highlight: ["S", "C", "D", "B", "T"].includes(node.id),
        })),
        edges: [
          { source: "S", target: "A", capacity: 10, flow: 10 },
          { source: "S", target: "C", capacity: 10, flow: 9 },
          { source: "A", target: "B", capacity: 4, flow: 4 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 6 },
          { source: "B", target: "T", capacity: 10, flow: 9 },
          { source: "C", target: "D", capacity: 9, flow: 9 },
          { source: "D", target: "B", capacity: 6, flow: 5 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ].map((edge) => ({
          ...edge,
          highlight: isEdgeInPath(edge, ["S", "C", "D", "B", "T"]),
        })),
        currentPath: ["S", "C", "D", "B", "T"],
        maxFlow: 19,
      },
      explanation: `Found path S→C→D→B→T:
• Bottleneck capacity = min(10-9, 9-9, 6-5, 10-9) = 1
• Updated flows: S→C: 9/10, C→D: 9/9, D→B: 5/6, B→T: 9/10
• Current maximum flow: 19 units`,
    },
    // Step 7: Final State
    {
      graphState: {
        nodes: [
          { id: "S" },
          { id: "A" },
          { id: "B" },
          { id: "C" },
          { id: "D" },
          { id: "T" },
        ],
        edges: [
          { source: "S", target: "A", capacity: 10, flow: 10 },
          { source: "S", target: "C", capacity: 10, flow: 9 },
          { source: "A", target: "B", capacity: 4, flow: 4 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 6 },
          { source: "B", target: "T", capacity: 10, flow: 9 },
          { source: "C", target: "D", capacity: 9, flow: 9 },
          { source: "D", target: "B", capacity: 6, flow: 5 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ].map((edge) => ({
          ...edge,
          highlight: false,
        })),
        currentPath: [],
        maxFlow: 19,
      },
      explanation: `Final state - no more augmenting paths possible:
• S→C has 1 unit remaining capacity but C→D is full
• Backward edge C→A is empty
• No valid path from S to T exists
• Final maximum flow: 19 units

Note: Different path choices are valid as long as they result in the same maximum flow of 19 units.`,
    },
  ];

  return (
    <EducationPageStructure
      title="Ford-Fulkerson Algorithm"
      graphStates={[steps]}
      conceptText={conceptText}
      pseudocode={pseudocode}
    />
  );
};

export default FordFulkersonEducationPage;
