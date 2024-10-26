"use client";

import React, { useState } from "react";

const HungarianKhunMunkresGamePage = () => {
  const [gameState, setGameState] = useState({
    matrix: [
      [40, 60, 15],
      [25, 30, 45],
      [55, 30, 25],
    ],
    currentStep: 0,
    rowMinima: [],
    colMinima: [],
    lines: [],
    selectedCells: [],
    score: 0,
    message:
      "Let's start solving the assignment problem! First, find row minima.",
    gamePhase: "ROW_REDUCTION",
  });

  const phases = {
    ROW_REDUCTION: "ROW_REDUCTION",
    COLUMN_REDUCTION: "COLUMN_REDUCTION",
    ZERO_MARKING: "ZERO_MARKING",
    LINE_DRAWING: "LINE_DRAWING",
    FIND_MIN_UNCOVERED: "FIND_MIN_UNCOVERED",
    MATRIX_ADJUSTMENT: "MATRIX_ADJUSTMENT",
    FINAL_ASSIGNMENT: "FINAL_ASSIGNMENT",
  };

  const [selectedValue, setSelectedValue] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const validateRowMinimum = (rowIndex, value) => {
    const row = gameState.matrix[rowIndex];
    return Math.min(...row) === value;
  };

  const validateColMinimum = (colIndex, value) => {
    const col = gameState.matrix.map((row) => row[colIndex]);
    return Math.min(...col) === value;
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (isComplete) return;

    const value = gameState.matrix[rowIndex][colIndex];

    switch (gameState.gamePhase) {
      case phases.ROW_REDUCTION:
        if (validateRowMinimum(rowIndex, value)) {
          const newRowMinima = [...gameState.rowMinima];
          newRowMinima[rowIndex] = value;

          const allRowsFound = newRowMinima.length === gameState.matrix.length;

          setGameState((prev) => ({
            ...prev,
            rowMinima: newRowMinima,
            score: prev.score + 10,
            message: allRowsFound
              ? "Great! Now subtract these minima from their respective rows."
              : "Correct! Find the minimum value for the next row.",
            gamePhase: allRowsFound
              ? phases.COLUMN_REDUCTION
              : phases.ROW_REDUCTION,
          }));
        } else {
          setGameState((prev) => ({
            ...prev,
            score: prev.score - 5,
            message: "That's not the minimum value in this row. Try again!",
          }));
        }
        break;

      case phases.COLUMN_REDUCTION:
        if (validateColMinimum(colIndex, value)) {
          const newColMinima = [...gameState.colMinima];
          newColMinima[colIndex] = value;

          const allColsFound =
            newColMinima.length === gameState.matrix[0].length;

          setGameState((prev) => ({
            ...prev,
            colMinima: newColMinima,
            score: prev.score + 10,
            message: allColsFound
              ? "Perfect! Now let's find all zeros in the reduced matrix."
              : "Correct! Find the minimum value for the next column.",
            gamePhase: allColsFound
              ? phases.ZERO_MARKING
              : phases.COLUMN_REDUCTION,
          }));
        } else {
          setGameState((prev) => ({
            ...prev,
            score: prev.score - 5,
            message: "That's not the minimum value in this column. Try again!",
          }));
        }
        break;

      case phases.ZERO_MARKING:
        if (value === 0) {
          const newSelectedCells = [
            ...gameState.selectedCells,
            [rowIndex, colIndex],
          ];
          setGameState((prev) => ({
            ...prev,
            selectedCells: newSelectedCells,
            score: prev.score + 5,
            message: "Good! Keep marking zeros.",
          }));
        } else {
          setGameState((prev) => ({
            ...prev,
            score: prev.score - 5,
            message: "This cell isn't a zero. Look for cells with value 0.",
          }));
        }
        break;

      case phases.LINE_DRAWING:
        const newLines = [...gameState.lines, [rowIndex, colIndex]];
        setGameState((prev) => ({
          ...prev,
          lines: newLines,
          message: "Drawing line... Click another cell to complete the line.",
        }));
        break;

      default:
        break;
    }
  };

  const renderCell = (value, rowIndex, colIndex) => {
    const isSelected = gameState.selectedCells.some(
      ([r, c]) => r === rowIndex && c === colIndex
    );
    const isInLine = gameState.lines.some(
      ([r, c]) => r === rowIndex || c === colIndex
    );

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        onClick={() => handleCellClick(rowIndex, colIndex)}
        className={`
          w-16 h-16 
          flex items-center justify-center 
          border border-gray-300 
          cursor-pointer 
          transition-colors
          ${isSelected ? "bg-yellow-200" : ""}
          ${isInLine ? "bg-blue-100" : ""}
          ${value === 0 ? "text-red-500 font-bold" : ""}
          hover:bg-gray-100
        `}
      >
        {value}
      </div>
    );
  };

  return (
    <main className="flex flex-col p-6 pt-8 items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Hungarian Algorithm Game
      </h1>

      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between">
          <div>Score: {gameState.score}</div>
          <div>Phase: {gameState.gamePhase.replace("_", " ")}</div>
        </div>

        <div className="mb-6 relative">
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-1 mb-4">
              {gameState.matrix.map((row, rowIndex) =>
                row.map((cell, colIndex) =>
                  renderCell(cell, rowIndex, colIndex)
                )
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">Instructions</h2>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p className="text-center">{gameState.message}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              if (gameState.gamePhase === phases.ZERO_MARKING) {
                setGameState((prev) => ({
                  ...prev,
                  gamePhase: phases.LINE_DRAWING,
                  message:
                    "Now draw minimum number of lines to cover all zeros.",
                }));
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next Step
          </button>

          <button
            onClick={() => {
              setGameState((prev) => ({
                ...prev,
                matrix: [
                  [40, 60, 15],
                  [25, 30, 45],
                  [55, 30, 25],
                ],
                currentStep: 0,
                rowMinima: [],
                colMinima: [],
                lines: [],
                selectedCells: [],
                score: 0,
                message:
                  "Let's start solving the assignment problem! First, find row minima.",
                gamePhase: phases.ROW_REDUCTION,
              }));
              setIsComplete(false);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  );
};

export default HungarianKhunMunkresGamePage;
