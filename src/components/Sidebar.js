import React from "react";

export default function Sidebar({
  isOpen,
  toggleSidebar,
  selectedMode,
  setSelectedMode,
  selectedAlgorithm,
  setSelectedAlgorithm,
}) {
  const modes = ["Education", "Game"];
  const algorithms = [
    "Traversal",
    "Shortest Path",
    "Minimum Spanning Tree",
    "Network Flow",
    "Matching",
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-30`}
    >
      <nav className="p-4">
        <h2 className="text-xl font-bold mb-4">1. Mode:</h2>
        <div className="space-y-2 mb-6">
          {modes.map((mode) => (
            <button
              key={mode}
              className={`w-full py-2 px-4 rounded ${
                selectedMode === mode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
        <h2 className="text-xl font-bold mb-4">2. Algorithm:</h2>
        <div className="space-y-2">
          {algorithms.map((algo) => (
            <button
              key={algo}
              className={`w-full py-2 px-4 rounded ${
                selectedAlgorithm === algo
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedAlgorithm(algo)}
            >
              {algo}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
