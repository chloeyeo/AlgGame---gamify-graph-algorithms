"use client";
import React, { useState, useEffect } from "react";
import GraphVisualisation from "@/components/GraphVisualisation";
import { usePathname } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function GamePageStructure({
  title = "Graph Traversal Game",
  graphStates = [], // Array of graph states instead of individual props
  isValidMove = () => {},
  getNodeStatus = () => {},
  getScore = () => 0,
  getMessage = () => "No moves made yet.",
  isGameComplete = () => false,
  renderCustomUI = null,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentGraphStates, setCurrentGraphStates] = useState(graphStates);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayContent, setOverlayContent] = useState({ type: "", text: "" });
  const [isSpeakingFeedback, setIsSpeakingFeedback] = useState(false);
  const pathname = usePathname();
  const startTime = Date.now();

  useEffect(() => {
    setCurrentGraphStates(graphStates);
  }, [graphStates]);

  const isFordFulkersonPage = pathname.includes("ford-fulkerson");
  const isMultiGraphGame = graphStates.length > 1;

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
    setCurrentGraphStates(graphStates);
    setScore(0);
    setMoves(0);
    setMessage("Game reset. Click on a node to begin!");
    setShowOverlay(false);
  };

  const submitScore = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          algorithm: title.toLowerCase().split(" ")[0],
          score: getScore(),
          timeSpent: Date.now() - startTime,
          movesCount: moves,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit score");

      toast.success("Score submitted successfully!");
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error("Failed to submit score");
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
    if (isGameComplete(getCurrentGraphState())) return;

    const {
      newState,
      validMove,
      nodeStatus,
      message: customMessage,
    } = isValidMove(getCurrentGraphState(), nodeId);

    if (validMove) {
      const newScore = getScore(nodeStatus);
      setScore((s) => s + newScore);
      setMessage(customMessage || getMessage(nodeStatus, nodeId));
      setOverlayContent({ type: "correct", text: "Correct!" });
      setCurrentGraphState(newState);
    } else {
      setScore((s) => s - 5);
      setMessage(customMessage || `Invalid move to Node ${nodeId}!`);
      setOverlayContent({ type: "incorrect", text: "Incorrect!" });
    }

    setMoves((m) => m + 1);
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 1000);
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
    if (isGameComplete()) {
      submitScore();
      setMessage("Congratulations! You've completed the game!");
    }
  }, [moves, isGameComplete]);

  if (!graphStates.length) {
    return (
      <p className="text-center mt-[50%]">
        No content available at the moment.
      </p>
    );
  }

  const renderGraphTabs = () =>
    isMultiGraphGame && (
      <div className="flex mb-2 border-b overflow-clip overflow-x-auto no-scrollbar">
        {graphStates.map((_, index) => (
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
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
      <Toaster position="top-right" />
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{title}</h1>

      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between items-center">
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

        <div className="mb-6 relative">
          <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
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
              {showOverlay && (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    overlayContent.type === "correct"
                      ? "bg-green-500"
                      : "bg-red-500"
                  } bg-opacity-75`}
                >
                  <p className="text-white text-2xl font-bold">
                    {overlayContent.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {isFordFulkersonPage && (
          <div className="w-full">
            {renderCustomUI &&
              renderCustomUI(getCurrentGraphState(), setCurrentGraphState)}
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center mb-2">
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
          <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
            <p>{message}</p>
          </div>
        </div>

        {!isGameComplete(getCurrentGraphState()) &&
          getCurrentGraphState().currentNode === null && (
            <p className="text-red-800 text-center text-sm font-bold">
              ! Please click on a node to visit it
            </p>
          )}
      </div>
    </main>
  );

  return renderMainContent();
}
