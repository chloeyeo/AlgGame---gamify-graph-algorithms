export const getNetworkFlowNodePositions = () => ({
  S: { x: 100, y: 250 },
  A: { x: 300, y: 100 },
  B: { x: 500, y: 100 },
  C: { x: 300, y: 400 },
  D: { x: 500, y: 400 },
  T: { x: 700, y: 250 },
});

export const getDefaultNodes = () => [
  { id: "A", x: 300, y: 50 },
  { id: "B", x: 200, y: 200 },
  { id: "C", x: 400, y: 200 },
  { id: "D", x: 130, y: 350 },
  { id: "E", x: 270, y: 350 },
  { id: "F", x: 470, y: 350 },
  { id: "G", x: 80, y: 500 },
];

export const getDijkstraNodes = [
  // Graph A (Same as default nodes)
  {
    A: { x: 300, y: 50 },
    B: { x: 200, y: 200 },
    C: { x: 400, y: 200 },
    D: { x: 130, y: 350 },
    E: { x: 270, y: 350 },
    F: { x: 470, y: 350 },
    G: { x: 80, y: 500 },
  },
  // Graph B (Circular layout)
  {
    A: { x: 300, y: 100 },
    B: { x: 150, y: 200 },
    C: { x: 450, y: 200 },
    D: { x: 150, y: 350 },
    E: { x: 300, y: 400 },
    F: { x: 450, y: 350 },
  },
  // Graph C (Grid layout)
  {
    A: { x: 200, y: 100 },
    B: { x: 400, y: 100 },
    C: { x: 200, y: 250 },
    D: { x: 400, y: 250 },
    E: { x: 200, y: 400 },
    F: { x: 400, y: 400 },
  },
];

export const getDFSGameNodes = [
  {
    // Graph A
    A: { x: 300, y: 50 },
    B: { x: 200, y: 200 },
    C: { x: 400, y: 200 },
    D: { x: 130, y: 350 },
    E: { x: 270, y: 350 },
    F: { x: 470, y: 350 },
    G: { x: 80, y: 500 },
  },
  {
    // Caterpillar (Graph B)
    A: { x: 600, y: 200 },
    B: { x: 100, y: 200 },
    C: { x: 200, y: 200 },
    D: { x: 300, y: 200 },
    E: { x: 400, y: 200 },
    F: { x: 100, y: 300 },
    G: { x: 200, y: 300 },
    H: { x: 300, y: 300 },
  },
  {
    // Star (Graph C)
    A: { x: 300, y: 250 },
    B: { x: 300, y: 150 },
    C: { x: 400, y: 250 },
    D: { x: 300, y: 350 },
    E: { x: 200, y: 250 },
    F: { x: 400, y: 350 },
  },
  {
    // Diamond (Graph D)
    A: { x: 300, y: 100 },
    B: { x: 200, y: 200 },
    C: { x: 400, y: 200 },
    D: { x: 300, y: 300 },
    E: { x: 250, y: 300 },
    F: { x: 350, y: 300 },
    G: { x: 450, y: 300 },
  },
  {
    // Cycle (Graph E)
    A: { x: 300, y: 100 },
    B: { x: 400, y: 175 },
    C: { x: 400, y: 275 },
    D: { x: 300, y: 350 },
    E: { x: 200, y: 275 },
    F: { x: 200, y: 175 },
  },
  {
    // Disconnected (Graph F)
    A: { x: 50, y: 200 },
    B: { x: 150, y: 200 },
    C: { x: 250, y: 200 },
    D: { x: 400, y: 200 },
    E: { x: 500, y: 200 },
    F: { x: 600, y: 200 },
  },
  {
    // Complete graph (Graph G)
    A: { x: 300, y: 100 },
    B: { x: 200, y: 200 },
    C: { x: 400, y: 200 },
    D: { x: 300, y: 300 },
    E: { x: 250, y: 300 },
    F: { x: 350, y: 300 },
    G: { x: 450, y: 300 },
  },
];

