"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const dijkstraConceptText = {
  introduction: `Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. The algorithm works by maintaining distances to each node and always processing the unvisited node with the smallest current distance.

The visualization uses the following color coding:
• Green: Currently being processed node
• Blue: Already visited/processed node
• Pink: Node whose distance was just updated
• White: Unvisited node
• Numbers inside nodes: Current shortest distance from start node
• Numbers on edges: Edge weights`,
  keyCharacteristics: [
    "Maintains a running total of shortest distances from the start node to each node",
    "Always selects the unvisited node with the smallest current distance",
    "Updates neighbor distances only if a new shorter path is found through the current node",
    "Guarantees shortest paths in graphs with non-negative weights",
    "Processes each node exactly once",
  ],
  applications: [
    "GPS and navigation systems for finding optimal routes",
    "Network routing protocols for data packet transmission",
    "Social networks for finding shortest connection between users",
    "Games for pathfinding and AI movement",
    "Supply chain optimization for delivery routes",
  ],
};

const dijkstraPseudocode = `function DijkstraShortestPath(Graph, source):
    // Initialize distances
    for each vertex v in Graph:
        distance[v] := infinity
        previous[v] := undefined
        add v to unvisited
    distance[source] := 0

    while unvisited is not empty:
        // Select unvisited node with minimum distance
        current := node in unvisited with minimum distance
        
        if distance[current] = infinity:
            break // All remaining vertices are inaccessible
            
        remove current from unvisited
        
        for each neighbor v of current:
            // Calculate potential new distance
            newDistance := distance[current] + weight(current, v)
            
            // Update if new path is shorter
            if newDistance < distance[v]:
                distance[v] := newDistance
                previous[v] := current`;

const generateDijkstraSteps = (initialNodes, edges) => {
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
      })),
      edges,
      currentNode: null,
    },
    explanation:
      "Initial state: All nodes have infinite distance except the start node",
    pseudoCodeLines: [2, 3, 4, 5, 6],
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

    // Mark current node as visited
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
      },
      explanation: `Processing node ${current} (current shortest distance: ${distances.get(
        current
      )})`,
      pseudoCodeLines: [8, 9, 12],
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
            },
            explanation: `Updated distance to ${neighbor.id}: ${newDistance} through node ${current}`,
            pseudoCodeLines: [15, 16, 17, 18],
          });
        }
      }
    }
  }

  return steps;
};

export default function DijkstraEducationPage() {
  return (
    <EducationPageStructure
      title="Dijkstra's Algorithm"
      conceptText={dijkstraConceptText}
      pseudocode={dijkstraPseudocode}
      generateSteps={generateDijkstraSteps}
    />
  );
}
