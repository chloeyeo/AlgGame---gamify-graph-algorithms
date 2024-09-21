export function bfs(graphData, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const traversalOrder = [];

  while (queue.length > 0) {
    const node = queue.shift();

    if (!visited.has(node.id)) {
      visited.add(node.id);
      traversalOrder.push(node);

      // Add neighbors to the queue
      const neighbors = graphData.links
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => (link.source === node.id ? link.target : link.source))
        .map((neighborId) => graphData.nodes.find((n) => n.id === neighborId));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return traversalOrder;
}
