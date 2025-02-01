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
