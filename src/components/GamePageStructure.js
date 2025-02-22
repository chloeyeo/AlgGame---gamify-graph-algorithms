"use client";
import React, { useState, useEffect, useRef } from "react";
import GraphVisualisation from "@/components/GraphVisualisation";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";
import { DIFFICULTY_SETTINGS } from "@/constants/gameSettings";
import { useRouter } from "next/navigation";
import { generateInitialGraphState } from "@/utils/graphUtils";
import { generateGameGraph as generateDijkstraGraph } from "./GraphGenerator";

const API_URL = BACKEND_URL;

const DifficultySelector = ({ onSelect }) => (
  <div className="flex flex-col h-full items-center justify-center p-4">
    <div className="flex flex-col items-center">
      <h1 className="text-xl lg:text-3xl font-bold mb-4 lg:mb-8">
        Choose Difficulty Level
      </h1>
      <div className="flex flex-wrap gap-2 lg:gap-4 justify-center">
        {Object.keys(DIFFICULTY_SETTINGS).map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className="px-3 py-2 lg:px-6 lg:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg capitalize text-sm lg:text-base"
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const generateRandomGraph = (nodeCount = 6, difficulty = "medium") => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const baseAngle = (2 * Math.PI * i) / nodeCount;
    const angleJitter = Math.random() * 0.5 - 0.25;
    const angle = baseAngle + angleJitter;

    const minRadius = 100;
    const maxRadius = 200;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);

    return {
      id: String.fromCharCode(65 + i),
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
    };
  });

  const edges = [];
  // Ensure graph is connected
  for (let i = 1; i < nodes.length; i++) {
    const parent = Math.floor(Math.random() * i);
    edges.push({
      source: nodes[parent].id,
      target: nodes[i].id,
    });
  }

  // Add random extra edges based on difficulty
  const maxExtraEdges =
    {
      easy: 1,
      medium: 2,
      hard: 3,
    }[difficulty] || 2;

  for (let i = 0; i < maxExtraEdges; i++) {
    const source = Math.floor(Math.random() * nodes.length);
    const target = Math.floor(Math.random() * nodes.length);

    if (
      source !== target &&
      !edges.some(
        (e) =>
          (e.source === nodes[source].id && e.target === nodes[target].id) ||
          (e.source === nodes[target].id && e.target === nodes[source].id)
      )
    ) {
      edges.push({
        source: nodes[source].id,
        target: nodes[target].id,
      });
    }
  }

  return { nodes, edges };
};

const generateAlgorithmSpecificGraph = (nodeCount, difficulty, algorithm) => {
  const baseGraph = generateRandomGraph(nodeCount, difficulty);

  if (algorithm === "bfs" || algorithm === "dfs") {
    const { nodes } = baseGraph;
    const edges = [];

    // Create a connected path
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
      });
    }

    // Add random extra edges based on difficulty
    const maxExtraEdges =
      {
        easy: 1,
        medium: 2,
        hard: 3,
      }[difficulty] || 2;

    for (let i = 0; i < maxExtraEdges; i++) {
      const source = Math.floor(Math.random() * nodes.length);
      const target = Math.floor(Math.random() * nodes.length);

      if (source !== target && Math.abs(source - target) > 1) {
        edges.push({
          source: nodes[source].id,
          target: nodes[target].id,
        });
      }
    }

    return { ...baseGraph, edges };
  }

  return baseGraph;
};

// Export both functions
export { generateRandomGraph, generateAlgorithmSpecificGraph };

const getAlgorithmFromTitle = (title) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("dfs")) return "dfs";
  if (titleLower.includes("bfs")) return "bfs";
  if (titleLower.includes("dijkstra")) return "dijkstra";
  if (titleLower.includes("a*")) return "astar";
  if (titleLower.includes("kruskal")) return "kruskal";
  if (titleLower.includes("prim")) return "prim";
  if (titleLower.includes("ford-fulkerson")) return "fordFulkerson";
  return titleLower.split(" ")[0];
};

