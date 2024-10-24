"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const astarSteps = [
  {
    graphState: {
      nodes: [
        { id: "A", visited: false, f: 7, g: 0, h: 7, recentlyUpdated: false },
        {
          id: "B",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 9,
          recentlyUpdated: false,
        },
        {
          id: "C",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 9,
          recentlyUpdated: false,
        },
        {
          id: "D",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 11,
          recentlyUpdated: false,
        },
        {
          id: "E",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 9,
          recentlyUpdated: false,
        },
        {
          id: "F",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 7,
          recentlyUpdated: false,
        },
        {
          id: "G",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 0,
          recentlyUpdated: false,
        },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      currentNode: null,
    },
    explanation:
      "Initial state: Set f(A) = g(A) + h(A) = 0 + 7 = 7 for start node A. All other nodes have f, g set to Infinity. h values are pre-calculated heuristics.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, f: 7, g: 0, h: 7, recentlyUpdated: false },
        { id: "B", visited: false, f: 13, g: 4, h: 9, recentlyUpdated: true },
        { id: "C", visited: false, f: 12, g: 3, h: 9, recentlyUpdated: true },
        {
          id: "D",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 11,
          recentlyUpdated: false,
        },
        {
          id: "E",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 9,
          recentlyUpdated: false,
        },
        {
          id: "F",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 7,
          recentlyUpdated: false,
        },
        {
          id: "G",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 0,
          recentlyUpdated: false,
        },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      currentNode: "A",
    },
    explanation:
      "Visit node A. Calculate f(B) = g(B) + h(B) = 4 + 9 = 13 and f(C) = g(C) + h(C) = 3 + 9 = 12. Choose C as next node (lowest f-value).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, f: 7, g: 0, h: 7, recentlyUpdated: false },
        { id: "B", visited: false, f: 13, g: 4, h: 9, recentlyUpdated: false },
        { id: "C", visited: true, f: 12, g: 3, h: 9, recentlyUpdated: false },
        {
          id: "D",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 11,
          recentlyUpdated: false,
        },
        {
          id: "E",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 9,
          recentlyUpdated: false,
        },
        { id: "F", visited: false, f: 14, g: 7, h: 7, recentlyUpdated: true },
        {
          id: "G",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 0,
          recentlyUpdated: false,
        },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      currentNode: "C",
    },
    explanation:
      "Visit node C. Calculate f(F) = g(F) + h(F) = 7 + 7 = 14. Choose B as next node (lowest f-value among unvisited).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, f: 7, g: 0, h: 7, recentlyUpdated: false },
        { id: "B", visited: true, f: 13, g: 4, h: 9, recentlyUpdated: false },
        { id: "C", visited: true, f: 12, g: 3, h: 9, recentlyUpdated: false },
        { id: "D", visited: false, f: 20, g: 9, h: 11, recentlyUpdated: true },
        { id: "E", visited: false, f: 15, g: 6, h: 9, recentlyUpdated: true },
        { id: "F", visited: false, f: 14, g: 7, h: 7, recentlyUpdated: false },
        {
          id: "G",
          visited: false,
          f: Infinity,
          g: Infinity,
          h: 0,
          recentlyUpdated: false,
        },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      currentNode: "B",
    },
    explanation:
      "Visit node B. Calculate f(D) = g(D) + h(D) = 9 + 11 = 20 and f(E) = g(E) + h(E) = 6 + 9 = 15. Choose F as next node (lowest f-value among unvisited).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, f: 7, g: 0, h: 7, recentlyUpdated: false },
        { id: "B", visited: true, f: 13, g: 4, h: 9, recentlyUpdated: false },
        { id: "C", visited: true, f: 12, g: 3, h: 9, recentlyUpdated: false },
        { id: "D", visited: false, f: 20, g: 9, h: 11, recentlyUpdated: false },
        { id: "E", visited: false, f: 15, g: 6, h: 9, recentlyUpdated: false },
        { id: "F", visited: true, f: 14, g: 7, h: 7, recentlyUpdated: false },
        { id: "G", visited: false, f: 16, g: 9, h: 0, recentlyUpdated: true },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      currentNode: "F",
    },
    explanation:
      "Visit node F. Calculate f(G) = g(G) + h(G) = 9 + 0 = 9. Choose E as next node (lowest f-value among unvisited).",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, f: 7, g: 0, h: 7, recentlyUpdated: false },
        { id: "B", visited: true, f: 13, g: 4, h: 9, recentlyUpdated: false },
        { id: "C", visited: true, f: 12, g: 3, h: 9, recentlyUpdated: false },
        { id: "D", visited: false, f: 20, g: 9, h: 11, recentlyUpdated: false },
        { id: "E", visited: true, f: 15, g: 6, h: 9, recentlyUpdated: false },
        { id: "F", visited: true, f: 14, g: 7, h: 7, recentlyUpdated: false },
        { id: "G", visited: false, f: 16, g: 9, h: 0, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      currentNode: "E",
    },
    explanation:
      "Visit node E. The path through E to G (A -> B -> E -> G) has a total cost of 10, which is higher than the current best path to G through F. No update needed.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, f: 7, g: 0, h: 7, recentlyUpdated: false },
        { id: "B", visited: true, f: 13, g: 4, h: 9, recentlyUpdated: false },
        { id: "C", visited: true, f: 12, g: 3, h: 9, recentlyUpdated: false },
        { id: "D", visited: false, f: 20, g: 9, h: 11, recentlyUpdated: false },
        { id: "E", visited: true, f: 15, g: 6, h: 9, recentlyUpdated: false },
        { id: "F", visited: true, f: 14, g: 7, h: 7, recentlyUpdated: false },
        { id: "G", visited: true, f: 16, g: 9, h: 0, recentlyUpdated: false },
      ],
      edges: [
        { source: "A", target: "B", weight: 4 },
        { source: "A", target: "C", weight: 3 },
        { source: "B", target: "D", weight: 5 },
        { source: "B", target: "E", weight: 2 },
        { source: "C", target: "F", weight: 4 },
        { source: "D", target: "G", weight: 3 },
        { source: "E", target: "G", weight: 4 },
        { source: "F", target: "G", weight: 2 },
      ],
      currentNode: "G",
    },
    explanation:
      "Visit node G (goal). A* algorithm is complete. The shortest path is A -> C -> F -> G with a total cost of 9 (3+4+2 = 9). Node D was not visited because the goal was reached via a more optimal path before D needed to be explored.",
  },
];

