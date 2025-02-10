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
      isComplete: false,
      currentEdgeIndex: 0,
      edgeFlowOptions: [],
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
      isComplete: false,
      currentEdgeIndex: 0,
      edgeFlowOptions: [],
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
    const updatedEdges = graphState.edges.map((edge) => ({
      ...edge,
      state: isEdgeInPath(edge, selectedPath) ? "current path" : undefined,
      isHighlighted: false,
    }));

    const flows = new Map(
      graphState.edges.map((e) => [`${e.source}-${e.target}`, e.flow || 0])
    );

    const bottleneck = calculateBottleneck(
      selectedPath,
      graphState.edges,
      flows
    );
    const flowOptions = generateFlowOptions(bottleneck);

    setGraphState((prev) => ({
      ...prev,
      selectedPath,
      edges: updatedEdges,
      gamePhase: "UPDATE_FLOWS",
      flowOptions,
      feedback: null,
    }));
  };

  const handleFlowSelect = (selectedFlow) => {
    const bottleneck = calculateBottleneck(
      graphState.selectedPath,
      graphState.edges
    );

    if (selectedFlow === bottleneck) {
      setGraphState((prev) => ({
        ...prev,
        selectedFlow,
        gamePhase: "UPDATE_EDGE_FLOWS",
        edgeFlowOptions: generateEdgeFlowOptions(selectedFlow),
        currentEdgeIndex: 0,
        feedback: "Correct! Now update each edge's flow.",
      }));
    } else {
      setGraphState((prev) => ({
        ...prev,
        feedback: "Incorrect flow value selected.",
      }));
    }
  };

  const handleEdgeFlowSelect = (selectedEdgeFlow) => {
    const currentEdge = getCurrentEdgeFromPath();
    const correctFlow = calculateCorrectEdgeFlow(currentEdge);
    const isCorrect = selectedEdgeFlow === correctFlow;

    if (isCorrect) {
      const isLastEdge =
        graphState.currentEdgeIndex === graphState.selectedPath.length - 2;

      // Update the graph visualization immediately
      const updatedEdges = graphState.edges.map((edge) => {
        if (
          (edge.source === currentEdge.source &&
            edge.target === currentEdge.target) ||
          (edge.source === currentEdge.target &&
            edge.target === currentEdge.source)
        ) {
          return {
            ...edge,
            flow: edge.flow ? edge.flow + selectedEdgeFlow : selectedEdgeFlow,
            style: getEdgeStyle(edge, true),
            isHighlighted: true,
          };
        }
        return edge;
      });

      if (isLastEdge) {
        const newEdges = updateEdgeFlows(
          updatedEdges,
          graphState.selectedPath,
          graphState.selectedFlow
        );
        const newState = {
          ...graphState,
          edges: newEdges,
          maxFlow: graphState.maxFlow + graphState.selectedFlow,
        };
        const gameComplete = isGameComplete(newState);

        setGraphState((prev) => ({
          ...prev,
          edges: newEdges,
          gamePhase: "SELECT_PATH",
          pathOptions: gameComplete ? [] : generatePathOptions(newState),
          maxFlow: prev.maxFlow + prev.selectedFlow,
          score: prev.score + 15,
          feedback: gameComplete
            ? "Game Complete! Maximum flow achieved."
            : "Correct! Select the next augmenting path.",
          isComplete: gameComplete,
          currentEdgeIndex: 0,
          selectedPath: null,
          selectedFlow: null,
        }));

        if (!gameComplete) {
          // Call the parent component's handleRoundComplete
          const parentHandleRoundComplete = async () => {
            const newGraph = generateRandomGraph(nodeCount, true);
            const newPathOptions = findAllPaths(newGraph.edges, "S", "T")
              .filter(
                (path) => calculateResidualCapacity(path, newGraph.edges) > 0
              )
              .slice(0, 3);

            setGraphState((prev) => ({
              ...newGraph,
              currentPath: [],
              maxFlow: 0,
              gamePhase: "SELECT_PATH",
              pathOptions: newPathOptions,
              flowOptions: [],
              currentEdgeIndex: 0,
              userAnswers: {},
              correctAnswers: {},
              pathFlow: 0,
              feedback: "New round started!",
              flows: new Map(),
              isComplete: false,
              score: 0,
            }));
            setRound((prev) => prev + 1);
          };

          parentHandleRoundComplete();
        }
      } else {
        setGraphState((prev) => ({
          ...prev,
          edges: updatedEdges,
          currentEdgeIndex: prev.currentEdgeIndex + 1,
          score: prev.score + 5,
          feedback: "Correct! Next edge.",
        }));
      }
    } else {
      setGraphState((prev) => ({
        ...prev,
        score: prev.score - 5,
        feedback: "Incorrect edge flow value.",
      }));
    }
  };

  const generateEdgeFlowOptions = (totalFlow) => {
    return [
      ...new Set([
        totalFlow,
        -totalFlow,
        totalFlow + 1,
        -(totalFlow + 1),
        Math.max(1, totalFlow - 1),
        -Math.max(1, totalFlow - 1),
      ]),
    ].sort((a, b) => a - b);
  };

  const getCurrentEdgeFromPath = () => {
    const { selectedPath, currentEdgeIndex } = graphState;
    return {
      source: selectedPath[currentEdgeIndex],
      target: selectedPath[currentEdgeIndex + 1],
    };
  };

  const calculateCorrectEdgeFlow = (edge) => {
    const { selectedFlow, selectedPath } = graphState;
    const isForward =
      selectedPath.indexOf(edge.source) < selectedPath.indexOf(edge.target);
    return isForward ? selectedFlow : -selectedFlow;
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
            onEdgeFlowSelect={handleEdgeFlowSelect}
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
