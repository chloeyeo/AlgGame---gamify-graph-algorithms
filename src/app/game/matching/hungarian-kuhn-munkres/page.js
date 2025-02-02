// "use client";

// import React, { useState, useEffect } from "react";

// const HungarianKhunMunkresGamePage = () => {
//   const initialMatrix = [
//     [40, 60, 15],
//     [25, 30, 45],
//     [55, 30, 25],
//   ];

//   const [matrix, setMatrix] = useState(initialMatrix);
//   const [score, setScore] = useState(0);
//   const [moves, setMoves] = useState(0);
//   const [message, setMessage] = useState(
//     "Start by subtracting the minimum value from each row!"
//   );
//   const [currentStep, setCurrentStep] = useState(0);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [overlayContent, setOverlayContent] = useState({ type: "", text: "" });
//   const [selectedCells, setSelectedCells] = useState([]);
//   const [rowMinima, setRowMinima] = useState([]);
//   const [colMinima, setColMinima] = useState([]);
//   const [lines, setLines] = useState({ rows: [], cols: [] });
//   const [adjustmentValue, setAdjustmentValue] = useState(null);
//   const [finalAssignments, setFinalAssignments] = useState([]);
//   const [drawMode, setDrawMode] = useState(null);
//   const [uncoveredCells, setUncoveredCells] = useState([]);
//   const [invalidAssignmentPairs, setInvalidAssignmentPairs] = useState([]);
//   const [unassignedRowsCols, setUnassignedRowsCols] = useState({
//     rows: [],
//     cols: [],
//   });

//   // Helper function to find all zeros in the matrix
//   const findAllZeros = () => {
//     const zeros = [];
//     for (let i = 0; i < matrix.length; i++) {
//       for (let j = 0; j < matrix[0].length; j++) {
//         if (matrix[i][j] === 0) {
//           zeros.push({ row: i, col: j });
//         }
//       }
//     }
//     return zeros;
//   };

//   // Helper function to check if an assignment is valid
//   const isValidAssignment = (assignments, newRow, newCol) => {
//     return !assignments.some(
//       (assignment) => assignment.row === newRow || assignment.col === newCol
//     );
//   };

//   // Helper function to update unassigned rows and columns
//   const updateUnassignedRowsCols = (assignments) => {
//     const assignedRows = new Set(assignments.map((a) => a.row));
//     const assignedCols = new Set(assignments.map((a) => a.col));

//     const unassignedRows = [];
//     const unassignedCols = [];

//     for (let i = 0; i < matrix.length; i++) {
//       if (!assignedRows.has(i)) unassignedRows.push(i);
//     }
//     for (let j = 0; j < matrix[0].length; j++) {
//       if (!assignedCols.has(j)) unassignedCols.push(j);
//     }

//     setUnassignedRowsCols({ rows: unassignedRows, cols: unassignedCols });
//   };

//   // Calculate the minimum value in a row
//   const getRowMinimum = (row) => Math.min(...row);

//   // Calculate the minimum value in a column
//   const getColMinimum = (colIndex) =>
//     Math.min(...matrix.map((row) => row[colIndex]));

//   // Count zeros in row/column
//   const countZeros = (index, type) => {
//     if (type === "row") {
//       return matrix[index].filter((val) => val === 0).length;
//     } else {
//       return matrix.filter((row) => row[index] === 0).length;
//     }
//   };

//   // Find minimum uncovered value
//   const findMinUncovered = () => {
//     let min = Infinity;
//     matrix.forEach((row, rowIndex) => {
//       row.forEach((value, colIndex) => {
//         if (!lines.rows.includes(rowIndex) && !lines.cols.includes(colIndex)) {
//           min = Math.min(min, value);
//         }
//       });
//     });
//     return min;
//   };

