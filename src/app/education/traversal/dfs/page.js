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
      "Visit the first unvisited adjacent node of B, which is D. Push D onto the stack and mark it as visited.",
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
      "Visit the only unvisited adjacent node of D, which is G. Push G onto the stack and mark it as visited.",
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
      "Backtrack to B and visit its unvisited adjacent node E. Push E onto the stack and mark it as visited.",
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
      "Backtrack to A and visit its unvisited adjacent node C. Push C onto the stack and mark it as visited.",
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
      "Visit the only unvisited adjacent node of C, which is F. Push F onto the stack and mark it as visited.",
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
    explanation: "All nodes have been visited. DFS traversal is complete.",
  },
];

const dfsConceptText = `
  DFS Concept: Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. 
  It uses a stack to keep track of nodes to visit and is often implemented recursively.
  
  Key Characteristics:
  - Explores deep into the graph before backtracking
  - Uses a stack (or recursion) to keep track of nodes to visit
  - Marks nodes as visited to avoid cycles
  - Can be used to detect cycles, find paths, and solve puzzles
`;

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
      steps={dfsSteps}
      conceptText={dfsConceptText}
      pseudocode={dfsPseudocode}
    />
  );
}
