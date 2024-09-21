export const dfs = (graph, startNode) => {
  const visited = new Set();
  const result = [];

  const traverse = (node) => {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);
    result.push(node);
    const neighbors = graph.links
      .filter((link) => link.source.id === node.id)
      .map((link) => link.target);
    for (const neighbor of neighbors) {
      traverse(neighbor);
    }
  };

  traverse(startNode);
  return result;
};
