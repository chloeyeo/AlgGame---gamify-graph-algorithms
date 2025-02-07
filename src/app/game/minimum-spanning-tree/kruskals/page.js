"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateInitialGraphState } from "@/utils/graphUtils.js";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import { EDGE_STATES } from "@/utils/graphUtils.js";

const KruskalsGamePage = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [nodeCount, setNodeCount] = useState(6);
  const [graphState, setGraphState] = useState(() =>
    generateInitialGraphState(4, "kruskal")
  );

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    const fixedNodeCount = DIFFICULTY_SETTINGS[selectedDifficulty].minNodes;
    setNodeCount(fixedNodeCount);
    setGraphState(
      generateInitialGraphState(fixedNodeCount, "kruskal", selectedDifficulty)
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

    // Find minimum weight among unselected edges
    const unselectedEdges = state.edges.filter((e) => !e.selected);
    if (unselectedEdges.length === 0) {
      return {
        validMove: false,
        newState: state,
        nodeStatus: "incorrect",
        message: "No more edges available.",
      };
    }

    const minWeight = Math.min(...unselectedEdges.map((e) => e.weight));

    // Check if selected edge has minimum weight
    if (selectedEdge.weight > minWeight) {
      return {
        validMove: false,
        newState: {
          ...state,
          edges: state.edges.map((edge, idx) => ({
            ...edge,
            state: idx === edgeIndex ? EDGE_STATES.CONSIDERING : edge.state,
          })),
        },
        nodeStatus: "incorrect",
        message: `Incorrect! Choose the edge with minimum weight (${minWeight}) first.`,
      };
    }

    // Create new state with deep copy
    const newState = JSON.parse(JSON.stringify(state));
    const components = new Map(state.components);

    // Check for cycle
    const sourceRoot = findRoot(components, selectedEdge.source);
    const targetRoot = findRoot(components, selectedEdge.target);

    if (sourceRoot === targetRoot) {
      return {
        validMove: false,
        newState: {
          ...state,
          edges: state.edges.map((edge, idx) => ({
            ...edge,
            state: idx === edgeIndex ? EDGE_STATES.CYCLE : edge.state,
          })),
        },
        nodeStatus: "incorrect",
        message: `Adding edge ${selectedEdge.source}-${selectedEdge.target} would create a cycle!`,
      };
    }

    // Valid move - update state
    unionComponents(components, selectedEdge.source, selectedEdge.target);
    selectedEdge.selected = true;
    selectedEdge.state = EDGE_STATES.MST;

    newState.mstEdges.push({
      source: selectedEdge.source,
      target: selectedEdge.target,
      weight: selectedEdge.weight,
    });

    // Update node visited status
    newState.nodes = newState.nodes.map((node) => ({
      ...node,
      visited:
        node.id === selectedEdge.source ||
        node.id === selectedEdge.target ||
        newState.mstEdges.some(
          (e) => e.source === node.id || e.target === node.id
        ),
    }));

    newState.components = components;
    newState.currentEdge = edgeIndex;

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
      title="Kruskal's Algorithm Game"
      graphState={graphState}
      setGraphState={setGraphState}
      isValidMove={isValidMove}
      getNodeStatus={(node) => (node.visited ? "visited" : "unvisited")}
      getScore={(status) =>
        status === "correct" ? 10 : status === "final-move" ? 20 : -5
      }
      getMessage={(status, edgeIndex, state) => {
        if (status === "incorrect") {
          return "Invalid move! In Kruskal's, you must select the unvisited edge with the lowest weight that doesn't create a cycle.";
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
      initialMessage="Select edges in ascending order of weight to build the Minimum Spanning Tree!"
    />
  );
};

export default KruskalsGamePage;
