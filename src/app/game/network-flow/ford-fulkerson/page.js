"use client";

import React, { useState, useEffect } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateFordFulkersonGraph } from "@/utils/graphGenerator";
import {
  generateSteps,
  isEdgeInPath,
  findPath,
  calculateBottleneck,
  calculateNodeFlows,
  generateRandomGraph,
  NODE_TYPES,
  EDGE_TYPES,
  getEdgeStyle,
  FordFulkersonGraphVisualisation,
} from "@/app/education/network-flow/ford-fulkerson/page";

const FordFulkersonGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [nodeCount, setNodeCount] = useState(5);
  const [graphState, setGraphState] = useState(() => {
    const initialGraph = generateRandomGraph(nodeCount);
    return {
      ...initialGraph,
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
      isRunning: false,
      // gamePhase: "SHOW_PATH",
      // currentPathIndex: 0,
      // flowOptions: [],
      // currentEdgeIndex: 0,
      // userAnswers: {},
      // correctAnswers: {},
      // pathFlow: 0,
      // feedback: null,
    };
  });

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

  // after difficulty change or page reload or round end this useEffect should run
  useEffect(() => {
    const newGraph = generateRandomGraph(nodeCount);
    setGraphState({
      ...newGraph,
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
      isRunning: false,
    });
  }, [nodeCount]);

  const initialSteps = generateSteps(graphState.nodes, graphState.edges);

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
        status === "correct" ? 10 : status === "final-move" ? 20 : -5
      }
      getMessage={(status, edgeIndex, state) => {
        if (status === "incorrect") {
          return "Invalid flow value! Try again.";
        }
        return `Valid flow! Current total flow: ${state.maxFlow}`;
      }}
      isGameComplete={(state) =>
        state.currentPathIndex >= state.possiblePaths?.length
      }
      difficulty={difficulty}
      onDifficultySelect={(diff) => {
        setDifficulty(diff);
        const nodeCount = diff === "easy" ? 4 : diff === "medium" ? 6 : 8;
        setGraphState(() => {
          const newGraph = generateFordFulkersonGraph(nodeCount);
          return {
            ...newGraph,
            currentPath: [],
            maxFlow: 0,
            gamePhase: "SHOW_PATH",
            currentPathIndex: 0,
            flowOptions: [],
            currentEdgeIndex: 0,
            userAnswers: {},
            correctAnswers: {},
            pathFlow: 0,
            feedback: null,
          };
        });
      }}
      initialMessage="Click any node to start finding augmenting paths!"
      algorithm="ford-fulkerson"
    />
  );
};

export default FordFulkersonGamePage;
