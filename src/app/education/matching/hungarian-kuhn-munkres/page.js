"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";

const HungarianKhunMunkresEducationPage = () => {
  const initialMatrix = [
    [40, 60, 15],
    [25, 30, 45],
    [55, 30, 25],
  ];

  // Enhanced steps with better line visualization
  const steps = [
    {
      graphState: {
        matrix: [...initialMatrix.map((row) => [...row])],
        highlights: [],
        rowMinima: [],
        colMinima: [],
        assignment: [],
        lines: [],
      },
      explanation:
        "Initial cost matrix showing the cost of assigning each worker (row) to each job (column). Each cell represents the assignment cost.",
    },
    {
      graphState: {
        matrix: [
          [25, 45, 0],
          [0, 5, 20],
          [30, 5, 0],
        ],
        highlights: ["row"],
        rowMinima: [15, 25, 25],
        colMinima: [],
        assignment: [],
        lines: [],
      },
      explanation:
        "Row Reduction Step: \n• Subtract row minimums: Row 1 (15), Row 2 (25), Row 3 (25)\n• This creates initial zeros in each row",
    },
    {
      graphState: {
        matrix: [
          [25, 40, 0],
          [0, 0, 20],
          [30, 0, 0],
        ],
        highlights: ["col"],
        rowMinima: [15, 25, 25],
        colMinima: [0, 5, 0],
        assignment: [],
        lines: [],
      },
      explanation:
        "Column Reduction Step: \n• Subtract column minimums: Col 1 (0), Col 2 (5), Col 3 (0)\n• This creates additional zeros",
    },
    {
      graphState: {
        matrix: [
          [25, 40, 0],
          [0, 0, 20],
          [30, 0, 0],
        ],
        highlights: ["zero"],
        rowMinima: [15, 25, 25],
        colMinima: [0, 5, 0],
        assignment: [],
        lines: [
          { type: "horizontal", index: 1 }, // Row 2
          { type: "vertical", index: 1 }, // Column 2
          { type: "vertical", index: 2 }, // Column 3
        ],
      },
      explanation:
        "Line Drawing Step:\n• Goal: Cover all zeros with minimum number of lines\n• Draw horizontal line through Row 2 (covers two zeros)\n• Draw vertical lines through Columns 2 and 3 (covers remaining zeros)\n• Total lines = 3 (equals matrix size), so we can proceed to assignment",
    },
    {
      graphState: {
        matrix: [
          [5, 20, 0],
          [0, 0, 40],
          [10, 0, 20],
        ],
        highlights: ["final"],
        rowMinima: [15, 25, 25],
        colMinima: [0, 5, 0],
        assignment: [
          [0, 0, 1],
          [1, 0, 0],
          [0, 1, 0],
        ],
      },
      explanation: `Final Assignment Selection:
  
  • Key Constraint: One-to-One Mapping
    - Each worker can only be assigned to exactly one job
    - Each job can only be assigned to exactly one worker
    - This ensures fair distribution and complete coverage
  
  • Assignment Process:
    1. Worker 1 → Job 3 (cost: ${initialMatrix[0][2]})
       - Once assigned, Job 3 is no longer available
    2. Worker 2 → Job 1 (cost: ${initialMatrix[1][0]})
       - Job 2 was also possible, but Job 1 allows for overall optimal solution
    3. Worker 3 → Job 2 (cost: ${initialMatrix[2][1]})
       - Only remaining valid assignment that maintains one-to-one mapping
  
  • Total minimum cost: initialCostMatrix[0][2] + initialCostMatrix[1][0] + initialCostMatrix[2][1] = ${
    initialMatrix[0][2] + initialMatrix[1][0] + initialMatrix[2][1]
  }.
  
  This assignment pattern gives us the optimal (minimum) total cost while ensuring each worker has exactly one job and each job is assigned to exactly one worker.`,
    },
  ];

  const conceptText = {
    introduction:
      "The Hungarian Algorithm (Munkres algorithm) solves the assignment problem by finding the optimal way to assign n workers to n jobs while minimizing total cost. The line-drawing step is crucial as it helps identify if we have found the optimal solution.",
    keyCharacteristics: [
      "Works with square matrices (n×n)",
      "Uses row and column reduction to create zeros",
      "Draws minimum number of lines to cover all zeros",
      "Solution is optimal when number of lines equals matrix size (n)",
      "Time complexity: O(n³)",
      "Can handle both minimization and maximization problems",
    ],
    applications: [
      "Job/Task assignment optimization",
      "Resource allocation",
      "Personnel scheduling",
      "Transportation routing",
      "Network flow problems",
      "Pattern matching",
    ],
  };

  const pseudocode = `HUNGARIAN_ALGORITHM(cost_matrix):
1. Row Reduction
   - Subtract minimum value from each row

2. Column Reduction
   - Subtract minimum value from each column

3. Line Drawing
   - Find minimum number of lines to cover all zeros
   - If lines = n, proceed to assignment
   - If lines < n:
     * Find smallest uncovered value k
     * Subtract k from uncovered elements
     * Add k to elements covered by two lines
     * Repeat line drawing

4. Make Optimal Assignment
   - Assign workers to jobs using covered zeros
   - Each worker/job can only be assigned once
   - Return optimal assignment matrix`;

  const GraphVisualisation = ({ graphState }) => {
    const { matrix, highlights, assignment, lines } = graphState;

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="relative">
          {/* Matrix Grid */}
          <div className="grid grid-cols-3 gap-1">
            {matrix.map((row, i) =>
              row.map((cell, j) => {
                let bgColor = "bg-white";
                if (highlights?.includes("row")) bgColor = "bg-blue-50";
                if (highlights?.includes("col")) bgColor = "bg-green-50";
                if (highlights?.includes("zero") && cell === 0)
                  bgColor = "bg-yellow-100";
                if (highlights?.includes("final") && assignment?.[i]?.[j])
                  bgColor = "bg-green-200";

                return (
                  <div
                    key={`${i}-${j}`}
                    className={`
                      w-16 h-16 
                      flex items-center justify-center 
                      border border-gray-300
                      ${bgColor}
                      ${cell === 0 ? "text-red-500 font-bold" : ""}
                    `}
                  >
                    {cell}
                  </div>
                );
              })
            )}
          </div>

          {/* Draw Lines */}
          {lines?.map((line, idx) => {
            if (line.type === "horizontal") {
              return (
                <div
                  key={`h-${idx}`}
                  className="absolute w-full h-0.5 bg-red-500"
                  style={{
                    top: `${line.index * 64 + 32}px`,
                    left: 0,
                  }}
                />
              );
            } else if (line.type === "vertical") {
              return (
                <div
                  key={`v-${idx}`}
                  className="absolute w-0.5 h-full bg-red-500"
                  style={{
                    left: `${line.index * 64 + 32}px`,
                    top: 0,
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <EducationPageStructure
      title="Hungarian (Kuhn-Munkres) Algorithm"
      graphStates={[steps]}
      conceptText={conceptText}
      pseudocode={pseudocode}
      GraphVisualisationComponent={GraphVisualisation}
    />
  );
};

export default HungarianKhunMunkresEducationPage;
