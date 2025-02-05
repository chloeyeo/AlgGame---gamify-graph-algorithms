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
    // Get ALL nodes at current level from ANY previously visited node
    const currentLevelNodes = getCurrentLevelNodes(newState);

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

export const generateDFSSteps = (initialNodes, edges) => {
  const steps = [];
  const visited = new Set();
  const backtracked = new Set();
  const stack = [initialNodes[0].id];

  // Step 1: Initialize Stack
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        backtracked: false,
        current: node.id === initialNodes[0].id,
      })),
      edges,
      currentNode: initialNodes[0].id,
      stack: [...stack],
    },
    explanation: generateDFSExplanation(null, visited, backtracked, stack),
    pseudoCodeLines: [2], // Stack = [start_node]
  });

  // Step 2: Initialize Visited Set
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        backtracked: false,
        current: node.id === initialNodes[0].id,
      })),
      edges,
      currentNode: initialNodes[0].id,
      stack: [...stack],
    },
    explanation: generateDFSExplanation(
      steps[steps.length - 1],
      visited,
      backtracked,
      stack
    ),
    pseudoCodeLines: [3], // Visited = set()
  });

  while (stack.length > 0) {
    const currentNode = stack[stack.length - 1];

    // Step 3: While loop check
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
          backtracked: backtracked.has(node.id),
          current: node.id === currentNode,
        })),
        edges,
        currentNode,
        stack: [...stack],
      },
      explanation: generateDFSExplanation(
        steps[steps.length - 1],
        visited,
        backtracked,
        stack
      ),
      pseudoCodeLines: [5], // while Stack is not empty
    });

    if (!visited.has(currentNode)) {
      // Step 4: Pop operation
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
        },
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [6], // node = Stack.pop()
      });

      // Step 5: Check if node not visited
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
        },
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [7], // if node not in Visited
      });

      // Step 6: Add to visited
      visited.add(currentNode);
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
        },
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [8], // Visited.add(node)
      });

      // Step 7: Process node
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
        },
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [9], // process(node)
      });
    }

    const allNeighbors = edges
      .filter(
        (edge) => edge.source === currentNode || edge.target === currentNode
      )
      .map((edge) => (edge.source === currentNode ? edge.target : edge.source))
      .sort();

    // Step 8: Start neighbor loop
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
          backtracked: backtracked.has(node.id),
          current: node.id === currentNode,
        })),
        edges,
        currentNode,
        stack: [...stack],
      },
      explanation: generateDFSExplanation(
        steps[steps.length - 1],
        visited,
        backtracked,
        stack
      ),
      pseudoCodeLines: [10], // for neighbor in graph[node]
    });

    const unvisitedNeighbor = allNeighbors.find(
      (neighbor) => !visited.has(neighbor)
    );

    if (unvisitedNeighbor) {
      // Step 9: Check unvisited neighbor
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
          activeNeighbor: unvisitedNeighbor,
        },
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [11], // if neighbor not in Visited
      });

      // Step 10: Push to stack
      stack.push(unvisitedNeighbor);
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
          activeNeighbor: unvisitedNeighbor,
        },
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [12], // Stack.push(neighbor)
      });
    } else {
      // Backtracking
      stack.pop();
      backtracked.add(currentNode);
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current:
              stack.length > 0 ? node.id === stack[stack.length - 1] : false,
          })),
          edges,
          currentNode: stack[stack.length - 1],
          stack: [...stack],
        },
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [5], // back to while Stack is not empty
      });
    }
  }

  return steps;
};

