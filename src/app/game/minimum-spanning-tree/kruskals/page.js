"use client";

import React, { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";
import { generateInitialGraphState } from "@/utils/graphUtils.js";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import { EDGE_STATES } from "@/utils/graphUtils.js";

const findRoot = (components, nodeId) => {
  if (components.get(nodeId) !== nodeId) {
    components.set(nodeId, findRoot(components, components.get(nodeId)));
  }
  return components.get(nodeId);
};

const unionComponents = (components, node1, node2) => {
  const root1 = findRoot(components, node1);
  const root2 = findRoot(components, node2);
  if (root1 !== root2) {
    components.set(root2, root1);
    return true;
  }
  return false;
};

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

    // Create a new state object
    const newState = {
      ...state,
      edges: state.edges.map((edge) => ({
        ...edge,
        state: edge.selected ? EDGE_STATES.MST : EDGE_STATES.NORMAL,
      })),
      components: new Map(state.components),
      mstEdges: [...state.mstEdges],
    };

    // Check if edge is already selected
    if (selectedEdge.selected) {
      return {
        validMove: false,
        newState,
        nodeStatus: "incorrect",
        message: "Edge already selected!",
      };
    }

    // Find minimum weight among unselected edges that don't create cycles
    const validEdges = state.edges.filter((edge) => {
      if (edge.selected) return false;
      const srcRoot = findRoot(newState.components, edge.source);
      const tgtRoot = findRoot(newState.components, edge.target);
      return srcRoot !== tgtRoot;
    });

    const minWeight = Math.min(...validEdges.map((e) => e.weight));

    // Check for cycle
    const sourceRoot = findRoot(newState.components, selectedEdge.source);
    const targetRoot = findRoot(newState.components, selectedEdge.target);

    if (sourceRoot === targetRoot) {
      return {
        validMove: false,
        newState: {
          ...newState,
          edges: newState.edges.map((edge, idx) => ({
            ...edge,
            state: idx === edgeIndex ? EDGE_STATES.CYCLE : edge.state,
          })),
        },
        nodeStatus: "incorrect",
        message: `Adding edge ${selectedEdge.source}-${selectedEdge.target} would create a cycle!`,
      };
    }

    // Check if selected edge has minimum weight
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

    // Valid move - update state
    unionComponents(
      newState.components,
      selectedEdge.source,
      selectedEdge.target
    );

    newState.edges[edgeIndex].selected = true;
    newState.edges[edgeIndex].state = EDGE_STATES.MST;

    newState.mstEdges.push({
      source: selectedEdge.source,
      target: selectedEdge.target,
      weight: selectedEdge.weight,
      state: EDGE_STATES.MST,
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