export const getKruskalEducationGraphNodes = [
  // Graph A - Standard layout with 6 nodes
  [
    { id: "A", x: 300, y: 50 }, // Top center
    { id: "B", x: 200, y: 200 }, // Middle left
    { id: "C", x: 400, y: 200 }, // Middle right
    { id: "D", x: 130, y: 350 }, // Bottom left
    { id: "E", x: 270, y: 350 }, // Bottom middle
    { id: "F", x: 470, y: 350 }, // Bottom right
  ],

  // Graph B - 7 node layout
  [
    { id: "A", x: 300, y: 50 },
    { id: "B", x: 200, y: 200 },
    { id: "C", x: 400, y: 200 },
    { id: "D", x: 130, y: 350 },
    { id: "E", x: 270, y: 350 },
    { id: "F", x: 470, y: 350 },
    { id: "G", x: 80, y: 500 },
  ],

  // Graph C - Cycle detection example
  [
    { id: "A", x: 300, y: 50 },
    { id: "B", x: 200, y: 200 },
    { id: "C", x: 400, y: 200 },
    { id: "D", x: 130, y: 350 },
    { id: "E", x: 270, y: 350 },
    { id: "F", x: 470, y: 350 },
    { id: "G", x: 80, y: 500 },
  ],

  // Graph D - Triangle with extensions (from your drawing)
  [
    { id: "A", x: 300, y: 50 }, // Top vertex
    { id: "B", x: 150, y: 200 }, // Left vertex
    { id: "C", x: 450, y: 200 }, // Right vertex
    { id: "D", x: 100, y: 350 }, // Bottom left
    { id: "E", x: 500, y: 350 }, // Bottom right
  ],
];

// Optional helper function to get specific graph's nodes
export const getNodesForGraph = (graphIndex) => {
  if (graphIndex >= 0 && graphIndex < getKruskalEducationGraphNodes.length) {
    return getKruskalEducationGraphNodes[graphIndex];
  }
  return getKruskalEducationGraphNodes[0]; // Default to first graph if invalid index
};

export const generateInitialGraphState = (
  nodeCount,
  type = "default",
  difficulty = null
) => {
  if (type === "dijkstra") {
    // Use circular layout for consistent positioning
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (2 * Math.PI * i) / nodeCount;
      const radius = 150; // Fixed radius for consistent spacing

      return {
        id: String.fromCharCode(65 + i),
        x: 300 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle),
        visited: false,
        current: false,
        recentlyUpdated: false,
        distance: Infinity,
        displayText: "∞",
      };
    });

    const edges = [];
    // Ensure graph is connected
    for (let i = 1; i < nodes.length; i++) {
      const parent = Math.floor(Math.random() * i);
      edges.push({
        source: nodes[parent].id,
        target: nodes[i].id,
        weight: Math.floor(Math.random() * 8) + 1, // Random weight 1-9
      });
    }

    // Add extra edges based on difficulty
    const maxExtraEdges =
      {
        easy: 1,
        medium: 2,
        hard: 3,
      }[difficulty] || 1;

    for (let i = 0; i < maxExtraEdges; i++) {
      const source = Math.floor(Math.random() * nodes.length);
      const target = Math.floor(Math.random() * nodes.length);

      if (
        source !== target &&
        !edges.some(
          (e) =>
            (e.source === nodes[source].id && e.target === nodes[target].id) ||
            (e.source === nodes[target].id && e.target === nodes[source].id)
        )
      ) {
        edges.push({
          source: nodes[source].id,
          target: nodes[target].id,
          weight: Math.floor(Math.random() * 8) + 1,
        });
      }
    }

    return {
      nodes,
      edges,
      startNode: null,
      currentNode: null,
    };
  }
  if (type === "astar") {
    // Use circular layout for consistent positioning
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (2 * Math.PI * i) / nodeCount;
      const radius = 150; // Fixed radius for consistent spacing

      return {
        id: String.fromCharCode(65 + i),
        x: 300 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle),
        visited: false,
        current: false,
        recentlyUpdated: false,
        g: Infinity,
        h: 0,
        f: Infinity,
        displayText: "∞",
      };
    });

    const edges = [];
    // Ensure graph is connected
    for (let i = 1; i < nodes.length; i++) {
      const parent = Math.floor(Math.random() * i);
      edges.push({
        source: nodes[parent].id,
        target: nodes[i].id,
        weight: Math.floor(Math.random() * 8) + 1, // Random weight 1-9
      });
    }

    // Add extra edges based on difficulty
    const maxExtraEdges =
      {
        easy: 1,
        medium: 2,
        hard: 3,
      }[difficulty] || 1;

    for (let i = 0; i < maxExtraEdges; i++) {
      const source = Math.floor(Math.random() * nodes.length);
      const target = Math.floor(Math.random() * nodes.length);

      if (
        source !== target &&
        !edges.some(
          (e) =>
            (e.source === nodes[source].id && e.target === nodes[target].id) ||
            (e.source === nodes[target].id && e.target === nodes[source].id)
        )
      ) {
        edges.push({
          source: nodes[source].id,
          target: nodes[target].id,
          weight: Math.floor(Math.random() * 8) + 1,
        });
      }
    }

    return {
      nodes,
      edges,
      startNode: null,
      currentNode: null,
      goalNode: nodes[nodes.length - 1].id, // Last node is the goal
    };
  }

  return {
    nodes: [],
    edges: [],
    startNode: null,
    currentNode: null,
  };
};
