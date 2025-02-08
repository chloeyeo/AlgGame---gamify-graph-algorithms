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
  <main className="hidden lg:flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Choose Difficulty Level</h1>
      <div className="flex gap-4">
        {Object.keys(DIFFICULTY_SETTINGS).map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg capitalize"
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  </main>
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

  const submitScore = async () => {
    if (submitAttempted.current) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to save your score to the leaderboard!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          algorithm: title.split(" ")[0].toLowerCase(),
          score,
          timeSpent: Date.now() - startTime,
          movesCount: moves,
          difficulty: difficulty,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Received non-JSON response from server");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit score");
      }

      setScoreSubmitted(true);
      setMessage("Score submitted successfully!");
      submitAttempted.current = true;
    } catch (error) {
      console.error("Score submission error:", error);
      setMessage(
        "Game completed but score submission failed. Please try again."
      );
      setIsSubmitting(false);
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

    if (validMove) {
      setCurrentStep((step) => step + 1);
      setScore((s) => s + getScore(nodeStatus));
      setGraphState(newState);
      setMessage(customMessage || getMessage(nodeStatus, nodeId));
      setOverlayState({
        show: true,
        content: { type: "correct", text: "Correct!" },
      });
    } else {
      setScore((s) => s - 5);
      setMessage(
        customMessage || `Invalid move! That's not the correct DFS step.`
      );
      setOverlayState({
        show: true,
        content: { type: "incorrect", text: "Incorrect!" },
      });
    }

    setMoves((m) => m + 1);
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

  // Handle game completion
  useEffect(() => {
    const checkGameCompletion = async () => {
      if (
        isGameComplete(graphState) &&
        !scoreSubmitted &&
        !submitAttempted.current
      ) {
        try {
          await submitScore();
        } catch (error) {
          console.error("Score submission error:", error);
        }
      }
    };

    checkGameCompletion();
  }, [graphState, isGameComplete, scoreSubmitted]);

  useEffect(() => {
    if (isGameComplete(graphState)) {
      setOverlayState({
        show: true,
        content: {
          type: "success",
          text: `Round ${round} Complete! Starting next round...`,
        },
      });

      setTimeout(() => {
        const algorithm = title.toLowerCase().includes("kruskal")
          ? "kruskal"
          : title.toLowerCase().includes("prim")
          ? "prim"
          : title.toLowerCase().includes("dijkstra")
          ? "dijkstra"
          : title.toLowerCase().includes("a*")
          ? "astar"
          : "default";

        handleRoundComplete(score, algorithm);
        setScore(0);
        setMoves(0);
      }, 2000);
    }
  }, [graphState, isGameComplete, round, score]);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score]);

  const DifficultyModal = ({ onClose, onSelect }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select Difficulty
        </h2>
        <div className="flex gap-4 justify-center">
          {Object.keys(DIFFICULTY_SETTINGS).map((level) => (
            <button
              key={level}
              onClick={() => {
                onSelect(level);
                onClose();
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg capitalize"
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const handleRoundComplete = async (currentScore, algorithm) => {
    const token = localStorage.getItem("token");

    let newState;
    if (isFordFulkerson) {
      newState = {
        ...graphState,
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
    } else if (
      algorithm === "kruskal" ||
      algorithm === "prim" ||
      algorithm === "dijkstra" ||
      algorithm === "astar"
    ) {
      newState = generateInitialGraphState(nodeCount, algorithm, difficulty);
    } else {
      // Keep existing BFS/DFS logic unchanged
      const { nodes, edges } = generateRandomGraph(nodeCount, difficulty);
      newState = {
        nodes: nodes.map((node) => ({
          ...node,
          visited: false,
          backtracked: algorithm === "dfs",
          current: false,
        })),
        edges,
        currentNode: null,
        stack: algorithm === "dfs" ? [] : undefined,
        queue: algorithm === "bfs" ? [] : undefined,
        visitedNodes: [],
        backtrackedNodes: algorithm === "dfs" ? [] : undefined,
        round: 1,
      };
    }

    setGraphState(newState);
    setRound((prev) => prev + 1);
    setTotalScore((prev) => prev + currentScore);
  };

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
    <main className="hidden lg:flex flex-col h-[calc(100vh-4rem)] p-4">
      <h1 className="text-2xl text-center md:text-3xl font-bold mb-2">
        {title}
      </h1>

      <div className="flex flex-col flex-1">
        {/* Top Controls Bar */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-6">
            <div className="text-lg">Round: {round}</div>
            <div className="text-lg">Total Score: {totalScore}</div>
            <div className="text-lg">Best Round Score: {bestScore}</div>
            <div className="flex gap-4">
              <div>Score: {score}</div>
              <div>Moves: {moves}</div>
            </div>
          </div>

          {/* Compact Feedback Section */}
          <div className="mx-4 flex-shrink-0 w-64">
            <div className="bg-white border border-gray-300 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold">Feedback</h2>
                <button
                  onClick={() => toggleSpeech(message)}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    isSpeakingFeedback ? "bg-gray-200" : ""
                  }`}
                >
                  🔊
                </button>
              </div>
              <p className="text-sm text-center">{message}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
            >
              Reset Game
            </button>
            <button
              onClick={() => setShowDifficultyModal(true)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Change Difficulty
            </button>
          </div>
        </div>

        {/* Centered Graph Section */}
        <div className="flex-1 relative mx-auto w-4/5">
          <div className="h-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            {renderGraphTabs()}
            <div className="flex items-center justify-center h-[calc(100%-2rem)]">
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
                  <p className="text-white text-2xl font-bold">
                    {overlayState.content.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <>
      {renderMainContent()}
      {showDifficultyModal && (
        <DifficultyModal
          onClose={() => setShowDifficultyModal(false)}
          onSelect={onDifficultySelect}
        />
      )}
    </>
  );
}
