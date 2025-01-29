"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";

// Helper functions
const isEdgeInPath = (edge, path) => {
  if (!path || path.length < 2) return false;
  for (let i = 0; i < path.length - 1; i++) {
    if (
      (edge.source === path[i] && edge.target === path[i + 1]) ||
      (edge.source === path[i + 1] && edge.target === path[i])
    ) {
      return true;
    }
  }
  return false;
};

const findPath = (source, sink, edges, flows) => {
  const visited = new Set();
  const path = [];

  const dfs = (node) => {
    if (node === sink) return true;
    visited.add(node);

    for (const edge of edges) {
      const neighbor =
        edge.source === node
          ? edge.target
          : edge.target === node
          ? edge.source
          : null;

      if (!neighbor || visited.has(neighbor)) continue;

      const residualCapacity =
        edge.source === node
          ? edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0)
          : flows.get(`${edge.target}-${edge.source}`) || 0;

      if (residualCapacity > 0) {
        path.push(neighbor);
        if (dfs(neighbor)) return true;
        path.pop();
      }
    }
    return false;
  };

  path.push(source);
  if (dfs(source)) return path;
  return null;
};

const calculateBottleneck = (path, edges, flows) => {
  let bottleneck = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const edge = edges.find(
      (e) =>
        (e.source === current && e.target === next) ||
        (e.source === next && e.target === current)
    );

    if (edge) {
      let residualCapacity;
      if (edge.source === current) {
        residualCapacity =
          edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0);
      } else {
        residualCapacity = flows.get(`${edge.target}-${edge.source}`) || 0;
      }
      bottleneck = Math.min(bottleneck, residualCapacity);
    }
  }

  return bottleneck;
};

const updateFlows = (path, bottleneck, flows) => {
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const forwardKey = `${current}-${next}`;
    const backwardKey = `${next}-${current}`;

    const existingForwardFlow = flows.get(forwardKey) || 0;
    const existingBackwardFlow = flows.get(backwardKey) || 0;

    if (existingBackwardFlow > 0) {
      flows.set(backwardKey, existingBackwardFlow - bottleneck);
    } else {
      flows.set(forwardKey, existingForwardFlow + bottleneck);
    }
  }
};

const generateSteps = (initialNodes, edges, source = "S", sink = "T") => {
  const steps = [];
  const flows = new Map();
  edges.forEach((e) => flows.set(`${e.source}-${e.target}`, 0));

  // Initial state with both graphs
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        highlight: false,
      })),
      networkEdges: edges.map((edge) => ({
        ...edge,
        flow: 0,
        highlight: false,
      })),
      residualEdges: edges.map((edge) => ({
        ...edge,
        flow: 0,
        capacity: edge.capacity,
        highlight: false,
      })),
      currentPath: [],
      maxFlow: 0,
      showResidual: false, // Toggle between network and residual views
    },
    explanation: `Initial state of the network:\n• Left: Network Graph shows current flows\n• Right: Residual Graph shows available capacities\n• Looking for augmenting path from ${source} to ${sink}\n• Current flow: 0 units`,
    pseudoCodeLines: [1],
  });

  let maxFlow = 0;
  let path = findPath(source, sink, edges, flows);

  while (path) {
    const bottleneck = calculateBottleneck(path, edges, flows);
    maxFlow += bottleneck;
    updateFlows(path, bottleneck, flows);

    // Add step showing both graphs
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          highlight: path.includes(node.id),
        })),
        networkEdges: edges.map((edge) => ({
          ...edge,
          flow: flows.get(`${edge.source}-${edge.target}`) || 0,
          highlight: isEdgeInPath(edge, path),
        })),
        residualEdges: edges.map((edge) => {
          const forwardFlow = flows.get(`${edge.source}-${edge.target}`) || 0;
          const backwardFlow = flows.get(`${edge.target}-${edge.source}`) || 0;
          return {
            ...edge,
            forwardCapacity: edge.capacity - forwardFlow,
            backwardCapacity: forwardFlow,
            highlight: isEdgeInPath(edge, path),
          };
        }),
        currentPath: path,
        maxFlow,
        showResidual: false,
      },
      explanation: `Found augmenting path ${path.join(
        "→"
      )}:\n• Bottleneck capacity: ${bottleneck}\n• Current maximum flow: ${maxFlow} units`,
      pseudoCodeLines: [2, "a", "b", "c"],
    });

    path = findPath(source, sink, edges, flows);
  }

  // Final state
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        highlight: false,
      })),
      networkEdges: edges.map((edge) => ({
        ...edge,
        flow: flows.get(`${edge.source}-${edge.target}`) || 0,
        highlight: false,
      })),
      residualEdges: edges.map((edge) => {
        const forwardFlow = flows.get(`${edge.source}-${edge.target}`) || 0;
        return {
          ...edge,
          forwardCapacity: edge.capacity - forwardFlow,
          backwardCapacity: forwardFlow,
          highlight: false,
        };
      }),
      currentPath: [],
      maxFlow,
      showResidual: false,
    },
    explanation: `Algorithm complete:\n• No more augmenting paths found\n• Maximum flow achieved: ${maxFlow} units`,
    pseudoCodeLines: [3],
  });

  return steps;
};

const FordFulkersonEducationPage = () => {
  const conceptText = {
    introduction: `The Ford-Fulkerson method is a fundamental algorithm for solving the maximum flow problem in a flow network. It works by repeatedly finding augmenting paths from source to sink through any available path-finding strategy. While the basic Ford-Fulkerson method allows for any path-finding approach, a notable improvement called the Edmonds-Karp algorithm specifically uses Breadth-First Search (BFS) to find the shortest augmenting paths.

The key distinction is that while Ford-Fulkerson can use any valid path-finding strategy (like DFS or random selection), Edmonds-Karp's use of BFS guarantees a polynomial time complexity of O(VE²). This makes Edmonds-Karp more efficient and prevents pathological cases where Ford-Fulkerson might take exponential time with poor path selections.`,
    keyCharacteristics: [
      "Can use any strategy to find augmenting paths (DFS, random, etc.)",
      "Maintains both network and residual graphs",
      "Iteratively increases flow along found paths",
      "Terminates when no augmenting path exists",
      "Runtime varies based on path selection strategy",
      "Edmonds-Karp variation uses BFS for O(VE²) complexity guarantee",
      "Flow Equilibrium: At each node (except source and sink), inflow equals outflow",
    ],
    applications: [
      "Network routing optimization",
      "Bandwidth allocation in telecommunications",
      "Supply chain management",
      "Traffic flow systems",
      "Pipeline distribution networks",
    ],
  };

  const pseudocode = `FORD-FULKERSON Algorithm:
1. Initialize all flows to zero
2. While there exists an augmenting path:
   a. Find any augmenting path
   b. Calculate bottleneck capacity
   c. Update flows along the path
3. Return total flow when no path exists`;

  return (
    <EducationPageStructure
      title="Ford-Fulkerson Algorithm"
      conceptText={conceptText}
      pseudocode={pseudocode}
      generateSteps={(nodes, edges) => generateSteps(nodes, edges, "S", "T")}
    />
  );
};

export default FordFulkersonEducationPage;
