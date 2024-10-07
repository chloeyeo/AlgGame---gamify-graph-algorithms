import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import Image from "next/image";
import GraphVisualisation from "@/components/GraphVisualisation";

export default function GamePageStructure({
  title = "Graph Traversal Game",
  initialGraphState = null, // Default to null if not provided
  isValidMove = () => {}, // Default to an empty function
  getNodeStatus = () => {}, // Default to an empty function
  getScore = () => 0, // Default to return 0
  getMessage = () => "No moves made yet.", // Default message
  isGameComplete = () => false, // Default to return false
}) {
  const [graphState, setGraphState] = useState(initialGraphState);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayContent, setOverlayContent] = useState({ type: "", text: "" });
  const [isSpeakingFeedback, setIsSpeakingFeedback] = useState(false);
  // const algorithm = useSelector((state) => state.algorithm.selectedAlgorithm);

  if (!initialGraphState) {
    return (
      <p className="text-center mt-[50%]">
        No content available at the moment.
      </p>
    ); // Fallback content if no initialGraphState
  }

  const handleNodeClick = (nodeId) => {
    if (isGameComplete(graphState)) return;

    const { newState, validMove, nodeStatus } = isValidMove(graphState, nodeId);

    if (validMove) {
      const newScore = getScore(nodeStatus);
      setScore((s) => s + newScore);
      setMessage(getMessage(nodeStatus, nodeId));
      setOverlayContent({ type: "correct", text: "Correct!" });
      setGraphState(newState);
    } else {
      setScore((s) => s - 5);
      setMessage(`Invalid move to Node ${nodeId}!`);
      setOverlayContent({ type: "incorrect", text: "Incorrect!" });
    }

    setMoves((m) => m + 1);
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 1000);
  };

  const readAloud = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.onstart = () => setIsSpeakingFeedback(true);
      utterance.onend = () => setIsSpeakingFeedback(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // useEffect(() => {
  //   readAloud(message);
  // }, [message]);

  return (
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{title}</h1>

      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between">
          <div>Score: {score}</div>
          <div>Moves: {moves}</div>
        </div>

        <div className="mb-6 relative">
          <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
          <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-[27rem] overflow-hidden relative">
            <GraphVisualisation
              graphState={graphState}
              onNodeClick={handleNodeClick}
              mode="game"
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

        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold flex items-center">
            <Image
              src="/images/person-speaking.png"
              alt="person speaking icon"
              width={40}
              height={40}
              className={`${
                isSpeakingFeedback ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
              onClick={() => readAloud(message)}
            />
            <span className="ml-2">Feedback</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
            <p>{message}</p>
          </div>
        </div>

        {!isGameComplete(graphState) && graphState.currentNode === null && (
          <p className="text-red-800 text-center text-sm font-bold">
            ! Please click on a node to visit it
          </p>
        )}
      </div>
    </main>
  );
}
