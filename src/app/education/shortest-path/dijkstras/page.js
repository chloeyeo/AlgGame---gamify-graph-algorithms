"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const dijkstraSteps = [
  {
    graphState: {
      nodes: [
        { id: "A", visited: false, distance: 0 },
        { id: "B", visited: false, distance: Infinity },
        { id: "C", visited: false, distance: Infinity },
        { id: "D", visited: false, distance: Infinity },
        { id: "E", visited: false, distance: Infinity },
        { id: "F", visited: false, distance: Infinity },
        { id: "G", visited: false, distance: Infinity },
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
    explanation:
      "Initial state: Set distance to start node (A) as 0 and all others as infinity.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0 },
        { id: "B", visited: false, distance: 4 },
        { id: "C", visited: false, distance: 2 },
        { id: "D", visited: false, distance: Infinity },
        { id: "E", visited: false, distance: Infinity },
        { id: "F", visited: false, distance: Infinity },
        { id: "G", visited: false, distance: Infinity },
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
    explanation:
      "Visit node A. Update distances to its neighbors B (4) and C (2).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0 },
        { id: "B", visited: false, distance: 4 },
        { id: "C", visited: true, distance: 2 },
        { id: "D", visited: false, distance: Infinity },
        { id: "E", visited: false, distance: Infinity },
        { id: "F", visited: false, distance: 7 },
        { id: "G", visited: false, distance: Infinity },
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
    explanation:
      "Visit node C (shortest unvisited). Update distance to F (2 + 5 = 7).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0 },
        { id: "B", visited: true, distance: 4 },
        { id: "C", visited: true, distance: 2 },
        { id: "D", visited: false, distance: 7 },
        { id: "E", visited: false, distance: 5 },
        { id: "F", visited: false, distance: 7 },
        { id: "G", visited: false, distance: Infinity },
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
    explanation:
      "Visit node B. Update distances to D (4 + 3 = 7) and E (4 + 1 = 5).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0 },
        { id: "B", visited: true, distance: 4 },
        { id: "C", visited: true, distance: 2 },
        { id: "D", visited: false, distance: 7 },
        { id: "E", visited: true, distance: 5 },
        { id: "F", visited: false, distance: 7 },
        { id: "G", visited: false, distance: 8 },
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
    explanation: "Visit node E. Update distance to G (5 + 3 = 8).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0 },
        { id: "B", visited: true, distance: 4 },
        { id: "C", visited: true, distance: 2 },
        { id: "D", visited: false, distance: 7 },
        { id: "E", visited: true, distance: 5 },
        { id: "F", visited: true, distance: 7 },
        { id: "G", visited: false, distance: 8 },
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
    explanation:
      "Visit node F. Update distance to G (7 + 1 = 8, no change as it's not shorter).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0 },
        { id: "B", visited: true, distance: 4 },
        { id: "C", visited: true, distance: 2 },
        { id: "D", visited: true, distance: 7 },
        { id: "E", visited: true, distance: 5 },
        { id: "F", visited: true, distance: 7 },
        { id: "G", visited: false, distance: 8 },
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
    explanation:
      "Visit node D. Cannot update G as current path (9) is longer than existing (8).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, distance: 0 },
        { id: "B", visited: true, distance: 4 },
        { id: "C", visited: true, distance: 2 },
        { id: "D", visited: true, distance: 7 },
        { id: "E", visited: true, distance: 5 },
        { id: "F", visited: true, distance: 7 },
        { id: "G", visited: true, distance: 8 },
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
    explanation:
      "Visit node G. All nodes visited. Dijkstra's algorithm is complete.",
  },
];

const dijkstraConceptText = {
  introduction: `Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. It works by maintaining a set of distances to each node and continuously updating them as shorter paths are found. The algorithm guarantees the shortest path in graphs where all edge weights are non-negative.`,
  keyCharacteristics: [
    "Always selects the unvisited node with the smallest current distance (NOT first-in-first-out)",
    "Updates neighbor distances only if a shorter path is found through the current node",
    "Guarantees shortest path in graphs with non-negative weights",
    "Processes each node exactly once",
    "Maintains a running tally of the total distance to each node",
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
