import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = ({
  isOpen,
  onClose,
  onModeSelect,
  onAlgorithmSelect,
  selectedMode,
  selectedAlgorithm,
}) => {
  const router = useRouter();
  const [selectedMainAlgorithm, setSelectedMainAlgorithm] = useState(null);

  const modes = ["Education", "Game"];
  const algorithms = {
    Traversal: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)"],
    "Shortest Path": [
      "Dijkstra's",
      "Bellman-Ford",
      "Floyd-Warshall",
      "A*",
      "Johnson's",
    ],
    "Minimum Spanning Tree": ["Kruskal's", "Prim's", "Borůvka's"],
    "Network Flow": [
      "Ford-Fulkerson",
      "Edmonds-Karp",
      "Dinic's",
      "Push-Relabel (Goldberg-Tarjan)",
      "Capacity Scaling",
    ],
    Matching: [
      "Hungarian (Kuhn-Munkres)",
      "Hopcroft-Karp",
      "Blossom (Edmonds')",
      "Gale-Shapley (Stable Marriage)",
    ],
  };

  const handleMainAlgorithmClick = (algorithm) => {
    setSelectedMainAlgorithm(
      algorithm === selectedMainAlgorithm ? null : algorithm
    );
  };

  const handleSubAlgorithmClick = (subAlgorithm) => {
    onAlgorithmSelect(subAlgorithm);
    setSelectedMainAlgorithm(null);

    // Navigate based on the selected algorithm
    if (subAlgorithm === "Depth-First Search (DFS)") {
      router.push("/education/traversal/dfs");
    } else if (subAlgorithm === "Breadth-First Search (BFS)") {
      router.push("/education/traversal/bfs");
    }
  };

  return (
    <div
      className={`absolute top-20 inset-y-0 left-0 w-64 bg-white transition-transform duration-300 ease-in-out z-30 overflow-y-auto no-scrollbar ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 overflow-y-auto h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Mode:</h3>
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => onModeSelect(mode)}
              className={`block w-full text-left px-4 py-2 rounded ${
                selectedMode === mode
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Algorithm:</h3>
          {Object.entries(algorithms).map(([mainAlgorithm, subAlgorithms]) => (
            <div key={mainAlgorithm} className="mb-2">
              <button
                onClick={() => handleMainAlgorithmClick(mainAlgorithm)}
                className={`block w-full text-left px-4 py-2 rounded ${
                  selectedMainAlgorithm === mainAlgorithm
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {mainAlgorithm}
              </button>
              {selectedMainAlgorithm === mainAlgorithm && (
                <div className="ml-4 mt-2">
                  {subAlgorithms.map((subAlgorithm) => (
                    <div key={subAlgorithm}>
                      <button
                        onClick={() => handleSubAlgorithmClick(subAlgorithm)}
                        className={`block w-full text-left px-4 py-2 rounded ${
                          selectedAlgorithm === subAlgorithm
                            ? "bg-blue-300 text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {subAlgorithm}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
