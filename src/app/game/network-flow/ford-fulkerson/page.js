"use client";

import React, { useState } from "react";
import GraphVisualisation from "@/components/GraphVisualisation";

const FordFulkersonGame = () => {
  const initialGraphState = {
    nodes: [
      { id: "S" },
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
      { id: "T" },
    ],
    edges: [
      { source: "S", target: "A", capacity: 10, flow: 0 },
      { source: "S", target: "C", capacity: 10, flow: 0 },
      { source: "A", target: "B", capacity: 4, flow: 0 },
      { source: "A", target: "C", capacity: 2, flow: 0 },
      { source: "A", target: "D", capacity: 8, flow: 0 },
      { source: "B", target: "T", capacity: 10, flow: 0 },
      { source: "C", target: "D", capacity: 9, flow: 0 },
      { source: "D", target: "B", capacity: 6, flow: 0 },
      { source: "D", target: "T", capacity: 10, flow: 0 },
    ],
    currentPath: [],
    maxFlow: 0,
    gamePhase: "SHOW_PATH",
    possiblePaths: [
      ["S", "A", "B", "T"],
      ["S", "A", "D", "T"],
      ["S", "C", "D", "T"],
      ["S", "C", "D", "B", "T"],
    ],
    currentPathIndex: 0,
    flowOptions: [],
    currentEdgeIndex: 0,
    userAnswers: {},
    correctAnswers: {},
    pathFlow: 0,
    feedback: null,
  };

  const [graphState, setGraphState] = useState(initialGraphState);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const findEdge = (source, target) => {
    return graphState.edges.find(
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

  const generateFlowOptions = (path) => {
    const options = {};

    let bottleneck = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
      const source = path[i];
      const target = path[i + 1];
      const edge = findEdge(source, target);
      const residualCapacity = getResidualCapacity(edge, source, target);
      bottleneck = Math.min(bottleneck, residualCapacity);
    }

    for (let i = 0; i < path.length - 1; i++) {
      const source = path[i];
      const target = path[i + 1];
      const edge = findEdge(source, target);
      const currentFlow = edge.flow;
      const correctFlow =
        edge.source === source
          ? currentFlow + bottleneck
          : currentFlow - bottleneck;

      const maxFlow = edge.capacity;
      const options1 = Math.max(0, correctFlow - 2);
      const options2 = Math.min(maxFlow, correctFlow + 2);
      const options3 = Math.min(maxFlow, Math.max(0, correctFlow + 1));

      options[`${source}-${target}`] = {
        choices: [correctFlow, options1, options2, options3]
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort(() => Math.random() - 0.5),
        correct: correctFlow,
      };
    }

    return { options, bottleneck };
  };

  const handleNodeClick = () => {
    if (graphState.gamePhase === "SHOW_PATH") {
      const currentPath = graphState.possiblePaths[graphState.currentPathIndex];
      const { options, bottleneck } = generateFlowOptions(currentPath);

      setGraphState({
        ...graphState,
        currentPath,
        gamePhase: "SELECT_FLOWS",
        currentEdgeIndex: 0,
        flowOptions: options,
        pathFlow: bottleneck,
        correctAnswers: Object.fromEntries(
          Object.entries(options).map(([key, value]) => [key, value.correct])
        ),
      });
    }
  };

  const handleFlowSelection = (edge, selectedFlow) => {
    const [source, target] = edge.split("-");
    const correctFlow = graphState.correctAnswers[edge];

    if (selectedFlow === correctFlow) {
      const newState = { ...graphState };
      newState.userAnswers[edge] = selectedFlow;
      newState.feedback = {
        type: "success",
        message: "Correct! Move to the next edge.",
      };
      newState.currentEdgeIndex++;

      if (newState.currentEdgeIndex >= newState.currentPath.length - 1) {
        // Apply the flows
        for (let i = 0; i < newState.currentPath.length - 1; i++) {
          const s = newState.currentPath[i];
          const t = newState.currentPath[i + 1];
          const edgeKey = `${s}-${t}`;
          const edgeIndex = newState.edges.findIndex(
            (e) =>
              (e.source === s && e.target === t) ||
              (e.source === t && e.target === s)
          );
          newState.edges[edgeIndex].flow = newState.correctAnswers[edgeKey];
        }

        newState.maxFlow += newState.pathFlow;
        newState.currentPathIndex++;
        newState.gamePhase = "SHOW_PATH";
        newState.currentPath = [];
        newState.userAnswers = {};
        newState.flowOptions = [];
        newState.correctAnswers = {};
        newState.currentEdgeIndex = 0;
        newState.feedback = {
          type: "success",
          message: `Path complete! Flow added: ${newState.pathFlow}. Total flow: ${newState.maxFlow}`,
        };
      }

      setScore((s) => s + 10);
      setGraphState(newState);
    } else {
      setGraphState({
        ...graphState,
        feedback: {
          type: "error",
          message: "Incorrect. Try again!",
        },
      });
      setScore((s) => s - 5);
    }
    setMoves((m) => m + 1);
  };

  const isGameComplete = () => {
    return graphState.currentPathIndex >= graphState.possiblePaths.length;
  };

  const renderFlowSelector = () => {
    if (graphState.gamePhase !== "SELECT_FLOWS") return null;

    const source = graphState.currentPath[graphState.currentEdgeIndex];
    const target = graphState.currentPath[graphState.currentEdgeIndex + 1];
    const edge = `${source}-${target}`;
    const options = graphState.flowOptions[edge];

    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Flow Value:</h3>
          <p className="text-gray-900">
            Edge {source} → {target}
          </p>
        </div>

        <div className="flex gap-2">
          {options.choices.map((flow, index) => (
            <button
              key={index}
              onClick={() => handleFlowSelection(edge, flow)}
              className="px-4 py-2 border rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {flow}
            </button>
          ))}
        </div>

        {graphState.feedback && (
          <div
            className={`mt-4 p-3 rounded ${
              graphState.feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {graphState.feedback.message}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {Object.entries(graphState.userAnswers).map(([edgeKey, flow]) => {
            const [s, t] = edgeKey.split("-");
            return (
              <div key={edgeKey} className="text-sm text-gray-600">
                {s} → {t}: {flow}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="flex flex-col p-6 items-center justify-center min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Ford-Fulkerson Maximum Flow Game
      </h1>

      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Moves: {moves}</div>
        </div>

        <div className="mb-6">
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center justify-center h-[27rem] relative">
              <GraphVisualisation
                graphState={graphState}
                onNodeClick={handleNodeClick}
                mode="game"
              />
            </div>
          </div>
        </div>

        {renderFlowSelector()}

        {!isGameComplete() && graphState.gamePhase === "SHOW_PATH" && (
          <div className="text-center mt-4 text-blue-600 font-medium">
            Click any node on the graph to view the next augmenting path
          </div>
        )}

        {isGameComplete() && (
          <div className="text-center mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            Game complete! Maximum flow achieved: {graphState.maxFlow}
          </div>
        )}
      </div>
    </main>
  );
};

export default FordFulkersonGame;
