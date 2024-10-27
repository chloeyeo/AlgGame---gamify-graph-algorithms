"use client";

import React, { useState, useEffect } from "react";

const HungarianKhunMunkresGamePage = () => {
  const initialMatrix = [
    [40, 60, 15],
    [25, 30, 45],
    [55, 30, 25],
  ];

  const [matrix, setMatrix] = useState(initialMatrix);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState(
    "Start by subtracting the minimum value from each row!"
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayContent, setOverlayContent] = useState({ type: "", text: "" });
  const [selectedCells, setSelectedCells] = useState([]);
  const [rowMinima, setRowMinima] = useState([]);
  const [colMinima, setColMinima] = useState([]);

  // Calculate the minimum value in a row
  const getRowMinimum = (row) => Math.min(...row);

  // Calculate the minimum value in a column
  const getColMinimum = (colIndex) =>
    Math.min(...matrix.map((row) => row[colIndex]));

  // Check if the current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 0: // Row reduction
        return rowMinima.length === matrix.length;
      case 1: // Column reduction
        return colMinima.length === matrix[0].length;
      case 2: // Zero selection
        return selectedCells.length === matrix.length;
      default:
        return false;
    }
  };

  // Effect to check step completion after each move
  useEffect(() => {
    if (isStepComplete()) {
      const nextStep = currentStep + 1;
      if (nextStep < 3) {
        setTimeout(() => {
          setCurrentStep(nextStep);
          switch (nextStep) {
            case 1:
              setMessage("Now find the minimum values in each column!");
              break;
            case 2:
              setMessage("Select independent zeros (no shared rows/columns)!");
              break;
          }
        }, 1000);
      } else {
        setMessage(
          "Congratulations! You've completed the Hungarian Algorithm!"
        );
      }
    }
  }, [rowMinima, colMinima, selectedCells, currentStep]);

  // Handle cell click for different steps
  const handleCellClick = (rowIndex, colIndex) => {
    if (showOverlay) return;

    const value = matrix[rowIndex][colIndex];
    let isValidMove = false;
    let newMessage = "";

    switch (currentStep) {
      case 0: // Row reduction step
        if (!rowMinima.includes(rowIndex)) {
          const minimum = getRowMinimum(matrix[rowIndex]);
          if (value === minimum) {
            setRowMinima([...rowMinima, rowIndex]);
            const newMatrix = [...matrix];
            newMatrix[rowIndex] = newMatrix[rowIndex].map(
              (val) => val - minimum
            );
            setMatrix(newMatrix);
            isValidMove = true;
            newMessage = `Good! Row ${rowIndex + 1} minimum found. ${
              matrix.length - rowMinima.length - 1
            } rows remaining.`;
            setScore(score + 10);
          } else {
            newMessage = "That's not the minimum value in this row!";
            setScore(score - 5);
          }
        } else {
          newMessage = "This row has already been processed!";
        }
        break;

      case 1: // Column reduction step
        if (!colMinima.includes(colIndex)) {
          const minimum = getColMinimum(colIndex);
          if (value === minimum) {
            setColMinima([...colMinima, colIndex]);
            const newMatrix = matrix.map((row) => [...row]);
            for (let i = 0; i < matrix.length; i++) {
              newMatrix[i][colIndex] -= minimum;
            }
            setMatrix(newMatrix);
            isValidMove = true;
            newMessage = `Good! Column ${colIndex + 1} minimum found. ${
              matrix[0].length - colMinima.length - 1
            } columns remaining.`;
            setScore(score + 10);
          } else {
            newMessage = "That's not the minimum value in this column!";
            setScore(score - 5);
          }
        } else {
          newMessage = "This column has already been processed!";
        }
        break;

      case 2: // Zero selection step
        if (
          value === 0 &&
          !selectedCells.some(
            (cell) => cell.row === rowIndex || cell.col === colIndex
          )
        ) {
          setSelectedCells([
            ...selectedCells,
            { row: rowIndex, col: colIndex },
          ]);
          isValidMove = true;
          newMessage = `Good zero selection! ${
            matrix.length - selectedCells.length - 1
          } selections remaining.`;
          setScore(score + 15);
        } else if (value !== 0) {
          newMessage = "You must select cells with zero value!";
          setScore(score - 5);
        } else {
          newMessage = "Invalid selection! Choose an unclaimed zero.";
          setScore(score - 5);
        }
        break;
    }

    setMessage(newMessage);
    setMoves(moves + 1);

    if (isValidMove) {
      setShowOverlay(true);
      setOverlayContent({ type: "correct", text: "Correct!" });
    } else {
      setShowOverlay(true);
      setOverlayContent({ type: "incorrect", text: "Incorrect!" });
    }

    setTimeout(() => setShowOverlay(false), 1000);
  };

  return (
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Hungarian Algorithm Game
      </h1>

      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between">
          <div>Score: {score}</div>
          <div>Moves: {moves}</div>
        </div>

        <div className="mb-6 relative">
          <h2 className="text-xl mb-2 font-semibold">Matrix Visualization</h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-3 gap-1 relative">
                {matrix.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isSelected = selectedCells.some(
                      (s) => s.row === rowIndex && s.col === colIndex
                    );
                    const originalValue = initialMatrix[rowIndex][colIndex];
                    const difference = cell - originalValue;

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`
                          w-24 h-24 
                          flex flex-col items-center justify-center 
                          border border-gray-300
                          ${isSelected ? "bg-green-200" : "bg-white"}
                          ${
                            rowMinima.includes(rowIndex)
                              ? "border-blue-500"
                              : ""
                          }
                          ${
                            colMinima.includes(colIndex)
                              ? "border-green-500"
                              : ""
                          }
                          hover:bg-gray-50
                          transition-colors
                          relative
                        `}
                      >
                        <span className="text-lg font-semibold">{cell}</span>
                        {difference !== 0 && (
                          <span className="text-xs text-red-500">
                            ({difference > 0 ? "+" : ""}
                            {difference})
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
                {showOverlay && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      overlayContent.type === "correct"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } bg-opacity-75 rounded-lg`}
                  >
                    <p className="text-white text-2xl font-bold">
                      {overlayContent.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">Feedback</h2>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
            <p>{message}</p>
          </div>
        </div>

        <div className="text-center text-sm">
          <p className="font-semibold mb-2">
            Current Step: {currentStep + 1}/3
          </p>
          <p>
            {currentStep === 0 &&
              "Find and click the minimum value in each row"}
            {currentStep === 1 &&
              "Find and click the minimum value in each column"}
            {currentStep === 2 &&
              "Select independent zeros (no shared rows/columns)"}
          </p>
        </div>
      </div>
    </main>
  );
};

export default HungarianKhunMunkresGamePage;