//   // Verify if lines cover all zeros
//   const doLinesCoverAllZeros = () => {
//     let uncovered = [];
//     for (let i = 0; i < matrix.length; i++) {
//       for (let j = 0; j < matrix[0].length; j++) {
//         if (
//           matrix[i][j] === 0 &&
//           !lines.rows.includes(i) &&
//           !lines.cols.includes(j)
//         ) {
//           uncovered.push({ row: i, col: j });
//         }
//       }
//     }
//     setUncoveredCells(uncovered);
//     return uncovered.length === 0;
//   };

//   // Check if final assignments are optimal
//   const checkOptimalAssignments = () => {
//     // Check if assignments are independent (no shared rows/cols)
//     const rows = new Set();
//     const cols = new Set();
//     for (const assignment of finalAssignments) {
//       if (rows.has(assignment.row) || cols.has(assignment.col)) {
//         return false;
//       }
//       rows.add(assignment.row);
//       cols.add(assignment.col);
//     }

//     // Check if all assignments are zeros
//     return finalAssignments.every(({ row, col }) => matrix[row][col] === 0);
//   };

//   // Check if the current step is complete
//   const isStepComplete = () => {
//     switch (currentStep) {
//       case 0:
//         return rowMinima.length === matrix.length;
//       case 1:
//         return colMinima.length === matrix[0].length;
//       case 2:
//         return (
//           selectedCells.length === Math.min(matrix.length, matrix[0].length)
//         );
//       case 3:
//         const minLines = Math.min(matrix.length, matrix[0].length);
//         return (
//           doLinesCoverAllZeros() &&
//           lines.rows.length + lines.cols.length === minLines
//         );
//       case 4:
//         return adjustmentValue !== null;
//       case 5:
//         return (
//           finalAssignments.length ===
//             Math.min(matrix.length, matrix[0].length) &&
//           checkOptimalAssignments()
//         );
//       default:
//         return false;
//     }
//   };

//   // Handle line drawing mode selection
//   const toggleDrawMode = (mode) => {
//     setDrawMode(drawMode === mode ? null : mode);
//   };

//   // Reset lines
//   const resetLines = () => {
//     setLines({ rows: [], cols: [] });
//     setDrawMode(null);
//   };

//   const handleCellClick = (rowIndex, colIndex) => {
//     if (showOverlay) return;

//     const value = matrix[rowIndex][colIndex];
//     let isValidMove = false;
//     let newMessage = "";

//     switch (currentStep) {
//       case 0: // Row reduction step
//         if (!rowMinima.includes(rowIndex)) {
//           const minimum = getRowMinimum(matrix[rowIndex]);
//           if (value === minimum) {
//             setRowMinima([...rowMinima, rowIndex]);
//             const newMatrix = [...matrix];
//             newMatrix[rowIndex] = newMatrix[rowIndex].map(
//               (val) => val - minimum
//             );
//             setMatrix(newMatrix);
//             isValidMove = true;
//             newMessage = `Good! Row ${rowIndex + 1} minimum found. ${
//               matrix.length - rowMinima.length - 1
//             } rows remaining.`;
//             setScore(score + 10);
//           } else {
//             newMessage = "That's not the minimum value in this row!";
//             setScore(score - 5);
//           }
//         }
//         break;

//       case 1: // Column reduction step
//         if (!colMinima.includes(colIndex)) {
//           const minimum = getColMinimum(colIndex);
//           if (value === minimum) {
//             setColMinima([...colMinima, colIndex]);
//             const newMatrix = matrix.map((row) => [...row]);
//             for (let i = 0; i < matrix.length; i++) {
//               newMatrix[i][colIndex] -= minimum;
//             }
//             setMatrix(newMatrix);
//             isValidMove = true;
//             newMessage = `Good! Column ${colIndex + 1} minimum found. ${
//               matrix[0].length - colMinima.length - 1
//             } columns remaining.`;
//             setScore(score + 10);
//           } else {
//             newMessage = "That's not the minimum value in this column!";
//             setScore(score - 5);
//           }
//         }
//         break;

