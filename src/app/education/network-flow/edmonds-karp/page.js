"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";

const EdmondsKarpEducationPage = () => {
  const conceptText = {
    introduction: `This example uses the same graph as Ford-Fulkerson to demonstrate how Edmonds-Karp always chooses the shortest augmenting path using BFS. Notice how the path choices and order differ from Ford-Fulkerson, even though both reach the same maximum flow.`,
    keyCharacteristics: [
      "Always uses BFS to find shortest augmenting path",
      "Path length measured by number of edges",
      "More predictable than Ford-Fulkerson",
      "Prevents pathological cases",
      "O(VE²) runtime guarantee",
    ],
    applications: [
      "Network routing optimization",
      "Bandwidth allocation",
      "Supply chain management",
      "Traffic flow systems",
    ],
  };

  const pseudocode = `EDMONDS-KARP Algorithm:
1. Initialize all flows to zero
2. While BFS finds a path from source to sink:
   a. Find shortest augmenting path using BFS
   b. Calculate bottleneck capacity
   c. Update flows along the path
3. Return total flow when no path exists`;

  const steps = [
    // Initial State
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
• All edges show flow/capacity (initially 0/capacity)
• BFS will find shortest augmenting path from S to T
• Path length measured by number of edges
• Looking for first shortest path
• Current flow: 0 units`,
    },
    // First BFS Path (S→A→D→T) - Length 3
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
          { source: "S", target: "A", capacity: 10, flow: 8 },
          { source: "S", target: "C", capacity: 10, flow: 0 },
          { source: "A", target: "B", capacity: 4, flow: 0 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 8 },
          { source: "B", target: "T", capacity: 10, flow: 0 },
          { source: "C", target: "D", capacity: 9, flow: 0 },
          { source: "D", target: "B", capacity: 6, flow: 0 },
          { source: "D", target: "T", capacity: 10, flow: 8 },
        ],
        currentPath: ["S", "A", "D", "T"],
        maxFlow: 8,
      },
      explanation: `BFS finds shortest path S→A→D→T (3 edges):
• Path length: 3 edges (shortest path found)
• There are 3 paths that all have shortest path of 3 edges - any one of these can be chosen
• Bottleneck capacity = min(10, 8, 10) = 8
• Updated flows: S→A: 8/10, A→D: 8/8, D→T: 8/10
• Current maximum flow: 8 units (0+8=8)`,
    },
    // Second BFS Path (S→C→D→T) - Length 3
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
          { source: "S", target: "A", capacity: 10, flow: 8 },
          { source: "S", target: "C", capacity: 10, flow: 2 },
          { source: "A", target: "B", capacity: 4, flow: 0 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 8 },
          { source: "B", target: "T", capacity: 10, flow: 0 },
          { source: "C", target: "D", capacity: 9, flow: 2 },
          { source: "D", target: "B", capacity: 6, flow: 0 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ],
        currentPath: ["S", "C", "D", "T"],
        maxFlow: 10,
      },
      explanation: `BFS finds shortest path S→C→D→T (3 edges):
• Path length: 3 edges
• Bottleneck capacity = min(10-0, 9-0, 10-8) = min(10,9,2) = 2
• Updated flows: S→C: 2/10, C→D: 2/9, D→T: 10/10
• Current maximum flow: 10 units (8+2=10)
• Note: D→T is now saturated (no available capacity)`,
    },
    // Third BFS Path (S→A→B→T) - Length 3
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
          { source: "S", target: "C", capacity: 10, flow: 2 },
          { source: "A", target: "B", capacity: 4, flow: 2 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 8 },
          { source: "B", target: "T", capacity: 10, flow: 2 },
          { source: "C", target: "D", capacity: 9, flow: 2 },
          { source: "D", target: "B", capacity: 6, flow: 0 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ],
        currentPath: ["S", "A", "B", "T"],
        maxFlow: 12,
      },
      explanation: `BFS finds shortest path S→A→B→T (3 edges):
• Path length: 3 edges
• Bottleneck capacity = min(10-8, 4-0, 10-0) = min(2,4,10) = 2
• Updated flows: S→A: 10/10, A→B: 2/4, B→T: 2/10
• Current maximum flow: 12 units (10+2=12)
• Note the difference from Ford-Fulkerson: BFS found this direct path instead of using longer paths`,
    },
    // Fourth BFS Path (S→C→D→B→T) - Length 4
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
          { source: "S", target: "C", capacity: 10, flow: 8 },
          { source: "A", target: "B", capacity: 4, flow: 2 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 8 },
          { source: "B", target: "T", capacity: 10, flow: 8 },
          { source: "C", target: "D", capacity: 9, flow: 8 },
          { source: "D", target: "B", capacity: 6, flow: 6 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ],
        currentPath: ["S", "C", "D", "B", "T"],
        maxFlow: 19,
      },
      explanation: `BFS finds path S→C→D→B→T (4 edges):
• Now must use longer path as shorter paths (with 3 edges) are saturated (no capacity)
• Bottleneck capacity = min(10-2, 9-2, 6-0, 10-2) = min(8,7,6,8) = 6
• Updated flows: S→C: 8/10, C→D: 8/9, D→B: 6/6, B→T: 8/10
• Current maximum flow: 18 units (12+6=18)`,
    },
    // Fifth BFS Path (S→C→D→A-B→T) - Length 5
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
          { source: "A", target: "B", capacity: 4, flow: 3 },
          { source: "A", target: "C", capacity: 2, flow: 0 },
          { source: "A", target: "D", capacity: 8, flow: 7 },
          { source: "B", target: "T", capacity: 10, flow: 9 },
          { source: "C", target: "D", capacity: 9, flow: 9 },
          { source: "D", target: "B", capacity: 6, flow: 6 },
          { source: "D", target: "T", capacity: 10, flow: 10 },
        ],
        currentPath: ["S", "C", "D", "A", "B", "T"],
        maxFlow: 19,
      },
      explanation: `BFS finds path S→C→D→A-B→T (5 edges):
• Now must use longer path as shorter ones are saturated
• Bottleneck capacity = min(10-8, 9-8, 4-2, 10-8) = min(2,1,2,2) = 1
• D→A is a backward edge and as it is non-empty (flow(8)/capacity(8)) so we can use it and update the flow to 7/8
• Updated flows: S→C: 9/10, C→D: 9/9, D→A: 7/8, A→B: 3/4, B→T: 9/10
• Current maximum flow: 19 units (18+1=19)`,
    },
    // Final State
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
        ],
        currentPath: [],
        maxFlow: 19,
      },
      explanation: `Final state - no more augmenting paths exist:
• BFS cannot find any path from S to T becuase: S→A (forward edge) is full, and we can take S→C as it has capacity of 0 however C→D (forward edge) is full and C→A (backward edge) is empty so we cannot take any of S→A, C→D or C→A.
• Same maximum flow (19) as Ford-Fulkerson
• Key differences from Ford-Fulkerson:
  - Always used shortest available paths
  - Required fewer iterations (4 vs 5)
  - More predictable path choices
• Final maximum flow: 19 units
• You can calculate the maximum flow by summing the flow values going into the sink node T. B→T has flow(9)/capacity(10), and D→T has flow(10)/capacity(10), so 9+10 gives maximum flow of 19`,
    },
  ];

  return (
    <EducationPageStructure
      title="Edmonds-Karp Algorithm"
      steps={steps}
      conceptText={conceptText}
      pseudocode={pseudocode}
    />
  );
};

export default EdmondsKarpEducationPage;
