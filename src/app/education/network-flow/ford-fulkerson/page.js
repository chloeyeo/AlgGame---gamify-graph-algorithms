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

  // Initialize flows
  edges.forEach((e) => flows.set(`${e.source}-${e.target}`, 0));

  // Initial state
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        highlight: false,
      })),
      edges: edges.map((edge) => ({
        ...edge,
        flow: 0,
        highlight: false,
        residualCapacity: edge.capacity,
      })),
      currentPath: [],
      maxFlow: 0,
    },
    explanation:
      "Initial state: All flows are zero. Looking for augmenting path from source (S) to sink (T).",
    pseudoCodeLines: [1],
  });

  let path = findPath(source, sink, edges, flows);
  let iteration = 1;

  while (path) {
    const bottleneck = calculateBottleneck(path, edges, flows);

    // Add step showing current path
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          highlight: path.includes(node.id),
        })),
        edges: edges.map((edge) => ({
          ...edge,
          flow: flows.get(`${edge.source}-${edge.target}`) || 0,
          highlight: isEdgeInPath(edge, path),
          residualCapacity:
            edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0),
        })),
        currentPath: path,
        maxFlow: steps[steps.length - 1].graphState.maxFlow,
      },
      explanation: `Iteration ${iteration}: Found augmenting path ${path.join(
        " → "
      )} with bottleneck capacity ${bottleneck}`,
      pseudoCodeLines: [2, "a"],
    });

    // Update flows
    updateFlows(path, bottleneck, flows);

    // Add step showing updated flows
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          highlight: path.includes(node.id),
        })),
        edges: edges.map((edge) => ({
          ...edge,
          flow: flows.get(`${edge.source}-${edge.target}`) || 0,
          highlight: isEdgeInPath(edge, path),
          residualCapacity:
            edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0),
        })),
        currentPath: path,
        maxFlow: steps[steps.length - 1].graphState.maxFlow + bottleneck,
      },
      explanation: `Updated flows along path. Current maximum flow: ${
        steps[steps.length - 1].graphState.maxFlow + bottleneck
      }`,
      pseudoCodeLines: [2, "c"],
    });

    path = findPath(source, sink, edges, flows);
    iteration++;
  }

  return steps;
};

const generateRandomNetworkGraph = (nodeCount = 6) => {
  const nodes = [];
  const layerWidth = 150;
  const centerY = 300;

  // Add source node
  nodes.push({
    id: "S",
    x: 50,
    y: centerY,
  });

  // Add middle layers (2 layers)
  const nodesPerLayer = Math.max(2, Math.floor((nodeCount - 2) / 2));

  for (let layer = 0; layer < 2; layer++) {
    for (let i = 0; i < nodesPerLayer; i++) {
      nodes.push({
        id: `${String.fromCharCode(65 + layer * nodesPerLayer + i)}`,
        x: layerWidth * (layer + 1) + 50,
        y: 150 + (i * 300) / (nodesPerLayer - 1),
      });
    }
  }

  // Add sink node
  nodes.push({
    id: "T",
    x: layerWidth * 3 + 50,
    y: centerY,
  });

  // Generate edges
  const edges = [];

  // Connect source to first layer
  nodes
    .filter((n) => n.x === layerWidth + 50)
    .forEach((node) => {
      edges.push({
        source: "S",
        target: node.id,
        capacity: Math.floor(Math.random() * 8) + 3,
        flow: 0,
      });
    });

  // Connect layers
  for (let layer = 0; layer < 2; layer++) {
    const currentLayerNodes = nodes.filter(
      (n) => n.x === layerWidth * (layer + 1) + 50
    );
    const nextLayerNodes = nodes.filter(
      (n) => n.x === layerWidth * (layer + 2) + 50
    );

    currentLayerNodes.forEach((source) => {
      nextLayerNodes.forEach((target) => {
        if (Math.random() < 0.7) {
          edges.push({
            source: source.id,
            target: target.id,
            capacity: Math.floor(Math.random() * 8) + 3,
            flow: 0,
          });
        }
      });
    });
  }

  // Connect last layer to sink
  nodes
    .filter((n) => n.x === layerWidth * 2 + 50)
    .forEach((node) => {
      edges.push({
        source: node.id,
        target: "T",
        capacity: Math.floor(Math.random() * 8) + 3,
        flow: 0,
      });
    });

  return { nodes, edges };
};

const NODE_TYPES = {
  SOURCE: { color: "#90EE90" }, // Light green
  SINK: { color: "#FFB6C1" }, // Light pink
  NORMAL: { color: "#FFFFFF" }, // White
};

const EDGE_TYPES = {
  CURRENT_PATH: { color: "#4169E1" }, // Royal blue
  NORMAL: { color: "#000000" }, // Black
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
      generateSteps={(nodes, edges) => generateSteps(nodes, edges)}
      generateGraph={() => generateRandomNetworkGraph(5)}
    />
  );
};

export default FordFulkersonEducationPage;