export default function GamePageStructure({
  title = "Graph Traversal Game",
  graphState,
  setGraphState,
  isValidMove,
  getNodeStatus,
  getScore,
  getMessage,
  isGameComplete,
  round,
  setRound,
  totalScore,
  setTotalScore,
  nodeCount,
  difficulty,
  onDifficultySelect,
  initialMessage = "Start from any node!",
  GraphVisualisationComponent = GraphVisualisation,
  isFordFulkerson = false,
  children,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(initialMessage);
  const [overlayState, setOverlayState] = useState({
    show: false,
    content: { type: "", text: "" },
  });
  const [activeTab, setActiveTab] = useState(0);
  const [currentGraphStates, setCurrentGraphStates] = useState([graphState]);
  const [moves, setMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [isSpeakingFeedback, setIsSpeakingFeedback] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitAttempted = useRef(false);
  const pathname = usePathname();
  const startTime = Date.now();
  const [bestScore, setBestScore] = useState(0);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCurrentGraphStates([graphState]);
  }, [graphState]);

  const isFordFulkersonPage = pathname.includes("ford-fulkerson");
  const isMultiGraphGame = currentGraphStates.length > 1;

  // Get current graph state based on active tab
  const getCurrentGraphState = () => currentGraphStates[activeTab];

  // Set current graph state based on active tab
  const setCurrentGraphState = (newState) => {
    setCurrentGraphStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[activeTab] = newState;
      return newStates;
    });
  };

  const resetGame = () => {
    // Generate fresh graph state
    const freshGraphState = {
      ...graphState,
      nodes: graphState.nodes.map((node) => ({
        ...node,
        visited: false,
        backtracked: false,
        current: false,
      })),
      currentNode: null,
      stack: [],
      visitedNodes: [],
      backtrackedNodes: [],
    };

    setCurrentGraphStates([freshGraphState]);
    setGraphState(freshGraphState);
    setScore(0);
    setMoves(0);
    setMessage("Game reset. Click on a node to begin!");
    setOverlayState({
      show: false,
      content: { type: "", text: "" },
    });
    setScoreSubmitted(false);
    setIsSubmitting(false);
    submitAttempted.current = false;
  };

  const submitScore = async (scoreData) => {
    console.log("Attempting to submit score:", scoreData);

    // Clean up algorithm names
    if (scoreData.algorithm === "dijkstras") {
      scoreData.algorithm = "dijkstra";
    } else if (scoreData.algorithm === "kruskals") {
      scoreData.algorithm = "kruskal";
    } else if (scoreData.algorithm === "prims") {
      scoreData.algorithm = "prim";
    }

    if (!scoreData.algorithm || !scoreData.difficulty) {
      console.error("Missing required score data:", scoreData);
      throw new Error("Missing required score data");
    }

    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit score");
      }

      const data = await response.json();
      console.log("Score submission response:", data);
      return data;
    } catch (error) {
      console.error("Score submission error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        window.speechSynthesis.cancel();
        setIsSpeakingFeedback(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleNodeClick = (nodeId) => {
    if (isGameComplete(graphState)) return;

    const {
      newState,
      validMove,
      nodeStatus,
      message: customMessage,
    } = isValidMove(graphState, nodeId, currentStep);

    // Increment moves counter for every valid click attempt
    setMoves((m) => m + 1);

    if (validMove) {
      setCurrentStep((step) => step + 1);
      const moveScore = getScore(nodeStatus);
      setScore((s) => s + moveScore);
      setGraphState(newState);
      setMessage(customMessage || getMessage(nodeStatus, nodeId));
      setOverlayState({
        show: true,
        content: { type: "correct", text: "Correct!" },
      });
    } else {
      setScore((s) => s - 5);
      setMessage(customMessage || `Invalid move! That's not the correct step.`);
      setOverlayState({
        show: true,
        content: { type: "incorrect", text: "Incorrect!" },
      });
    }

    setTimeout(
      () => setOverlayState((prev) => ({ ...prev, show: false })),
      1000
    );
  };

  const toggleSpeech = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeakingFeedback(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.onstart = () => setIsSpeakingFeedback(true);
        utterance.onend = () => setIsSpeakingFeedback(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  useEffect(() => {
    if (isGameComplete(graphState)) {
      // For Ford-Fulkerson, only show completion when the last edge of the path is updated
      if (isFordFulkerson) {
        const currentPath = graphState.currentPath;
        if (!currentPath || currentPath.length < 2) return;

        // Check if we're on the last edge of the path
        const isLastEdge =
          graphState.currentEdgeIndex === currentPath.length - 2;
        if (!isLastEdge) return;
      }

      // Prevent multiple executions
      if (submitAttempted.current) return;
      submitAttempted.current = true;

      // Calculate time spent
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Submit score first
      const newTotalScore = totalScore + score;
      const newTotalMoves = totalMoves + moves;

      setTotalScore(newTotalScore);
      setTotalMoves(newTotalMoves);

      const scoreData = {
        algorithm: pathname.split("/").pop(),
        score: newTotalScore,
        timeSpent: timeSpent,
        movesCount: newTotalMoves,
        difficulty: difficulty,
      };

      console.log("Submitting final score:", scoreData); // Debug log

      submitScore(scoreData)
        .then(() => {
          console.log("Score submitted successfully"); // Debug log

          setOverlayState({
            show: true,
            content: {
              type: "success",
              text: `Round ${round} Complete! Starting next round...`,
            },
          });

          // Immediately call handleRoundComplete instead of setTimeout
          const algorithm = getAlgorithmFromTitle(title);
          handleRoundComplete(score, algorithm);
        })
        .catch((error) => {
          console.error("Failed to submit score:", error);
          toast.error("Failed to submit score. Please try again.");
          submitAttempted.current = false; // Reset flag on error
        });
    }
  }, [graphState, isGameComplete]);

  const handleRoundComplete = async (currentScore, algorithm) => {
    // Update total score
    const newTotalScore = totalScore + currentScore;
    setTotalScore(newTotalScore);

    // Clear overlay message after a delay
    setTimeout(() => {
      setOverlayState({
        show: false,
        content: { type: "", text: "" },
      });
    }, 2000);

    // Special handling for Ford-Fulkerson
    if (isFordFulkerson) {
      const newGraph = generateRandomGraph(nodeCount, true);
      const newPathOptions = findAllPaths(newGraph.edges, "S", "T")
        .filter((path) => calculateResidualCapacity(path, newGraph.edges) > 0)
        .slice(0, 3);

      const newState = {
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
        feedback: null,
        flows: new Map(),
        isComplete: false,
      };

      setGraphState(newState);
      setRound((prev) => prev + 1);
      setScore(0);
      setMoves(0);
      submitAttempted.current = false;
      return;
    }

    // Generate new state for next round
    let newState;
    if (
      algorithm === "kruskal" ||
      algorithm === "prim" ||
      algorithm === "dijkstra" ||
      algorithm === "astar"
    ) {
      newState = generateInitialGraphState(nodeCount, algorithm, difficulty);
    } else {
      const { nodes, edges } = generateRandomGraph(nodeCount, difficulty);
      newState = {
        nodes: nodes.map((node) => ({
          ...node,
          visited: false,
          backtracked: false,
          current: false,
        })),
        edges,
        currentNode: null,
        stack: algorithm === "dfs" ? [] : undefined,
        queue: algorithm === "bfs" ? [] : undefined,
        visitedNodes: [],
        backtrackedNodes: algorithm === "dfs" ? [] : undefined,
      };
    }

    setGraphState(newState);
    setRound((prev) => prev + 1);
    setScore(0);
    setMoves(0);
    setMessage("Start the next round!");
    submitAttempted.current = false;
  };

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score]);

  if (!difficulty) {
    return <DifficultySelector onSelect={onDifficultySelect} />;
  }

  if (!currentGraphStates.length) {
    return (
      <p className="text-center mt-[50%]">
        No content available at the moment.
      </p>
    );
  }

  const renderGraphTabs = () =>
    isMultiGraphGame && (
      <div className="flex mb-2 border-b overflow-clip overflow-x-auto no-scrollbar">
        {currentGraphStates.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none ${
              activeTab === index ? "border-blue-500 font-bold" : ""
            }`}
          >
            Graph {String.fromCharCode(65 + index)} {/* A, B, C, etc. */}
          </button>
        ))}
      </div>
    );

  const renderMainContent = () => (
    <main className="flex flex-col h-full p-2 lg:p-4">
      <h1 className="text-lg lg:text-2xl text-center md:text-3xl font-bold mb-1 lg:mb-2">
        {title}
      </h1>

      <div className="flex flex-col flex-1">
        {/* Top Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-2">
          {/* Scores Section */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 lg:flex lg:gap-6 text-xs lg:text-lg mb-2 lg:mb-0">
            <div>Round: {round}</div>
            <div>Total Score: {totalScore}</div>
            <div>Best Round Score: {bestScore}</div>
            <div>Current Score: {score}</div>
            <div>Current Moves: {moves}</div>
            <div>Total Moves: {totalMoves}</div>
          </div>

          {/* Feedback Section */}
          <div className="w-full lg:w-64 lg:mx-4 mb-2 lg:mb-0">
            <div className="bg-white border border-gray-300 rounded-lg p-1 lg:p-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs lg:text-sm font-semibold">Feedback</h2>
                <button
                  onClick={() => toggleSpeech(message)}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    isSpeakingFeedback ? "bg-gray-200" : ""
                  }`}
                >
                  🔊
                </button>
              </div>
              <p className="text-xs lg:text-sm text-center">{message}</p>
            </div>
          </div>

          {/* Game Control Buttons */}
          <div className="flex gap-2 lg:gap-4">
            <button
              onClick={resetGame}
              className="flex-1 lg:flex-none bg-yellow-500 hover:bg-yellow-600 text-white px-2 lg:px-4 py-1 lg:py-2 rounded text-xs lg:text-base"
            >
              Reset
            </button>
            <button
              onClick={() => setShowDifficultyModal(true)}
              className="flex-1 lg:flex-none px-2 lg:px-4 py-1 lg:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs lg:text-base"
            >
              Difficulty
            </button>
          </div>
        </div>

        {/* Graph Container */}
        <div className={`flex-1 relative mx-auto w-full lg:w-4/5 mb-4`}>
          <div
            className={`h-full bg-white border border-gray-300 rounded-lg overflow-hidden ${
              isFordFulkerson ? "lg:max-h-[calc(100vh-16rem)]" : ""
            }`}
          >
            {renderGraphTabs()}
            <div
              className={`flex items-center justify-center h-[calc(100%-2rem)] ${
                isFordFulkerson ? "lg:pt-12" : ""
              }`}
            >
              <GraphVisualisationComponent
                graphState={getCurrentGraphState()}
                onNodeClick={handleNodeClick}
                mode="game"
                isGraphA={activeTab === 0}
                graphIndex={activeTab}
                isFordFulkerson={isFordFulkerson}
              />
              {overlayState.show && (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    overlayState.content.type === "correct"
                      ? "bg-green-500"
                      : "bg-red-500"
                  } bg-opacity-75`}
                >
                  <p className="text-white text-sm lg:text-2xl font-bold">
                    {overlayState.content.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Render children (FlowQuestions) only for Ford-Fulkerson */}
        {isFordFulkerson && children}
      </div>
    </main>
  );

  return (
    <div className="h-[calc(100vh-4rem)]">
      {renderMainContent()}
      {showDifficultyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 m-4 max-w-md w-full relative">
            <button
              onClick={() => setShowDifficultyModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <DifficultySelector
              onSelect={(level) => {
                onDifficultySelect(level);
                setShowDifficultyModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
