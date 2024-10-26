"use client";

import React, { useState } from "react";
import GraphVisualisation from "@/components/GraphVisualisation";

const EdmondsKarpGamePage = () => {
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
    gamePhase: "SELECT_PATH",
    // All possible paths sorted by length
    possiblePaths: [
      // Length 3 paths
      ["S", "A", "D", "T"],
      ["S", "C", "D", "T"],
      ["S", "A", "B", "T"],
      // Length 4 path
      ["S", "C", "D", "B", "T"],
      // Length 5 path
      ["S", "C", "D", "A", "B", "T"],
    ],
    pathOptions: [
      ["S", "A", "D", "T"],
      ["S", "C", "D", "T"],
      ["S", "A", "B", "T"],
      ["S", "C", "D", "B", "T"],
      ["S", "C", "D", "A", "B", "T"],
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

  const getPathLength = (path) => path.length - 1;

  const findShortestPath = (paths) => {
    return paths.reduce((shortest, current) => {
      return getPathLength(current) < getPathLength(shortest)
        ? current
        : shortest;
    });
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

  const handlePathSelection = (selectedPath) => {
    const shortestPath = findShortestPath(graphState.pathOptions);
    const isCorrectChoice =
      getPathLength(selectedPath) === getPathLength(shortestPath);

    if (isCorrectChoice) {
      const { options, bottleneck } = generateFlowOptions(selectedPath);

      setGraphState({
        ...graphState,
        currentPath: selectedPath,
        gamePhase: "SELECT_FLOWS",
        currentEdgeIndex: 0,
        flowOptions: options,
        pathFlow: bottleneck,
        correctAnswers: Object.fromEntries(
          Object.entries(options).map(([key, value]) => [key, value.correct])
        ),
        feedback: {
          type: "success",
          message:
            "Correct! This is the shortest available augmenting path. Now update the flows.",
        },
        pathOptions: graphState.pathOptions.filter(
          (path) => !arraysEqual(path, selectedPath)
        ),
      });
      setScore((s) => s + 15);
    } else {
      setGraphState({
        ...graphState,
        feedback: {
          type: "error",
          message: `Incorrect. Find a path with fewer edges (current selection: ${getPathLength(
            selectedPath
          )} edges).`,
        },
      });
      setScore((s) => s - 10);
    }
    setMoves((m) => m + 1);
  };

  const handleFlowSelection = (edge, selectedFlow) => {
    const correctFlow = graphState.correctAnswers[edge];

    if (selectedFlow === correctFlow) {
      const newState = { ...graphState };
      newState.userAnswers[edge] = selectedFlow;
      newState.feedback = {
        type: "success",
        message: "Correct flow value! Move to the next edge.",
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
        newState.gamePhase = "SELECT_PATH";
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
          message: "Incorrect flow value. Try again!",
        },
      });
      setScore((s) => s - 5);
    }
    setMoves((m) => m + 1);
  };

  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  const isGameComplete = () => {
    return graphState.pathOptions.length === 0;
  };

  const renderPathSelector = () => {
    if (graphState.gamePhase !== "SELECT_PATH") return null;

    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Select the Shortest Augmenting Path:
          </h3>
          <p className="text-gray-900 mb-2">
            Choose the path with the fewest edges that can still carry
            additional flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {graphState.pathOptions.map((path, index) => (
            <button
              key={index}
              onClick={() => handlePathSelection(path)}
              className="px-4 py-2 text-left border rounded-lg hover:bg-blue-50 focus:outline-none"
            >
              {path.join(" → ")} ({getPathLength(path)} edges)
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
      </div>
    );
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
          <h3 className="text-lg font-semibold mb-2">Update Flow Value:</h3>
          <p className="text-gray-900">
            Edge {source} → {target}
          </p>
        </div>

        <div className="flex gap-2">
          {options.choices.map((flow, index) => (
            <button
              key={index}
              onClick={() => handleFlowSelection(edge, flow)}
              className="px-4 py-2 border rounded-lg hover:bg-blue-50 focus:outline-none"
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
        Edmonds-Karp Maximum Flow Game
      </h1>

      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Moves: {moves}</div>
        </div>

        <div className="mb-6">
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
            <div className="flex items-center justify-center h-[27rem] relative">
              <GraphVisualisation graphState={graphState} mode="game" />
            </div>
          </div>
        </div>

        {renderPathSelector()}
        {renderFlowSelector()}

        {isGameComplete() && (
          <div className="text-center mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="font-semibold">Game Complete!</p>
            <p>Maximum flow achieved: {graphState.maxFlow}</p>
            <p>Final score: {score}</p>
            <p>Total moves: {moves}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default EdmondsKarpGamePage;
