const generateAStarGraph = (nodeCount, difficulty = "medium") => {
  // Generate nodes with truly random positions
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    return {
      id: String.fromCharCode(65 + i),
      x: 150 + Math.random() * 300, // Random x between 150-450
      y: 150 + Math.random() * 300, // Random y between 150-450
      visited: false,
      f: Infinity,
      g: Infinity,
      h: 0,
      current: false,
      recentlyUpdated: false,
      displayText: "∞",
    };
  });

  // Generate edges with weights based on actual distances
  const edges = [];
  const maxEdges =
    {
      easy: Math.floor(nodeCount * 1.5),
      medium: Math.floor(nodeCount * 2),
      hard: Math.floor(nodeCount * 2.5),
    }[difficulty] || Math.floor(nodeCount * 2);

  // Ensure basic connectivity
  for (let i = 0; i < nodes.length - 1; i++) {
    const dx = nodes[i + 1].x - nodes[i].x;
    const dy = nodes[i + 1].y - nodes[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      weight: Number((distance / 100).toFixed(2)),
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
      const dx = nodes[target].x - nodes[source].x;
      const dy = nodes[target].y - nodes[source].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      edges.push({
        source: nodes[source].id,
        target: nodes[target].id,
        weight: Number((distance / 100).toFixed(2)),
      });
    }
  }

  // Set goal node and calculate heuristics
  const goalNode = nodes[nodes.length - 1].id;
  const goalNodeObj = nodes.find((n) => n.id === goalNode);

  nodes.forEach((node) => {
    const dx = node.x - goalNodeObj.x;
    const dy = node.y - goalNodeObj.y;
    node.h = Number(Math.sqrt(dx * dx + dy * dy).toFixed(2));
  });

  return {
    nodes,
    edges,
    currentNode: null,
    startNode: null,
    goalNode,
    algorithm: "astar",
  };
};

export { generateAStarGraph };
