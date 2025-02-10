"use client";

import React, { useState, useEffect } from "react";
import GamePageStructure from "@/components/GamePageStructure";
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
} from "@/app/education/network-flow/ford-fulkerson/page";
import { FlowQuestions } from "@/components/FlowQuestions";

const FordFulkersonGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(5);
  const [graphState, setGraphState] = useState(() => {
    const initialGraph = generateRandomGraph(nodeCount, true);
    console.log("Initial graph:", initialGraph);

    const initialPathOptions = findAllPaths(initialGraph.edges, "S", "T")
      .filter((path) => calculateResidualCapacity(path, initialGraph.edges) > 0)
      .slice(0, 3);

    console.log("Initial path options:", initialPathOptions);

    // Initialize flows Map with zero flows for all edges
    const initialFlows = new Map(
      initialGraph.edges.map((e) => [`${e.source}-${e.target}`, 0])
    );

    return {
      ...initialGraph,
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
      isRunning: false,
      gamePhase: "SELECT_PATH",
      pathOptions: initialPathOptions,
      selectedPath: null,
      flowOptions: [],
      selectedFlow: null,
      userAnswers: {},
      correctAnswers: {},
      score: 0,
      feedback: null,
      flows: initialFlows,
    };
  });

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const newNodeCount =
      selectedDifficulty === "easy"
        ? 4
        : selectedDifficulty === "medium"
        ? 5
        : 6;
    setNodeCount(newNodeCount);

    const newGraph = generateRandomGraph(newNodeCount, true);
    const newPathOptions = findAllPaths(newGraph.edges, "S", "T")
      .filter((path) => calculateResidualCapacity(path, newGraph.edges) > 0)
      .slice(0, 3);

    setGraphState({
      ...newGraph,
      currentPath: [],
      maxFlow: 0,
      currentPathIndex: 0,
      gamePhase: "SELECT_PATH",
      pathOptions: newPathOptions,
      flowOptions: [],
      currentEdge: null,
      userAnswers: {},
      correctAnswers: {},
      pathFlow: 0,
      flows: new Map(),
    });
  };

  const isValidMove = (currentState, nodeId) => {
    const { currentPath, edges } = currentState;

    // If starting a new path, must start from source
    if (currentPath.length === 0) {
      return nodeId === "S";
    }

    // If reached sink, path is complete
    if (nodeId === "T") {
      return true;
    }

    const lastNode = currentPath[currentPath.length - 1];
    const edge = edges.find(
      (e) =>
        (e.source === lastNode && e.target === nodeId) ||
        (e.target === lastNode && e.source === nodeId)
    );

    if (!edge) return false;

    // Check if node is already in path (no cycles allowed)
    if (currentPath.includes(nodeId)) return false;

    // Check if there's residual capacity
    const currentFlow = edge.flow || 0;
    const residualCapacity =
      edge.source === lastNode ? edge.capacity - currentFlow : currentFlow;

    return residualCapacity > 0;
  };

  const getNodeStatus = (node) => {
    if (graphState.currentPath.includes(node.id)) {
      return "visited";
    }
    return "unvisited";
  };

  const getScore = (status) => {
    if (status === "path-complete") {
      // Bonus points for finding a valid augmenting path
      return Math.floor(graphState.pathFlow * 5);
    }
    return status === "correct" ? 10 : -5;
  };

  const getMessage = (status, nodeId, state) => {
    if (status === "incorrect") {
      return "Invalid move! Check residual capacity or avoid cycles.";
    }
    if (status === "path-complete") {
      return `Great! Found augmenting path with flow ${state.pathFlow}. Total flow: ${state.maxFlow}`;
    }
    if (nodeId === "S") {
      return "Starting new path from source. Find a path to sink with available capacity!";
    }
    return "Valid move! Continue finding augmenting path to sink.";
  };

  const isGameComplete = (state) => {
    // Game is complete when no more augmenting paths exist
    return !findPath(
      "S",
      "T",
      state.edges,
      new Map(state.edges.map((e) => [`${e.source}-${e.target}`, e.flow || 0]))
    );
  };

  const generatePathOptions = (currentState) => {
    const validPaths = [];
    const allPaths = findAllPaths(currentState.edges, "S", "T");

    // Filter paths with residual capacity and add some incorrect options
    return allPaths
      .filter((path) => calculateResidualCapacity(path, currentState.edges) > 0)
      .slice(0, 3); // Limit to 3 valid options
  };

  const generateFlowOptions = (path, edges, flows) => {
    const correctFlow = calculateBottleneck(path, edges, flows);
    return [
      correctFlow,
      correctFlow + 1,
      Math.max(1, correctFlow - 1),
      Math.floor(correctFlow * 1.5),
    ].sort(() => Math.random() - 0.5);
  };

  const handlePathSelect = (selectedPath) => {
    // Create a flows Map from the current edge flows
    const flows = new Map(
      graphState.edges.map((e) => [`${e.source}-${e.target}`, e.flow || 0])
    );

    const isCorrect = isValidAugmentingPath(
      selectedPath,
      graphState.edges,
      flows
    );
    const correctPath = findOptimalPath(graphState.edges, flows);

    setGraphState((prev) => ({
      ...prev,
      selectedPath,
      gamePhase: "UPDATE_FLOWS",
      flowOptions: generateFlowOptions(selectedPath, prev.edges, flows),
      userAnswers: {
        ...prev.userAnswers,
        pathSelection: selectedPath,
      },
      correctAnswers: {
        ...prev.correctAnswers,
        pathSelection: correctPath,
      },
      flows,
      score: prev.score + (isCorrect ? 10 : -5),
      feedback: isCorrect
        ? "Correct! Now select the flow value."
        : "Incorrect. This path is not optimal.",
    }));
  };

  const handleFlowSelect = (selectedFlow) => {
    const correctFlow = calculateBottleneck(
      graphState.selectedPath,
      graphState.edges
    );
    const isCorrect = selectedFlow === correctFlow;

    if (isCorrect) {
      // Update the graph with new flows
      const newEdges = updateEdgeFlows(
        graphState.edges,
        graphState.selectedPath,
        selectedFlow
      );

      setGraphState((prev) => ({
        ...prev,
        edges: newEdges,
        gamePhase: "SELECT_PATH",
        pathOptions: generatePathOptions({ ...prev, edges: newEdges }),
        maxFlow: prev.maxFlow + selectedFlow,
        score: prev.score + 15,
        feedback: "Correct! Flow updated successfully.",
      }));
    } else {
      setGraphState((prev) => ({
        ...prev,
        score: prev.score - 5,
        feedback: "Incorrect flow value selected.",
      }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <GamePageStructure
        title="Ford-Fulkerson Maximum Flow Game"
        graphState={graphState}
        setGraphState={setGraphState}
        isValidMove={isValidMove}
        getNodeStatus={getNodeStatus}
        getScore={getScore}
        getMessage={getMessage}
        isGameComplete={isGameComplete}
        round={round}
        setRound={setRound}
        totalScore={totalScore}
        setTotalScore={setTotalScore}
        nodeCount={nodeCount}
        difficulty={difficulty}
        onDifficultySelect={handleDifficultySelect}
        initialMessage="Start from source (S) and find augmenting paths to sink (T)!"
        GraphVisualisationComponent={FordFulkersonGraphVisualisation}
        isFordFulkerson={true}
      >
        <div className="absolute bottom-4 left-0 right-0 mx-auto w-full max-w-2xl px-4 z-10">
          <FlowQuestions
            graphState={graphState}
            onPathSelect={handlePathSelect}
            onFlowSelect={handleFlowSelect}
          />
        </div>
      </GamePageStructure>
    </div>
  );
};

// Helper functions
const findAllPaths = (edges, source, sink, path = [], visited = new Set()) => {
  if (source === sink) return [path.concat(sink)];

  visited.add(source);
  let paths = [];

  edges.forEach((edge) => {
    if (edge.source === source && !visited.has(edge.target)) {
      const residualCapacity = edge.capacity - (edge.flow || 0);
      if (residualCapacity > 0) {
        paths = paths.concat(
          findAllPaths(
            edges,
            edge.target,
            sink,
            path.concat(source),
            new Set(visited)
          )
        );
      }
    }
  });

  return paths;
};

const calculateResidualCapacity = (path, edges, flows = new Map()) => {
  let minCapacity = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const edge = edges.find(
      (e) =>
        (e.source === current && e.target === next) ||
        (e.source === next && e.target === current)
    );

    if (!edge) return 0;

    const edgeKey = `${edge.source}-${edge.target}`;
    const reverseKey = `${edge.target}-${edge.source}`;

    let residualCapacity;
    if (edge.source === current) {
      residualCapacity = edge.capacity - (edge.flow || 0);
    } else {
      residualCapacity = edge.flow || 0;
    }

    minCapacity = Math.min(minCapacity, residualCapacity);
  }

  return minCapacity;
};

const isValidAugmentingPath = (path, edges, flows) => {
  // Check if path exists and has residual capacity
  const capacity = calculateResidualCapacity(path, edges, flows);
  return capacity > 0;
};

const findOptimalPath = (edges, flows) => {
  return findPath(
    "S",
    "T",
    edges,
    new Map(edges.map((e) => [`${e.source}-${e.target}`, e.flow || 0]))
  );
};

const updateEdgeFlows = (edges, path, flow) => {
  return edges.map((edge) => {
    for (let i = 0; i < path.length - 1; i++) {
      if (edge.source === path[i] && edge.target === path[i + 1]) {
        return { ...edge, flow: (edge.flow || 0) + flow };
      }
      if (edge.source === path[i + 1] && edge.target === path[i]) {
        return { ...edge, flow: (edge.flow || 0) - flow };
      }
    }
    return edge;
  });
};

export default FordFulkersonGamePage;
