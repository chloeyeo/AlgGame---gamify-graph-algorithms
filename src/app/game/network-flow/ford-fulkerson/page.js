"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateFordFulkersonGraph } from "@/utils/graphGenerator";

const FordFulkersonGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [graphState, setGraphState] = useState(() => {
    const initialGraph = generateFordFulkersonGraph(6);
    return {
      ...initialGraph,
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

  const findEdge = (state, source, target) => {
    return state.edges.find(
      (e) =>
        (e.source === source && e.target === target) ||
        (e.source === target && e.target === source)
    );
  };

  const getResidualCapacity = (edge, source, target) => {
    if (edge.source === source) {
      return edge.capacity - edge.flow;
    }
    return edge.flow;
  };

  const isValidMove = (state, edgeIndex) => {
    // Your existing flow validation logic here
    // Return object with validMove, newState, nodeStatus, message
  };

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