//       case 2: // Zero selection step
//         if (
//           value === 0 &&
//           !selectedCells.some(
//             (cell) => cell.row === rowIndex || cell.col === colIndex
//           )
//         ) {
//           setSelectedCells([
//             ...selectedCells,
//             { row: rowIndex, col: colIndex },
//           ]);
//           isValidMove = true;
//           newMessage = `Good zero selection! ${
//             Math.min(matrix.length, matrix[0].length) - selectedCells.length - 1
//           } selections remaining.`;
//           setScore(score + 15);
//         } else {
//           newMessage =
//             value !== 0
//               ? "You must select cells with zero value!"
//               : "Invalid selection! Choose an unclaimed zero.";
//           setScore(score - 5);
//         }
//         break;

//       case 3: // Line drawing step
//         if (drawMode === "row" && !lines.rows.includes(rowIndex)) {
//           const newLines = {
//             ...lines,
//             rows: [...lines.rows, rowIndex],
//           };
//           setLines(newLines);
//           isValidMove = true;
//           newMessage = "Row line drawn! ";
//           if (!doLinesCoverAllZeros()) {
//             newMessage += `${uncoveredCells.length} zeros still uncovered.`;
//           }
//           setScore(score + 15);
//         } else if (drawMode === "col" && !lines.cols.includes(colIndex)) {
//           const newLines = {
//             ...lines,
//             cols: [...lines.cols, colIndex],
//           };
//           setLines(newLines);
//           isValidMove = true;
//           newMessage = "Column line drawn! ";
//           if (!doLinesCoverAllZeros()) {
//             newMessage += `${uncoveredCells.length} zeros still uncovered.`;
//           }
//           setScore(score + 15);
//         } else {
//           newMessage = drawMode
//             ? "Line already drawn here!"
//             : "Select drawing mode first!";
//           setScore(score - 5);
//         }
//         break;

//       case 4: // Matrix adjustment step
//         if (!lines.rows.includes(rowIndex) && !lines.cols.includes(colIndex)) {
//           const minUncovered = findMinUncovered();
//           if (value === minUncovered) {
//             const newMatrix = matrix.map((row, i) =>
//               row.map((val, j) => {
//                 if (!lines.rows.includes(i) && !lines.cols.includes(j)) {
//                   return val - minUncovered;
//                 } else if (lines.rows.includes(i) && lines.cols.includes(j)) {
//                   return val + minUncovered;
//                 }
//                 return val;
//               })
//             );
//             setMatrix(newMatrix);
//             setAdjustmentValue(minUncovered);
//             setLines({ rows: [], cols: [] }); // Reset lines after adjustment
//             isValidMove = true;
//             newMessage = "Correct minimum uncovered value found!";
//             setScore(score + 20);
//           } else {
//             newMessage = "That's not the minimum uncovered value!";
//             setScore(score - 5);
//           }
//         } else {
//           newMessage = "Select an uncovered cell!";
//           setScore(score - 5);
//         }
//         break;

//       case 5: // Final assignment step
//         if (value === 0) {
//           const isValid = isValidAssignment(
//             finalAssignments,
//             rowIndex,
//             colIndex
//           );

//           if (isValid) {
//             const newAssignments = [
//               ...finalAssignments,
//               { row: rowIndex, col: colIndex },
//             ];
//             setFinalAssignments(newAssignments);
//             updateUnassignedRowsCols(newAssignments);
//             isValidMove = true;

//             if (
//               newAssignments.length ===
//               Math.min(matrix.length, matrix[0].length)
//             ) {
//               // Check if this is a complete optimal assignment
//               const zeros = findAllZeros();
//               const isOptimal = checkOptimalAssignments();

