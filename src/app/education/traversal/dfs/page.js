"use client";

import EducationPageStructure from "@/components/EducationPageStructure";
import { generateDFSSteps, isValidDFSMove } from "@/utils/graphAlgorithms";

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
      conceptText={dfsConceptText}
      pseudocode={dfsPseudocode}
      generateSteps={generateDFSSteps}
      isValidMove={isValidDFSMove}
    />
  );
}
