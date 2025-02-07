"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateInitialGraphState } from "@/utils/graphUtils";
import { EDGE_STATES } from "@/utils/graphUtils";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";

const PrimsGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(6);
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(4, "prim")
  );

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(
      generateInitialGraphState(fixedNodeCount, "prim", selectedDifficulty)
    );
    setRound(1);
    setTotalScore(0);
  };

  const isValidMove = (state, edgeIndex) => {
    if (
      edgeIndex === undefined ||
      edgeIndex < 0 ||
      edgeIndex >= state.edges.length
    ) {
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message: "Invalid edge selection.",
      };
    }

    const selectedEdge = state.edges[edgeIndex];
    const newState = {
      ...state,
      edges: state.edges.map((edge) => ({
        ...edge,
        state: edge.selected ? EDGE_STATES.MST : EDGE_STATES.NORMAL,
      })),
      mstEdges: [...state.mstEdges],
    };

    if (selectedEdge.selected) {
      return {
        validMove: false,
        newState,
        nodeStatus: "incorrect",
        message: "Edge already selected!",
      };
    }

    // Get visited nodes
    const visitedNodes = new Set(
      newState.nodes.filter((n) => n.visited).map((n) => n.id)
    );

    // Check if this is the first move
    if (visitedNodes.size === 0) {
      // Allow starting from any node - just mark the nodes as visited
      newState.nodes = newState.nodes.map((node) => ({
        ...node,
        visited:
          node.id === selectedEdge.source || node.id === selectedEdge.target,
      }));
    } else {
      // Rest of the validation logic for subsequent moves
      const connectsToVisited =
        (visitedNodes.has(selectedEdge.source) &&
          !visitedNodes.has(selectedEdge.target)) ||
        (visitedNodes.has(selectedEdge.target) &&
          !visitedNodes.has(selectedEdge.source));

      if (!connectsToVisited) {
        return {
          validMove: false,
          newState: {
            ...newState,
            edges: newState.edges.map((edge, idx) => ({
              ...edge,
              state: idx === edgeIndex ? EDGE_STATES.CONSIDERING : edge.state,
            })),
          },
          nodeStatus: "incorrect",
          message: "Edge must connect a visited node to an unvisited node!",
        };
      }

      // Find minimum weight among valid edges
      const validEdges = state.edges.filter(
        (e) =>
          !e.selected &&
          ((visitedNodes.has(e.source) && !visitedNodes.has(e.target)) ||
            (visitedNodes.has(e.target) && !visitedNodes.has(e.source)))
      );

      const minWeight = Math.min(...validEdges.map((e) => e.weight));

      if (selectedEdge.weight > minWeight) {
        return {
          validMove: false,
          newState: {
            ...newState,
            edges: newState.edges.map((edge, idx) => ({
              ...edge,
              state: idx === edgeIndex ? EDGE_STATES.CONSIDERING : edge.state,
            })),
          },
          nodeStatus: "incorrect",
          message: `Incorrect! Choose the edge with minimum weight (${minWeight}) first.`,
        };
      }
    }

    // Valid move - update state
    newState.edges[edgeIndex].selected = true;
    newState.edges[edgeIndex].state = EDGE_STATES.MST;

    newState.mstEdges.push({
      source: selectedEdge.source,
      target: selectedEdge.target,
      weight: selectedEdge.weight,
      state: EDGE_STATES.MST,
    });

    // Update visited nodes
    newState.nodes = newState.nodes.map((node) => ({
      ...node,
      visited:
        node.id === selectedEdge.source ||
        node.id === selectedEdge.target ||
        visitedNodes.has(node.id),
    }));

    const isComplete = newState.mstEdges.length === newState.nodes.length - 1;
    const totalWeight = newState.mstEdges.reduce((sum, e) => sum + e.weight, 0);

    return {
      validMove: true,
      newState,
      nodeStatus: isComplete ? "final-move" : "correct",
      message: isComplete
        ? `Congratulations! MST completed with total weight ${totalWeight}!`
        : `Correct! Added edge ${selectedEdge.source}-${selectedEdge.target} (weight: ${selectedEdge.weight}). Current total weight: ${totalWeight}`,
    };
  };

  return (
    <GamePageStructure
      title="Prim's Algorithm Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      getNodeStatus={(node) => (node.visited ? "visited" : "unvisited")}
      getScore={(status) =>
        status === "correct" ? 10 : status === "final-move" ? 20 : -5
      }
      getMessage={(status, edgeIndex, state) => {
        if (status === "incorrect") {
          return "Invalid move! In Prim's algorithm, you must select the unvisited edge with the lowest weight that connects to the visited set.";
        }
        return `Valid move! Edge selected: ${state.edges[edgeIndex].source}-${state.edges[edgeIndex].target}`;
      }}
      isGameComplete={(state) =>
        state.mstEdges.length === state.nodes.length - 1
      }
      round={round}
      setRound={setRound}
      totalScore={totalScore}
      setTotalScore={setTotalScore}
      nodeCount={nodeCount}
      difficulty={difficulty}
      onDifficultySelect={handleDifficultySelect}
      initialMessage="Select any edge to start building the Minimum Spanning Tree!"
    />
  );
};

export default PrimsGamePage;
