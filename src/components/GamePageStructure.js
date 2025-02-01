"use client";
import React, { useState, useEffect, useRef } from "react";
import GraphVisualisation from "@/components/GraphVisualisation";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";

const API_URL = BACKEND_URL;

export default function GamePageStructure({
  title = "Graph Traversal Game",
  graphState,
  setGraphState,
  isValidMove,
  getNodeStatus,
  getScore,
  getMessage,
  isGameComplete,
  nodeCountProp,
  onNodeCountChange,
  maxNodes = 8,
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
    setCurrentGraphStates([graphState]);
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
    submitAttempted.current = true;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Playing as guest - sign in to save your scores!", {
        toastId: "guest-score",
        position: "top-right",
        autoClose: 3000,
      });
      setScoreSubmitted(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${API_URL}/api/scores`,
        {
          algorithm: title.toLowerCase().split(" ")[0],
          score: score,
          timeSpent: Date.now() - startTime,
          movesCount: moves,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setScoreSubmitted(true);
      toast.success("Score submitted successfully!");
      return response.data;
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error("Failed to submit score");
      setScoreSubmitted(true);
    } finally {
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
        await submitScore();
        setMessage("Congratulations! You've completed the game!");
        setOverlayState({
          show: true,
          content: {
            type: "correct",
            text: "Congratulations! You've completed the game!",
          },
        });
      }
    };

    checkGameCompletion();
  }, [graphState, isGameComplete, scoreSubmitted]);

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
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>

      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-2 flex justify-between items-center">
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
          <div className="flex items-center mb-1">
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

  return renderMainContent();
}
