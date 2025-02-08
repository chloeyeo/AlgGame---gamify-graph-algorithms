export const generateGameGraph = (nodeCount = 6) => {
  const nodes = [];
  const edges = [];
  const width = 800;
  const height = 600;
  const radius = Math.min(width, height) / 3;
  const centerX = width / 2;
  const centerY = height / 2;

  // Generate nodes in a circular layout
  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount;
    nodes.push({
      id: String.fromCharCode(65 + i), // A, B, C, etc.
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  // Generate edges to ensure connected graph
  for (let i = 0; i < nodes.length; i++) {
    // Connect to next node
    edges.push({
      source: nodes[i].id,
      target: nodes[(i + 1) % nodes.length].id,
    });

    // Add some random edges for more interesting paths
    if (Math.random() > 0.5 && i > 1) {
      const target = Math.floor(Math.random() * i);
      if (
        !edges.some(
          (e) =>
            (e.source === nodes[i].id && e.target === nodes[target].id) ||
            (e.source === nodes[target].id && e.target === nodes[i].id)
        )
      ) {
        edges.push({
          source: nodes[i].id,
          target: nodes[target].id,
        });
      }
    }
  }

  return { nodes, edges };
};

export const generateFordFulkersonGraph = (nodeCount = 6) => {
  const nodes = [
    { id: "S", x: 100, y: 300 },
    ...Array.from({ length: nodeCount - 2 }, (_, i) => ({
      id: String.fromCharCode(65 + i),
      x: 250 + (i % 2) * 150,
      y: 200 + Math.floor(i / 2) * 200,
    })),
    { id: "T", x: 500, y: 300 },
  ];

  const edges = [];

  // Generate edges ensuring connectivity
  nodes.slice(1, -1).forEach((node) => {
    if (Math.random() < 0.7) {
      edges.push({
        source: "S",
        target: node.id,
        capacity: Math.floor(Math.random() * 8) + 3,
        flow: 0,
      });
    }

    if (Math.random() < 0.7) {
      edges.push({
        source: node.id,
        target: "T",
        capacity: Math.floor(Math.random() * 8) + 3,
        flow: 0,
      });
    }
  });

  // Add intermediate edges
  for (let i = 1; i < nodes.length - 1; i++) {
    for (let j = i + 1; j < nodes.length - 1; j++) {
      if (Math.random() < 0.3) {
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          capacity: Math.floor(Math.random() * 8) + 3,
          flow: 0,
        });
      }
    }
  }

  // Ensure at least one path exists from S to T
  if (!hasPathToSink(nodes, edges)) {
    const midNode = nodes[Math.floor(nodes.length / 2)].id;
    edges.push(
      { source: "S", target: midNode, capacity: 5, flow: 0 },
      { source: midNode, target: "T", capacity: 5, flow: 0 }
    );
  }

  return { nodes, edges };
};

const hasPathToSink = (nodes, edges) => {
  const visited = new Set();
  const dfs = (node) => {
    if (node === "T") return true;
    visited.add(node);

    for (const edge of edges) {
      if (edge.source === node && !visited.has(edge.target)) {
        if (dfs(edge.target)) return true;
      }
    }
    return false;
  };

  return dfs("S");
};
