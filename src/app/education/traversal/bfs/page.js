"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const bfsSteps = [
  {
    graphState: {
      nodes: [
        { id: "A", visited: false },
        { id: "B", visited: false },
        { id: "C", visited: false },
        { id: "D", visited: false },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: null,
    },
    explanation: "Initial state: No nodes have been visited yet.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: false },
        { id: "C", visited: false },
        { id: "D", visited: false },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "A",
    },
    explanation: "Start BFS from node A. Mark A as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: false },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "B",
    },
    explanation:
      "Visit the first unvisited adjacent node B. Mark B as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: false },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "C",
    },
    explanation: "Visit the next unvisited adjacent node C. Mark C as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "D",
    },
    explanation:
      "Visit the first unvisited adjacent node of B, which is D. Mark D as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "E",
    },
    explanation:
      "Visit the next unvisited adjacent node of B, which is E. Mark E as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
        { id: "F", visited: true },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "F",
    },
    explanation:
      "Visit the first unvisited adjacent node of C, which is F. Mark F as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
        { id: "F", visited: true },
        { id: "G", visited: true },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: null,
    },
    explanation: "All nodes have been visited. BFS traversal is complete.",
  },
];

const bfsConceptText = {
  introduction:
    "Breadth-First Search (BFS) is a graph traversal algorithm that explores all the neighbors of a node before moving to the next level of nodes. It uses a queue to keep track of nodes to visit and is often implemented iteratively.",
  keyCharacteristics: [
    "Explores all neighboring nodes before moving on to the next level",
    "Uses a queue to keep track of nodes to visit",
    "Marks nodes as visited to avoid cycles",
    "Can be used to find the shortest path in unweighted graphs",
  ],
  applications: [
    "Shortest path finding in unweighted graphs",
    "Web crawling",
    "Social networking features (e.g., finding all friends within N connections)",
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

export default function BFSEducationPage() {
  return (
    <EducationPageStructure
      title="Breadth-First Search (BFS)"
      graphStates={[bfsSteps]}
      conceptText={bfsConceptText}
      pseudocode={bfsPseudocode}
    />
  );
}
