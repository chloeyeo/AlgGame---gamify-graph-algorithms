export const isValidBFSMove = (state, nodeId) => {
  const newState = { ...state };
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);
  const visited = new Set(newState.visitedNodes);

  // First move
  if (!newState.currentNode) {
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.queue = [];
    newState.visitedNodes = [nodeId];

    // Add all unvisited neighbors to queue
    const neighbors = newState.edges
      .filter(
        (edge) =>
          (edge.source === nodeId && !visited.has(edge.target)) ||
          (edge.target === nodeId && !visited.has(edge.source))
      )
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source))
      .sort();

    newState.queue.push(...neighbors);

    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Starting BFS from node ${nodeId}`,
    };
  }

  // Check if clicked node is in queue and at the current level
  if (newState.queue.includes(nodeId) && !visited.has(nodeId)) {
    // Get all nodes at current level (all unvisited neighbors of current node)
    const currentLevelNodes = new Set(
      newState.edges
        .filter(
          (edge) =>
            (edge.source === newState.currentNode &&
              !visited.has(edge.target)) ||
            (edge.target === newState.currentNode && !visited.has(edge.source))
        )
        .map((edge) =>
          edge.source === newState.currentNode ? edge.target : edge.source
        )
    );

    // Only allow visiting nodes at current level
    if (!currentLevelNodes.has(nodeId)) {
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message:
          "Invalid move! In BFS, you must complete the current level before moving to the next level.",
      };
    }

    const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
    prevNode.current = false;
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.visitedNodes.push(nodeId);

    // Remove clicked node from queue
    newState.queue = newState.queue.filter((n) => n !== nodeId);

    // Add unvisited neighbors to queue
    const neighbors = newState.edges
      .filter(
        (edge) =>
          (edge.source === nodeId && !visited.has(edge.target)) ||
          (edge.target === nodeId && !visited.has(edge.source))
      )
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source))
      .sort();

    // Only add neighbors that aren't already in queue and aren't visited
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor) && !newState.queue.includes(neighbor)) {
        newState.queue.push(neighbor);
      }
    });

    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Processing node ${nodeId} in BFS order`,
    };
  }

  return {
    validMove: false,
    newState: state,
    nodeStatus: "incorrect",
    message:
      "Invalid move! In BFS, you must visit nodes in queue order, level by level.",
  };
};

export const isValidDFSMove = (state, nodeId) => {
  const newState = { ...state };
  const clickedNode = newState.nodes.find((n) => n.id === nodeId);

  // First move
  if (!newState.currentNode) {
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.stack = [nodeId];
    newState.visitedNodes = [nodeId];
    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Starting DFS from node ${nodeId}`,
    };
  }

  // Get all neighbors (both incoming and outgoing edges)
  const allNeighbors = newState.edges
    .filter(
      (edge) =>
        edge.source === newState.currentNode ||
        edge.target === newState.currentNode
    )
    .map((edge) =>
      edge.source === newState.currentNode ? edge.target : edge.source
    );

  // Find unvisited neighbors
  const unvisitedNeighbors = allNeighbors.filter(
    (neighbor) => !newState.nodes.find((node) => node.id === neighbor).visited
  );

  // If clicked node is an unvisited neighbor
  if (unvisitedNeighbors.includes(nodeId)) {
    const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
    prevNode.current = false;
    clickedNode.visited = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.stack.push(nodeId);
    newState.visitedNodes.push(nodeId);
    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Visited node ${nodeId}`,
    };
  }

  // Allow backtracking when no unvisited neighbors
  if (
    unvisitedNeighbors.length === 0 &&
    newState.stack.length > 1 &&
    newState.stack[newState.stack.length - 2] === nodeId
  ) {
    const prevNode = newState.nodes.find((n) => n.id === newState.currentNode);
    prevNode.current = false;
    prevNode.backtracked = true;
    clickedNode.current = true;
    newState.currentNode = nodeId;
    newState.stack.pop();
    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Backtracked to node ${nodeId}`,
    };
  }

  return {
    validMove: false,
    newState: state,
    nodeStatus: "incorrect",
    message:
      "Invalid move! Follow DFS rules: visit unvisited neighbors or backtrack when needed.",
  };
};
