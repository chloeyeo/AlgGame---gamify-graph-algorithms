"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const fordFulkersonSteps = [
  {
    graphState: {
      nodes: [{ id: "S" }, { id: "A" }, { id: "B" }, { id: "C" }, { id: "T" }],
      edges: [
        { source: "S", target: "A", weight: 16 },
        { source: "S", target: "C", weight: 13 },
        { source: "A", target: "B", weight: 12 },
        { source: "B", target: "T", weight: 20 },
        { source: "C", target: "A", weight: 4 },
        { source: "C", target: "T", weight: 14 },
      ],
      mstEdges: [],
    },
    explanation:
      "Initial flow network with capacities shown on edges. No flow yet.",
  },
  // Additional steps showing augmenting paths...
];

const fordFulkersonConceptText = {
  introduction:
    "The Ford-Fulkerson algorithm finds the maximum flow in a flow network using the concept of augmenting paths.",
  keyCharacteristics: [
    "Iteratively finds augmenting paths",
    "Maintains a residual graph",
    "Time complexity depends on path finding method",
    "Works with integer capacities",
  ],
  applications: [
    "Transportation networks",
    "Communication networks",
    "Supply chain optimization",
    "Maximum bipartite matching",
  ],
};

const fordFulkersonPseudocode = `function FordFulkerson(graph, source, sink):
    for each edge (u,v) in graph:
        flow[u][v] = 0
        flow[v][u] = 0
    
    while exists path p from source to sink:
        cf = min(cf(e) for e in p)
        for each edge (u,v) in p:
            flow[u][v] += cf
            flow[v][u] -= cf
            
    return sum(flow[source][v] for v in graph)`;

export default function FordFulkersonEducationPage() {
  return (
    <EducationPageStructure
      title="Ford-Fulkerson Algorithm"
      steps={fordFulkersonSteps}
      conceptText={fordFulkersonConceptText}
      pseudocode={fordFulkersonPseudocode}
    />
  );
}
