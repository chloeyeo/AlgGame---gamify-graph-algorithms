"use client";

import React, { useState, useEffect } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateFordFulkersonGraph } from "@/utils/graphGenerator";
import {
  isEdgeInPath,
  findPath,
  calculateBottleneck,
  calculateNodeFlows,
  NODE_TYPES,
  EDGE_TYPES,
  getEdgeStyle,
  FordFulkersonGraphVisualisation,
} from "@/app/education/network-flow/ford-fulkerson/page";

const FordFulkersonGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(5);
  const [graphState, setGraphState] = useState(() => {
    const initialGraph = generateFordFulkersonGraph(nodeCount);
    return {
      ...initialGraph,
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
      isRunning: false,
      flowOptions: [],
      currentPathIndex: 0,
      userAnswers: {},
      correctAnswers: {},
      pathFlow: 0,
    };
  });

  // Function to validate moves in Ford-Fulkerson
  const isValidMove = (currentState, nodeId) => {
    const { currentPath, edges } = currentState;

    // If starting a new path, must start from source
    if (currentPath.length === 0) {
      return nodeId === "S";
    }

    const lastNode = currentPath[currentPath.length - 1];
    const edge = edges.find(
      (e) =>
        (e.source === lastNode && e.target === nodeId) ||
        (e.target === lastNode && e.source === nodeId)
    );

    if (!edge) return false;

    // Check if there's residual capacity
    const currentFlow = edge.flow || 0;
    const residualCapacity =
      edge.source === lastNode ? edge.capacity - currentFlow : currentFlow;

    return residualCapacity > 0;
  };

  // Handle difficulty change
  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const newNodeCount =
      selectedDifficulty === "easy"
        ? 4
        : selectedDifficulty === "medium"
        ? 6
        : 8;
    setNodeCount(newNodeCount);
    const newGraph = generateFordFulkersonGraph(newNodeCount);
    setGraphState({
      ...newGraph,
      currentPath: [],
      maxFlow: 0,
      currentPathIndex: 0,
      flowOptions: [],
      currentEdge: null,
      userAnswers: {},
      correctAnswers: {},
      pathFlow: 0,
    });
    setRound(1);
    setTotalScore(0);
  };

  // Reset graph for new round
  useEffect(() => {
    const newGraph = generateFordFulkersonGraph(nodeCount);
    setGraphState({
      ...newGraph,
      currentPath: [],
      maxFlow: 0,
      currentPathIndex: 0,
      flowOptions: [],
      currentEdge: null,
      userAnswers: {},
      correctAnswers: {},
      pathFlow: 0,
    });
  }, [round]);

  return (
    <GamePageStructure
      title="Ford-Fulkerson Maximum Flow Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      getNodeStatus={(node) =>
        graphState.currentPath.includes(node.id) ? "visited" : "unvisited"
      }
      getScore={(status) =>
        status === "correct" ? 10 : status === "path-complete" ? 20 : -5
      }
      getMessage={(status, nodeId, state) => {
        if (status === "incorrect") {
          return "Invalid move! Check residual capacity.";
        }
        if (status === "path-complete") {
          return `Path complete! Flow increased by ${state.pathFlow}. Total flow: ${state.maxFlow}`;
        }
        return `Valid move! Continue finding augmenting path.`;
      }}
      isGameComplete={(state) =>
        !findPath(
          "S",
          "T",
          state.edges,
          new Map(
            state.edges.map((e) => [`${e.source}-${e.target}`, e.flow || 0])
          )
        )
      }
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
    />
  );
};

export default FordFulkersonGamePage;
