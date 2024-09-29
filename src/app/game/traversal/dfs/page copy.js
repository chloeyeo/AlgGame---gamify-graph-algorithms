"use client";

import { useState } from "react";
import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false },
    { id: "B", visited: false },
    { id: "C", visited: false },
    { id: "D", visited: false },
    { id: "E", visited: false },
    { id: "F", visited: false },
    { id: "G", visited: false },
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" },
    { source: "B", target: "E" },
    { source: "C", target: "F" },
    { source: "D", target: "G" },
  ],
  currentNode: null,
};

const correctDFSOrder = ["A", "B", "D", "G", "E", "C", "F"];

export default function DFSGamePage() {
  const [graphState, setGraphState] = useState(initialGraphState);
  const [userMoves, setUserMoves] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleNodeClick = (nodeId) => {
    if (gameOver) return;

    const newGraphState = { ...graphState };
    const clickedNode = newGraphState.nodes.find((node) => node.id === nodeId);

    if (!clickedNode.visited) {
      clickedNode.visited = true;
      newGraphState.currentNode = nodeId;
      setGraphState(newGraphState);

      const newMoves = [...userMoves, nodeId];
      setUserMoves(newMoves);

      // Check if the move is correct
      if (nodeId === correctDFSOrder[userMoves.length]) {
        setScore(score + 10);
      } else {
        setScore(Math.max(0, score - 5));
      }

      // Check if the game is over
      if (newMoves.length === correctDFSOrder.length) {
        setGameOver(true);
      }
    }
  };

  const generateFeedback = () => {
    if (gameOver) {
      return `Game Over! Your final score is ${score}. You made ${userMoves.length} moves.`;
    }

    const lastMove = userMoves[userMoves.length - 1];
    const expectedMove = correctDFSOrder[userMoves.length - 1];

    if (lastMove === expectedMove) {
      return `Great job! You've correctly visited node ${lastMove}. Keep going!`;
    } else if (lastMove) {
      return `Oops! Visiting node ${lastMove} wasn't the best move. Try to think about which unvisited node you should explore next.`;
    } else {
      return "Start by clicking on the root node to begin the DFS traversal.";
    }
  };

  const gameSteps = [
    {
      graphState: graphState,
      feedback: generateFeedback(),
    },
  ];

  return (
    <GamePageStructure
      title="Depth-First Search (DFS) Game"
      steps={gameSteps}
      onNodeClick={handleNodeClick}
      score={score}
      moves={userMoves.length}
    />
  );
}
