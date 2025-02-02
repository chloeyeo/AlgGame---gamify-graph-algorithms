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

const API_URL = BACKEND_URL;

const DifficultySelector = ({ onSelect }) => (
  <div className="flex flex-col items-center justify-center h-screen">
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
);

export default function GamePageStructure({
  title = "Graph Traversal Game",
  graphState,
  setGraphState,
  isValidMove,
  getNodeStatus,
  getScore,
  getMessage,
  isGameComplete,
  onRoundComplete,
  round,
  totalScore,
  nodeCountProp,
  onNodeCountChange,
  difficulty,
  onDifficultySelect,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Start DFS from any node!");
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
      setMessage("Please log in to save your score!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${BACKEND_URL}/api/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          algorithm: title.split(" ")[0].toLowerCase(),
          score,
          timeSpent: Date.now() - startTime,
          movesCount: moves,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Score submission failed:", errorData);
        throw new Error(errorData.message || "Failed to submit score");
      }

      const data = await response.json();
      setScoreSubmitted(true);
      setMessage("Score submitted successfully!");
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
        onRoundComplete(score);
        setOverlayState({ show: false, content: { type: "", text: "" } });
      }, 2000);
    }
  }, [graphState, isGameComplete, round, onRoundComplete, score]);

  const isValidDFSMove = (graphState, nodeId) => {
    const newState = { ...graphState };
    const clickedNode = newState.nodes.find((n) => n.id === nodeId);

    // First move
    if (!newState.currentNode) {
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack = [nodeId];
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Starting DFS from node ${nodeId}`,
      };
    }

    // Get unvisited neighbors of current node
    const currentNodeNeighbors = newState.edges
      .filter((e) => e.source === newState.currentNode)
      .map((e) => e.target);

    const unvisitedNeighbors = currentNodeNeighbors.filter(
      (n) => !newState.nodes.find((node) => node.id === n).visited
    );

    // If clicked node is unvisited neighbor
    if (unvisitedNeighbors.includes(nodeId)) {
      const prevNode = newState.nodes.find(
        (n) => n.id === newState.currentNode
      );
      prevNode.current = false;
      clickedNode.visited = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.push(nodeId);
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Visited node ${nodeId}`,
      };
    }

    // If no unvisited neighbors, allow backtracking
    if (
      unvisitedNeighbors.length === 0 &&
      newState.stack.length > 1 &&
      newState.stack[newState.stack.length - 2] === nodeId
    ) {
      const prevNode = newState.nodes.find(
        (n) => n.id === newState.currentNode
      );
      prevNode.current = false;
      prevNode.backtracked = true;
      clickedNode.current = true;
      newState.currentNode = nodeId;
      newState.stack.pop();
      return {
        validMove: true,
        newState,
        nodeStatus: "correct",
        message: `Backtracked to node ${nodeId}`,
      };
    }

    return {
      validMove: false,
      newState: graphState,
      nodeStatus: "incorrect",
      message:
        "Invalid move! Follow DFS rules: visit unvisited neighbors or backtrack when needed.",
    };
  };

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score]);

  const DifficultyModal = ({ onClose, onSelect }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Select Difficulty</h2>
        <div className="flex gap-4">
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
    <main className="hidden lg:flex flex-col p-4 max-h-screen">
      <h1 className="text-2xl text-center md:text-3xl font-bold mt-2">
        {title}
      </h1>

      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-4">
            <div className="flex gap-6">
              <div className="text-lg">Round: {round}</div>
              <div className="text-lg">Total Score: {totalScore}</div>
              <div className="text-lg">
                Best Round Score: {Math.max(score, bestScore)}
              </div>
              <button
                onClick={() => setShowDifficultyModal(true)}
                className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Change Difficulty
              </button>
            </div>
          </div>
        </div>

        <div className="flex mb-2 justify-between items-center">
          <div className="flex gap-4">
            <div>Score: {score}</div>
            <div>Moves: {moves}</div>
          </div>
          <button
            onClick={resetGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
          >
            Reset Game
          </button>
        </div>

        <div className="mb-2 relative">
          <div className="bg-white border border-gray-300 rounded-lg">
            {renderGraphTabs()}
            <div className="flex items-center justify-center h-[27rem] relative">
              <GraphVisualisation
                graphState={getCurrentGraphState()}
                onNodeClick={handleNodeClick}
                mode="game"
                isGraphA={activeTab === 0}
                graphIndex={activeTab}
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

        {isFordFulkersonPage && (
          <div className="mb-2">
            {nodeCountProp &&
              nodeCountProp(getCurrentGraphState(), setCurrentGraphState)}
          </div>
        )}

        <div>
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Feedback</h2>
            <button
              onClick={() => toggleSpeech(message)}
              className={`ml-2 p-2 rounded-full hover:bg-gray-100 ${
                isSpeakingFeedback ? "bg-gray-200" : ""
              }`}
            >
              🔊
            </button>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-3 text-center">
            <p>{message}</p>
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