export const generateBFSSteps = (initialNodes, edges) => {
  const steps = [];
  const visited = new Set();
  const queue = [initialNodes[0].id];

  // Step 1: Initialize Queue
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        current: node.id === initialNodes[0].id,
      })),
      edges,
      currentNode: initialNodes[0].id,
      queue: [...queue],
    },
    explanation: "Starting BFS from node " + initialNodes[0].id,
    pseudoCodeLines: [1, 2],
  });

  // Step 2: Initialize Visited Set
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        current: node.id === initialNodes[0].id,
      })),
      edges,
      currentNode: initialNodes[0].id,
      queue: [...queue],
    },
    explanation: "Initializing empty visited set",
    pseudoCodeLines: [3],
  });

  while (queue.length > 0) {
    const currentNode = queue.shift();

    // Step 3: Queue dequeue operation
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
          current: node.id === currentNode,
        })),
        edges,
        currentNode,
        queue: [...queue],
      },
      explanation: `Dequeuing node ${currentNode}`,
      pseudoCodeLines: [5],
    });

    if (!visited.has(currentNode)) {
      // Step 4: Mark as visited
      visited.add(currentNode);
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          queue: [...queue],
        },
        explanation: `Marking node ${currentNode} as visited`,
        pseudoCodeLines: [7],
      });

      // Find unvisited neighbors
      const neighbors = edges
        .filter(
          (edge) =>
            (edge.source === currentNode && !visited.has(edge.target)) ||
            (edge.target === currentNode && !visited.has(edge.source))
        )
        .map((edge) =>
          edge.source === currentNode ? edge.target : edge.source
        )
        .sort();

      // Add each unvisited neighbor to queue
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          steps.push({
            graphState: {
              nodes: initialNodes.map((node) => ({
                ...node,
                visited: visited.has(node.id),
                current: node.id === currentNode,
              })),
              edges,
              currentNode,
              queue: [...queue],
              activeNeighbor: neighbor,
            },
            explanation: `Adding unvisited neighbor ${neighbor} to queue`,
            pseudoCodeLines: [9, 10],
          });
        }
      }
    }
  }

  return steps;
};

export const generateDFSExplanation = (step, visited, backtracked, stack) => {
  // Initial state
  if (stack.length === 1 && visited.size === 0) {
    return "Starting DFS from node " + stack[0];
  }

  // Just visited a node
  if (step.graphState.activeNeighbor) {
    return `Found unvisited neighbor ${step.graphState.activeNeighbor} from node ${step.graphState.currentNode}`;
  }

  // Backtracking
  if (backtracked.has(step.graphState.currentNode)) {
    return `Backtracking from node ${step.graphState.currentNode} (all neighbors visited)`;
  }

  // Just visited a new node
  if (visited.has(step.graphState.currentNode)) {
    return `Visiting node ${step.graphState.currentNode}, exploring its neighbors`;
  }

  return "Processing next DFS step";
};

export const generateBFSExplanation = (step, visited, queue) => {
  // Initial state
  if (queue.length === 1 && visited.size === 0) {
    return "Starting BFS from node " + queue[0];
  }

  // Just visited a node
  if (step.graphState.activeNeighbor) {
    return `Found unvisited neighbor ${step.graphState.activeNeighbor} at current level`;
  }

  // Processing new level
  if (visited.has(step.graphState.currentNode)) {
    return `Visiting node ${step.graphState.currentNode}, exploring all neighbors at this level`;
  }

  return "Processing next BFS step";
};

// for BFS
const getCurrentLevelNodes = (state) => {
  // If this is the first move
  if (state.visitedNodes.length === 0) {
    return new Set(state.queue);
  }

  const visited = new Set(state.visitedNodes);

  // Calculate distances from start node for all nodes
  const distances = new Map();
  const startNode = state.visitedNodes[0];

  // Initialize all distances to Infinity
  state.nodes.forEach((node) => distances.set(node.id, Infinity));
  distances.set(startNode, 0);

  // Calculate shortest distances using BFS
  const queue = [startNode];
  const processed = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (processed.has(current)) continue;
    processed.add(current);

    // Get neighbors
    const neighbors = state.edges
      .filter((edge) => edge.source === current || edge.target === current)
      .map((edge) => (edge.source === current ? edge.target : edge.source));

    // Update distances for unvisited neighbors
    neighbors.forEach((neighbor) => {
      if (!processed.has(neighbor)) {
        const newDist = distances.get(current) + 1;
        if (newDist < distances.get(neighbor)) {
          distances.set(neighbor, newDist);
          queue.push(neighbor);
        }
      }
    });
  }

  // Find minimum distance of any unvisited node
  let minDist = Infinity;
  state.nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      minDist = Math.min(minDist, distances.get(node.id));
    }
  });

  // Return all unvisited nodes at the minimum distance
  return new Set(
    state.nodes
      .filter(
        (node) => !visited.has(node.id) && distances.get(node.id) === minDist
      )
      .map((node) => node.id)
  );
};

