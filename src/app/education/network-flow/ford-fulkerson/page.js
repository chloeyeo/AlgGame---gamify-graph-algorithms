"use client";

import React, { useState, useEffect } from "react";
import EducationPageStructure from "@/components/EducationPageStructure";
import { useSelector } from "react-redux";
import {
  isEdgeInPath,
  findPath,
  calculateBottleneck,
  calculateNodeFlows,
  NODE_TYPES,
  EDGE_TYPES,
  getEdgeStyle,
  FordFulkersonGraphVisualisation,
  generateRandomGraph,
  generateSteps,
} from "@/utils/fordFulkersonEducationUtils";

const FordFulkersonEducationPage = () => {
  const generateGraphButtonClickedCounter = useSelector(
    (state) => state.graph.generateGraphCounter
  );
  const [nodeCount, setNodeCount] = useState(5);
  const [graphState, setGraphState] = useState(() => {
    const initialGraph = generateRandomGraph(nodeCount);
    return {
      ...initialGraph,
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
      isRunning: false,
    };
  });

  // Added this function to handle node count changes
  const handleNodeCountChange = (newCount) => {
    setNodeCount(newCount);
    const newGraph = generateRandomGraph(newCount);
    setGraphState({
      ...newGraph,
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
      isRunning: false,
    });
  };

  useEffect(() => {
    const newGraph = generateRandomGraph(nodeCount);
    setGraphState({
      ...newGraph,
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
      isRunning: false,
    });
  }, [nodeCount, generateGraphButtonClickedCounter]);

  const conceptText = {
    introduction: `The Ford-Fulkerson method is a fundamental algorithm for solving the maximum flow problem in a flow network. It works by repeatedly finding augmenting paths from source to sink through any available path-finding strategy. While the basic Ford-Fulkerson method allows for any path-finding approach, a notable improvement called the Edmonds-Karp algorithm specifically uses Breadth-First Search (BFS) to find the shortest augmenting paths.`,
    keyCharacteristics: [
      "Can use any strategy to find augmenting paths (DFS, random, etc.)",
      "Maintains both network and residual graphs",
      "Iteratively increases flow along found paths",
      "Terminates when no augmenting path exists",
      "Runtime varies based on path selection strategy",
      "Edmonds-Karp variation uses BFS for O(VE²) complexity guarantee",
      "Flow Equilibrium: At each node (except source and sink), inflow equals outflow",
    ],
    applications: [
      "Network routing optimization",
      "Bandwidth allocation in telecommunications",
      "Supply chain management",
      "Traffic flow systems",
      "Pipeline distribution networks",
    ],
  };

  const pseudocode = `Initialize residual graph
While path exists from source to sink:
  Find augmenting path
  Find minimum residual capacity
  Update flow along path
Return maximum flow value`;

  const initialSteps = generateSteps(graphState.nodes, graphState.edges);

  return (
    <EducationPageStructure
      title="Ford-Fulkerson Algorithm"
      conceptText={conceptText}
      pseudocode={pseudocode}
      generateSteps={() => initialSteps}
      GraphVisualisationComponent={FordFulkersonGraphVisualisation}
      isFordFulkerson
      nodeCountProp={nodeCount}
      onNodeCountChange={handleNodeCountChange}
    />
  );
};

export default FordFulkersonEducationPage;
