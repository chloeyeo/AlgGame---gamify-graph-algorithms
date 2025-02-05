"use client";

import EducationPageStructure from "@/components/EducationPageStructure";
import { isValidBFSMove, generateBFSSteps } from "@/utils/graphAlgorithms";

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

export default function BFSEducationPage() {
  return (
    <EducationPageStructure
      title="Breadth-First Search (BFS)"
      conceptText={bfsConceptText}
      pseudocode={bfsPseudocode}
      generateSteps={generateBFSSteps}
      isValidMove={isValidBFSMove}
    />
  );
}
