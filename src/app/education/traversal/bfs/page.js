"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const bfsConceptText = {
  introduction:
    "Breadth-First Search (BFS) is a graph traversal algorithm that explores all the neighbors of a node before moving to the next level of nodes.",
  keyCharacteristics: [
    "Explores all neighboring nodes before moving on to the next level",
    "Uses a queue to keep track of nodes to visit",
    "Marks nodes as visited to avoid cycles",
    "Can be used to find the shortest path in unweighted graphs",
  ],
  applications: [
    "Shortest path finding in unweighted graphs",
    "Web crawling",
    "Social networking features",
    "GPS navigation systems",
  ],
};

const bfsPseudocode = `BFS(graph, start_node):
    Queue = [start_node]
    Visited = set()

    while Queue is not empty:
        node = Queue.dequeue()
        if node not in Visited:
            Visited.add(node)
            process(node)
            for neighbor in graph[node]:
                if neighbor not in Visited:
                    Queue.enqueue(neighbor)`;

const generateBFSSteps = (initialNodes, edges) => {
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

export default function BFSEducationPage() {
  return (
    <EducationPageStructure
      title="Breadth-First Search (BFS)"
      conceptText={bfsConceptText}
      pseudocode={bfsPseudocode}
      generateSteps={generateBFSSteps}
    />
  );
}
