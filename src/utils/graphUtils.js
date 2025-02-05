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
  // For Dijkstra's algorithm
  if (type === "dijkstra") {
    const nodes = [];
    const edges = [];

    // Use the first graph layout from getDijkstraNodes
    const nodePositions = getDijkstraNodes[0];

    // Create nodes
    Object.entries(nodePositions)
      .slice(0, nodeCount)
      .forEach(([id, pos]) => {
        nodes.push({
          id,
          x: pos.x,
          y: pos.y,
          visited: false,
          current: false,
          recentlyUpdated: false,
          distance: Infinity,
          displayText: "∞",
        });
      });

    // Create edges with random weights (1-9)
    const nodeIds = nodes.map((node) => node.id);
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        if (Math.random() < 0.5) {
          // 50% chance to create an edge
          edges.push({
            source: nodeIds[i],
            target: nodeIds[j],
            weight: Math.floor(Math.random() * 9) + 1,
          });
        }
      }
    }

    return {
      nodes,
      edges,
      startNode: null,
      currentNode: null,
    };
  }

  // Handle other graph types here if needed
  return {
    nodes: [],
    edges: [],
    startNode: null,
    currentNode: null,
  };
};
