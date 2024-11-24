"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const dfsSteps = [
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
    explanation:
      "Start DFS from node A. Push A onto the stack and mark it as visited.",
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
      "Visit the first unvisited adjacent node B. Push B onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
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
      "Visit node D (first unvisited neighbor of B). Push D onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true },
        { id: "E", visited: false },
        { id: "F", visited: false },
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
      currentNode: "G",
    },
    explanation:
      "Visit node G (only unvisited neighbor of D). Push G onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
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
    explanation: "G has no unvisited neighbors. Backtrack to D.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
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
    explanation: "D has no more unvisited neighbors. Backtrack to B.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
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
      "Visit node E (remaining unvisited neighbor of B). Push E onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
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
    explanation: "E has no unvisited neighbors. Backtrack to B.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: false },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
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
    explanation: "B has no more unvisited neighbors. Backtrack to A.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
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
    explanation:
      "Visit node C (remaining unvisited neighbor of A). Push C onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: true },
        { id: "G", visited: true, backtracked: true },
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
      "Visit node F (only unvisited neighbor of C). Push F onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: true, backtracked: true },
        { id: "G", visited: true, backtracked: true },
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
    explanation: "F has no unvisited neighbors. Backtrack to C.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true, backtracked: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: true, backtracked: true },
        { id: "G", visited: true, backtracked: true },
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
    explanation: "C has no more unvisited neighbors. Backtrack to A.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, backtracked: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true, backtracked: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: true, backtracked: true },
        { id: "G", visited: true, backtracked: true },
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
    explanation:
      "A has no more unvisited neighbors. DFS traversal is complete. All nodes have been visited and backtracked.",
  },
];

const dfsConceptText = {
  introduction:
    "Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack to keep track of nodes to visit and is often implemented recursively.",
  keyCharacteristics: [
    "Explores deep into the graph before backtracking",
    "Uses a stack (or recursion) to keep track of nodes to visit",
    "Marks nodes as visited to avoid cycles",
    "Can be used to detect cycles, find paths, and solve puzzles",
  ],
  applications: [
    "Topological sorting",
    "Finding connected components in a graph",
    "Maze generation and solving",
    "Detecting cycles in a graph",
  ],
};

const dfsPseudocode = `DFS(graph, start_node):
    Stack = [start_node]
    Visited = set()

    while Stack is not empty:
        node = Stack.pop()
        if node not in Visited:
            Visited.add(node)
            process(node)
            for neighbor in graph[node]:
                if neighbor not in Visited:
                    Stack.push(neighbor)`;

export default function DFSEducationPage() {
  return (
    <EducationPageStructure
      title="Depth-First Search (DFS)"
      graphStates={[dfsSteps]}
      conceptText={dfsConceptText}
      pseudocode={dfsPseudocode}
    />
  );
}
