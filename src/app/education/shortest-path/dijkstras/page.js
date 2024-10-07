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
  introduction:
    "Dijkstra's algorithm is a graph traversal algorithm used to find the shortest path between a starting node and all other nodes in a weighted graph with non-negative edge weights.",
  keyCharacteristics: [
    "Maintains a set of unvisited nodes and their tentative distances from the start",
    "Always selects the unvisited node with the smallest tentative distance",
    "Updates the tentative distances of neighboring nodes",
    "Marks visited nodes to avoid revisiting",
  ],
  applications: [
    "GPS and mapping systems for finding shortest routes",
    "Network routing protocols",
    "Flight scheduling",
    "Robotics path planning",
  ],
};

const dijkstraPseudocode = `function Dijkstra(Graph, source):
    for each vertex v in Graph:
        dist[v] := infinity
        prev[v] := undefined
        add v to Q
    dist[source] := 0
    
    while Q is not empty:
        u := vertex in Q with min dist[u]
        remove u from Q
        
        for each neighbor v of u:
            alt := dist[u] + length(u, v)
            if alt < dist[v]:
                dist[v] := alt
                prev[v] := u
    
    return dist[], prev[]`;

export default function DijkstraEducationPage() {
  return (
    <EducationPageStructure
      title="Dijkstra's Algorithm"
      steps={dijkstraSteps}
      conceptText={dijkstraConceptText}
      pseudocode={dijkstraPseudocode}
    />
  );
}
