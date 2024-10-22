"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const hungarianSteps = [
  {
    graphState: {
      nodes: [
        { id: "W1" },
        { id: "W2" },
        { id: "W3" },
        { id: "J1" },
        { id: "J2" },
        { id: "J3" },
      ],
      edges: [
        { source: "W1", target: "J1", weight: 2 },
        { source: "W1", target: "J2", weight: 3 },
        { source: "W1", target: "J3", weight: 3 },
        { source: "W2", target: "J1", weight: 3 },
        { source: "W2", target: "J2", weight: 2 },
        { source: "W2", target: "J3", weight: 3 },
        { source: "W3", target: "J1", weight: 3 },
        { source: "W3", target: "J2", weight: 3 },
        { source: "W3", target: "J3", weight: 2 },
      ],
      mstEdges: [],
    },
    explanation:
      "Initial cost matrix showing the assignment costs between workers (W1-W3) and jobs (J1-J3).",
  },
  {
    graphState: {
      nodes: [
        { id: "W1", visited: true },
        { id: "W2", visited: true },
        { id: "W3", visited: true },
        { id: "J1" },
        { id: "J2" },
        { id: "J3" },
      ],
      edges: [
        { source: "W1", target: "J1", weight: 0 },
        { source: "W1", target: "J2", weight: 1 },
        { source: "W1", target: "J3", weight: 1 },
        { source: "W2", target: "J1", weight: 1 },
        { source: "W2", target: "J2", weight: 0 },
        { source: "W2", target: "J3", weight: 1 },
        { source: "W3", target: "J1", weight: 1 },
        { source: "W3", target: "J2", weight: 1 },
        { source: "W3", target: "J3", weight: 0 },
      ],
      mstEdges: [],
    },
    explanation:
      "Row reduction: Subtract minimum value in each row from all elements in that row.",
  },
  // Additional steps...
];

const hungarianConceptText = {
  introduction:
    "The Hungarian algorithm (Munkres algorithm) is used to solve the assignment problem, finding the optimal way to assign n workers to n jobs while minimizing total cost.",
  keyCharacteristics: [
    "Solves assignment problems in polynomial time O(n³)",
    "Uses matrix reduction and augmenting path techniques",
    "Guarantees optimal solution for assignment problems",
    "Works with both maximization and minimization objectives",
  ],
  applications: [
    "Job scheduling and task assignment",
    "Resource allocation in computing systems",
    "Personnel assignment in organizations",
    "Pattern matching in computer vision",
  ],
};

const hungarianPseudocode = `function Hungarian(cost_matrix):
    Step 1: Subtract row minima
    for each row in matrix:
        subtract minimum element from each element

    Step 2: Subtract column minima
    for each column in matrix:
        subtract minimum element from each element

    Step 3: Cover all zeros with minimum lines
    while lines < n:
        draw minimum lines to cover all zeros
        if lines < n:
            find smallest uncovered element
            subtract it from uncovered elements
            add it to elements covered twice

    Step 4: Find optimal assignment
    return optimal_assignment`;

export default function HungarianEducationPage() {
  return (
    <EducationPageStructure
      title="Hungarian Algorithm"
      steps={hungarianSteps}
      conceptText={hungarianConceptText}
      pseudocode={hungarianPseudocode}
    />
  );
}
