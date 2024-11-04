"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const dijkstraSteps = [
  {
    graphState: {
      nodes: [
        { id: "A", visited: false, distance: 0, recentlyUpdated: false },
        { id: "B", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "C", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "D", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "E", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "F", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "G", visited: false, distance: Infinity, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: null,
    },
    explanation: `Initial state:
• All nodes are white (unvisited)
• Node A is the starting node`,
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0, recentlyUpdated: false },
        { id: "B", visited: false, distance: 4, recentlyUpdated: true },
        { id: "C", visited: false, distance: 2, recentlyUpdated: true },
        { id: "D", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "E", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "F", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "G", visited: false, distance: Infinity, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: "A",
    },
    explanation: `Visit node A (shown in green):
• Identify neighbors of A: B and C
• Distance(B) = Distance(A) + weight(A→B) = 0 + 4 = 4
• Distance(C) = Distance(A) + weight(A→C) = 0 + 2 = 2
• B and C turn pink to show their distances were updated
• A turns blue to show it's been visited
• Node C has smallest distance (2) among unvisited nodes, so it will be processed next`,
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0, recentlyUpdated: false },
        { id: "B", visited: false, distance: 4, recentlyUpdated: false },
        { id: "C", visited: true, distance: 2, recentlyUpdated: false },
        { id: "D", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "E", visited: false, distance: Infinity, recentlyUpdated: false },
        { id: "F", visited: false, distance: 7, recentlyUpdated: true },
        { id: "G", visited: false, distance: Infinity, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: "C",
    },
    explanation: `Visit node C (smallest unvisited distance = 2):
    • Identify neighbors of C: F
    • Distance(F) = Distance(C) + weight(C→F) = 2 + 5 = 7
    • F turns pink to show its distance was updated
    • C turns blue to show it's been visited
    • Node B has smallest distance (4) among unvisited nodes, so it will be processed next`,
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0, recentlyUpdated: false },
        { id: "B", visited: true, distance: 4, recentlyUpdated: false },
        { id: "C", visited: true, distance: 2, recentlyUpdated: false },
        { id: "D", visited: false, distance: 7, recentlyUpdated: true },
        { id: "E", visited: false, distance: 5, recentlyUpdated: true },
        { id: "F", visited: false, distance: 7, recentlyUpdated: false },
        { id: "G", visited: false, distance: Infinity, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: "B",
    },
    explanation: `Visit node B (smallest unvisited distance = 4):
• Identify neighbors of B: D and E
• Distance(D) = Distance(B) + weight(B→D) = 4 + 3 = 7
• Distance(E) = Distance(B) + weight(B→E) = 4 + 1 = 5
• D and E turn pink to show their distances were updated
• B turns blue to show it's been visited
• Node E has smallest distance (5) among unvisited nodes, so it will be processed next`,
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0, recentlyUpdated: false },
        { id: "B", visited: true, distance: 4, recentlyUpdated: false },
        { id: "C", visited: true, distance: 2, recentlyUpdated: false },
        { id: "D", visited: false, distance: 7, recentlyUpdated: false },
        { id: "E", visited: true, distance: 5, recentlyUpdated: false },
        { id: "F", visited: false, distance: 7, recentlyUpdated: false },
        { id: "G", visited: false, distance: 8, recentlyUpdated: true },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: "E",
    },
    explanation: `Visit node E (smallest unvisited distance = 5):
    • Identify neighbors of E: G
    • Distance(G) = Distance(E) + weight(E→G) = 5 + 3 = 8
    • G turns pink to show its distance was updated
    • E turns blue to show it's been visited
    • Nodes D and F are tied for smallest distance (7) among unvisited nodes, we'll process F next`,
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0, recentlyUpdated: false },
        { id: "B", visited: true, distance: 4, recentlyUpdated: false },
        { id: "C", visited: true, distance: 2, recentlyUpdated: false },
        { id: "D", visited: false, distance: 7, recentlyUpdated: false },
        { id: "E", visited: true, distance: 5, recentlyUpdated: false },
        { id: "F", visited: true, distance: 7, recentlyUpdated: false },
        { id: "G", visited: false, distance: 8, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: "F",
    },
    explanation: `Visit node F (one of two smallest unvisited distances = 7):
• Identify neighbors of F: G
• Distance(G) = Distance(F) + weight(F→G) = 7 + 1 = 8
• No update to G as new distance (8) is not shorter than current distance (8)
• F turns blue to show it's been visited
• Node D has smallest distance (7) among unvisited nodes, so it will be processed next`,
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0, recentlyUpdated: false },
        { id: "B", visited: true, distance: 4, recentlyUpdated: false },
        { id: "C", visited: true, distance: 2, recentlyUpdated: false },
        { id: "D", visited: true, distance: 7, recentlyUpdated: false },
        { id: "E", visited: true, distance: 5, recentlyUpdated: false },
        { id: "F", visited: true, distance: 7, recentlyUpdated: false },
        { id: "G", visited: false, distance: 8, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: "D",
    },
    explanation: `Visit node D (smallest unvisited distance = 7):
    • Identify neighbors of D: G
    • Distance(G) = Distance(D) + weight(D→G) = 7 + 2 = 9
    • No update to G as new distance (9) is longer than current distance (8)
    • D turns blue to show it's been visited
    • Only G remains unvisited, so it will be processed last`,
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0, recentlyUpdated: false },
        { id: "B", visited: true, distance: 4, recentlyUpdated: false },
        { id: "C", visited: true, distance: 2, recentlyUpdated: false },
        { id: "D", visited: true, distance: 7, recentlyUpdated: false },
        { id: "E", visited: true, distance: 5, recentlyUpdated: false },
        { id: "F", visited: true, distance: 7, recentlyUpdated: false },
        { id: "G", visited: true, distance: 8, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 2 },
        { source: "B", target: "D", weight: 3 },
        { source: "B", target: "E", weight: 1 },
        { source: "C", target: "F", weight: 5 },
        { source: "D", target: "G", weight: 2 },
        { source: "E", target: "G", weight: 3 },
        { source: "F", target: "G", weight: 1 },
      ],
      currentNode: "G",
    },
    explanation: `Algorithm Complete!

    • Final distances are from starting node A to all other nodes
    • These distances represent the shortest possible paths from node A to each node in the graph
    • All nodes have been visited (shown in blue)`,
  },
];

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
                previous[v] := current
                
    return distance[], previous[]`;

export default function DijkstraEducationPage() {
  return (
    <EducationPageStructure
      title="Dijkstra's Algorithm Visualization"
      steps={dijkstraSteps}
      conceptText={dijkstraConceptText}
      pseudocode={dijkstraPseudocode}
    />
  );
}