//               if (isOptimal) {
//                 const totalCost = newAssignments.reduce((sum, { row, col }) => {
//                   return sum + initialMatrix[row][col];
//                 }, 0);
//                 newMessage = `Congratulations! You've found an optimal assignment with total cost: ${totalCost}`;
//                 setScore(score + 50);
//               } else {
//                 newMessage =
//                   "This assignment is not optimal. Try a different combination!";
//                 setFinalAssignments([]);
//                 setScore(score - 10);
//                 isValidMove = false;
//               }
//             } else {
//               const remaining =
//                 Math.min(matrix.length, matrix[0].length) -
//                 newAssignments.length;
//               newMessage = `Good assignment! ${remaining} assignments remaining. `;
//               if (unassignedRowsCols.rows.length > 0) {
//                 newMessage += `Unassigned rows: ${unassignedRowsCols.rows
//                   .map((r) => r + 1)
//                   .join(", ")}. `;
//               }
//               if (unassignedRowsCols.cols.length > 0) {
//                 newMessage += `Unassigned columns: ${unassignedRowsCols.cols
//                   .map((c) => c + 1)
//                   .join(", ")}`;
//               }
//               setScore(score + 25);
//             }
//           } else {
//             const conflictingAssignments = finalAssignments.filter(
//               (assignment) =>
//                 assignment.row === rowIndex || assignment.col === colIndex
//             );
//             setInvalidAssignmentPairs(conflictingAssignments);
//             newMessage =
//               "Invalid assignment! This row or column is already assigned.";
//             setScore(score - 5);
//           }
//         } else {
//           newMessage = "Invalid assignment! Choose a cell with zero value.";
//           setScore(score - 5);
//         }
//         break;
//     }

//     setMessage(newMessage);
//     setMoves(moves + 1);

//     if (isValidMove) {
//       setShowOverlay(true);
//       setOverlayContent({ type: "correct", text: "Correct!" });
//       setTimeout(() => setShowOverlay(false), 1000);
//     } else {
//       setShowOverlay(true);
//       setOverlayContent({ type: "incorrect", text: "Incorrect!" });
//       setTimeout(() => setShowOverlay(false), 1000);
//     }
//   };

//   // Effect to check step completion and advance to next step
//   useEffect(() => {
//     if (isStepComplete()) {
//       const nextStep = currentStep + 1;
//       if (nextStep < 6) {
//         setTimeout(() => {
//           setCurrentStep(nextStep);
//           setDrawMode(null);
//           switch (nextStep) {
//             case 1:
//               setMessage("Now find the minimum values in each column!");
//               break;
//             case 2:
//               setMessage("Select independent zeros (no shared rows/columns)!");
//               break;
//             case 3:
//               setMessage("Draw minimum number of lines to cover all zeros!");
//               break;
//             case 4:
//               setMessage("Find and subtract the minimum uncovered value!");
//               break;
//             case 5:
//               setMessage("Make the final optimal assignments!");
//               setFinalAssignments([]); // Reset final assignments
//               break;
//           }
//         }, 1000);
//       } else {
//         const totalCost = finalAssignments.reduce((sum, { row, col }) => {
//           return sum + initialMatrix[row][col];
//         }, 0);
//         setMessage(
//           `Congratulations! You've completed the Hungarian Algorithm! Total cost: ${totalCost}`
//         );
//       }
//     }
//   }, [
//     rowMinima,
//     colMinima,
//     selectedCells,
//     lines,
//     adjustmentValue,
//     finalAssignments,
//     currentStep,
//   ]);

//   return (
//     <div className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto">
//       <h1 className="text-2xl md:text-3xl font-bold mb-6">
//         Hungarian (Kuhn-Munkres) Algorithm Game
//       </h1>

//       <div className="w-full max-w-4xl">
//         <div className="mb-4 flex justify-between">
//           <div>Score: {score}</div>
//           <div>Moves: {moves}</div>
//         </div>

//         {currentStep === 3 && (
//           <div className="mb-4 flex gap-4 justify-center">
//             <button
//               onClick={() => toggleDrawMode("row")}
//               className={`px-4 py-2 rounded ${
//                 drawMode === "row" ? "bg-red-500 text-white" : "bg-gray-200"
//               }`}
//             >
//               Draw Row Line
//             </button>
//             <button
//               onClick={() => toggleDrawMode("col")}
//               className={`px-4 py-2 rounded ${
//                 drawMode === "col" ? "bg-red-500 text-white" : "bg-gray-200"
//               }`}
//             >
//               Draw Column Line
//             </button>
//             <button
//               onClick={resetLines}
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//             >
//               Reset Lines
//             </button>
//           </div>
//         )}