const astarConceptText = {
  introduction:
    "A* (A-star) is a graph traversal and path search algorithm that combines features of uniform-cost search and pure heuristic search to efficiently find the optimal path between a start node and a goal node in a weighted graph.",
  keyCharacteristics: [
    "Uses a best-first search approach",
    "Employs both the actual cost from the start (g(n)) and a heuristic estimate to the goal (h(n))",
    "Evaluates nodes based on f(n) = g(n) + h(n)",
    "Guarantees the optimal path if the heuristic is admissible and consistent",
    "More efficient than Dijkstra's algorithm in many cases due to heuristic guidance",
  ],
  applications: [
    "Pathfinding in video games and robotics",
    "Route planning in GPS navigation systems",
    "Solving puzzles and problems in artificial intelligence",
    "Logistics and supply chain optimization",
  ],
};

const astarPseudocode = `function A_Star(start, goal, h):
    openSet := {start}
    cameFrom := an empty map
    gScore := map with default value of Infinity
    gScore[start] := 0
    fScore := map with default value of Infinity
    fScore[start] := h(start)

    while openSet is not empty:
        current := node in openSet with the lowest fScore value
        if current = goal:
            return reconstruct_path(cameFrom, current)

        openSet.Remove(current)
        for each neighbor of current:
            tentative_gScore := gScore[current] + d(current, neighbor)
            if tentative_gScore < gScore[neighbor]:
                cameFrom[neighbor] := current
                gScore[neighbor] := tentative_gScore
                fScore[neighbor] := gScore[neighbor] + h(neighbor)
                if neighbor not in openSet:
                    openSet.Add(neighbor)

    return failure

function reconstruct_path(cameFrom, current):
    total_path := [current]
    while current in cameFrom.Keys:
        current := cameFrom[current]
        total_path.prepend(current)
    return total_path`;

export default function AStarEducationPage() {
  return (
    <EducationPageStructure
      title="A* Algorithm"
      steps={astarSteps}
      conceptText={astarConceptText}
      pseudocode={astarPseudocode}
    />
  );
}
