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
  const startNode = state.visitedNodes[0]; // The first node visited (B in this case)

  // Get all direct unvisited neighbors of the start node first
  const directNeighborsOfStart = new Set(
    state.edges
      .filter((edge) => edge.source === startNode || edge.target === startNode)
      .map((edge) => (edge.source === startNode ? edge.target : edge.source))
      .filter((neighborId) => !visited.has(neighborId))
  );

  // If there are still unvisited direct neighbors of the start node, they must be visited first
  if (directNeighborsOfStart.size > 0) {
    return directNeighborsOfStart;
  }

  // If all direct neighbors of start are visited, get the next level
  const nextLevelNodes = new Set();
  const currentLevelNodes = state.visitedNodes.filter(
    (nodeId) => nodeId !== startNode
  );

  currentLevelNodes.forEach((nodeId) => {
    const neighbors = state.edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source))
      .filter(
        (neighborId) =>
          !visited.has(neighborId) && state.queue.includes(neighborId)
      );

    neighbors.forEach((neighborId) => nextLevelNodes.add(neighborId));
  });

  return nextLevelNodes;
};