//         <div className="mb-6 relative">
//           <div className="bg-white border border-gray-300 rounded-lg p-4">
//             <div className="flex justify-center items-center">
//               <div className="grid grid-cols-3 gap-1 relative">
//                 {matrix.map((row, rowIndex) =>
//                   row.map((cell, colIndex) => {
//                     const isSelected = selectedCells.some(
//                       (s) => s.row === rowIndex && s.col === colIndex
//                     );
//                     const isFinalAssignment = finalAssignments.some(
//                       (a) => a.row === rowIndex && a.col === colIndex
//                     );
//                     const isInvalidPair = invalidAssignmentPairs.some(
//                       (a) => a.row === rowIndex || a.col === colIndex
//                     );
//                     const isUnassignedRow =
//                       currentStep === 5 &&
//                       unassignedRowsCols.rows.includes(rowIndex);
//                     const isUnassignedCol =
//                       currentStep === 5 &&
//                       unassignedRowsCols.cols.includes(colIndex);

//                     return (
//                       <button
//                         key={`${rowIndex}-${colIndex}`}
//                         onClick={() => handleCellClick(rowIndex, colIndex)}
//                         className={`
//                           w-24 h-24
//                           flex flex-col items-center justify-center
//                           border border-gray-300
//                           ${isSelected ? "bg-green-200" : ""}
//                           ${isFinalAssignment ? "bg-blue-200" : ""}
//                           ${isInvalidPair ? "bg-red-100" : ""}
//                         ${
//                           isUnassignedRow || isUnassignedCol
//                             ? "bg-yellow-50"
//                             : ""
//                         }
//                            ${
//                              lines.rows.includes(rowIndex)
//                                ? "border-t-4 border-b-4 border-red-500"
//                                : ""
//                            }
//                            ${
//                              lines.cols.includes(colIndex)
//                                ? "border-l-4 border-r-4 border-red-500"
//                                : ""
//                            }
//                           hover:bg-gray-50
//                           transition-colors
//                           relative
//                         `}
//                       >
//                         <span className="text-lg font-semibold">{cell}</span>
//                         {cell === 0 && currentStep === 5 && (
//                           <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
//                             0
//                           </span>
//                         )}
//                       </button>
//                     );
//                   })
//                 )}
//                 {showOverlay && (
//                   <div
//                     className={`absolute inset-0 flex items-center justify-center ${
//                       overlayContent.type === "correct"
//                         ? "bg-green-500"
//                         : "bg-red-500"
//                     } bg-opacity-75 rounded-lg`}
//                   >
//                     <p className="text-white text-2xl font-bold">
//                       {overlayContent.text}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {currentStep === 5 && (
//           <div className="mb-4 text-sm">
//             <p className="font-semibold">Assignment Rules:</p>
//             <ul className="list-disc pl-5">
//               <li>Select cells with zero values</li>
//               <li>Each row and column can only be used once</li>
//               <li>The assignment must be optimal (minimum total cost)</li>
//             </ul>
//           </div>
//         )}

//         <div className="mb-6">
//           <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
//             <p>{message}</p>
//           </div>
//         </div>

//         <div className="text-center text-sm">
//           <p className="font-semibold mb-2">Step {currentStep + 1}/6</p>
//           <p>
//             {currentStep === 0 &&
//               "Find and click the minimum value in each row"}
//             {currentStep === 1 &&
//               "Find and click the minimum value in each column"}
//             {currentStep === 2 &&
//               "Select independent zeros (no shared rows/columns)"}
//             {currentStep === 3 &&
//               "Draw lines to cover all zeros (minimum number of lines)"}
//             {currentStep === 4 && "Find and select the minimum uncovered value"}
//             {currentStep === 5 && "Make the final optimal assignments"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HungarianKhunMunkresGamePage;

export const dynamic = "force-dynamic";