export const generateDijkstraSteps = (initialNodes, edges) => {
  const steps = [];
  const visited = new Set();
  const distances = new Map();
  const previous = new Map();

  // Initialize distances
  initialNodes.forEach((node) => {
    distances.set(node.id, node.id === initialNodes[0].id ? 0 : Infinity);
    previous.set(node.id, null);
  });

  // Initial state
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        distance: distances.get(node.id),
        recentlyUpdated: false,
        current: false,
      })),
      edges,
      currentNode: null,
      startNode: initialNodes[0].id,
    },
    explanation:
      "Initial state: All nodes have infinite distance except the start node",
  });

  while (visited.size < initialNodes.length) {
    // Find unvisited node with minimum distance
    let minDistance = Infinity;
    let current = null;

    initialNodes.forEach((node) => {
      if (!visited.has(node.id) && distances.get(node.id) < minDistance) {
        minDistance = distances.get(node.id);
        current = node.id;
      }
    });

    if (!current || distances.get(current) === Infinity) {
      break;
    }

    // Mark as visited
    visited.add(current);
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
          distance: distances.get(node.id),
          recentlyUpdated: false,
          current: node.id === current,
        })),
        edges,
        currentNode: current,
        startNode: initialNodes[0].id,
      },
      explanation: `Processing node ${current} (current shortest distance: ${distances.get(
        current
      )})`,
    });

    // Process neighbors
    const neighbors = edges
      .filter((edge) => edge.source === current || edge.target === current)
      .map((edge) => ({
        id: edge.source === current ? edge.target : edge.source,
        weight: edge.weight,
      }));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.id)) {
        const newDistance = distances.get(current) + neighbor.weight;
        if (newDistance < distances.get(neighbor.id)) {
          distances.set(neighbor.id, newDistance);
          previous.set(neighbor.id, current);

          steps.push({
            graphState: {
              nodes: initialNodes.map((node) => ({
                ...node,
                visited: visited.has(node.id),
                distance: distances.get(node.id),
                recentlyUpdated: node.id === neighbor.id,
                current: node.id === current,
              })),
              edges,
              currentNode: current,
              startNode: initialNodes[0].id,
            },
            explanation: `Updated distance to ${neighbor.id}: ${newDistance} through node ${current}`,
          });
        }
      }
    }
  }

  return steps;
};

export const isValidDijkstraMove = (graphState, nodeId, currentStep) => {
  const steps = generateDijkstraSteps(graphState.nodes, graphState.edges);

  // If this is the first move
  if (!graphState.startNode) {
    const newState = {
      ...graphState,
      nodes: graphState.nodes.map((node) => ({
        ...node,
        distance: node.id === nodeId ? 0 : Infinity,
        current: node.id === nodeId,
      })),
      startNode: nodeId,
      currentNode: nodeId,
    };
    return {
      validMove: true,
      newState,
      nodeStatus: "correct",
      message: `Starting Dijkstra's algorithm from node ${nodeId}`,
    };
  }

  // Get the expected next state from our steps
  const expectedState = steps[currentStep]?.graphState;
  if (!expectedState) return { validMove: false, newState: graphState };

  // Check if the clicked node matches the expected current node
  if (expectedState.currentNode !== nodeId) {
    return {
      validMove: false,
      newState: graphState,
      nodeStatus: "incorrect",
      message:
        "Invalid move! Choose the unvisited node with smallest distance.",
    };
  }

  // Valid move - return the new state from our steps
  return {
    validMove: true,
    newState: expectedState,
    nodeStatus: "correct",
    message: `Visited node ${nodeId} and updated its neighbors`,
  };
};
