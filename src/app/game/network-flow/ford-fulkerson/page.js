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

  const generateFlowOptions = (path, edges) => {
    const correctFlow = calculateBottleneck(path, edges);
    return [
      correctFlow,
      correctFlow + 1,
      Math.max(1, correctFlow - 1),
      Math.floor(correctFlow * 1.5),
    ].sort(() => Math.random() - 0.5);
  };

  const handlePathSelect = (selectedPath) => {
    const isCorrect = isValidAugmentingPath(selectedPath, graphState.edges);

    setGraphState((prev) => ({
      ...prev,
      selectedPath,
      gamePhase: "UPDATE_FLOWS",
      flowOptions: generateFlowOptions(selectedPath, prev.edges),
      userAnswers: {
        ...prev.userAnswers,
        pathSelection: selectedPath,
      },
      correctAnswers: {
        ...prev.correctAnswers,
        pathSelection: findOptimalPath(prev.edges),
      },
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
        <div className="flex flex-col space-y-4 w-full max-w-md mx-auto mt-4">
          <FlowQuestions
            graphState={graphState}
            onPathSelect={handlePathSelect}
            onFlowSelect={handleFlowSelect}
          />
          {graphState.feedback && (
            <div className="mt-4 p-3 rounded bg-blue-50 text-blue-800">
              {graphState.feedback}
            </div>
          )}
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

const calculateResidualCapacity = (path, edges) => {
  let minCapacity = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const edge = edges.find(
      (e) =>
        (e.source === current && e.target === next) ||
        (e.source === next && e.target === current)
    );

    if (edge) {
      if (edge.source === current) {
        minCapacity = Math.min(minCapacity, edge.capacity - (edge.flow || 0));
      } else {
        minCapacity = Math.min(minCapacity, edge.flow || 0);
      }
    }
  }

  return minCapacity;
};

const isValidAugmentingPath = (path, edges) => {
  if (!path || path.length < 2) return false;

  for (let i = 0; i < path.length - 1; i++) {
    const edge = edges.find(
      (e) =>
        (e.source === path[i] && e.target === path[i + 1]) ||
        (e.source === path[i + 1] && e.target === path[i])
    );

    if (!edge) return false;

    const residualCapacity =
      edge.source === path[i]
        ? edge.capacity - (edge.flow || 0)
        : edge.flow || 0;

    if (residualCapacity <= 0) return false;
  }

  return true;
};

const findOptimalPath = (edges) => {
  return findPath("S", "T", edges);
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
