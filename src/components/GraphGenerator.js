const generateGameGraph = (nodeCount = 6, difficulty = "medium") => {
  const nodes = [];
  const width = 600;
  const height = 500;
  const padding = 80;
  const centerX = width / 2;
  const centerY = height / 2;

  // Generate nodes in a circular layout with random offsets
  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount;
    const radius = (height - 2 * padding) / 2;

    // Add some randomness to positions based on difficulty
    const randomOffset = difficulty === "hard" ? 0.3 : 0.1;
    const xOffset = (Math.random() - 0.5) * radius * randomOffset;
    const yOffset = (Math.random() - 0.5) * radius * randomOffset;

    nodes.push({
      id: String.fromCharCode(65 + i), // A, B, C, etc.
      x: centerX + radius * Math.cos(angle) + xOffset,
      y: centerY + radius * Math.sin(angle) + yOffset,
    });
  }

  // Generate edges based on difficulty
  const edges = [];
  const minEdges = difficulty === "easy" ? nodeCount : nodeCount + 1;
  const maxExtraEdges = {
    easy: 1,
    medium: 2,
    hard: 3,
  }[difficulty];

  // Ensure graph is connected
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push(
      { source: nodes[i].id, target: nodes[i + 1].id },
      { source: nodes[i + 1].id, target: nodes[i].id }
    );
  }

  // Connect first and last node for better connectivity
  edges.push(
    { source: nodes[0].id, target: nodes[nodes.length - 1].id },
    { source: nodes[nodes.length - 1].id, target: nodes[0].id }
  );

  // Add random extra edges based on difficulty
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
      edges.push(
        { source: nodes[source].id, target: nodes[target].id },
        { source: nodes[target].id, target: nodes[source].id }
      );
    }
  }

  return { nodes, edges };
};

export { generateGameGraph };
