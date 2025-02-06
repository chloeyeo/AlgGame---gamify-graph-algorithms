const generateAStarGraph = (nodeCount, difficulty = "medium") => {
  // Use circular layout for consistent positioning
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / nodeCount;
    const radius = 150;

    return {
      id: String.fromCharCode(65 + i),
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 0,
      current: false,
      recentlyUpdated: false,
      displayText: "∞",
    };
  });

  // Generate edges with integer weights
  const edges = [];
  const maxEdges =
    {
      easy: Math.floor(nodeCount * 1.5),
      medium: Math.floor(nodeCount * 2),
      hard: Math.floor(nodeCount * 2.5),
    }[difficulty] || Math.floor(nodeCount * 2);

  // Ensure basic connectivity
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      weight: Math.floor(Math.random() * 8) + 1,
    });
  }

  // Add random edges
  while (edges.length < maxEdges) {
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
    goalNode: nodes[nodes.length - 1].id,
    startNode: null,
    currentNode: null,
  };
};

export { generateAStarGraph };
